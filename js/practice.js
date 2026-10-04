/* ============================================================
   Maths for All — Practice component ("Test Yourself")
   ------------------------------------------------------------
   HOW TO ADD PROBLEMS (no JS knowledge needed):

   1. Put a placeholder where the section should appear:
        <section data-practice="my-chapter-key" data-title="Test Yourself"></section>

   2. Add an array of problems in js/practice-data.js:
        PRACTICE_DATA["my-chapter-key"] = [
          { id: "unique-id", type: "concept",      // concept | computation | interview
            q: "Question text with $\\LaTeX$",
            hint: "Optional nudge",
            steps: ["Step 1 …", "Step 2 …"],       // shown in the solution
            answer: "Final answer" }               // optional
        ];

      …or skip step 2 and embed JSON directly in the placeholder:
        <section data-practice="x">
          <script type="application/json">[ { "id": "…", "q": "…", "steps": ["…"] } ]</script>
        </section>

   Notes
   • Difficulty dots follow array order (1st = easiest … 5th = hardest).
   • Text fields are trusted HTML written by the site author (MathJax OK).
   • IDs must be unique site-wide: progress is stored per ID in localStorage
     (key "mfa-practice-v1"); storage is always wrapped in try/catch so the
     page still works in private mode or when storage is blocked.
   ============================================================ */
(function () {
  'use strict';

  var STORE_KEY = 'mfa-practice-v1';
  var TYPE_LABEL = { concept: 'Concept check', computation: 'Computation', interview: 'Interview question' };

  /* ── storage (never throws) ── */
  var memory = {};
  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      var obj = raw ? JSON.parse(raw) : {};
      return (obj && typeof obj === 'object') ? obj : {};
    } catch (e) { return memory; }
  }
  function saveState(state) {
    memory = state;
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage blocked: keep in memory */ }
  }
  var state = loadState();

  /* ── MathJax helper: works whether MathJax has finished loading or not ── */
  function typeset(el, tries) {
    tries = tries || 0;
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise([el]).catch(function () {});
    } else if (tries < 60) {
      setTimeout(function () { typeset(el, tries + 1); }, 250);
    }
  }

  function h(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') node.className = attrs[k]; else node.setAttribute(k, attrs[k]);
    });
    if (html != null) node.innerHTML = html;
    return node;
  }

  function readProblems(host) {
    var inline = host.querySelector('script[type="application/json"]');
    if (inline) {
      try { return JSON.parse(inline.textContent); }
      catch (e) { console.error('[practice] invalid inline JSON for', host.dataset.practice, e); return []; }
    }
    var all = window.PRACTICE_DATA || {};
    return all[host.dataset.practice] || [];
  }

  function mount(host, problems) {
    problems = problems || readProblems(host);
    if (!problems.length) return;
    var key = host.dataset.practice || 'practice';
    host.innerHTML = '';
    host.classList.add('practice');
    host.setAttribute('aria-labelledby', 'practice-title-' + key);

    /* header + tracker */
    var title = h('h3', { id: 'practice-title-' + key }, '<span class="practice-icon" aria-hidden="true">🧪</span> ' + (host.dataset.title || 'Test Yourself'));
    var count = h('span', { 'aria-live': 'polite' });
    var bar = h('div', { class: 'practice-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(problems.length) });
    var fill = h('span'); bar.appendChild(fill);
    var reset = h('button', { class: 'practice-reset', type: 'button' }, 'Reset');
    var tracker = h('div', { class: 'practice-tracker' });
    tracker.appendChild(count); tracker.appendChild(bar); tracker.appendChild(reset);
    var head = h('div', { class: 'practice-head' });
    head.appendChild(title); head.appendChild(tracker);
    host.appendChild(head);

    function refresh() {
      var done = problems.filter(function (p) { return state[p.id]; }).length;
      count.textContent = done + ' / ' + problems.length + ' solved';
      fill.style.width = (100 * done / problems.length) + '%';
      bar.setAttribute('aria-valuenow', String(done));
    }

    var list = h('ol', { class: 'practice-list' });
    problems.forEach(function (p, i) {
      var uid = key + '-' + p.id;
      var item = h('li', { class: 'practice-item', 'data-type': p.type || 'concept' });
      var type = TYPE_LABEL[p.type] ? p.type : 'concept';

      var dots = '';
      for (var d = 0; d < problems.length; d++) dots += '<i class="' + (d <= i ? 'on' : '') + '"></i>';
      item.appendChild(h('div', { class: 'practice-meta' },
        '<span class="practice-num">Q' + (i + 1) + '</span>' +
        '<span class="practice-badge t-' + type + '">' + TYPE_LABEL[type] + '</span>' +
        '<span class="practice-dots" role="img" aria-label="Difficulty ' + (i + 1) + ' of ' + problems.length + '">' + dots + '</span>'));
      item.appendChild(h('div', { class: 'practice-q' }, p.q));

      var actions = h('div', { class: 'practice-actions' });
      var hintBtn = p.hint ? h('button', { class: 'practice-btn hint', type: 'button', 'aria-expanded': 'false', 'aria-controls': uid + '-hint' }, '💡 Hint') : null;
      var revealBtn = h('button', { class: 'practice-btn reveal', type: 'button', 'aria-expanded': 'false', 'aria-controls': uid + '-sol' }, 'Reveal Solution');
      var solveBtn = h('button', { class: 'practice-btn solve', type: 'button', 'aria-pressed': 'false' }, '✓ I solved it');
      if (hintBtn) actions.appendChild(hintBtn);
      actions.appendChild(revealBtn); actions.appendChild(solveBtn);
      item.appendChild(actions);

      var hint = p.hint ? h('div', { class: 'practice-hint', id: uid + '-hint', hidden: '' }, '<strong>Hint:</strong> ' + p.hint) : null;
      if (hint) item.appendChild(hint);

      var steps = (p.steps || []).map(function (s) { return '<li>' + s + '</li>'; }).join('');
      var sol = h('div', { class: 'practice-solution', id: uid + '-sol', hidden: '' },
        '<ol>' + steps + '</ol>' + (p.answer ? '<div class="practice-answer">Answer: ' + p.answer + '</div>' : ''));
      item.appendChild(sol);

      function toggle(btn, panel, openLabel, closedLabel) {
        var open = panel.hasAttribute('hidden');
        if (open) { panel.removeAttribute('hidden'); typeset(panel); } else { panel.setAttribute('hidden', ''); }
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? openLabel : closedLabel;
      }
      if (hintBtn) hintBtn.addEventListener('click', function () { toggle(hintBtn, hint, '💡 Hide hint', '💡 Hint'); });
      revealBtn.addEventListener('click', function () { toggle(revealBtn, sol, 'Hide Solution', 'Reveal Solution'); });

      function paintSolved() {
        var on = !!state[p.id];
        item.classList.toggle('is-solved', on);
        solveBtn.setAttribute('aria-pressed', String(on));
        solveBtn.textContent = on ? '✓ Solved' : '✓ I solved it';
      }
      solveBtn.addEventListener('click', function () {
        state = loadState();                       // pick up changes from other tabs
        if (state[p.id]) delete state[p.id]; else state[p.id] = 1;
        saveState(state); paintSolved(); refresh();
      });
      paintSolved();
      list.appendChild(item);
    });
    host.appendChild(list);

    reset.addEventListener('click', function () {
      state = loadState();
      problems.forEach(function (p) { delete state[p.id]; });
      saveState(state);
      host.querySelectorAll('.practice-item').forEach(function (it) { it.classList.remove('is-solved'); });
      host.querySelectorAll('.practice-btn.solve').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); b.textContent = '✓ I solved it'; });
      refresh();
    });

    refresh();
    typeset(host);
  }

  function mountAll() {
    state = loadState();
    document.querySelectorAll('[data-practice]').forEach(function (host) { mount(host); });
  }

  window.Practice = { mount: mount, mountAll: mountAll };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll);
  else mountAll();
})();
