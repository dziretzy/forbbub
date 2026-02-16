/* =========================
   CONFIG (EDIT THESE)
========================= */
// ✅ Put your EmailJS Public Key here:
const EMAILJS_PUBLIC_KEY = "WXpWjeBmA9tVCMEhS";

// ✅ Your EmailJS Service + Template IDs (you already have these)
const EMAILJS_SERVICE_ID = "service_7bek3tq";
const EMAILJS_TEMPLATE_ID = "template_u4ozgzi";

// ✅ Where you want to receive the email
const RECEIVER_EMAIL = "waldxbalallo@gmail.com";


/* =========================
   BACKGROUND (HEARTS/SPARKLES)
========================= */
let ambienceOn = true;
const spawned = { hearts: [], sparkles: [] };

(function spawnBackground(){
  const hearts = 24, sparkles = 28;

  for (let i = 0; i < hearts; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = (Math.random() > 0.75) ? '💕' : '💖';

    const size = 14 + Math.random() * 22;
    heart.style.fontSize = size + 'px';
    heart.style.left = (Math.random() * 100) + 'vw';
    heart.style.opacity = (0.20 + Math.random() * 0.55).toFixed(2);
    heart.style.filter = `blur(${(Math.random() * 1.1).toFixed(2)}px)`;

    const dur = 7 + Math.random() * 8;
    const delay = Math.random() * 7;
    heart.style.animationDuration = dur + 's';
    heart.style.animationDelay = (-delay) + 's';

    document.body.appendChild(heart);
    spawned.hearts.push(heart);
  }

  for (let i = 0; i < sparkles; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = (Math.random() * 100) + 'vw';

    const dur = 6 + Math.random() * 8;
    const delay = Math.random() * 8;
    s.style.animationDuration = dur + 's';
    s.style.animationDelay = (-delay) + 's';

    const size = 2 + Math.random() * 2.5;
    s.style.width = size + 'px';
    s.style.height = size + 'px';

    s.style.opacity = (0.15 + Math.random() * 0.45).toFixed(2);
    document.body.appendChild(s);
    spawned.sparkles.push(s);
  }
})();

function setAmbienceVisible(on){
  [...spawned.hearts, ...spawned.sparkles].forEach(el => {
    el.style.display = on ? '' : 'none';
  });
}


/* =========================
   TOAST
========================= */
let toastTimer = null;
function toast(msg="Saved 💌"){
  const t = document.getElementById('toast');
  const tx = document.getElementById('toastText');
  if (!t || !tx) return;

  tx.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1400);
}


/* =========================
   TIME CHIP
========================= */
(function setTimeChip(){
  const el = document.getElementById('timeChip');
  if (!el) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  // keep the menu button intact (it's inside chip)
  el.childNodes[0].textContent = `⏰ ${timeStr} `;
})();


/* =========================
   QUESTIONS
========================= */
const questions = [
  { key:"Dinner", text: "What would you like for dinner? 🍴", answers: ["Pork 🐷", "Beef 🥩", "Chicken 🐓", "Seafoods 🦐", "Anything you pick 😌"] },
  { key:"Outfit", text: "What color should we wear to match? 👗", answers: ["Blue 🩵", "Red 🩷", "White 🤍", "Black 🖤", "Pastel 🌸"] },
  { key:"After",  text: "Where should we go after dinner? 🌃", answers: ["Coffee shop ☕", "Dessert place 🍰", "Park walk 🌳", "Scenic view 🌆", "Arcade 🎮"] },
  { key:"Vibe",   text: "What kind of date vibe do you want? ✨", answers: ["Romantic 💕", "Fun & playful 😄", "Chill & cozy 🧸", "Adventurous 🚗", "Quiet & gentle 🌙"] },
  { key:"Gift",   text: "What gift would make you smile? 🎁", answers: ["Flowers 🌹", "Chocolates 🍫", "Stuffed toy 🧸", "A surprise 😏", "Handwritten note 💌"] },
  { key:"Photos", text: "Should we take cute pictures together? 📸", answers: ["Of course! 😍", "Maybe a few 🙂", "Only if I look good 😌", "Let’s do candid shots 🫶🏻"] },
  { key:"Drive",  text: "Would you prefer a long drive date or a short one? 🚗", answers: ["Long drive 🚗", "Short drive 🚘", "Either, as long as it’s with you 🥹"] }
];

let currentQuestion = 0;
const answersChosen = [];


/* =========================
   LOCAL STORAGE
========================= */
function saveToLocal() {
  const payload = {
    answersChosen,
    currentQuestion,
    date: document.getElementById('datePick')?.value || "",
    time: document.getElementById('timePick')?.value || ""
  };
  localStorage.setItem("bbubDateQuiz", JSON.stringify(payload));
}

function loadFromLocal() {
  const raw = localStorage.getItem("bbubDateQuiz");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}


/* =========================
   EMAILJS INIT + SENDER
========================= */
function initEmailJSIfAvailable(){
  if (window.emailjs && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY"){
    try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) { console.warn(e); }
  }
}

async function sendReceiptEmail(){
  if (!window.emailjs){
    throw new Error("EmailJS library not loaded. Add the EmailJS script tag in HTML.");
  }
  if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"){
    throw new Error("Missing EmailJS public key. Set EMAILJS_PUBLIC_KEY in script.js.");
  }

  const dateVal = document.getElementById('datePick').value;
  const timeVal = document.getElementById('timePick').value;

  const receiptLines = [];
  receiptLines.push("💌 Our Little Love Receipt");
  receiptLines.push("");
  questions.forEach((q, i) => receiptLines.push(`${q.key}: ${answersChosen[i] || "—"}`));
  receiptLines.push(`Date: ${formatDatePretty(dateVal)}`);
  receiptLines.push(`Time: ${formatTimePretty(timeVal)}`);
  receiptLines.push("");
  receiptLines.push("— Made for Bbub🫶🏻");

  const templateParams = {
    to_email: RECEIVER_EMAIL,
    subject: "Bbub Date Quiz Answers 💌",
    message: receiptLines.join("\n")
  };

  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
}


/* =========================
   FLOW
========================= */
function startQuestions(){
  document.getElementById('intro').classList.add('fadeOut');

  setTimeout(() => {
    document.getElementById('intro').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
    document.getElementById('stepText').textContent = 'Answer honestly 😉';
    showQuestion();
    toast("Let’s go 💌");
  }, 340);
}

function showQuestion(){
  const q = questions[currentQuestion];
  document.getElementById('questionText').textContent = q.text;

  document.getElementById('progressLabel').textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  const progress = (currentQuestion / questions.length) * 100;
  document.getElementById('progressBar').style.width = progress + '%';

  const answerContainer = document.getElementById('answerButtons');
  answerContainer.innerHTML = '';

  q.answers.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'secondary';
    btn.textContent = a;
    btn.onclick = () => nextQuestion(a);
    answerContainer.appendChild(btn);
  });

  const backBtn = document.getElementById('backBtn');
  backBtn.disabled = currentQuestion === 0;
  backBtn.style.opacity = backBtn.disabled ? .55 : 1;
}

function nextQuestion(answer){
  answersChosen[currentQuestion] = answer;
  saveToLocal();
  currentQuestion++;

  if(currentQuestion < questions.length){
    showQuestion();
  } else {
    document.getElementById('progressBar').style.width = '100%';
    showFinal();
  }
}

function goBack(){
  if(currentQuestion === 0) return;
  currentQuestion--;
  showQuestion();
}

function restart(){
  currentQuestion = 0;
  answersChosen.length = 0;
  saveToLocal();
  showQuestion();
  toast("Restarted ✨");
}

function showFinal(){
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('final').classList.remove('hidden');
  document.getElementById('stepText').textContent = 'Pick date & time 💌';

  const dateEl = document.getElementById('datePick');
  const timeEl = document.getElementById('timePick');

  // restore saved date/time if any
  const saved = loadFromLocal();
  if (saved?.date) dateEl.value = saved.date;
  if (saved?.time) timeEl.value = saved.time;

  // if still empty, set defaults: tomorrow + 7pm
  if(!dateEl.value || !timeEl.value){
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    if(!dateEl.value){
      dateEl.value = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()+1).padStart(2,'0')}-${String(tomorrow.getDate()).padStart(2,'0')}`;
    }
    if(!timeEl.value){
      timeEl.value = "19:00";
    }
  }

  // listeners must be here (elements exist here)
  dateEl.onchange = saveToLocal;
  timeEl.onchange = saveToLocal;

  saveToLocal();
  toast("Pick your schedule ⏰");
}

function backToQuiz(){
  document.getElementById('final').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  document.getElementById('stepText').textContent = 'Answer honestly 😉';
  showQuestion();
}

function backToFinal(){
  document.getElementById('extraMessage').classList.add('hidden');
  document.getElementById('final').classList.remove('hidden');
  document.getElementById('stepText').textContent = 'Pick date & time 💌';
}

function goToExtraMessage(){
  const dateVal = document.getElementById('datePick').value;
  const timeVal = document.getElementById('timePick').value;

  if(!dateVal || !timeVal){
    alert("Please pick both a date and time 🫶🏻");
    return;
  }

  document.getElementById('final').classList.add('hidden');
  document.getElementById('extraMessage').classList.remove('hidden');
  document.getElementById('stepText').textContent = 'A little note 💗';
  toast("Just a small message 🫶🏻");
}

function formatDatePretty(yyyy_mm_dd){
  if(!yyyy_mm_dd) return '';
  const [y, m, d] = yyyy_mm_dd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' });
}

function formatTimePretty(hh_mm){
  if(!hh_mm) return '';
  const [hh, mm] = hh_mm.split(':').map(Number);
  const dt = new Date();
  dt.setHours(hh, mm, 0, 0);
  return dt.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
}

function suggestTimes(){
  const t = document.getElementById('timePick');
  const picks = ["18:30","19:00","19:30","20:00"];
  const choice = picks[Math.floor(Math.random()*picks.length)];
  t.value = choice;
  saveToLocal();
  toast(`Suggested: ${formatTimePretty(choice)} ✨`);
}

// Typewriter effect
let typing = false;
function typeMessage(){
  if (typing) return;
  typing = true;

  const el = document.getElementById('messageBody');
  const full =
    "I know life gets busy, but I just want you to know: I’m proud of you.\n" +
    "I’m not here to rush you—only to choose you, gently, every day.\n\n" +
    "If you say yes, I’ll make it simple, sweet, and very you. 🫶🏻";

  el.textContent = "";
  let i = 0;

  const tick = () => {
    el.textContent += full[i] || "";
    i++;
    if (i < full.length){
      setTimeout(tick, 18);
    } else {
      typing = false;
      toast("🥹");
    }
  };
  tick();
}

function goToValentine(){
  const dateVal = document.getElementById('datePick').value;
  const timeVal = document.getElementById('timePick').value;

  if(!dateVal || !timeVal){
    alert("Please pick both a date and time 🫶🏻");
    return;
  }

  document.getElementById('extraMessage').classList.add('hidden');
  document.getElementById('valentine').classList.remove('hidden');
  document.getElementById('stepText').textContent = 'Final question 😌';

  const btn = document.getElementById('noBtn');
  if(btn) btn.style.transform = 'translate(0px, 0px)';

  toast("Final question 💖");
}

function goToLoveReceipt(){
  const dateVal = document.getElementById('datePick').value;
  const timeVal = document.getElementById('timePick').value;

  if(!dateVal || !timeVal){
    alert("Please pick both a date and time 🫶🏻");
    return;
  }

  const prettyDate = formatDatePretty(dateVal);
  const prettyTime = formatTimePretty(timeVal);

  const rows = questions.map((q, i) => {
    const v = answersChosen[i] || "—";
    return `<div class="row"><div class="k">${q.key}</div><div class="v">${v}</div></div>`;
  }).join("");

  const dtRows = `
    <div class="row"><div class="k">Date</div><div class="v">${prettyDate}</div></div>
    <div class="row"><div class="k">Time</div><div class="v">${prettyTime}</div></div>
  `;

  document.getElementById('loveReceiptBox').innerHTML = `
    <strong>Receipt details ✨</strong>
    <div style="height:10px"></div>
    ${rows}
    ${dtRows}
  `;

  document.getElementById('valentine').classList.add('hidden');
  document.getElementById('loveReceiptPage').classList.remove('hidden');
  document.getElementById('stepText').textContent = 'Almost there 💌';

  document.getElementById('celebrate').classList.add('hidden');
  toast("Looks perfect? 💌");
}

function burstHearts(count = 18){
  for (let i = 0; i < count; i++){
    const h = document.createElement('div');
    h.textContent = (Math.random() > 0.5) ? '💖' : '💕';
    h.style.position = 'fixed';
    h.style.left = (50 + (Math.random()*30 - 15)) + 'vw';
    h.style.top  = (55 + (Math.random()*20 - 10)) + 'vh';
    h.style.fontSize = (18 + Math.random()*18) + 'px';
    h.style.opacity = '0.95';
    h.style.transform = 'translate(-50%, -50%)';
    h.style.pointerEvents = 'none';
    h.style.zIndex = 90;

    const x = (Math.random()*240 - 120);
    const y = -(120 + Math.random()*160);
    const r = (Math.random()*30 - 15);

    h.animate([
      { transform:`translate(-50%, -50%) translate(0px,0px) rotate(0deg)`, opacity: .95 },
      { transform:`translate(-50%, -50%) translate(${x}px,${y}px) rotate(${r}deg)`, opacity: 0 }
    ], { duration: 900 + Math.random()*500, easing: 'cubic-bezier(.2,.8,.2,1)' });

    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1500);
  }
}

async function confirmEverything(){
  document.getElementById('celebrate').classList.remove('hidden');
  document.getElementById('footerReceipt').textContent = "See you on our date, I'm so excited 💕";
  burstHearts(26);

  try{
    await sendReceiptEmail();
    toast("Sent to email 💌");
  } catch(e){
    toast("Email failed 🥺");
    console.error(e);
  }
}

// Moving "No"
function moveNo(){
  const btn = document.getElementById('noBtn');
  if(!btn) return;

  const x = Math.floor(Math.random() * 180) - 90;
  const y = Math.floor(Math.random() * 140) - 70;
  btn.style.transform = `translate(${x}px, ${y}px)`;
}

function noTry(){
  const btn = document.getElementById('noBtn');
  if(!btn) return;
  btn.classList.remove('shake');
  void btn.offsetWidth;
  btn.classList.add('shake');
  toast("Hehe nice try 😜");
}

// Copy receipt
async function copyReceipt(){
  const dateVal = document.getElementById('datePick').value;
  const timeVal = document.getElementById('timePick').value;

  const lines = [];
  lines.push("💌 Our Little Love Receipt");
  lines.push("");
  questions.forEach((q, i) => lines.push(`${q.key}: ${answersChosen[i] || "—"}`));
  lines.push(`Date: ${formatDatePretty(dateVal)}`);
  lines.push(`Time: ${formatTimePretty(timeVal)}`);
  lines.push("");
  lines.push("— Made for Bbub🫶🏻");

  try{
    await navigator.clipboard.writeText(lines.join("\n"));
    toast("Copied 📋");
  } catch(e){
    alert("Copy failed 🥺 (Some browsers block clipboard on local files.)");
  }
}

// Mini menu
function openMiniMenu(){
  document.getElementById('miniMenu').classList.add('show');
}
function closeMiniMenu(){
  document.getElementById('miniMenu').classList.remove('show');
}
document.getElementById('miniMenu')?.addEventListener('click', (e) => {
  if (e.target.id === 'miniMenu') closeMiniMenu();
});

function toggleAmbience(){
  ambienceOn = !ambienceOn;
  setAmbienceVisible(ambienceOn);
  document.getElementById('ambienceTitle').textContent = `Ambience: ${ambienceOn ? "ON" : "OFF"}`;
  toast(ambienceOn ? "Ambience on 🌙" : "Ambience off ☀️");
  closeMiniMenu();
}

function surpriseCompliment(){
  const lines = [
    "You’re genuinely my favorite kind of peace. 🫶🏻",
    "If being cute was a job, you’d be CEO. 😌",
    "I like you… a lot. Like, a lot-lot. 💗",
    "You make ordinary days feel special. ✨",
    "I’ll always choose you gently. 🌙"
  ];
  toast(lines[Math.floor(Math.random()*lines.length)]);
  closeMiniMenu();
}

function jumpToReceipt(){
  const dateVal = document.getElementById('datePick').value;
  const timeVal = document.getElementById('timePick').value;

  ["intro","quiz","final","extraMessage","valentine","loveReceiptPage"].forEach(id => {
    document.getElementById(id)?.classList.add('hidden');
  });

  if(!dateVal || !timeVal){
    document.getElementById('final').classList.remove('hidden');
    document.getElementById('stepText').textContent = 'Pick date & time 💌';
    toast("Pick date/time first 🫶🏻");
  } else {
    document.getElementById('valentine').classList.remove('hidden');
    document.getElementById('stepText').textContent = 'Final question 😌';
    toast("Back to the question 😌");
  }
  closeMiniMenu();
}


/* =========================
   BOOT (RESTORE SAVED QUIZ)
========================= */
(function boot(){
  initEmailJSIfAvailable();

  const saved = loadFromLocal();
  if (!saved) return;

  // restore quiz state
  if (Array.isArray(saved.answersChosen)){
    answersChosen.length = 0;
    saved.answersChosen.forEach((v) => answersChosen.push(v));
  }
  if (typeof saved.currentQuestion === "number"){
    currentQuestion = Math.max(0, Math.min(saved.currentQuestion, questions.length));
  }
})();
