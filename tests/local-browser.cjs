const {chromium}=require("playwright"),assert=require("node:assert/strict");
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(require("node:fs").existsSync("/usr/bin/chromium")?"/usr/bin/chromium":undefined),args:["--no-sandbox"]});try{
const p=await browser.newPage({viewport:{width:390,height:900},hasTouch:true,isMobile:true}),errors=[];p.on("pageerror",e=>errors.push(e.message));p.setDefaultTimeout(10000);
await p.goto("http://127.0.0.1:4173/La-Sillita.html");await p.clock.install();await p.clock.pauseAt(await p.evaluate(()=>Date.now()+100));
const start=async()=>{await p.locator("#play").evaluate(b=>b.scrollIntoView({block:"center"}));await p.locator("#play").click({force:true});await p.waitForFunction(()=>document.querySelector(".dancing"),null,{timeout:10000});};
for(const [locale,animal] of [["es-ES",0],["en-GB",1],["pl-PL",2],["de-DE",3]]){
 await p.locator('[data-language="'+locale+'"]').evaluate(b=>b.click());await p.locator('[data-mode="solo"]').click({force:true});
 await p.locator('[data-profile-name="0"]').fill("");await p.locator('[data-profile-name="0"]').pressSequentially("Martina AFJL");assert.equal(await p.locator('[data-profile-name="0"]').inputValue(),"Martina AFJL");await p.locator('[data-profile-animal="0"]').selectOption(String(animal));await p.locator("#difficulty").selectOption("hard");
 assert.equal(await p.locator(".character").count(),4);assert.equal(await p.locator("[data-touch-player]:visible").count(),1);
 assert.equal(await p.locator('#person-0 .animal-'+animal).count(),1);
 for(let round=1;round<4;round++){
  await start();await p.keyboard.press("j");assert.equal(await p.locator(".taken").count(),0);
  await p.clock.fastForward(10000);await p.locator('[data-touch-player="0"]').tap({force:true});await p.clock.runFor(1700);
  assert.equal(await p.locator(".character.out").count(),round);
 }
 assert.equal(await p.locator(".character.winner").getAttribute("id"),"person-0");assert((await p.locator("#stage-title").textContent()).includes("Martina"));
 await p.locator("#back-menu").evaluate(b=>b.click());
 console.log(locale+": menú, nombre, animal, dificultad, tres bots automáticos, tacto y victoria: OK");
}
await p.locator('[data-mode="solo"]').click({force:true});await p.locator("#difficulty").selectOption("easy");await start();await p.clock.fastForward(10000);await p.clock.runFor(2000);
assert(await p.locator("#person-0").evaluate(e=>e.classList.contains("out")));assert(await p.locator('[data-touch-player="0"]').isDisabled());
for(let n=0;n<2;n++){await start();await p.clock.fastForward(10000);await p.clock.runFor(2000);}assert.notEqual(await p.locator(".character.winner").getAttribute("id"),"person-0");
await p.locator('[data-language="es-ES"]').evaluate(b=>b.click());assert((await p.locator("#stage-title").textContent()).includes("ordenador"));
await p.locator("#back-menu").evaluate(b=>b.click());await p.locator('[data-mode="local"]').click({force:true});
await p.locator('[data-count="2"]').evaluate(b=>b.click());await p.locator('[data-profile-name="0"]').fill('Ana <img src=x>');await p.locator('[data-profile-name="1"]').fill("Bea");
await p.locator('[data-profile-animal="0"]').selectOption("3");
assert.equal(new Set(await p.locator(".creature").evaluateAll(els=>els.map(e=>e.getAttribute("aria-label")))).size,2);
assert.equal(await p.locator("#roster img").count(),0);
await start();await p.clock.fastForward(10000);await p.clock.runFor(2000);assert.equal(await p.locator(".taken").count(),0); // local sin bots
await p.keyboard.press("a");assert.equal(await p.locator(".character.winner").getAttribute("id"),"person-0");
await p.locator("#back-menu").evaluate(b=>b.click());await p.locator('[data-mode="online"]').click({force:true});
assert(await p.locator("#online-unavailable").isVisible());assert(await p.locator("#create-room").isDisabled());assert(await p.locator("#join-room").isDisabled());
await p.locator("#back-menu").evaluate(b=>b.click());
for(const width of [320,390,768,1360]){
 await p.setViewportSize({width,height:1000});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.screenshot({path:"work/menu-"+width+".png",fullPage:true});
}
assert.deepEqual(errors,[]);await p.close();console.log("Local sin bots, nombres seguros, intercambio de animales, controles originales y aviso honesto de online pendiente: OK");
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
