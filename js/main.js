/* Anti-Procrastinator — interactions */
const CONFIG = {
  // Вставьте сюда URL вашей PWA (CutTails), например:
  // demoUrl: 'https://app.anti-procrastinator.com'
  demoUrl: ''
};

document.addEventListener('DOMContentLoaded', () => {
  // ---- Демо-виджет (модалка с iframe) ----
  const modal = document.getElementById('demo-modal');
  const body = document.querySelector('.modal-body');

  function openModal() {
    let iframe = body.querySelector('iframe');
    if (CONFIG.demoUrl) {
      if (!iframe) {
        const ph = body.querySelector('.modal-placeholder');
        if (ph) ph.remove();
        iframe = document.createElement('iframe');
        iframe.setAttribute('title', 'CutTails demo');
        iframe.setAttribute('allow', 'clipboard-write');
        body.appendChild(iframe);
      }
      iframe.src = CONFIG.demoUrl;
    } else if (iframe) {
      iframe.remove();
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    const iframe = body.querySelector('iframe');
    if (iframe) iframe.src = 'about:blank';
  }
  document.querySelectorAll('[data-open-demo]').forEach(b => b.addEventListener('click', openModal));
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ---- Тест «Какой вы прокрастинатор?» ----
  const quizRoot = document.getElementById('quiz');
  if (quizRoot && window.TEST_DATA) {
    const D = window.TEST_DATA;
    const answers = {};
    let step = 0;

    function render() {
      const q = D.questions[step];
      if (q) {
        quizRoot.innerHTML =
          '<div class="quiz-progress">' + D.progress.replace('{n}', step + 1).replace('{t}', D.questions.length) + '</div>' +
          '<h3>' + q.title + '</h3>' +
          q.options.map((o, i) =>
            '<button class="opt" data-type="' + o.type + '" data-i="' + i + '">' + o.text + '</button>'
          ).join('');
        quizRoot.querySelectorAll('.opt').forEach(btn =>
          btn.addEventListener('click', () => {
            quizRoot.querySelectorAll('.opt').forEach(b => b.classList.remove('chosen'));
            btn.classList.add('chosen');
            answers[q.id] = btn.dataset.type;
            setTimeout(() => { step++; render(); }, 250);
          })
        );
      } else {
        showResult();
      }
    }

    function showResult() {
      const counts = {};
      Object.values(answers).forEach(t => counts[t] = (counts[t] || 0) + 1);
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      const r = D.results[top];
      quizRoot.innerHTML =
        '<div class="result">' +
        '<span class="tag">' + r.tag + '</span>' +
        '<h3>' + r.title + '</h3>' +
        '<p>' + r.text + '</p>' +
        '<div class="tip">' + r.tip + '</div>' +
        '<div class="cta-row" style="margin-top:20px">' +
        '<button class="btn primary" data-open-demo>' + r.cta + '</button>' +
        '</div></div>';
      const demoBtn = quizRoot.querySelector('[data-open-demo]');
      if (demoBtn && CONFIG.demoUrl) {
        demoBtn.addEventListener('click', () => {
          // глубокая ссылка: передаём тип пользователя в демо CutTails
          try {
            const u = new URL(CONFIG.demoUrl);
            u.searchParams.set('type', top);
            u.searchParams.set('source', 'site-quiz');
            CONFIG.demoUrl = u.toString();
          } catch (e) {}
          openModal();
        });
      }
    }

    render();
  }

  // ---- Год в футере ----
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
});
