const CONFIG = {
  demoUrl: '', // <-- вставьте URL вашей PWA, например 'https://app.anti-procrastinator.com'
  quizSource: 'site-quiz'
};

const TYPE_PARAMS = { a: 'overloaded', b: 'perfectionist', c: 'avoider', d: 'thrill-seeker' };

function openDemo() {
  const modal = document.getElementById('demo-modal');
  const wrap = document.getElementById('demo-frame-wrap');
  const note = document.getElementById('demo-note');
  modal.classList.remove('hidden');
  if (CONFIG.demoUrl) {
    if (!wrap.dataset.loaded) {
      wrap.innerHTML = '<iframe src="' + CONFIG.demoUrl + '" title="CutTails demo" allow="clipboard-write"></iframe>';
      wrap.dataset.loaded = '1';
    }
    if (note) note.style.display = 'none';
  }
}
function closeDemo() {
  document.getElementById('demo-modal').classList.add('hidden');
}

const TEXT = SITE_LANG === 'ru'
  ? {
      overloaded: {t:'Вы — «Перегруженный»',d:'У вас много начатого и мало завершённого. Механизм — перегрузка выбора. Первое действие: выберите ОДНУ задачу и разбейте её на шаг по 2 минуты.',cta:'Разобрать одну задачу с ИИ-компаньоном'},
      perfectionist: {t:'Вы — «Перфекционист»',d:'Вы откладываете, чтобы защитить самооценку. Первое действие: сделайте намеренно «плохой» черновик за 10 минут — это снимет планку.',cta:'Попробовать режим «черновик без страха»'},
      avoider: {t:'Вы — «Тревожный избегатель»',d:'Вы избегаете того, что вызывает тревогу. Первое действие: подойдите к пугающей задаче на 5 минут — не решить, а только «коснуться».',cta:'Поговорить с ИИ-компаньоном об избегании'},
      'thrill-seeker': {t:'Вы — «Искатель азарта»',d:'Дедлайн — ваш стартовый пистолет. Первое действие: назначьте себе искусственный мини-дедлайн раньше настоящего и награду за его выполнение.',cta:'Настроить мини-дедлайн в демо'}
    }
  : {
      overloaded: {t:'You are the Overloaded',d:'Lots started, little finished. Mechanism: choice overload. First action: pick ONE task and break it into a 2-minute step.',cta:'Break down one task with the AI companion'},
      perfectionist: {t:'You are the Perfectionist',d:'You delay to protect self-esteem. First action: make a deliberately bad 10-minute draft — it lowers the bar.',cta:'Try the "fearless draft" mode'},
      avoider: {t:'You are the Anxious Avoider',d:'You avoid whatever triggers anxiety. First action: approach the scary task for 5 minutes — touch it, do not solve it.',cta:'Talk to the AI companion about avoidance'},
      'thrill-seeker': {t:'You are the Thrill-Seeker',d:'Deadlines are your starting gun. First action: set yourself an artificial mini-deadline earlier than the real one, with a reward.',cta:'Set a mini-deadline in the demo'}
    };

function showResult() {
  const counts = {};
  for (const name of ['q1','q2','q3']) {
    const el = document.querySelector('input[name="' + name + '"]:checked');
    if (!el) { alert(SITE_LANG === 'ru' ? 'Ответьте на все вопросы' : 'Please answer all questions'); return; }
    counts[el.value] = (counts[el.value] || 0) + 1;
  }
  const type = Object.entries(counts).sort((x, y) => y[1] - x[1])[0][0];
  const info = TEXT[TYPE_PARAMS[type]];
  const box = document.getElementById('quiz-result');
  box.style.display = 'block';
  box.innerHTML = '<h3>' + info.t + '</h3><p>' + info.d + '</p><button class="btn primary" onclick="goToDemo(\'' + TYPE_PARAMS[type] + '\')">' + info.cta + '</button>';
}

function goToDemo(type) {
  if (CONFIG.demoUrl) {
    window.open(CONFIG.demoUrl + '?type=' + type + '&source=' + CONFIG.quizSource, '_blank');
  } else {
    openDemo();
  }
}
