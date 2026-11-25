const CONFIG = {
  demoUrl: '' // вставьте URL PWA CutTails, например 'https://app.anti-procrastinator.com'
};

// Демо-виджет
const modal = document.getElementById('demoModal');
const btn = document.getElementById('demoBtn');
if (btn && modal) {
  btn.addEventListener('click', openDemo);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
}
function openDemo(){
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (CONFIG.demoUrl) {
    const type = new URLSearchParams(location.search).get('type');
    const url = type ? CONFIG.demoUrl + '?type=' + type + '&source=site-quiz' : CONFIG.demoUrl;
    document.getElementById('demoFrame').src = url;
    document.getElementById('demoFrame').style.display = 'block';
    document.getElementById('demoFallback').style.display = 'none';
  }
}
function closeModal(){
  modal.classList.remove('open');
  document.body.style.overflow = '';
  const f = document.getElementById('demoFrame'); if (f) f.src = 'about:blank';
}

// Тест: 3 вопроса, 4 типа
const QUIZ = [
  {q:{ru:'Задача стоит третий день. Что происходит в голове?',en:'The task has been sitting for three days. What happens in your head?'},
   o:[
    {ru:'«Сначала надо довести до идеала — а я пока не готов(а)», — и снова переписываю план.',en:'"It must be perfect first — and I'm not ready yet," so I keep rewriting the plan.',t:'perfectionist'},
    {ru:'Думаю обо всём, что может пойти не так, и откладываю, чтобы не испытать это.',en:'I imagine everything that could go wrong and postpone to avoid it.',t:'fear'},
    {ru:'Список такой длинный, что я не понимаю, за что хвататься, — и не хватаюсь ни за что.',en:'My list is so long I don't know where to grab — so I grab nothing.',t:'overwhelmed'},
    {ru:'Скучно. Заведусь, когда будет гореть дедлайн — под давлением я в огне.',en:'It's boring. I'll switch on when the deadline burns — pressure lights me up.',t:'thrill'}
   ]},
  {q:{ru:'Что чаще всего «съедает» ваше намерение начать?',en:'What usually "eats" your intention to start?'},
   o:[
    {ru:'Страх, что результат окажется недостаточно хорошим.',en:'Fear that the result won't be good enough.',t:'perfectionist'},
    {ru:'Тревога: задача в голове разрослась до монстра.',en:'Anxiety: the task has grown into a monster in my head.',t:'fear'},
    {ru:'Перегруз: всё важно, всё срочно, мозг завис.',en:'Overload: everything is urgent, my brain freezes.',t:'overwhelmed'},
    {ru:'Отсутствие азарта — без адреналина мотор не заводится.',en:'No thrill — without adrenaline the engine won't start.',t:'thrill'}
   ]},
  {q:{ru:'Когда вы наконец делаете дело, что вы чувствуете?',en:'When you finally do it, what do you feel?'},
   o:[
    {ru:'«А точно ли достаточно хорошо?» — даже после завершения.',en:'"Is it really good enough?" — even after it's done.',t:'perfectionist'},
    {ru:'Облегчение и досаду: «зачем я так боялся(ась)».',en:'Relief and annoyance: "why did I fear this so much".',t:'fear'},
    {ru:'Истощение: я делал(а) всё и сразу до последнего.',en:'Exhaustion: I did everything at once till the end.',t:'overwhelmed'},
    {ru:'Кайф от гонки: «надо было раньше так не тянуть… а впрочем, было весело».',en:'The rush: "should've started earlier... but that was fun".',t:'thrill'}
   ]}
];
const TYPE_INFO = {
  perfectionist:{name:{ru:'Перфекционист',en:'The Perfectionist'},
    mech:{ru:'Установка «идеально или никак» парализует старт: первая версия кажется провалом, поэтому вы её не выпускаете.',en:'The "perfect or nothing" rule paralyzes the start: a first draft feels like failure, so it never ships.'},
    tech:{ru:'Правило плохого черновика: первый вариант обязан быть неидеальным — это его работа. Таймер на 15 минут, правки только после.',en:'The bad-draft rule: version one is supposed to be imperfect — that's its job. 15-minute timer, edits only after.'}},
  fear:{name:{ru:'Тревожный избегатель',en:'The Anxious Avoider'},
    mech:{ru:'Избегание снимает тревогу на час и усиливает её на неделю: задача в голове разрастается до монстра.',en:'Avoiding lowers anxiety for an hour and raises it for a week: the task grows into a monster in your head.'},
    tech:{ru:'Выпишите худший сценарий на бумагу и оцените его реальность по шкале 1–10. Затем один шаг, который нельзя сделать плохо.',en:'Write the worst scenario down and rate how realistic it is, 1–10. Then one step that cannot be done badly.'}},
  overwhelmed:{name:{ru:'Перегруженный',en:'The Overloaded'},
    mech:{ru:'Список из 30 пунктов парализует: мозг не видит точки входа и не начинает ни с чего.',en:'A 30-item list paralyzes: the brain sees no entry point and starts nothing.'},
    tech:{ru:'Выберите одну навязчивую задачу и разрежьте на 3 части. Первая часть — действие с глаголом, на 5–10 минут.',en:'Pick one nagging task, cut it into 3 pieces. Piece one is an action starting with a verb, 5–10 minutes.'}},
  thrill:{name:{ru:'Искатель азарта',en:'The Thrill-Seeker'},
    mech:{ru:'Скучная задача не даёт дофамина, мозг ждёт дедлайн-адреналина — и получает его ценой качества и сна.',en:'Boring tasks give no dopamine; the brain waits for deadline adrenaline — paying with quality and sleep.'},
    tech:{ru:'Обманите дедлайн: назначьте свой на день раньше с реальным последствием (расскажите другу). Гонка с таймером и рекордом.',en:'Trick the deadline: set yours a day early with a real consequence (tell a friend). Race the timer, beat your record.'}}
};
const T = (o) => o[(document.documentElement.lang === 'en') ? 'en' : 'ru'];
const answers = {};
// Рендерим блоки вопросов из массива
const mount = document.getElementById('quizBlocks');
QUIZ.forEach((item, qi) => {
  const div = document.createElement('div');
  div.className = 'qblock';
  div.innerHTML = '<h3>' + (qi+1) + '. ' + T(item.q) + '</h3><div class="opts"></div>';
  const opts = div.querySelector('.opts');
  item.o.forEach((o, oi) => {
    const b = document.createElement('button');
    b.textContent = T(o);
    b.addEventListener('click', () => {
      answers[qi] = {t: o.t};
      opts.querySelectorAll('button').forEach(x => x.style.borderColor = '');
      b.style.borderColor = 'var(--accent2)';
      if (Object.keys(answers).length === QUIZ.length) showResult();
    });
    opts.appendChild(b);
  });
  mount.appendChild(div);
});
  block.querySelectorAll('.opts button').forEach((b, oi) => {
    b.addEventListener('click', () => {
      answers[qi] = {t: QUIZ[qi].o[oi].t, oi};
      block.querySelectorAll('.opts button').forEach(x => x.style.borderColor = '');
      b.style.borderColor = 'var(--accent2)';
      if (Object.keys(answers).length === QUIZ.length) showResult();
    });
  });
});
function showResult(){
  const counts = {};
  Object.values(answers).forEach(a => counts[a.t] = (counts[a.t]||0)+1);
  const type = Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];
  const info = TYPE_INFO[type];
  const r = document.getElementById('quizResult');
  r.innerHTML = '<h3>'+T(info.name)+'</h3>'
    + '<p>'+T(info.mech)+'</p>'
    + '<div class="tech"><b>'+(document.documentElement.lang==='en'?'First step:':'Первый шаг:')+'</b> '+T(info.tech)+'</div>'
    + '<p style="margin-top:16px"><button class="btn btn-primary" onclick="openDemoWithType(\''+type+'\')">'+(document.documentElement.lang==='en'?'Try it with the AI companion':'Попробовать с ИИ-компаньоном')+'</button></p>';
  r.style.display = 'block';
  r.scrollIntoView({behavior:'smooth', block:'nearest'});
}
function openDemoWithType(type){
  const demoBtn = document.getElementById('demoBtn');
  if (CONFIG.demoUrl) {
    const url = CONFIG.demoUrl + '?type=' + type + '&source=site-quiz';
    window.open(url, '_blank');
  } else if (demoBtn) {
    openDemo(); // покажет заглушку, пока не задан demoUrl
  }
}
