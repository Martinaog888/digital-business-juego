(() => {
"use strict";
const $ = id => document.getElementById(id);
const palette = ["#f9b0b2","#f6cc6b","#96d8c4","#b5a3ee"];
const keys = ["KeyA","KeyF","KeyJ","KeyL"];
const labels = ["A","F","J","L"];

// Ilustraciones vectoriales locales: se escalan sin perder nitidez.
function animalSvg(id) {
 const bodies = [
 '<circle cx="26" cy="34" r="12" fill="#343547"/><circle cx="64" cy="34" r="12" fill="#343547"/><ellipse cx="45" cy="77" rx="23" ry="24" fill="#fffaf3"/><ellipse cx="28" cy="97" rx="12" ry="7" fill="#343547"/><ellipse cx="62" cy="97" rx="12" ry="7" fill="#343547"/><ellipse cx="23" cy="76" rx="8" ry="13" fill="#343547" transform="rotate(25 23 76)"/><ellipse cx="67" cy="76" rx="8" ry="13" fill="#343547" transform="rotate(-25 67 76)"/><rect x="17" y="30" width="56" height="46" rx="23" fill="#fffaf3"/><ellipse cx="33" cy="49" rx="10" ry="12" fill="#343547" transform="rotate(20 33 49)"/><ellipse cx="57" cy="49" rx="10" ry="12" fill="#343547" transform="rotate(-20 57 49)"/>',
 '<path d="M26 70 Q5 46 9 81 L23 91M64 70 Q85 46 81 81 L67 91" fill="#b6a0f3" stroke="#715299" stroke-width="2"/><path d="M61 89 Q87 97 75 71 Q94 96 70 101" fill="#75cbb0"/><ellipse cx="45" cy="78" rx="24" ry="24" fill="#79cfb1"/><ellipse cx="45" cy="83" rx="14" ry="17" fill="#ffdf99"/><ellipse cx="29" cy="98" rx="13" ry="6" fill="#69bda2"/><ellipse cx="61" cy="98" rx="13" ry="6" fill="#69bda2"/><path d="M26 34 L24 16 Q37 19 37 34M54 34 Q55 19 68 16 L64 37" fill="#ffe1a0"/><rect x="16" y="29" width="58" height="47" rx="22" fill="#84dabc"/><path d="M40 29 L45 19 L50 29" fill="#b6a0f3"/><ellipse cx="45" cy="63" rx="22" ry="13" fill="#a4e6c9"/><circle cx="37" cy="60" r="2" fill="#468d76"/><circle cx="53" cy="60" r="2" fill="#468d76"/>',
 '<ellipse cx="45" cy="78" rx="22" ry="24" fill="#efba78"/><ellipse cx="45" cy="83" rx="14" ry="15" fill="#fff0d5"/><ellipse cx="29" cy="98" rx="12" ry="6" fill="#c68b58"/><ellipse cx="61" cy="98" rx="12" ry="6" fill="#c68b58"/><path d="M65 83 Q88 74 77 65" fill="none" stroke="#c68b58" stroke-width="9" stroke-linecap="round"/><rect x="19" y="30" width="52" height="46" rx="23" fill="#f4c58c"/><ellipse cx="20" cy="48" rx="11" ry="23" fill="#a67351" transform="rotate(13 20 48)"/><ellipse cx="70" cy="48" rx="11" ry="23" fill="#a67351" transform="rotate(-13 70 48)"/><path d="M39 32 Q45 25 51 32 L51 57 L39 57Z" fill="#fff0d5"/><ellipse cx="45" cy="64" rx="18" ry="12" fill="#fff0d5"/>',
 '<ellipse cx="45" cy="80" rx="23" ry="23" fill="#e2d6fb"/><circle cx="69" cy="83" r="10" fill="#fff9ff"/><ellipse cx="29" cy="98" rx="13" ry="6" fill="#c8b1ed"/><ellipse cx="61" cy="98" rx="13" ry="6" fill="#c8b1ed"/><ellipse cx="31" cy="25" rx="10" ry="24" fill="#e2d6fb" transform="rotate(-9 31 25)"/><ellipse cx="59" cy="25" rx="10" ry="24" fill="#e2d6fb" transform="rotate(9 59 25)"/><ellipse cx="31" cy="24" rx="4.5" ry="17" fill="#f3adc8" transform="rotate(-9 31 24)"/><ellipse cx="59" cy="24" rx="4.5" ry="17" fill="#f3adc8" transform="rotate(9 59 24)"/><rect x="18" y="36" width="54" height="42" rx="22" fill="#eee4ff"/><ellipse cx="45" cy="81" rx="13" ry="14" fill="#fff9ff"/>'
 ];
 return '<svg class="animal-art animal-'+id+'" viewBox="0 0 90 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="45" cy="105" rx="27" ry="3" fill="#584270" opacity=".12"/>'+bodies[id]+
 '<g class="animal-eyes" fill="'+(id===0?'#ffffff':'#49384f')+'"><ellipse cx="33" cy="50" rx="3" ry="4"/><ellipse cx="57" cy="50" rx="3" ry="4"/></g><g class="animal-happy-eyes" fill="none" stroke="'+(id===0?'#ffffff':'#49384f')+'" stroke-width="2.5" stroke-linecap="round"><path d="M29 51 Q33 44 37 51M53 51 Q57 44 61 51"/></g><g fill="#f39bb4" opacity=".65"><ellipse cx="26" cy="60" rx="5" ry="3"/><ellipse cx="64" cy="60" rx="5" ry="3"/></g>'+
 (id!==1?'<path d="M41 58 Q45 55 49 58 Q48 62 45 63 Q42 62 41 58" fill="'+(id===3?'#d584a7':'#49384f')+'"/>':'')+
 '<path class="animal-smile" d="M39 66 Q45 72 51 66" fill="none" stroke="#49384f" stroke-width="2" stroke-linecap="round"/><path class="animal-sad" d="M40 70 Q45 64 50 70" fill="none" stroke="#49384f" stroke-width="2" stroke-linecap="round"/><g class="animal-cheer"><path d="M38 65 Q45 79 52 65Z" fill="#693b62"/><path d="M41 70 Q45 67 49 70 Q45 75 41 70" fill="#f49bb8"/></g><g class="animal-crown" fill="#ffd66d" stroke="#c99531" stroke-width="1.2"><path d="M31 30 L28 18 L39 23 L45 13 L51 23 L62 18 L59 30Z"/></g></svg>';
}


const translations = {
 "es-ES": {
 "touchTitle":"Tu silla, a un toque", "touchWait":"Espera a que pare la música…", "touchNow":"¡Ahora! Toca tu animal.", "touchReady":"Inicia la partida para jugar.", "touchPaused":"Repite la ronda para continuar.", "touchDone":"Ronda terminada.", "touchAbsent":"No participa", "touchSeated":"¡Silla conseguida!", "touchTap":"¡Toca aquí!", "touchWaitShort":"Espera…", "touchPlayer":"Jugador {n}: {animal}. Botón táctil o tecla {key}",
 title:"La Sillita · Sillas musicales", course:"DIGITAL BUSINESS · JUEGA EN COMPAÑÍA", eyebrow:"EL CLÁSICO, CON MÁS RITMO", headline:"Que no te quiten", accent:"tu sitio.", intro:"Música, reflejos y una silla de menos. ¿Quién se sienta primero?",
 gameArea:"Zona de juego", live:"SOLO PERSONAS, CERO BOTS", prepare:"PREPARA TU PARTIDA", setupEyebrow:"QUE EMPIECE LA FIESTA", setupTitle:"Vuestro próximo pique.", howMany:"¿Cuántas personas jugáis?", countLabel:"Número de participantes", participant:"PARTICIPANTE", key:"SU TECLA", localNote:"Una pantalla. Teclas o toques. Mucho ritmo.", scoreboard:"El marcador", thisGame:"ESTA PARTIDA", howTo:"ASÍ SE JUEGA", rulesTitle:"Oídos atentos. Dedos preparados.", rule1Title:"Sigue el ritmo", rule1:"Los personajes bailan mientras suena la música. ¡Todavía no pulses ni toques!", rule2Title:"¡Ahora, a la silla!", rule2:"Cuando pare la música y aparezca «¡Siéntate!», toca el botón de tu animal o pulsa tu tecla una vez.", rule3Title:"Solo queda una persona", rule3:"Hay una silla menos por ronda. Quien se queda sin sitio sale de la partida.", fineprint:"Si te adelantas, suelta la tecla o levanta el dedo y vuelve a pulsar o tocar al parar la música. No vale mantenerlos pulsados. Las pulsaciones y los toques se resuelven por orden de llegada al navegador. Si cambiáis de pestaña, la ronda se repite.", footer:"Un juego para compartir.", credit:"Hecho para Digital Business · 2–4 personas", language:"Idioma", player:"Jugador {n}", shortPlayer:"J{n}", animals:["Panda","Dragón","Perro","Conejo"], round:"RONDA {n} / {total}", winnerLabel:"★ Ganador", outLabel:"Fuera", chairs:{one:"{n} silla",other:"{n} sillas"}, people:{one:"{n} persona",other:"{n} personas"},
 readyTitle:"Todo listo para bailar", readyDescription:"Reúne a tu equipo y dale al play.", readyStatus:"Elige cuántas personas vais a jugar.", start:"Empezar partida", replay:"Volver a jugar", next:"Siguiente ronda", repeatRound:"Repetir ronda", running:"La ronda está en marcha ♫", musicTitle:"¡Sigue el ritmo!", musicDescription:"Espera… la música puede parar en cualquier momento.", musicStatus:"No pulses hasta que se detenga la música.", visualStatus:"Sigue la señal visual: espera a «¡Siéntate!».", audioError:"Audio no disponible: sigue la señal visual «¡Siéntate!».", stopTitle:"¡Siéntate!", stopDescription:"Toca tu animal o pulsa tu tecla. ¡Cada milisegundo cuenta!", stopStatus:"¡La música ha parado! Consigue tu silla.", early:"Jugador {n}: ¡todavía no! Suelta la tecla o levanta el dedo y espera.", seated:"Jugador {n} ya tiene silla. ¡Aún queda sitio!", eliminated:"Jugador {n} se ha quedado sin silla en la ronda {round}.", winTitle:"¡Gana el jugador {n}!", winDescription:"Reflejos de campeón. ¿Os atrevéis con la revancha?", resultTitle:"¡Una silla menos!", resultDescription:"Jugador {n} queda eliminado. Seguimos bailando.", pauseTitle:"Una pausa para todos", pauseDescription:"La ronda se repetirá cuando estéis preparados.", pauseStatus:"Ronda anulada al salir de la ventana. Nadie queda eliminado.", soundOn:"♫ Sonido activado", soundOff:"♫ Sonido desactivado"
 },
 "en-GB": {
 "touchTitle":"Your seat is a tap away", "touchWait":"Wait for the music to stop…", "touchNow":"Now! Tap your animal.", "touchReady":"Start the game to play.", "touchPaused":"Replay the round to continue.", "touchDone":"Round finished.", "touchAbsent":"Not playing", "touchSeated":"Seat secured!", "touchTap":"Tap here!", "touchWaitShort":"Wait…", "touchPlayer":"Player {n}: {animal}. Touch button or {key} key",
 title:"La Sillita · Musical Chairs", course:"DIGITAL BUSINESS · PLAY TOGETHER", eyebrow:"THE CLASSIC, WITH MORE RHYTHM", headline:"Don't lose", accent:"your seat.", intro:"Music, quick reactions and one chair too few. Who will sit down first?",
 gameArea:"Play area", live:"REAL PEOPLE, NO BOTS", prepare:"GET READY TO PLAY", setupEyebrow:"LET THE PARTY BEGIN", setupTitle:"A little friendly competition.", howMany:"How many people are playing?", countLabel:"Number of players", participant:"PLAYER", key:"THEIR KEY", localNote:"One screen. Keys or taps. Plenty of rhythm.", scoreboard:"Scoreboard", thisGame:"THIS GAME", howTo:"HOW TO PLAY", rulesTitle:"Ears open. Fingers ready.", rule1Title:"Follow the rhythm", rule1:"The animals dance while the music plays. Don't press your key or tap yet!", rule2Title:"Grab a chair!", rule2:"When the music stops and “Sit down!” appears, tap your animal’s button or press your key once.", rule3Title:"Last player standing", rule3:"There is one fewer chair than players in each round. Whoever misses out is eliminated.", fineprint:"If you press or tap too early, release the key or lift your finger and try again once the music stops. Holding a key or button down doesn't count. Keys and taps are processed in the order the browser receives them. Switching tabs restarts the round.", footer:"A game to share.", credit:"Made for Digital Business · 2–4 players", language:"Language", player:"Player {n}", shortPlayer:"P{n}", animals:["Panda","Dragon","Dog","Rabbit"], round:"ROUND {n} / {total}", winnerLabel:"★ Winner", outLabel:"Out", chairs:{one:"{n} chair",other:"{n} chairs"}, people:{one:"{n} player",other:"{n} players"},
 readyTitle:"Ready to dance", readyDescription:"Gather your friends and press play.", readyStatus:"Choose how many people are playing.", start:"Start game", replay:"Play again", next:"Next round", repeatRound:"Replay round", running:"Round in progress ♫", musicTitle:"Follow the rhythm!", musicDescription:"Wait… the music could stop at any moment.", musicStatus:"Don't press until the music stops.", visualStatus:"Watch the screen: wait for “Sit down!”.", audioError:"Audio unavailable: watch for the “Sit down!” message.", stopTitle:"Sit down!", stopDescription:"Tap your animal or press your key. Every millisecond counts!", stopStatus:"The music has stopped! Grab your chair.", early:"Player {n}: not yet! Release your key or lift your finger and wait.", seated:"Player {n} has a chair. There's still room!", eliminated:"Player {n} missed out on a chair in round {round}.", winTitle:"Player {n} wins!", winDescription:"Champion reactions! Fancy a rematch?", resultTitle:"One fewer chair!", resultDescription:"Player {n} is out. Let's keep dancing.", pauseTitle:"A break for everyone", pauseDescription:"Replay the round when everyone is ready.", pauseStatus:"Round cancelled after leaving the window. No one is eliminated.", soundOn:"♫ Sound on", soundOff:"♫ Sound off"
 },
 "pl-PL": {
 "touchTitle":"Krzesło na wyciągnięcie palca", "touchWait":"Poczekaj, aż muzyka ucichnie…", "touchNow":"Teraz! Dotknij swojego zwierzątka.", "touchReady":"Rozpocznij grę, aby zagrać.", "touchPaused":"Powtórz rundę, aby kontynuować.", "touchDone":"Koniec rundy.", "touchAbsent":"Nie bierze udziału", "touchSeated":"Krzesło zajęte!", "touchTap":"Dotknij tutaj!", "touchWaitShort":"Czekaj…", "touchPlayer":"Gracz {n}: {animal}. Przycisk dotykowy lub klawisz {key}",
 title:"La Sillita · Muzyczne krzesła", course:"DIGITAL BUSINESS · GRAJCIE RAZEM", eyebrow:"KLASYCZNA GRA W NOWYM RYTMIE", headline:"Nie daj sobie zabrać", accent:"miejsca.", intro:"Muzyka, refleks i o jedno krzesło za mało. Kto usiądzie pierwszy?",
 gameArea:"Plansza gry", live:"TYLKO LUDZIE, ŻADNYCH BOTÓW", prepare:"PRZYGOTUJCIE SIĘ DO GRY", setupEyebrow:"NIECH ZACZNIE SIĘ ZABAWA", setupTitle:"Czas na przyjazną rywalizację.", howMany:"Ile osób gra?", countLabel:"Liczba graczy", participant:"GRACZ", key:"KLAWISZ", localNote:"Jeden ekran. Klawisze lub dotyk. Mnóstwo rytmu.", scoreboard:"Wyniki", thisGame:"TA ROZGRYWKA", howTo:"JAK GRAĆ", rulesTitle:"Nadstawcie uszu. Przygotujcie palce.", rule1Title:"Poczuj rytm", rule1:"Zwierzątka tańczą, gdy gra muzyka. Jeszcze nie naciskaj klawisza ani przycisku!", rule2Title:"Zajmij krzesło!", rule2:"Gdy muzyka ucichnie i pojawi się napis „Siadaj!”, dotknij przycisku swojego zwierzątka lub naciśnij swój klawisz jeden raz.", rule3Title:"Zostaje jedna osoba", rule3:"W każdej rundzie jest o jedno krzesło mniej niż graczy. Osoba bez miejsca odpada.", fineprint:"Jeśli naciśniesz za wcześnie, puść klawisz lub podnieś palec i spróbuj ponownie, gdy muzyka ucichnie. Przytrzymywanie klawisza lub przycisku się nie liczy. Liczy się kolejność, w jakiej przeglądarka odbierze naciśnięcia i dotknięcia. Po zmianie karty runda zostanie powtórzona.", footer:"Gra do wspólnej zabawy.", credit:"Projekt na zajęcia Digital Business · 2–4 graczy", language:"Język", player:"Gracz {n}", shortPlayer:"G{n}", animals:["Panda","Smok","Pies","Królik"], round:"RUNDA {n} / {total}", winnerLabel:"★ Zwycięzca", outLabel:"Poza grą", chairs:{one:"{n} krzesło",few:"{n} krzesła",many:"{n} krzeseł",other:"{n} krzesła"}, people:{one:"{n} gracz",few:"{n} graczy",many:"{n} graczy",other:"{n} gracza"},
 readyTitle:"Gotowi do tańca", readyDescription:"Zbierz znajomych i rozpocznij grę.", readyStatus:"Wybierz liczbę graczy.", start:"Rozpocznij grę", replay:"Zagraj ponownie", next:"Następna runda", repeatRound:"Powtórz rundę", running:"Runda w toku ♫", musicTitle:"Poczuj rytm!", musicDescription:"Czekaj… muzyka może ucichnąć w każdej chwili.", musicStatus:"Nie naciskaj, dopóki muzyka nie ucichnie.", visualStatus:"Patrz na ekran: poczekaj na napis „Siadaj!”.", audioError:"Dźwięk niedostępny: czekaj na napis „Siadaj!”.", stopTitle:"Siadaj!", stopDescription:"Dotknij swojego zwierzątka lub naciśnij klawisz. Liczy się każda milisekunda!", stopStatus:"Muzyka ucichła! Zajmij krzesło.", early:"Gracz {n}: jeszcze nie! Puść klawisz lub podnieś palec i poczekaj.", seated:"Gracz {n} ma już krzesło. Są jeszcze wolne miejsca!", eliminated:"Gracz {n} nie zajął krzesła w rundzie {round}.", winTitle:"Wygrywa gracz {n}!", winDescription:"Mistrzowski refleks! Czas na rewanż?", resultTitle:"O jedno krzesło mniej!", resultDescription:"Gracz {n} odpada. Tańczymy dalej.", pauseTitle:"Przerwa dla wszystkich", pauseDescription:"Powtórzcie rundę, gdy wszyscy będą gotowi.", pauseStatus:"Runda anulowana po opuszczeniu okna. Nikt nie odpada.", soundOn:"♫ Dźwięk włączony", soundOff:"♫ Dźwięk wyłączony"
 },
 "de-DE": {
 "touchTitle":"Ein Fingertipp zum Sitzplatz", "touchWait":"Warte, bis die Musik stoppt…", "touchNow":"Jetzt! Tippe auf dein Tier.", "touchReady":"Starte das Spiel, um mitzuspielen.", "touchPaused":"Wiederhole die Runde, um fortzufahren.", "touchDone":"Runde beendet.", "touchAbsent":"Spielt nicht mit", "touchSeated":"Stuhl gesichert!", "touchTap":"Hier tippen!", "touchWaitShort":"Warte…", "touchPlayer":"Spieler {n}: {animal}. Touch-Schaltfläche oder Taste {key}",
 title:"La Sillita · Reise nach Jerusalem", course:"DIGITAL BUSINESS · GEMEINSAM SPIELEN", eyebrow:"DER KLASSIKER MIT MEHR RHYTHMUS", headline:"Sichere dir", accent:"deinen Platz.", intro:"Musik, schnelle Reaktionen und ein Stuhl zu wenig. Wer sitzt zuerst?",
 gameArea:"Spielfeld", live:"NUR MENSCHEN, KEINE BOTS", prepare:"MACHT EUCH BEREIT", setupEyebrow:"DIE PARTY KANN BEGINNEN", setupTitle:"Zeit für ein kleines Duell.", howMany:"Wie viele Personen spielen mit?", countLabel:"Anzahl der Mitspielenden", participant:"SPIELER", key:"TASTE", localNote:"Ein Bildschirm. Tastatur oder Touch. Jede Menge Rhythmus.", scoreboard:"Punktestand", thisGame:"DIESES SPIEL", howTo:"SO WIRD GESPIELT", rulesTitle:"Ohren auf. Finger bereit.", rule1Title:"Folge dem Rhythmus", rule1:"Die Tiere tanzen, solange die Musik läuft. Drücke noch keine Taste und tippe noch nicht!", rule2Title:"Schnapp dir einen Stuhl!", rule2:"Sobald die Musik stoppt und „Hinsetzen!“ erscheint, tippe einmal auf die Schaltfläche deines Tiers oder drücke deine Taste.", rule3Title:"Eine Person gewinnt", rule3:"In jeder Runde gibt es einen Stuhl weniger als Mitspielende. Wer keinen Platz bekommt, scheidet aus.", fineprint:"Wenn du zu früh drückst oder tippst, lass die Taste los oder hebe den Finger und versuche es erneut, sobald die Musik stoppt. Gedrückthalten zählt nicht. Entscheidend ist die Reihenfolge, in der Tastendrücke und Berührungen beim Browser ankommen. Beim Wechseln des Tabs wird die Runde wiederholt.", footer:"Ein Spiel für gemeinsame Zeit.", credit:"Für Digital Business entwickelt · 2–4 Personen", language:"Sprache", player:"Spieler {n}", shortPlayer:"S{n}", animals:["Panda","Drache","Hund","Kaninchen"], round:"RUNDE {n} / {total}", winnerLabel:"★ Gewinner", outLabel:"Ausgeschieden", chairs:{one:"{n} Stuhl",other:"{n} Stühle"}, people:{one:"{n} Person",other:"{n} Personen"},
 readyTitle:"Bereit zum Tanzen", readyDescription:"Versammelt euch und startet das Spiel.", readyStatus:"Wählt aus, wie viele Personen mitspielen.", start:"Spiel starten", replay:"Noch mal spielen", next:"Nächste Runde", repeatRound:"Runde wiederholen", running:"Die Runde läuft ♫", musicTitle:"Folge dem Rhythmus!", musicDescription:"Warte… die Musik kann jeden Moment stoppen.", musicStatus:"Drücke erst, wenn die Musik stoppt.", visualStatus:"Achte auf den Bildschirm: Warte auf „Hinsetzen!“.", audioError:"Kein Ton verfügbar: Achte auf „Hinsetzen!“.", stopTitle:"Hinsetzen!", stopDescription:"Tippe auf dein Tier oder drücke deine Taste. Jede Millisekunde zählt!", stopStatus:"Die Musik ist aus! Schnapp dir deinen Stuhl.", early:"Spieler {n}: noch nicht! Lass die Taste los oder hebe den Finger und warte.", seated:"Spieler {n} hat einen Stuhl. Es sind noch Plätze frei!", eliminated:"Spieler {n} hat in Runde {round} keinen Stuhl bekommen.", winTitle:"Spieler {n} gewinnt!", winDescription:"Meisterhafter Reflex! Lust auf eine Revanche?", resultTitle:"Ein Stuhl weniger!", resultDescription:"Spieler {n} scheidet aus. Wir tanzen weiter.", pauseTitle:"Eine Pause für alle", pauseDescription:"Wiederholt die Runde, sobald alle bereit sind.", pauseStatus:"Runde beim Verlassen des Fensters abgebrochen. Niemand scheidet aus.", soundOn:"♫ Ton an", soundOff:"♫ Ton aus"
 }
};
/*__MODE_TRANSLATIONS__*/
let language = "es-ES";
try { const saved=localStorage.getItem("la-sillita-language"); if(translations[saved]) language=saved; } catch (_) {}
const t = (key, params={}) => {
 const text=translations[language][key];
 if(typeof text!=="string") throw new Error("Missing translation: "+language+"/"+key);
 const values={...params};if(Number.isInteger(values.playerId))values.name=displayName(values.playerId);
 return text.replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??""));
};
const plural = (key,n) => {
 const forms=translations[language][key],category=new Intl.PluralRules(language).select(n);
 return (forms[category]||forms.other).replace("{n}",n);
};
let stageState={title:"readyTitle",description:"readyDescription",icon:"♫",params:{}};
let statusState={key:"readyStatus",params:{}};
let playState={key:"start",icon:"↗"};
function setStatus(key,params={}) { statusState={key,params}; $("status").textContent=t(key,params); }
function setPlay(key,icon="") { playState={key,icon}; $("play").replaceChildren(document.createTextNode(t(key))); if(icon){ const marker=document.createElement("span"); marker.textContent=icon; marker.setAttribute("aria-hidden","true"); $("play").append(marker); } }
function translateStatic() {
 document.documentElement.lang=language;document.title=t("title");
 document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
 document.querySelector(".game-panel").setAttribute("aria-label",t("gameArea"));
 document.querySelector(".count-selector").setAttribute("aria-label",t("countLabel"));
 document.querySelector(".language-picker").setAttribute("aria-label",t("language"));
 document.querySelectorAll("[data-language]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.language===language)));
 $("sound").textContent=t(muted?"soundOff":"soundOn");
 $("reset").textContent=t("replay");
}
function refreshLanguage() {
 translateStatic();renderStats();renderRoster();
 model.players.forEach(p=>{
  const el=$("person-"+p.id);
  el.querySelector(".creature").setAttribute("aria-label",translations[language].animals[p.animal??p.id]);
  el.querySelector(".player-tag").innerHTML="<kbd>"+labels[p.id]+"</kbd> "+esc(displayName(p.id));
 });
 message(stageState.title,stageState.description,stageState.icon,stageState.params);
 setStatus(statusState.key,statusState.params);setPlay(playState.key,playState.icon);renderSettings();
}


/*__MODES__*/
const model = new ChairGame(4);
let count=4, roundTimer=null, audio=null, master=null, musicBus=null, beatTimer=null, noteIndex=0, busy=false, muted=false, stopAt=0;
const melody=[72,76,79,76,74,77,81,77,72,76,79,84,83,79,77,74];
const selectButtons=[...document.querySelectorAll("[data-count]")];
function message(title,description,icon="♫",params={}) { stageState={title,description,icon,params}; $("stage-title").textContent=t(title,params); $("stage-description").textContent=t(description,params); $("stage-icon").textContent=icon; }
// Pointer Events admiten varios dedos; teclado y tacto comparten las mismas reglas.
const activeInputs=Array.from({length:4},()=>new Set());
const pointerOwners=new Map();
function createTouchControls(){
 $("touch-buttons").innerHTML=palette.map((colour,id)=>'<button type="button" class="touch-player" data-touch-player="'+id+'" style="--player:'+colour+'" disabled><span class="touch-avatar" aria-hidden="true">'+animalSvg(id)+'</span><span class="touch-copy"><strong></strong><small></small></span><kbd>'+labels[id]+'</kbd></button>').join("");
 document.querySelectorAll("[data-touch-player]").forEach(button=>{
  const id=Number(button.dataset.touchPlayer);
  button.addEventListener("pointerdown",event=>{
   if(button.disabled||event.button!==0)return;
   event.preventDefault();
   pointerOwners.set(event.pointerId,id);
   try{button.setPointerCapture(event.pointerId);}catch(_){}
   inputDown(id,"pointer:"+event.pointerId);
  });
  // Activación por lector de pantalla o Enter/Espacio; no duplica el clic de un toque.
  button.addEventListener("click",event=>{
   if(event.detail!==0||button.disabled)return;
   inputDown(id,"accessible");inputUp(id,"accessible");
  });
  button.addEventListener("contextmenu",event=>event.preventDefault());
 });
}
function updateTouchControls(){
 if(!$("touch-buttons").children.length)return;
 const playable=["music","claim"].includes(model.phase);
 $("touch-prompt").textContent=t(model.phase==="music"?"touchWait":model.phase==="claim"?"touchNow":model.phase==="ready"?"touchReady":model.phase==="paused"?"touchPaused":"touchDone");
 $("touch-controls").classList.toggle("touch-go",model.phase==="claim");
 document.querySelectorAll("[data-touch-player]").forEach(button=>{
  const id=Number(button.dataset.touchPlayer),player=model.players[id],seated=model.claims.includes(id);
  const animal=player?.animal??id;
  if(button.dataset.animal!==String(animal)){button.querySelector(".touch-avatar").innerHTML=animalSvg(animal);button.dataset.animal=String(animal);}
  button.style.setProperty("--player",palette[animal]);
  button.hidden=selectedMode!=="local"&&!canControl(id);
  const state=!player?"touchAbsent":!player.active?"outLabel":seated?"touchSeated":model.phase==="claim"?"touchTap":"touchWaitShort";
  button.querySelector("strong").textContent=selectedMode==="online"?t("sit"):player?displayName(id):translations[language].animals[animal];
  button.querySelector("small").textContent=t(state);
  button.setAttribute("aria-label",t("touchPlayer",{n:id+1,animal:translations[language].animals[animal],key:labels[id]})+". "+t(state));
  button.disabled=!player||!player.active||!playable||seated||!canControl(id)||(selectedMode==="online"&&!online.connected);
  button.classList.toggle("touch-seated",seated);
  button.classList.toggle("touch-out",Boolean(player&&!player.active));
  button.classList.toggle("touch-held",activeInputs[id].size>0);
 });
}
function inputDown(id,source,repeat=false){
 if(!canControl(id)||!selectedMode||(selectedMode==="online"&&!online.connected))return;
 if(repeat||activeInputs[id].has(source))return;
 const wasHeld=activeInputs[id].size>0;
 activeInputs[id].add(source);
 if(!wasHeld){
  if(selectedMode==="online")sendOnline("press",{round:model.round,claimToken:online.state?.claimToken});
  else {if(model.phase==="music"&&performance.now()>=stopAt)stopRound();claim(id,false);}
 }
 updateTouchControls();
}
function inputUp(id,source){
 activeInputs[id].delete(source);
 if(activeInputs[id].size===0){model.release(id);if(selectedMode==="online"&&id===online.ownSlot)sendOnline("release");}
 updateTouchControls();
}
function releasePointer(event){
 const id=pointerOwners.get(event.pointerId);
 if(id===undefined)return;
 pointerOwners.delete(event.pointerId);inputUp(id,"pointer:"+event.pointerId);
}
function clearInputs(){
 pointerOwners.clear();activeInputs.forEach(sources=>sources.clear());model.held.clear();
}
window.addEventListener("pointerup",releasePointer);
window.addEventListener("pointercancel",releasePointer);
window.addEventListener("lostpointercapture",releasePointer);


function tone(midi,duration=.15,type="triangle",volume=.12,bus=master) {
 if(!audio || audio.state!=="running" || !bus) return;
 const oscillator=audio.createOscillator(), gain=audio.createGain(), now=audio.currentTime;
 oscillator.type=type; oscillator.frequency.value=440*Math.pow(2,(midi-69)/12);
 gain.gain.setValueAtTime(0,now); gain.gain.linearRampToValueAtTime(volume,now+.008);gain.gain.exponentialRampToValueAtTime(.001,now+duration);
 oscillator.connect(gain);gain.connect(bus);oscillator.start(now);oscillator.stop(now+duration+.01);
 oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
}
async function unlockAudio() {
 try {
  if(!audio){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio) throw Error("No disponible");audio=new Audio();master=audio.createGain();master.gain.value=muted?0:.65;master.connect(audio.destination);}
  if(audio.state!=="running") await Promise.race([audio.resume(),new Promise(resolve=>setTimeout(resolve,700))]);
  return audio.state==="running";
 } catch (_) { setStatus("audioError"); return false; }
}
function endMusic() {
 clearInterval(beatTimer);beatTimer=null;
 if(musicBus){musicBus.gain.cancelScheduledValues(audio.currentTime);musicBus.gain.setValueAtTime(0,audio.currentTime);const old=musicBus;setTimeout(()=>old.disconnect(),300);musicBus=null;}
}
function music(elapsed=0) {
 endMusic();if(!audio||audio.state!=="running")return;
 musicBus=audio.createGain();musicBus.connect(master);noteIndex=Math.floor(elapsed/210);
 const beat=()=>{tone(melody[noteIndex%melody.length],.16,"triangle",.12,musicBus);if(noteIndex%2===0)tone([48,53,48,55][Math.floor(noteIndex/4)%4],.18,"sine",.17,musicBus);noteIndex++;};
 beat();beatTimer=setInterval(beat,210);
}
function stopRound() {
 if(selectedMode==="online")return;
 if(!model.stopMusic())return;
 clearTimeout(roundTimer);endMusic();$("arena").classList.remove("dancing");$("arena").classList.add("stopped");
 message("stopTitle","stopDescription","!");
 setStatus("stopStatus");renderStats();scheduleBots();
}
function renderStats() {
 updateTouchControls();syncModeControls();
 const alive=model.active.length;
 const available=(model.phase==="result"||model.phase==="finished")?0:Math.max(0,model.chairs-model.claims.length);
 $("remaining").textContent=plural("chairs",available)+" · "+plural("people",alive);
 $("round").textContent=model.round ? t("round",{n:model.round,total:count-1}) : t("prepare");
 $("scores").innerHTML=model.players.map(p=>'<div class="score-row '+(p.id===model.winner?"winner":"")+'"><span>'+esc(displayName(p.id))+'</span><span>'+(p.id===model.winner?t("winnerLabel")+" · ":!p.active?t("outLabel")+" · ":"")+plural("chairs",p.seats)+'</span></div>').join("");
}
function renderRoster() {
 $("roster").innerHTML=model.players.map(p=>'<div class="roster-row" style="--player:'+palette[p.animal??p.id]+'"><span class="avatar" aria-hidden="true">'+animalSvg(p.animal??p.id)+'</span><span>'+esc(displayName(p.id))+' <span class="animal-name">· '+translations[language].animals[p.animal??p.id]+'</span></span><kbd>'+labels[p.id]+'</kbd></div>').join("");
}
function renderPeople() {
 renderRoster();
 $("characters").innerHTML=model.players.map(p=>'<div class="character" id="person-'+p.id+'" style="--player:'+palette[p.animal??p.id]+';--delay:-'+p.id*.13+'s"><div class="creature" role="img" aria-label="'+translations[language].animals[p.animal??p.id]+'">'+animalSvg(p.animal??p.id)+'</div><span class="player-tag"><kbd>'+labels[p.id]+'</kbd> '+esc(displayName(p.id))+'</span></div>').join("");
}
function renderChairs() { $("chairs").innerHTML=Array.from({length:selectedMode==="online"&&["result","finished"].includes(model.phase)?model.claims.length:model.chairs},()=>'<div class="chair"><i></i></div>').join(""); }
function positionPeople(time=0) {
 const playing=model.phase==="music";
 model.players.forEach(p=>{
  const element=$("person-"+p.id);if(!element)return;
  const seat=model.claims.indexOf(p.id);
  let x,y;
  if(seat>=0){const chairCount=document.querySelectorAll(".chair").length;x=50+((seat-(chairCount-1)/2)*71/$("arena").clientWidth)*100;y=58;}
  else{const angle=(p.id/count)*Math.PI*2-Math.PI*.78+(playing?time/1800:0);x=50+Math.cos(angle)*35;y=51+Math.sin(angle)*31;}
  element.style.left=x+"%";element.style.top=y+"%";element.classList.toggle("out",!p.active);element.classList.toggle("winner",p.id===model.winner);element.classList.toggle("seated",seat>=0);
 });
}
function animate(time){if(model.phase==="music") positionPeople(selectedMode==="online"?Math.max(0,Date.now()+online.offset-(online.state?.startAt||Date.now())):time);requestAnimationFrame(animate);}
function clearEffects(){cancelBots();clearTimeout(roundTimer);roundTimer=null;endMusic();$("arena").classList.remove("dancing","stopped");$("confetti").innerHTML="";}
function resetGame(newCount=count) {
 clearEffects();clearInputs();count=newCount;model.reset(count);configurePlayers();busy=false;
 selectButtons.forEach(b=>{const selected=Number(b.dataset.count)===count;b.classList.toggle("selected",selected);b.setAttribute("aria-pressed",String(selected));b.disabled=false;});
 renderPeople();renderChairs();positionPeople();renderStats();message("readyTitle","readyDescription");
 setStatus("readyStatus");$("play").disabled=false;setPlay("start","↗");$("reset").hidden=true;
}
async function startRound() {
 if(!selectedMode||selectedMode==="online")return;
 if(busy||!["ready","result","paused"].includes(model.phase))return;
 busy=true;$("play").disabled=true;
 const soundReady=await unlockAudio();
 busy=false;
 if(document.hidden){$("play").disabled=false;return;}
 if(!model.startRound())return;
 clearEffects();selectButtons.forEach(b=>b.disabled=true);
 renderChairs();positionPeople();renderStats();$("arena").classList.add("dancing");
 message("musicTitle","musicDescription");
 setStatus(soundReady?"musicStatus":"visualStatus");
 setPlay("running");$("reset").hidden=false;
 music();
 stopAt=performance.now()+4500+Math.random()*4500;
 roundTimer=setTimeout(stopRound,Math.max(0,stopAt-performance.now()));
}
function claim(id,repeat) {
 const result=model.press(id,repeat);
 if(result.type==="early"){setStatus("namedEarly",{playerId:id});return;}
 if(!["seat","elimination"].includes(result.type))return;
 const index=model.claims.indexOf(id),chair=$("chairs").children[index];
 if(chair){chair.classList.add("taken");chair.style.setProperty("--player",palette[model.players[id].animal??id]);}
 positionPeople();renderStats();tone(80+index*3,.11,"sine",.11);
 if(result.type==="seat"){setStatus("namedSeated",{playerId:id});return;}
 clearEffects();positionPeople();
 setStatus("namedEliminated",{playerId:result.loser,round:model.round});
 if(model.phase==="finished"){
  message("namedWin","winDescription","★",{playerId:model.winner});
  $("play").disabled=false;setPlay("replay","↻");$("reset").hidden=true;
  $("confetti").innerHTML=Array.from({length:32},(_,i)=>'<i class="confetto" style="--left:'+((i*37)%100)+'%;--color:'+palette[i%4]+';--duration:'+(2+i%4*.4)+'s;--delay:-'+(i%7*.3)+'s"></i>').join("");
 } else {
  message("resultTitle","namedResult","↗",{playerId:result.loser});
  $("play").disabled=false;setPlay("next","↗");
 }
}
selectButtons.forEach(b=>b.addEventListener("click",()=>{if(model.phase==="ready"&&selectedMode==="local"){resetGame(Number(b.dataset.count));renderSettings();}}));
$("play").addEventListener("click",()=>{if(selectedMode==="online"){sendOnline(online.state?.phase==="finished"?"replay":"start");return;}if(model.phase==="finished"){resetGame();}else startRound();});
$("reset").addEventListener("click",()=>resetGame());
$("sound").addEventListener("click",async()=>{muted=!muted;if(master)master.gain.setValueAtTime(muted?0:.65,audio.currentTime);$("sound").textContent=t(muted?"soundOff":"soundOn");$("sound").setAttribute("aria-pressed",String(!muted));if(!muted)await unlockAudio();});
window.addEventListener("keydown",event=>{
 if(event.ctrlKey||event.metaKey||event.altKey||event.target.closest?.(".language-picker,input,select,textarea,[contenteditable=true]"))return;
 let id=keys.indexOf(event.code);
 if(id<0)id=labels.indexOf(event.key.toUpperCase());
 if(id<0||id>=count)return;
 event.preventDefault();
 inputDown(id,"keyboard",event.repeat);
});
window.addEventListener("keyup",event=>{let id=keys.indexOf(event.code);if(id<0)id=labels.indexOf(event.key.toUpperCase());if(id>=0)inputUp(id,"keyboard");});
function suspendRound(){
 if(onlineAway())return;
 clearInputs();
 if(!model.pause()) {model.held.clear();return;}
 clearEffects();renderChairs();positionPeople();renderStats();message("pauseTitle","pauseDescription","Ⅱ");
 setStatus("pauseStatus");
 $("play").disabled=false;setPlay("repeatRound","↗");
}
document.addEventListener("visibilitychange",()=>{if(document.hidden)suspendRound();});
window.addEventListener("blur",suspendRound);
document.querySelectorAll("[data-language]").forEach(button=>button.addEventListener("click",()=>{
 language=button.dataset.language;
 try { localStorage.setItem("la-sillita-language",language); } catch (_) {}
 refreshLanguage();
 // Return keyboard focus to the game so assigned keys still work immediately.
 button.blur();
}));
createTouchControls();resetGame();refreshLanguage();showMenu();
if(/^#sala=[A-HJ-NP-Z2-9]{8}$/.test(location.hash))selectMode("online");
requestAnimationFrame(animate);
})();
