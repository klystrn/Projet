/* ==========================================================================
   Projet — full-bleed auth stage (login.html / signup.html)

   Runs alongside site.js, which owns the forms themselves (validation, the
   error/pending states, the data-endpoint POST, the ?role= prefill). This
   file owns only the stage: which mode is active, and the slide/crossfade
   transition between them.

   No height-stabilization step here (unlike, say, the testimonial
   spotlight card elsewhere on the site) — .auth-panel is a fixed
   full-height column, not sized around whichever face happens to be
   active, so swapping between the shorter login form and the taller
   signup form never has anything to jump.

   Progressive enhancement, same rule as everywhere else on the site: if
   this never runs, .no-js in auth.css stacks BOTH faces in full, so a
   visitor without JS gets two working forms rather than one form and a
   permanently-invisible second face. Nothing here is load-bearing for
   actually signing in.
   ========================================================================== */
(function () {
  "use strict";

  var stage = document.getElementById("authStage");
  if (!stage) return;

  /* The page ships with its own data-mode already set (login.html sends
     "login", signup.html sends "signup"), so the first paint is correct
     with zero JS having run yet — this only handles later switches. */
  function setMode(mode) {
    if (stage.getAttribute("data-mode") === mode) return;
    stage.setAttribute("data-mode", mode);

    var activeFace = stage.querySelector(".auth-face--" + mode);
    if (activeFace) {
      var focusTarget = activeFace.querySelector("input, button, select");
      if (focusTarget) {
        // wait out the crossfade's own transition-delay so focus doesn't
        // land on a still-invisible element
        window.setTimeout(function () { focusTarget.focus(); }, 200);
      }
    }
  }

  stage.querySelectorAll("[data-goto-mode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setMode(btn.getAttribute("data-goto-mode"));
    });
  });
})();
