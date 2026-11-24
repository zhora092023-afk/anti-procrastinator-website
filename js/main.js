
/* CutTails demo widget + quiz + i18n glue */
const CONFIG = {
  // Вставьте сюда URL веб-версии CutTails (PWA/демо-страницу)
  demoUrl: "",
  // Страница описания приложения (кнопка внутри виджета)
  appUrl: ""
};

/* --- i18n: тексты уже зашиты в HTML каждой языковой версии, JSON нужен для динамических блоков --- */
const LANG = document.documentElement.lang || "en";
let T = {};
fetch(document.baseURI + "../../locales/" + LANG + ".json").catch(()=>fetch("../locales/"+LANG+".json"))
  .then(r=>r.json()).then(d=>{ T=d; initQuiz(); });

/* --- Quiz --- */
const QUIZ_TYPES = ["perfectionist","anxious","overloader","thrill"];
const quizRoot = document.getElementById("quiz-root");
let answers = [], step = 0;

function initQuiz(){ renderQuiz(); }

function renderQuiz(){
  if(!quizRoot || !T.quiz) return;
  if(step >= 3){ showResult(); return; }
  const i = step + 1;
  const opts = T.quiz["q"+i+"_opts"];
  quizRoot.innerHTML =
    `<p class="q">${T.quiz["q"+i]}</p><div class="opts">` +
    opts.map((o,idx)=>`<button class="opt" data-type="${QUIZ_TYPES[idx]}">${o}</button>`).join("") +
    `</div><p class="note" style="margin-top:10px">${step+1} / 3</p>`;
  quizRoot.querySelectorAll(".opt").forEach(b=>b.addEventListener("click",()=>{
    answers.push(b.dataset.type); step++; renderQuiz();
  }));
}

function showResult(){
  const counts = {};
  answers.forEach(a=>counts[a]=(counts[a]||0)+1);
  const top = QUIZ_TYPES.reduce((a,b)=>(counts[b]||0)>(counts[a]||0)?b:a);
  const r = T.quiz.results[top];
  quizRoot.innerHTML = `
    <div class="result">
      <h3>${T.quiz.result_title}: ${r.name}</h3>
      <p>${r.text}</p>
      <p>${r.cta}</p>
      <button class="btn primary" onclick="document.getElementById('demo-badge').click()">${T.nav.try_demo}</button>
      <button class="btn ghost" onclick="step=0;answers=[];renderQuiz()">${T.quiz.restart}</button>
    </div>`;
}

/* --- Demo widget --- */
const badge = document.getElementById("demo-badge");
const modal = document.getElementById("demo-modal");
const frame = document.getElementById("demo-frame");
if(badge){
  badge.addEventListener("click",()=>{
    if(frame && CONFIG.demoUrl){ frame.src = CONFIG.demoUrl; }
    modal.classList.add("open");
    if(frame && !CONFIG.demoUrl){
      frame.srcdoc = "<body style='font-family:sans-serif;background:#0f1220;color:#9aa3c0;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:20px'><div>DEMO_URL не задан.<br>Откройте js/config-раздел в коде страницы и вставьте URL веб-версии CutTails.</div></body>";
    }
  });
  document.getElementById("demo-close").addEventListener("click",()=>modal.classList.remove("open"));
  modal.addEventListener("click",e=>{ if(e.target===modal) modal.classList.remove("open"); });
}
