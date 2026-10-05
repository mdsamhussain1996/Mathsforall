/* ============================================================
   Maths for All — Shared MathJax 3 Configuration
   ============================================================ */
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
  },
  startup: {
    ready: function () {
      var isLazy = document.body && document.body.hasAttribute('data-lazy-math');
      if (isLazy) {
        MathJax.config.startup.typeset = false;
      }
      MathJax.startup.defaultReady();
    }
  }
};
