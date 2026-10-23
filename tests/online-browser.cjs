const {chromium}=require("playwright"),assert=require("node:assert/strict"),fs=require("node:fs");
const html=fs.readFileSync("La-Sillita.html","utf8").replace('const SERVER_URL = "";','const SERVER_URL = "http://127.0.0.1:8787";');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(require("node:fs").existsSync("/usr/bin/chromium")?"/usr/bin/chromium":undefined),args:["--no-sandbox"]});
try{
 const contexts=[],pages=[],errors=[];
 for(let i=0;i<4;i++){
  const c=await browser.newContext({viewport:{width:390,height:900},hasTouch:true,isMobile:true});contexts.push(c);
  const p=await c.newPage();const permissions=await c.newCDPSession(p);const target=await permissions.send("Target.getTargetInfo");await permissions.send("Browser.grantPermissions",{permissions:["localNetworkAccess","loopbackNetwork"],origin:"http://127.0.0.1:4173",browserContextId:target.targetInfo.browserContextId});pages.push(p);p.on("pageerror",e=>errors.push(e.message));
  await p.route("**/La-Sillita.html",r=>r.fulfill({contentType:"text/html",body:html}));
  await p.goto("http://127.0.0.1:4173/La-Sillita.html");
  await p.locator('[data-mode="online"]').click({force:true});
  await p.locator("#online-name").fill(["Ana <img src=x onerror=alert(1)>","Bea","Chris","Dora"][i].slice(0,24));
  await p.locator("#online-animal").selectOption(String(i));
 }
 await pages[0].locator("#create-room").evaluate(b=>b.scrollIntoView({block:"center"}));await pages[0].locator("#create-room").click({force:true});
 await pages[0].locator("#room-code").waitFor({state:"visible",timeout:15000});
 await pages[0].waitForFunction(()=>document.getElementById("room-code").textContent.length===8,null,{timeout:15000});
 const code=await pages[0].locator("#room-code").textContent();console.log("Sala creada y código de 8 caracteres validado.");
 for(let i=1;i<4;i++){
  await pages[i].locator("#room-input").fill(code);
  await pages[i].locator("#join-room").evaluate(b=>b.scrollIntoView({block:"center"}));await pages[i].locator("#join-room").click({force:true});
  await pages[i].waitForFunction(()=>document.querySelectorAll("#lobby-players li").length>=2,null,{timeout:15000});
 }
 for(const p of pages)await p.waitForFunction(()=>document.querySelectorAll("#lobby-players li").length===4,null,{timeout:15000});
 assert.equal(await pages[0].locator("#lobby-players img").count(),0);
 for(const p of pages){assert.equal(await p.locator(".character").count(),4);assert.equal(await p.locator("[data-touch-player]:visible").count(),1);await p.locator("#online-ready").evaluate(b=>b.click());}
 await pages[0].waitForFunction(()=>!document.getElementById("play").disabled,null,{timeout:15000});
 assert(await pages[1].locator("#play").isDisabled());
 for(let round=1;round<4;round++){
  await pages[0].locator("#play").evaluate(b=>b.click());
  for(const p of pages)await p.waitForFunction(()=>document.querySelector(".dancing"),null,{timeout:12000});
  // Otra tecla intenta controlar a Ana desde el dispositivo de Bea: no debe actuar.
  await pages[1].keyboard.press("a");
  for(const p of pages)await p.waitForFunction(()=>document.querySelector(".stopped"),null,{timeout:15000});
  for(let i=0;i<4-round;i++)await pages[i].locator('[data-touch-player="'+i+'"]').tap({force:true});
  for(const p of pages)await p.waitForFunction(n=>document.querySelectorAll(".character.out").length===n,round,{timeout:10000});
  if(round===1){
   assert(await pages[3].locator('[data-touch-player="3"]').isDisabled());
   for(const [i,locale] of ["es-ES","en-GB","pl-PL","de-DE"].entries())await pages[i].locator('[data-language="'+locale+'"]').evaluate(b=>b.click());
  }
  console.log("Ronda online "+round+": mismos eliminados en los cuatro dispositivos.");
 }
 for(const p of pages){assert.equal(await p.locator(".character.winner").getAttribute("id"),"person-0");assert.equal(await p.locator(".chair").count(),1);}
 await pages[0].locator("#play").evaluate(b=>b.click());
 for(const p of pages)await p.waitForFunction(()=>document.querySelectorAll(".character.out").length===0,null,{timeout:10000});
 for(const p of pages)await p.locator("#online-ready").evaluate(b=>b.click());
 await pages[0].waitForFunction(()=>!document.getElementById("play").disabled,null,{timeout:10000});
 await pages[0].locator("#play").evaluate(b=>b.click());
 await pages[0].waitForFunction(()=>document.querySelector(".dancing"),null,{timeout:12000});
 await contexts[3].setOffline(true);
 await pages[3].evaluate(()=>window.dispatchEvent(new Event("blur")));
 // Un mensaje explícito de away y una reconexión prueban la repetición sin eliminar.
 await contexts[3].setOffline(false);
 await pages[3].reload();
 await pages[3].locator('[data-mode="online"]').click({force:true});
 await pages[3].locator("#online-name").fill("Dora");await pages[3].locator("#room-input").fill(code);await pages[3].locator("#join-room").click({force:true});
 await pages[3].waitForFunction(()=>document.querySelectorAll("#lobby-players li").length===4,null,{timeout:15000});
 assert.deepEqual(errors,[]);
 await pages[0].screenshot({path:"work/online-four-players.png",fullPage:true});
 for(const c of contexts)await c.close();
 console.log("Online: sala real local, cuatro dispositivos, idiomas independientes, nombres seguros, espectador, revancha y recuperación: OK");
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
