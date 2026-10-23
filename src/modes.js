const SERVER_URL = "";
let selectedMode=null,difficulty="easy";
const profiles=Array.from({length:4},(_,animal)=>({name:"",animal}));
let botTimers=[];
const online={socket:null,code:"",token:"",state:null,connected:false,intentional:false,seq:0,offset:0,bestRtt:Infinity,retry:0,retryTimer:null,pingTimer:null,audioTimer:null,audioRound:null,notice:null,ownSlot:-1,generation:0,busy:false,occupied:[],preview:[]};
const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function displayName(id){
 const p=model.players[id];
 if(p?.customName)return p.customName;
 if(p?.bot)return t("bot",{animal:translations[language].animals[p.animal]});
 return t("player",{n:id+1});
}
function canControl(id){return selectedMode==="local"||(selectedMode==="solo"&&id===0)||(selectedMode==="online"&&id===online.ownSlot);}
function configurePlayers(){
 if(selectedMode==="online")return;
 model.players.forEach((p,i)=>{
  p.animal=profiles[i].animal;p.customName=profiles[i].name;p.bot=selectedMode==="solo"&&i>0;
 });
}
function configureSolo(){
 const animal=profiles[0].animal,others=[0,1,2,3].filter(n=>n!==animal);
 for(let i=1;i<4;i++)profiles[i]={name:"",animal:others[i-1]};
}
function cancelBots(){botTimers.forEach(clearTimeout);botTimers=[];}
function scheduleBots(){
 cancelBots();if(selectedMode!=="solo")return;
 const [min,max]={easy:[800,1600],medium:[400,1000],hard:[180,550]}[difficulty];
 model.players.filter(p=>p.active&&p.bot).forEach(p=>{
  botTimers.push(setTimeout(()=>{if(model.phase==="claim"&&p.active){claim(p.id,false);model.release(p.id);}},min+Math.random()*(max-min)));
 });
}
function renderSettings(){
 const panel=$("mode-settings");if(!selectedMode){panel.hidden=true;return;}
 panel.hidden=false;
 $("mode-title").textContent=t(selectedMode);
 $("difficulty-setting").hidden=selectedMode!=="solo";
 $("profile-settings").hidden=selectedMode==="online";
 $("swap-hint").hidden=selectedMode!=="local";
 if(selectedMode!=="online"){
  const n=selectedMode==="solo"?1:count;
  $("profile-settings").innerHTML=Array.from({length:n},(_,i)=>'<div class="profile-editor"><label>'+esc(t("profileName"))+' '+(i+1)+'<input data-profile-name="'+i+'" maxlength="24" autocomplete="off" value="'+esc(profiles[i].name)+'" placeholder="'+esc(t("player",{n:i+1}))+'"></label><label>'+esc(t("chooseAnimal"))+'<select data-profile-animal="'+i+'">'+translations[language].animals.map((a,index)=>'<option value="'+index+'" '+(profiles[i].animal===index?'selected':'')+'>'+esc(a)+'</option>').join("")+'</select></label></div>').join("");
  document.querySelectorAll("[data-profile-name]").forEach(input=>input.addEventListener("input",()=>{
   profiles[Number(input.dataset.profileName)].name=[...input.value.trim()].slice(0,24).join("");
   configurePlayers();renderRoster();renderStats();
   model.players.forEach(p=>{$("person-"+p.id).querySelector(".player-tag").innerHTML="<kbd>"+labels[p.id]+"</kbd> "+esc(displayName(p.id));});
  }));
  document.querySelectorAll("[data-profile-animal]").forEach(select=>select.addEventListener("change",()=>{
   const id=Number(select.dataset.profileAnimal),animal=Number(select.value),old=profiles[id].animal;
   if(selectedMode==="local"){const other=profiles.slice(0,count).find((p,i)=>i!==id&&p.animal===animal);if(other)other.animal=old;}
   profiles[id].animal=animal;if(selectedMode==="solo")configureSolo();
   configurePlayers();renderPeople();positionPeople();renderStats();renderSettings();
  }));
 }
 $("difficulty").value=difficulty;
 renderOnlinePanel();syncModeControls();
}
function syncModeControls(){
 document.querySelector(".field-label").hidden=selectedMode!=="local";
 document.querySelector(".count-selector").hidden=selectedMode!=="local";
 document.querySelectorAll("#profile-settings input,#profile-settings select,#difficulty").forEach(e=>e.disabled=model.phase!=="ready");
 const badge=document.querySelector('[data-i18n="live"]');if(badge)badge.textContent=t(selectedMode==="solo"?"soloBadge":selectedMode==="online"?"onlineBadge":"live");
 $("touch-controls").classList.toggle("single-control",selectedMode!=="local");
 $("touch-controls").hidden=selectedMode==="online"&&!online.state;
 const note=document.querySelector('[data-i18n="localNote"]');if(note)note.textContent=t(selectedMode==="online"?"onlineLocalNote":"localNote");
 if(selectedMode==="online"){
  renderOnlinePanel();
  const state=online.state,me=state?.players.find(p=>p.id===state.you),host=state?.host===state?.you;
  const able=state&&state.players.length>=2&&state.players.filter(p=>state.phase==="lobby"||p.active).every(p=>p.connected&&p.ready);
  $("play").disabled=!online.connected||!host||!able||!["lobby","result","finished","paused"].includes(state?.phase);
  if(!host)setPlay("waitingHost");else setPlay(state?.phase==="finished"?"replay":state?.phase==="result"?"next":state?.phase==="paused"?"repeatRound":"start","↗");
  $("reset").hidden=true;
  if(me&&!me.active)$("touch-prompt").textContent=t("spectating");
 }
}
function selectMode(mode){
 leaveOnline();clearEffects();clearInputs();selectedMode=mode;
 document.body.classList.remove("menu-open");$("mode-menu").hidden=true;$("game-layout").hidden=false;$("back-menu").hidden=false;
 if(mode==="solo")configureSolo();
 resetGame(mode==="local"?count:mode==="solo"?4:2);
 if(mode==="online"){
  online.state=null;online.ownSlot=-1;model.players=[];count=0;renderPeople();renderChairs();renderStats();
  $("room-input").value=(location.hash.match(/^#sala=([A-HJ-NP-Z2-9]{8})$/)||[])[1]||"";previewRoom();
 }
 renderSettings();
}
function showMenu(){
 leaveOnline();clearEffects();clearInputs();selectedMode=null;
 document.body.classList.add("menu-open");$("mode-menu").hidden=false;$("game-layout").hidden=true;$("mode-settings").hidden=true;$("back-menu").hidden=true;
 if(location.hash.startsWith("#sala="))history.replaceState(null,"",location.pathname+location.search);
}
function onlineError(code){
 const key=Object.prototype.hasOwnProperty.call(translations[language],"netError_"+code)?"netError_"+code:"netError_connection";
 online.notice=key;renderOnlinePanel();
}
function renderOnlinePanel(){
 $("online-panel").hidden=selectedMode!=="online";if(selectedMode!=="online")return;
 const available=Boolean(SERVER_URL);
 $("online-unavailable").hidden=available;
 $("online-form").hidden=Boolean(online.state);
 $("create-room").disabled=!available||online.busy||Boolean(online.socket&&online.socket.readyState<2);
 $("join-room").disabled=$("create-room").disabled;
 $("online-lobby").hidden=!online.state;
 $("online-animal").innerHTML=translations[language].animals.map((name,i)=>'<option value="'+i+'" '+(Number($("online-animal").dataset.value||"0")===i?'selected':'')+(online.occupied.includes(i)?' disabled':'')+'>'+esc(name)+'</option>').join("");
 $("online-name").setAttribute("placeholder",t("yourName"));$("room-input").setAttribute("placeholder",t("roomPlaceholder"));
 $("online-notice").textContent=online.notice?t(online.notice):"";
 $("room-preview").textContent=online.preview.map(p=>p.name+" · "+translations[language].animals[p.animal]).join(" / ");
 const state=online.state;if(!state)return;
 $("room-code").textContent=online.code;
 const link=new URL(location.href);link.hash="sala="+online.code;
 $("invite-link").value=link.href;
 $("lobby-players").innerHTML=state.players.map(p=>'<li><span class="lobby-animal">'+animalSvg(p.animal)+'</span><span><strong>'+esc(p.name)+'</strong><small>'+esc(translations[language].animals[p.animal])+' · '+esc(t(p.connected?"connectedLabel":"disconnectedLabel"))+' · '+esc(t(p.ready?"readyLabel":"notReadyLabel"))+(p.id===state.host?' · '+esc(t("hostLabel")):"")+'</small></span></li>').join("");
 const me=state.players.find(p=>p.id===state.you);
 $("online-ready").disabled=!online.connected||Boolean(me?.ready);
 $("online-ready").hidden=!["lobby","paused"].includes(state.phase);
}
function sendOnline(type,extra={}){
 if(online.socket?.readyState!==1)return false;
 online.socket.send(JSON.stringify({type,seq:++online.seq,...extra}));return true;
}
function leaveOnline(){
 online.generation++;online.occupied=[];online.preview=[];online.busy=false;online.intentional=true;clearTimeout(online.retryTimer);clearTimeout(online.audioTimer);clearInterval(online.pingTimer);
 if(online.socket?.readyState===1)sendOnline("leave");
 online.socket?.close();if(online.code){try{sessionStorage.removeItem("sillita-session-"+online.code);}catch(_){}}online.socket=null;online.connected=false;online.state=null;online.token="";online.notice=null;online.audioRound=null;online.code="";online.ownSlot=-1;online.retry=0;
}
async function previewRoom(){
 const code=$("room-input").value.trim().toUpperCase();if(!SERVER_URL||!/^[A-HJ-NP-Z2-9]{8}$/.test(code))return;
 const generation=online.generation;
 try{const response=await fetch(SERVER_URL.replace(/\/$/,"")+"/rooms/"+code+"/info");const data=await response.json();if(generation!==online.generation)return;
 if(response.ok){online.preview=data.players;online.occupied=data.players.map(p=>p.animal);renderOnlinePanel();}
 }catch(_){}
}
async function openRoom(create=false,reconnect=false){
 if(!SERVER_URL||online.busy)return;
 const generation=online.generation;
 const name=$("online-name").value.trim(),animal=Number($("online-animal").value);
 if(!reconnect&&(!name||[...name].length>24)){onlineError("name");return;}
 online.busy=true;renderOnlinePanel();
 try{
  if(!reconnect){
   online.intentional=false;online.notice=null;online.token="";online.retry=0;
   await unlockAudio();if(generation!==online.generation||selectedMode!=="online")return;
   if(create){
    const response=await fetch(SERVER_URL.replace(/\/$/,"")+"/rooms",{method:"POST"});
    const result=await response.json();if(generation!==online.generation||selectedMode!=="online")return;if(!response.ok){onlineError(result.error);return;}online.code=result.code;
   }else{
    online.code=$("room-input").value.trim().toUpperCase();
    if(!/^[A-HJ-NP-Z2-9]{8}$/.test(online.code)){onlineError("roomMissing");return;}
    try{online.token=sessionStorage.getItem("sillita-session-"+online.code)||"";}catch(_){}
    await previewRoom();if(!online.token&&online.occupied.includes(animal)){onlineError("animal");return;}
   }
  }
  const endpoint=new URL(SERVER_URL);if(endpoint.protocol!=="https:"&&!["127.0.0.1","localhost"].includes(endpoint.hostname))throw Error("protocol");
  endpoint.protocol=endpoint.protocol==="https:"?"wss:":"ws:";endpoint.pathname="/rooms/"+online.code+"/socket";
  online.socket?.close();
  const socket=new WebSocket(endpoint);online.socket=socket;online.seq=0;
  socket.onopen=()=>{
   if(socket!==online.socket)return;
   online.connected=true;online.retry=0;
   sendOnline("join",{name,animal,token:online.token||undefined});
   socket.send(JSON.stringify({type:"ping",sent:Date.now()}));
   clearInterval(online.pingTimer);online.pingTimer=setInterval(()=>{if(socket.readyState===1)socket.send(JSON.stringify({type:"ping",sent:Date.now()}));},10000);
   renderOnlinePanel();
  };
  socket.onmessage=event=>{
   if(socket!==online.socket)return;
   try{
    const msg=JSON.parse(event.data);
    if(msg.type==="session"){online.token=msg.token;try{sessionStorage.setItem("sillita-session-"+online.code,msg.token);}catch(_){}}
    if(msg.type==="pong"){
     const rtt=Date.now()-msg.sent;if(rtt>=0&&rtt<online.bestRtt){online.bestRtt=rtt;online.offset=msg.serverNow-(msg.sent+Date.now())/2;}
     if(rtt>700){online.notice="lowConnection";renderOnlinePanel();}
    }
    if(msg.type==="state"){online.notice=null;applyOnlineState(msg);}
    if(msg.type==="error"){onlineError(msg.code);if(!online.state){if(msg.code==="session"){try{sessionStorage.removeItem("sillita-session-"+online.code);}catch(_){}online.token="";}socket.close(1000,"join failed");}}
   }catch(_){onlineError("connection");}
  };
  socket.onerror=()=>onlineError("connection");
  socket.onclose=event=>{
   if(socket!==online.socket)return;
   online.connected=false;clearInterval(online.pingTimer);clearTimeout(online.audioTimer);online.audioRound=null;endMusic();clearInputs();
   if(online.intentional||selectedMode!=="online")return;
   if(event.code===4001){online.token="";onlineError("session");syncModeControls();return;}
   if(online.token&&online.retry<5){
    online.notice="reconnecting";online.retryTimer=setTimeout(()=>openRoom(false,true),Math.min(10000,1000*Math.pow(2,online.retry++)));
   }else if(!online.notice)onlineError("connection");
   syncModeControls();
  };
  renderOnlinePanel();
 }catch(_){if(generation===online.generation){online.connected=false;onlineError("connection");}}finally{if(generation===online.generation){online.busy=false;renderOnlinePanel();}}
}
function applyOnlineState(state){
 const previous=online.state;online.state=state;
 if(!Number.isFinite(online.offset)||online.bestRtt===Infinity)online.offset=state.serverNow-Date.now();
 online.ownSlot=state.players.findIndex(p=>p.id===state.you);
 const rosterChanged=!previous||previous.players.map(p=>p.id+":"+p.animal).join()!==state.players.map(p=>p.id+":"+p.animal).join();
 count=state.players.length;
 model.players=state.players.map((p,id)=>({id,onlineId:p.id,animal:p.animal,customName:p.name,bot:false,active:p.active,seats:p.seats,eliminatedRound:p.eliminatedRound}));
 model.phase=state.phase==="lobby"?"ready":state.phase;model.round=state.round;
 model.claims=state.claims.map(id=>state.players.findIndex(p=>p.id===id));model.winner=state.winner?state.players.findIndex(p=>p.id===state.winner):null;
 if(rosterChanged)renderPeople();
 const phaseChange=!previous||previous.phase!==state.phase||previous.round!==state.round;
 if(phaseChange){
  $("arena").classList.remove("dancing","stopped");$("confetti").innerHTML="";
  clearTimeout(online.audioTimer);
  if(state.phase==="music"){
   const begin=()=>{if(online.state?.phase!=="music")return;$("arena").classList.add("dancing");message("musicTitle","musicDescription");if(online.audioRound!==state.round){online.audioRound=state.round;music(Math.max(0,Date.now()+online.offset-state.startAt));}};
   if(Date.now()+online.offset<state.startAt){message("onlineCountdown","onlineMusic","♫",{n:Math.ceil((state.startAt-Date.now()-online.offset)/1000)});online.audioTimer=setTimeout(begin,Math.max(0,state.startAt-Date.now()-online.offset));}else begin();
  }else{
   endMusic();online.audioRound=null;
   if(state.phase==="claim"){$("arena").classList.add("stopped");message("stopTitle","stopDescription","!");}
   else if(state.phase==="finished"){message("namedWin","winDescription","★",{playerId:model.winner});celebrate();}
   else if(state.phase==="result"){const loser=model.players.find(p=>p.eliminatedRound===state.round);message("resultTitle","namedResult","↗",{playerId:loser?.id});}
   else if(state.phase==="paused")message("pauseTitle","onlinePaused","Ⅱ");
   else message("lobby",state.cancelled?"onlineCancelled":"onlineLobby");
  }
  renderChairs();
 }
 // Les sièges gardent les couleurs décidées par le serveur.
 model.claims.forEach((id,index)=>{const chair=$("chairs").children[index];if(chair){chair.classList.add("taken");chair.style.setProperty("--player",palette[model.players[id].animal]);}});
 positionPeople();renderStats();renderRoster();
 setStatus(state.phase==="claim"?"stopStatus":state.phase==="music"?"onlineMusic":state.phase==="paused"?"onlinePaused":state.phase==="lobby"?(state.cancelled?"onlineCancelled":"onlineLobby"):state.phase==="finished"?"winDescription":"resultTitle");
 syncModeControls();
}
function onlineAway(){
 if(selectedMode!=="online")return false;
 endMusic();clearTimeout(online.audioTimer);online.audioRound=null;clearInputs();sendOnline("away");return true;
}
function celebrate(){
 $("confetti").innerHTML=Array.from({length:32},(_,i)=>'<i class="confetto" style="--left:'+((i*37)%100)+'%;--color:'+palette[i%4]+';--duration:'+(2+i%4*.4)+'s;--delay:-'+(i%7*.3)+'s"></i>').join("");
}
document.querySelectorAll("[data-mode]").forEach(button=>button.addEventListener("click",()=>selectMode(button.dataset.mode)));
$("back-menu").addEventListener("click",showMenu);
$("difficulty").addEventListener("change",()=>difficulty=$("difficulty").value);
$("room-input").addEventListener("change",previewRoom);
$("online-animal").addEventListener("change",()=>$("online-animal").dataset.value=$("online-animal").value);
$("create-room").addEventListener("click",()=>openRoom(true));
$("join-room").addEventListener("click",()=>openRoom(false));
$("online-ready").addEventListener("click",async()=>{await unlockAudio();sendOnline("ready");});
$("copy-invite").addEventListener("click",async()=>{
 try{await navigator.clipboard.writeText($("invite-link").value);online.notice="copyDone";}
 catch(_){$("invite-link").select();online.notice="copyManual";}renderOnlinePanel();
});
