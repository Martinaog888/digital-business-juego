export class RoomError extends Error { constructor(code){super(code);this.code=code;} }
const fail=code=>{throw new RoomError(code);};
const randomToken=()=>crypto.randomUUID()+crypto.randomUUID();
export class Room {
 constructor(data,now=()=>Date.now(),random=Math.random){
  this.now=now;this.random=random;
  this.data=data||{players:[],phase:"lobby",round:0,claims:[],winner:null,host:null,startAt:0,stopAt:0,deadline:0,updatedAt:now(),cancelled:false};
 }
 get players(){return this.data.players;}
 touch(){this.data.updatedAt=this.now();}
 join(name,animal,token){
  this.tick();
  if(token){
   const p=this.players.find(p=>p.token===token);
   if(!p)fail("session");
   p.connected=true;p.held=false;p.leftAt=null;if(!this.data.host||!this.players.some(p=>p.id===this.data.host&&p.connected))this.data.host=p.id;this.touch();return p;
  }
  if(this.data.phase!=="lobby")fail("started");
  if(this.players.length>=4)fail("full");
  if(typeof name!=="string"||!name.trim()||[...name.trim()].length>24)fail("name");
  if(!Number.isInteger(animal)||animal<0||animal>3||this.players.some(p=>p.animal===animal))fail("animal");
  const p={id:crypto.randomUUID(),token:randomToken(),name:name.trim(),animal,connected:true,ready:false,held:false,active:true,seats:0,eliminatedRound:null};
  this.players.push(p);if(!this.data.host)this.data.host=p.id;this.touch();return p;
 }
 player(id){const p=this.players.find(p=>p.id===id&&p.connected);if(!p)fail("session");return p;}
 disconnect(id){
  const p=this.players.find(p=>p.id===id);if(!p)return;
  p.connected=false;p.ready=false;p.held=false;p.leftAt=this.now();
  if(["music","claim"].includes(this.data.phase)&&p.active){
   this.data.phase="paused";this.data.claims=[];this.data.deadline=this.now()+20000;
  }
  if(this.data.host===id)this.data.host=this.players.find(p=>p.connected)?.id||null;
  this.touch();
 }
 leave(id){
  const p=this.players.find(p=>p.id===id);if(!p)return;
  this.disconnect(id);
  if(this.data.phase==="lobby")this.data.players=this.players.filter(p=>p.id!==id);
 }
 tick(){
  const d=this.data,now=this.now();
  if(d.phase==="music"&&now>=d.stopAt){d.phase="claim";d.claimToken=randomToken();}
  if(d.phase==="paused"&&this.players.filter(p=>p.active).every(p=>p.connected&&p.ready))d.deadline=0;
  if(d.phase==="lobby")d.players=this.players.filter(p=>p.connected||!p.leftAt||now-p.leftAt<20000);
  if(d.phase==="paused"&&d.deadline&&now>=d.deadline){
   d.phase="lobby";d.round=0;d.claims=[];d.winner=null;d.cancelled=true;d.deadline=0;
   d.players=this.players.filter(p=>p.connected);
   d.players.forEach(p=>{p.active=true;p.seats=0;p.eliminatedRound=null;p.ready=false;p.held=false;});
   if(!d.players.some(p=>p.id===d.host))d.host=d.players[0]?.id||null;
  }
 }
 handle(id,msg){
  this.tick();const p=this.player(id),d=this.data;
  if(msg.type==="ready"){p.ready=true;this.tick();this.touch();return;}
  if(msg.type==="away"){p.held=false;p.ready=false;if(p.active&&["music","claim"].includes(d.phase)){d.phase="paused";d.claims=[];d.deadline=this.now()+20000;}this.touch();return;}
  if(msg.type==="release"){p.held=false;return;}
  if(msg.type==="start"){
   if(d.host!==id)fail("notHost");
   if(!["lobby","result","paused"].includes(d.phase))fail("stale");
   const participants=this.players.filter(p=>d.phase==="lobby"||p.active);
   if(this.players.length<2||participants.some(p=>!p.connected||!p.ready))fail("notReady");
   if(d.phase!=="paused")d.round++;
   d.phase="music";d.claimToken=null;d.claims=[];d.startAt=this.now()+2200;d.stopAt=d.startAt+4500+Math.floor(this.random()*4500);d.deadline=0;d.cancelled=false;d.winner=null;
   this.touch();return;
  }
  if(msg.type==="replay"){
   if(d.host!==id)fail("notHost");if(d.phase!=="finished")fail("stale");
   d.players=this.players.filter(p=>p.connected);d.players.forEach(p=>{p.active=true;p.seats=0;p.ready=false;p.held=false;p.eliminatedRound=null;});
   d.phase="lobby";d.round=0;d.claims=[];d.winner=null;d.cancelled=false;this.touch();return;
  }
  if(msg.type==="press"){
   if(msg.round!==d.round)fail("stale");
   if(!p.active)fail("spectator");
   if(p.held)return;
   p.held=true;
   if(d.phase==="music")fail("early");
   if(d.phase!=="claim"||msg.claimToken!==d.claimToken)fail("stale");
   if(d.claims.includes(id))return;
   d.claims.push(id);
   const active=this.players.filter(p=>p.active);
   if(d.claims.length===active.length-1){
    d.claims.forEach(id=>this.players.find(p=>p.id===id).seats++);
    const loser=active.find(p=>!d.claims.includes(p.id));loser.active=false;loser.eliminatedRound=d.round;
    const survivors=this.players.filter(p=>p.active);
    d.phase=survivors.length===1?"finished":"result";d.winner=survivors.length===1?survivors[0].id:null;
   }
   this.touch();return;
  }
  fail("message");
 }
 snapshot(you){
  this.tick();const d=this.data;
  return {type:"state",you,serverNow:this.now(),phase:d.phase,round:d.round,claims:[...d.claims],host:d.host,winner:d.winner,startAt:d.startAt,cancelled:d.cancelled,claimToken:d.phase==="claim"?d.claimToken:null,
   players:this.players.map(({token,held,...p})=>({...p}))};
 }
 nextAlarm(){
  const d=this.data,targets=[d.updatedAt+30*60*1000];
  if(d.phase==="lobby")this.players.filter(p=>!p.connected&&p.leftAt).forEach(p=>targets.push(p.leftAt+20000));
  if(d.phase==="music")targets.push(d.stopAt);
  if(d.phase==="paused"&&d.deadline)targets.push(d.deadline);
  return Math.min(...targets);
 }
 expired(){return this.now()-this.data.updatedAt>=30*60*1000;}
}
