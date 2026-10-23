import {test} from "node:test";
import assert from "node:assert/strict";
import {Room} from "../server/room.mjs";
function setup(count=4){let now=1000;const room=new Room(null,()=>now,()=>0);const players=Array.from({length:count},(_,i)=>room.join("P"+i,i));players.forEach(p=>room.handle(p.id,{type:"ready"}));return {room,players,advance:n=>{now+=n;room.tick();},set:n=>now=n};}
const rejects=(fn,code)=>assert.throws(fn,e=>e.code===code);
test("animales exclusivos, aforo, nombres y sesión",()=>{
 const {room,players}=setup();
 rejects(()=>room.join("otro",0),"full");
 const empty=new Room();empty.join("Ana",0);
 rejects(()=>empty.join("Luis",0),"animal");rejects(()=>empty.join("",1),"name");rejects(()=>empty.join("Luis",9),"animal");
 assert.equal(empty.join("",0,empty.players[0].token).id,empty.players[0].id);
 const snapshot=room.snapshot(players[0].id);
 assert(!JSON.stringify(snapshot).includes(players[0].token));assert(!("stopAt" in snapshot));
});
test("autoridad del anfitrión y orden del servidor, sin tiempos del cliente",()=>{
 const {room,players,advance}=setup(4),[a,b,c,d]=players;
 rejects(()=>room.handle(b.id,{type:"start"}),"notHost");
 room.handle(a.id,{type:"start"});
 rejects(()=>room.handle(a.id,{type:"press",claimToken:room.data.claimToken,round:1,clientTime:99999999}),"early");
 advance(7000);
 room.handle(a.id,{type:"press",claimToken:room.data.claimToken,round:1});assert.deepEqual(room.data.claims,[]); // dedo mantenido
 room.handle(a.id,{type:"release"});room.handle(a.id,{type:"press",claimToken:room.data.claimToken,round:1});
 room.handle(a.id,{type:"release"});room.handle(a.id,{type:"press",claimToken:room.data.claimToken,round:1});
 assert.equal(room.data.claims.length,1);
 room.handle(c.id,{type:"press",claimToken:room.data.claimToken,round:1});room.handle(b.id,{type:"press",claimToken:room.data.claimToken,round:1});
 assert.equal(d.active,false);assert.equal(room.data.phase,"result");
 room.handle(a.id,{type:"start"});advance(7000);
 for(const p of [b,a]){room.handle(p.id,{type:"release"});room.handle(p.id,{type:"press",claimToken:room.data.claimToken,round:2});}
 assert.equal(c.active,false);room.handle(a.id,{type:"start"});advance(7000);
 room.handle(b.id,{type:"release"});room.handle(b.id,{type:"press",claimToken:room.data.claimToken,round:3});
 assert.equal(room.data.winner,b.id);rejects(()=>room.handle(d.id,{type:"press",claimToken:room.data.claimToken,round:3}),"spectator");
 room.handle(a.id,{type:"replay"});assert.equal(room.data.phase,"lobby");assert(room.players.every(p=>p.active&&p.seats===0));
});
test("no confía en otra identidad ni ronda; desconexión y recuperación",()=>{
 const {room,players,advance}=setup(2),[a,b]=players;
 room.handle(a.id,{type:"start"});rejects(()=>room.handle(b.id,{type:"press",claimToken:room.data.claimToken,round:999}),"stale");
 rejects(()=>room.handle("inventado",{type:"press",claimToken:room.data.claimToken,round:1}),"session");
 room.disconnect(b.id);assert.equal(room.data.phase,"paused");
 room.join("",0,b.token);room.handle(b.id,{type:"ready"});advance(21000);room.tick();
 assert.equal(room.data.phase,"paused");room.handle(a.id,{type:"start"});assert.equal(room.data.round,1);
 room.disconnect(a.id);assert.equal(room.data.host,b.id);advance(21000);room.tick();
 assert.equal(room.data.phase,"lobby");assert.equal(room.players.length,1);assert.equal(room.data.cancelled,true);
});
test("cambiar de pestaña pausa, no elimina; salas caducan",()=>{
 const {room,players,advance}=setup(2);room.handle(players[0].id,{type:"start"});room.handle(players[1].id,{type:"away"});
 assert.equal(room.data.phase,"paused");assert(room.players.every(p=>p.active));
 advance(20001);room.tick();assert.equal(room.data.phase,"lobby");
 advance(1800001);assert(room.expired());
});
