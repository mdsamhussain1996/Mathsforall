/* ============================================================
   Maths for All — Shared MathJax 3 Configuration
   ============================================================ */
window.MathJax = {
  loader: {
    load: ['a11y/assistive-mml', 'a11y/explorer']
  },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    enableExplorer: true,
    enableAssistiveMml: true,
    menuOptions: {
      settings: {
        assistiveMml: true,
        explorer: true
      }
    }
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
