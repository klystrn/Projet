(function () {
  "use strict";

  // scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { io.observe(el); });

  // hero load-in stagger
  window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.hero .reveal').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('in'); }, 120 * i);
    });
  });

  // step badges light up one after another as the how-it-works row scrolls in
  var steps = document.querySelectorAll('.steps-grid .step');
  var stepsIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        steps.forEach(function (step, i) {
          setTimeout(function () { step.classList.add('in'); }, 140 * i);
        });
        stepsIO.disconnect();
      }
    });
  }, { threshold: 0.3 });
  if (steps.length) stepsIO.observe(steps[0]);

  // rubric + evidence bar fill on scroll
  function animateFills(container) {
    container.querySelectorAll('[data-fill]').forEach(function (el) {
      el.style.width = el.getAttribute('data-fill') + '%';
    });
  }
  var fillIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateFills(e.target);
        fillIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.rubric-card, [data-bar-chart]').forEach(function (el) {
    fillIO.observe(el);
  });

  // FAQ accordion — one open at a time
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
      });
      if (!wasOpen) item.classList.add('open');
    });
  });
})();
