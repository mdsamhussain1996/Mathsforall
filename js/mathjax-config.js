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
      MathJax.startup.defaultReady();
    }
  }
};
