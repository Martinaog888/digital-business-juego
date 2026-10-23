import {Room,RoomError} from "./room.mjs";
const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{"Content-Type":"application/json",...headers}});
const code=()=>Array.from(crypto.getRandomValues(new Uint8Array(8)),n=>"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[n%32]).join("");
export default {
 async fetch(request,env){
  const url=new URL(request.url),origin=request.headers.get("Origin");
  const allowed=env.ALLOWED_ORIGIN||"https://martinaog888.github.io";
  if(origin!==allowed)return json({error:"origin"},403);
  const cors={"Access-Control-Allow-Origin":allowed,"Vary":"Origin","Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  const reply=async r=>{
   if(r.status===101)return r;
   const h=new Headers(r.headers);Object.entries(cors).forEach(([k,v])=>h.set(k,v));return new Response(r.body,{status:r.status,headers:h});
  };
  if(url.pathname==="/health")return json({ok:true},200,cors);
  const create=url.pathname==="/rooms"&&request.method==="POST";
  const match=url.pathname.match(/^\/rooms\/([A-HJ-NP-Z2-9]{8})\/(socket|info)$/);
  if(!create&&!match)return json({error:"roomMissing"},404,cors);
  const ip=request.headers.get("CF-Connecting-IP")||"local";
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(ip));
  const key=Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,"0")).join("");
  const limiter=env.LIMITS.get(env.LIMITS.idFromName(key));
  const limit=await limiter.fetch("https://internal/"+(create?"create":"join"));
  if(limit.status!==200)return json({error:"rate"},429,cors);
  if(create){
   for(let n=0;n<4;n++){
    const id=code(),room=env.ROOMS.get(env.ROOMS.idFromName(id));
    const r=await room.fetch("https://internal/init",{method:"POST"});
    if(r.status===201)return json({code:id},201,cors);
   }
   return json({error:"rate"},503,cors);
  }
  return reply(await env.ROOMS.get(env.ROOMS.idFromName(match[1])).fetch(request));
 }
};
export class RoomDO {
 constructor(ctx,env){
  this.ctx=ctx;this.env=env;this.room=null;this.rates=new Map();
  ctx.blockConcurrencyWhile(async()=>{
   const data=await ctx.storage.get("room");if(!data)return;
   this.room=new Room(data);
   const ids=new Set(ctx.getWebSockets().map(ws=>ws.deserializeAttachment()?.id).filter(Boolean));
   this.room.players.forEach(p=>p.connected=ids.has(p.id));
  });
 }
 async fetch(req){
  if(new URL(req.url).pathname==="/init"){
   if(this.room&&!this.room.expired())return json({error:"occupied"},409);
   this.room=new Room();await this.save();return json({ok:true},201);
  }
  if(!this.room||this.room.expired())return json({error:"roomMissing"},404);
  if(new URL(req.url).pathname.endsWith("/info")){this.room.tick();return json({phase:this.room.data.phase,players:this.room.players.map(p=>({name:p.name,animal:p.animal}))});}
  if(req.headers.get("Upgrade")?.toLowerCase()!=="websocket")return json({error:"message"},400);
  if(this.ctx.getWebSockets().length>=12)return json({error:"full"},409);
  const pair=new WebSocketPair(),client=pair[0],server=pair[1];
  this.ctx.acceptWebSocket(server);server.serializeAttachment({id:null,seq:0,opened:Date.now()});
  await this.ctx.storage.setAlarm(Math.min(this.room.nextAlarm(),Date.now()+20000));
  return new Response(null,{status:101,webSocket:client});
 }
 async webSocketMessage(ws,raw){
  let attach=ws.deserializeAttachment()||{seq:0},msg;
  try{
   if(typeof raw!=="string"||raw.length>2048)throw new RoomError("message");
   const now=Date.now(),entry=this.rates.get(ws)||{at:now,n:0};
   if(now-entry.at>1000){entry.at=now;entry.n=0;}if(++entry.n>25)throw new RoomError("rate");this.rates.set(ws,entry);
   msg=JSON.parse(raw);
   if(!msg||typeof msg!=="object")throw new RoomError("message");
   if(msg.type==="ping"){ws.send(JSON.stringify({type:"pong",sent:msg.sent,serverNow:Date.now()}));return;}
   if(!Number.isSafeInteger(msg.seq)||msg.seq<=attach.seq)throw new RoomError("stale");attach.seq=msg.seq;ws.serializeAttachment(attach);
   if(msg.type==="join"){
    if(attach.id)throw new RoomError("session");
    const p=this.room.join(msg.name,msg.animal,msg.token);
    // Une seule connexion par identité. Le jeton reste privé.
    for(const old of this.ctx.getWebSockets())if(old!==ws&&old.deserializeAttachment()?.id===p.id){old.serializeAttachment({id:null,seq:0});old.close(4001,"replaced");}
    attach.id=p.id;ws.serializeAttachment(attach);ws.send(JSON.stringify({type:"session",token:p.token}));
   }else{
    if(!attach.id)throw new RoomError("session");
    if(msg.type==="leave"){this.room.leave(attach.id);ws.serializeAttachment({id:null,seq:attach.seq});ws.close(1000,"left");}
    else this.room.handle(attach.id,msg);
   }
  }catch(error){
   try{ws.send(JSON.stringify({type:"error",code:error instanceof RoomError?error.code:"message"}));}catch(_){}
  }
  await this.save();this.broadcast();
 }
 broadcast(){
  if(!this.room)return;
  for(const ws of this.ctx.getWebSockets()){
   const a=ws.deserializeAttachment();
   if(!a?.id)continue;
   try{ws.send(JSON.stringify(this.room.snapshot(a.id)));}catch(_){}
  }
 }
 async save(){
  if(!this.room)return;
  await this.ctx.storage.put("room",this.room.data);
  const pending=this.ctx.getWebSockets().map(ws=>ws.deserializeAttachment()).filter(a=>!a?.id).map(a=>(a?.opened||Date.now())+20000);
  await this.ctx.storage.setAlarm(Math.max(Date.now()+100,Math.min(this.room.nextAlarm(),...pending)));
 }
 async webSocketClose(ws){
  this.rates.delete(ws);const id=ws.deserializeAttachment()?.id;
  if(this.room&&id){this.room.disconnect(id);await this.save();this.broadcast();}
 }
 async webSocketError(ws){await this.webSocketClose(ws);}
 async alarm(){
  if(!this.room)return;
  if(this.room.expired()){
   for(const ws of this.ctx.getWebSockets())ws.close(1000,"expired");
   this.room=null;await this.ctx.storage.deleteAll();return;
  }
  // Nettoyer aussi les connexions qui n'ont jamais rejoint la salle.
  for(const ws of this.ctx.getWebSockets()){const a=ws.deserializeAttachment();if(!a?.id&&Date.now()-(a?.opened||0)>20000)ws.close(1008,"join timeout");}
  this.room.tick();await this.save();this.broadcast();
 }
}
export class Limiter {
 constructor(ctx){this.ctx=ctx;}
 async fetch(req){
  const create=new URL(req.url).pathname==="/create",period=create?3600000:60000,key=create?"create":"join",limit=create?10:40,now=Date.now();
  let entry=await this.ctx.storage.get(key)||{at:now,n:0};
  if(now-entry.at>=period)entry={at:now,n:0};
  entry.n++;await this.ctx.storage.put(key,entry);await this.ctx.storage.setAlarm(now+3600000);
  return new Response("",{status:entry.n<=limit?200:429});
 }
 async alarm(){await this.ctx.storage.deleteAll();}
}
