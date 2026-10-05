/* ============================================================
   Maths for All — Lazy MathJax Typesetting
   Renders LaTeX formulas on demand as containers near the viewport.
   ============================================================ */
(function () {
  'use strict';

  // Only activate on pages with <body data-lazy-math>
  if (!document.body || !document.body.hasAttribute('data-lazy-math')) {
    return;
  }

  var observer = null;
  var allUnits = [];

  function waitForMathJax(callback, tries) {
    tries = tries || 0;
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      callback();
    } else if (tries < 120) {
      setTimeout(function () { waitForMathJax(callback, tries + 1); }, 100);
    }
  }

  function typesetElement(el) {
    if (!el || el.dataset.mathTypeset === 'true') return;
    el.dataset.mathTypeset = 'true';
    if (observer) {
      try { observer.unobserve(el); } catch (e) {}
    }
    waitForMathJax(function () {
      window.MathJax.typesetPromise([el]).catch(function () {});
    });
  }

  // Exposed helper to typeset everything (for print, CI, or unsupported observers)
  window.__typesetAll = function () {
    return new Promise(function (resolve) {
      waitForMathJax(function () {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        allUnits.forEach(function (u) { u.dataset.mathTypeset = 'true'; });
        window.MathJax.typesetPromise().then(resolve).catch(resolve);
      });
    });
  };

  // Fallback if IntersectionObserver is not supported
  if (!('IntersectionObserver' in window)) {
    window.__typesetAll();
    return;
  }

  function findContainingUnit(target) {
    if (!target) return null;
    return target.closest('.phase-card, .chapter, section, .page-hero') || target;
  }

  function typesetTarget(target) {
    if (!target) return;
    var unit = findContainingUnit(target);
    if (unit) {
      typesetElement(unit);
    } else {
      typesetElement(target);
    }
  }

  function handleHashJump() {
    var hash = window.location.hash;
    if (hash) {
      try {
        var id = decodeURIComponent(hash.replace(/^#/, ''));
        var el = document.getElementById(id) || document.querySelector('[name="' + CSS.escape(id) + '"]');
        if (el) {
          typesetTarget(el);
        }
      } catch (e) {}
    }
  }

  function init() {
    // Select units: .phase-card, .chapter, section, .page-hero, etc.
    var nodes = document.querySelectorAll('.phase-card, .chapter, section, .page-hero, .lab-section, .placement-corner');
    allUnits = Array.prototype.slice.call(nodes);

    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          typesetElement(entry.target);
        }
      });
    }, {
      rootMargin: '600px 0px'
    });

    allUnits.forEach(function (unit) {
      observer.observe(unit);
    });

    // Typeset target of URL hash immediately on load
    handleHashJump();

    // Listen to hash changes (browser back/forward, URL jumps)
    window.addEventListener('hashchange', handleHashJump);

    // Listen to link clicks (sidebar, anchor pills, search result items)
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href*="#"]');
      if (link) {
        var href = link.getAttribute('href');
        var idx = href.indexOf('#');
        if (idx !== -1) {
          var hashId = href.slice(idx + 1);
          if (hashId) {
            try {
              var target = document.getElementById(hashId) || document.querySelector('[name="' + CSS.escape(hashId) + '"]');
              if (target) {
                typesetTarget(target);
              }
            } catch (err) {}
          }
        }
      }
    });

    // Before printing, typeset all content on the page
    window.addEventListener('beforeprint', function () {
      window.__typesetAll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
