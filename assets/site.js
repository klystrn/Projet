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

  // mobile nav
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    function setMenu(open) {
      mobileMenu.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    navToggle.addEventListener('click', function () {
      setMenu(!mobileMenu.classList.contains('open'));
    });

    // any nav choice closes the sheet — including same-page anchors, which
    // otherwise scroll away behind a menu that's still covering the page
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        setMenu(false);
        navToggle.focus();
      }
    });

    // rotating past the breakpoint hides the toggle; drop the open state with it
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     AUTH FORMS — front end only.

     Validation, error and pending states are all real. Submission is the
     one piece that is not: the form POSTs JSON to whatever URL sits in its
     data-endpoint attribute, and does nothing when that is empty (the
     current state). Backend owner: set data-endpoint on the <form> in
     login.html / signup.html and this starts working unchanged.

     Expected contract:
       POST <endpoint>  Content-Type: application/json
       signup body  {role, name, email, password}
       login  body  {email, password}
       200 -> {redirect?: string}   non-200 -> {message?: string}
     ------------------------------------------------------------------ */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fieldValid(input) {
    var v = input.value.trim();
    if (input.hasAttribute('required') && !v) return false;
    if (input.type === 'email' && !EMAIL_RE.test(v)) return false;
    var min = parseInt(input.getAttribute('minlength'), 10);
    if (min && v.length < min) return false;
    return true;
  }

  function markField(input) {
    var ok = fieldValid(input);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }

  document.querySelectorAll('[data-auth-form]').forEach(function (form) {
    var status = document.getElementById('authStatus');
    var submit = form.querySelector('[type="submit"]');
    var inputs = Array.prototype.slice.call(form.querySelectorAll('input:not([type="radio"])'));

    function say(kind, msg) {
      if (!status) return;
      status.className = 'auth-status show ' + kind;
      status.textContent = msg;
    }

    // only nag about a field once the user has already left it invalid
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        if (input.value.trim()) markField(input);
      });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') markField(input);
      });
    });

    // carry the side chosen on the split-hero into the signup role picker
    var stored = null;
    try { stored = localStorage.getItem('projet:mode'); } catch (e) {}
    var param = new URLSearchParams(location.search).get('role');
    var role = param || stored;
    if (role) {
      var pick = form.querySelector('input[name="role"][value="' + role + '"]');
      if (pick) pick.checked = true;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstBad = null;
      inputs.forEach(function (input) {
        if (!markField(input) && !firstBad) firstBad = input;
      });
      if (firstBad) {
        firstBad.focus();
        say('err', 'Please fix the highlighted fields.');
        return;
      }

      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        // Deliberate: better to say the wiring is pending than to fake a
        // success and leave someone believing they have an account.
        say('pending', 'Accounts aren’t connected yet — this form is the finished front end, waiting on the API.');
        return;
      }

      var body = {};
      new FormData(form).forEach(function (v, k) { body[k] = v; });

      submit.setAttribute('aria-busy', 'true');
      say('pending', 'One moment…');

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok) throw new Error(data.message || 'Something went wrong. Please try again.');
            return data;
          });
        })
        .then(function (data) {
          window.location.href = data.redirect || 'business.html';
        })
        .catch(function (err) {
          submit.removeAttribute('aria-busy');
          say('err', err.message || 'Something went wrong. Please try again.');
        });
    });
  });

  /* ------------------------------------------------------------------
     DEFENSE DEMO — plays a scripted transcript one turn at a time, and
     lets the visitor flip between the two outcomes of the same question.
     Content lives in the HTML so it still reads with JS off.
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-defense-demo]').forEach(function (demo) {
    var tabs = demo.querySelectorAll('[data-dd-tab]');
    var panes = demo.querySelectorAll('[data-dd-pane]');
    var replay = demo.querySelector('[data-dd-replay]');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timers = [];

    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }

    function play(pane) {
      clearTimers();
      var turns = pane.querySelectorAll('.dd-turn');
      var verdict = pane.querySelector('.dd-verdict');
      turns.forEach(function (t) { t.classList.remove('in'); });
      if (verdict) verdict.classList.remove('in');

      if (reduced) {
        turns.forEach(function (t) { t.classList.add('in'); });
        if (verdict) verdict.classList.add('in');
        return;
      }
      turns.forEach(function (turn, i) {
        timers.push(setTimeout(function () { turn.classList.add('in'); }, 520 * i + 180));
      });
      if (verdict) {
        timers.push(setTimeout(function () { verdict.classList.add('in'); }, 520 * turns.length + 260));
      }
    }

    function show(name) {
      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', t.getAttribute('data-dd-tab') === name ? 'true' : 'false');
      });
      panes.forEach(function (p) {
        var on = p.getAttribute('data-dd-pane') === name;
        p.hidden = !on;
        if (on) {
          demo.classList.toggle('dd--fail', name === 'fail');
          play(p);
        }
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { show(tab.getAttribute('data-dd-tab')); });
    });
    if (replay) {
      replay.addEventListener('click', function () {
        var open = demo.querySelector('[data-dd-pane]:not([hidden])');
        if (open) play(open);
      });
    }

    // hold the animation until it's actually on screen
    var started = false;
    var ddIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !started) {
          started = true;
          var open = demo.querySelector('[data-dd-pane]:not([hidden])');
          if (open) play(open);
        }
      });
    }, { threshold: 0.3 });
    ddIO.observe(demo);
  });

  /* ------------------------------------------------------------------
     SHARED SCROLL TICKER — everything below that needs a continuous scroll
     position (as opposed to a one-time enter/exit, which IntersectionObserver
     already handles fine elsewhere) hangs off this single rAF-gated loop
     rather than each registering its own scroll listener.
     ------------------------------------------------------------------ */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) document.documentElement.classList.add('reduced-motion');

  var scrollUpdaters = [];
  (function () {
    var ticking = false;
    function run() {
      scrollUpdaters.forEach(function (fn) { fn(); });
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(run);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // deferred one tick so layout has settled (webfonts, images) before the
    // first read of scroll position / element rects
    window.addEventListener('load', onScroll);
    onScroll();
  })();

  /* ---- scroll progress bar ---- */
  (function () {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    scrollUpdaters.push(function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
    });
  })();

  /* ---- compact nav on scroll ---- */
  (function () {
    var nav = document.querySelector('header.nav');
    if (!nav) return;
    scrollUpdaters.push(function () {
      nav.classList.toggle('is-compact', window.scrollY > 48);
    });
  })();

  /* ---- subtle hero-visual parallax ---- */
  (function () {
    if (reducedMotion) return; // CSS forces transform:none for this exact reason
    var img = document.querySelector('.hero-visual .texture');
    if (!img) return;
    scrollUpdaters.push(function () {
      // effect only matters while the hero is on screen; capping the input
      // keeps it from doing anything once scrolled well past it
      var shift = Math.max(-1, Math.min(1, window.scrollY / 600));
      img.style.transform = 'translateY(' + (shift * 22) + 'px)';
    });
  })();

  /* ------------------------------------------------------------------
     FLUID TEXTURE VIDEO — the hero/final-cta background loop. No autoplay
     attribute in the markup on purpose: with JS off (or reduced-motion) the
     poster frame just sits there like the old static image did. With JS on,
     play it only while its section is actually on screen, so a page with
     both hero and final-cta videos isn't decoding two loops at once.
     ------------------------------------------------------------------ */
  (function () {
    var videos = document.querySelectorAll('[data-autoplay-video]');
    if (!videos.length || reducedMotion) return;
    var videoIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.play().catch(function () {});
        else e.target.pause();
      });
    }, { threshold: 0.25 });
    videos.forEach(function (v) { videoIO.observe(v); });
  })();

  /* ------------------------------------------------------------------
     PROBLEM SECTION SCROLL-EMPHASIS — the three pain points sit on a
     vertical track; a fixed reference line partway down the viewport
     drives both the connecting line's fill (continuous 0-100%) and which
     point is "active" (point N activates once its midpoint crosses the
     line). Runs off the shared ticker above rather than IntersectionObserver:
     IO reports enter/exit, not a continuous progress value, and the line
     fill needs the latter.
     ------------------------------------------------------------------ */
  (function () {
    var tracks = document.querySelectorAll('[data-pain-track]');
    if (!tracks.length) return;
    if (reducedMotion) return; // CSS shows every point active and the line full

    var REFERENCE_RATIO = 0.55; // 55% down the viewport

    function updateTrack(track) {
      var items = track.querySelectorAll('[data-pain-step]');
      var fill = track.querySelector('[data-pain-fill]');
      if (!fill || !items.length) return;

      var fillTrack = fill.parentElement.getBoundingClientRect();
      var referenceY = window.innerHeight * REFERENCE_RATIO;

      var fillPx = Math.max(0, Math.min(fillTrack.height, referenceY - fillTrack.top));
      fill.style.height = fillPx + 'px';

      items.forEach(function (item) {
        var r = item.getBoundingClientRect();
        var mid = r.top + r.height / 2;
        item.classList.toggle('is-active', mid <= referenceY);
      });

      track.setAttribute('data-ready', '');
    }

    scrollUpdaters.push(function () { tracks.forEach(updateTrack); });
  })();

  /* ------------------------------------------------------------------
     HOW IT WORKS — pinned scroll-through. Same shape as the pain track:
     a continuous scroll-progress value (not IntersectionObserver, since
     enter/exit alone can't say "we're 60% of the way down the pin") picks
     which of the four steps is active while .how-pin holds the section on
     screen via position:sticky. CSS collapses this to a plain static list
     under 900px, so the width check below just leaves that layout alone.
     ------------------------------------------------------------------ */
  (function () {
    var pin = document.querySelector('[data-how-pin]');
    if (!pin || reducedMotion) return;

    var howSteps = pin.querySelectorAll('[data-how-step]');
    var howDots = pin.querySelectorAll('[data-how-dot]');
    if (!howSteps.length) return;

    scrollUpdaters.push(function () {
      if (window.innerWidth <= 900) return; // CSS already shows it as a static list
      var rect = pin.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      var idx = Math.min(howSteps.length - 1, Math.floor(progress * howSteps.length));
      howSteps.forEach(function (step, i) { step.classList.toggle('is-active', i === idx); });
      howDots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === idx); });
    });
  })();

  /* ------------------------------------------------------------------
     STAGGERED GRID REVEAL — cards in a [data-stagger] grid fade/lift in
     one after another (rather than the whole grid appearing at once) once
     the grid scrolls into view. One-shot per grid; unlike the pain track
     this doesn't need continuous progress, so IntersectionObserver is the
     right tool here.
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-stagger]').forEach(function (grid) {
    var items = grid.children;
    if (!items.length) return;
    if (reducedMotion) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
      return;
    }
    var staggerIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Array.prototype.forEach.call(items, function (el, i) {
          setTimeout(function () { el.classList.add('in'); }, 90 * i);
        });
        staggerIO.disconnect();
      });
    }, { threshold: 0.15 });
    staggerIO.observe(grid);
  });

  /* ------------------------------------------------------------------
     COUNT-UP NUMBERS — the hero card's mockup rows ("42 submissions",
     "Ranked top 8%") carry the real number as their pre-rendered text
     (tools-build-pages.py's countify()), so no-js/reduced-motion visitors
     just see the finished number. With JS + motion on, each one resets to
     0 and animates up once it scrolls into view, one-shot.
     ------------------------------------------------------------------ */
  (function () {
    var counters = document.querySelectorAll('.count-up');
    if (!counters.length || reducedMotion) return;

    counters.forEach(function (el) { el.textContent = '0'; });

    var DURATION = 900;
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / DURATION, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
        countIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countIO.observe(el); });
  })();

  /* ------------------------------------------------------------------
     CARD TILT — offer/model cards tilt slightly toward the cursor on
     precise-pointer devices only (touch has no hover, so this would just
     be a stuck tilt on the last-tapped card there). Skipped under reduced
     motion like everything else here.
     ------------------------------------------------------------------ */
  (function () {
    if (reducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var MAX_TILT = 5;
    document.querySelectorAll('.offer-card, .model-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.style.transition = 'transform .05s linear';
      });
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(700px) rotateX(' + (-py * MAX_TILT) + 'deg) rotateY(' + (px * MAX_TILT) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform .4s var(--ease, ease)';
        card.style.transform = '';
      });
    });
  })();

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
