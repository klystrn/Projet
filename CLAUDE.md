# Projet — website work: handoff from Claude.ai chat

This file exists so Claude Code has full context on a website project that
started in a Claude.ai conversation. Read this before doing anything else
in this folder.

## Who/what Projet is

Projet is a Singapore pre-seed startup ("hiring on proof") shifting hiring
from resume-based to proof-based: a company posts a real brief from its own
backlog, candidates submit work anonymously, and — the core differentiator —
candidates must **defend their work live**, in a 15-minute call scored on a
rubric (Ownership 40% / Technical depth 25% / Live navigation 20% /
Communication 15%, pass at 3.5/5). The pitch is that AI can generate a
portfolio or a take-home, but it can't sit in the room and defend decisions
under questioning.

- **Website**: myprojet.co
- **Stage**: Pre-seed, raising S$500k, applying to the Block71 @ NUS
  incubator
- **Team**: Le Mai Thi (CEO, NUS Mechatronics), Andrei Loh (Platform & Ops,
  NUS Data Science and Analytics), and the person you're working with now
  (design/web dev consultant, possible future co-founder — design/eng)
- **Business model**: S$250 to list a brief, S$500 to unlock a candidate's
  identity after the defense (charged post-decision, no success fee)
- **Traction**: "Hack & Hire" pilot at Block71 @ NUS — 120+ student
  builders, 7 companies, 10+ live defenses run, 2 hires

The live copy/voice now lives in `index.html` — treat that as the source of
truth, not this summary. (The old `projet-landing.html`, which used to hold
it, is archived; see "Site architecture" below.)

## Brand tokens

```
Ink (near-black):     #14130f   (split-hero prototype uses #08080a, close enough — reconcile if it matters)
Signal orange:        #ff5b24   (primary brand accent, from the real Figma logo file)
Orange deep (hover):  #c73e10 / #c73e10
Navy (from spectrum):  #161c3f / #0c1638
Paper / warm card bg: #ffffff / #f5f4ef
Hairline:             #e6e3da

Display + body font:  Satoshi (via Fontshare: https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap)
Mono / labels / data: JetBrains Mono (Google Fonts)
```

The real logo is "Pr" + a circular orange icon + "jet" set in Satoshi
Black. **Resolved** — the real exports are committed and in use: trimmed
web copies at `assets/logo-dark.png` (light backgrounds) and
`assets/logo-white.png` (dark backgrounds), with favicons generated from the
icon mark (`favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`). The
originals are also in `assets/` (`Logo Full Black/White/Orange.png`, etc.).

## Figma source files

- **Pitch deck assets / logo exploration** (view-only to the user):
  `https://www.figma.com/design/tdMO3Okc6oRz5dby1AalDT/Test-Logo-Thi`
- **User's own editable copy, used for asset exports**:
  `fileKey: KWwUgic3XjFfV5Xyz5VqDI` — "copy-of-Projet-Assets"
  - Node `1:64` — dark logo (text `#171717`, for light backgrounds)
  - Node `1:80` — white logo (for dark backgrounds)
  - Node `1:84` — orange logo (text `#ff5b24`)
  - Node `1:68` — icon mark alone
  - Node `1:23` — "foreground" fluid swirl layer (used in the marketing
    landing page hero/final-CTA as a texture — **note**: user later found
    that the true polished look needs `background` (`1:22`) **and**
    `foreground` (`1:23`) composited together, not foreground alone. This
    was never actually resolved — see "Known issues."
  - Node `1:37` / `1:38` — the diagonal light-spectrum stripe used in the
    marketing landing page (`typographic_gradient_011_03`)

A Figma MCP connector is available and was used successfully in this chat
via `get_metadata`, `get_design_context`, and `download_assets` tools. It
hit a **Starter-plan rate limit** partway through this session — if you
have Figma MCP tools available in Claude Code and need more exports, expect
the same limit; batch requests together rather than calling one node at a
time.

Every asset URL pulled from Figma via these tools
(`https://www.figma.com/api/mcp/asset/...`) is a **presigned URL that
expires after about 7 days**. None of these should be hardcoded into
shipped code — always download/export the actual asset file locally (as
was done for `projet-split-hero/assets/spectrum.jpg`) rather than linking
the API URL directly.

## Site architecture — REBUILT (Aug 2026). Read this first.

**The whole previous multi-page site was scrapped on the user's explicit
instruction.** There is now one page: a landing page at `index.html`, which
is also the entry point (launching the site lands you here — there is no
longer a chooser gate in front of it).

```
index.html          the landing page — the entire public site
login.html          front-end-only auth (kept, still functional)
signup.html         front-end-only auth (kept; ?role= still prefills)
assets/             shared images/video + landing.css + landing.js + site.css
archive/            everything the landing page replaced
```

Everything below is in `archive/` and is **reference only — do not
resurrect any of it as a live page**:

| Archived | Was |
|---|---|
| `business-v1/v2.html`, `builders-v1/v2.html` | the dual-mode audience homepages |
| `projet-split-hero/` | the "pick your side" chooser that used to be the entry point |
| `projet-landing-v1.html` | the original single-file marketing/overview page |
| `challenges-v1.html` | the challenges stub |
| `tools-build-pages.py` | the generator that produced business/builders |

`assets/site.css` and `assets/site.js` are **still live** — `login.html` and
`signup.html` depend on them. Don't delete them when tidying. The landing
page deliberately does *not* use them; it has its own `assets/landing.css`
and `assets/landing.js` so it can evolve without inheriting the old pages'
layout baggage.

## "Light spectrum wave" — the house name for the signature animation

The user named this. It refers to the bar-shear mechanic first built for the
old audience chooser and now used in the Featured challenges / Success
stories split: the spectrum image (`assets/spectrum.webp`) sliced into a
stack of horizontal bars along a seam, which **shear away from whichever
side is active** — each bar offset by its own amplitude on a sine curve
(bulging toward the middle bars) and delayed by index, so the motion reads
as a cascade rather than a rigid block sliding. Use this name for it.

## Copy framing — live defense / rubric REMOVED AGAIN. Third reversal, read carefully.

This has now flipped twice in this project's history — don't re-add either
side of it without an explicit, current instruction:

1. An early build removed the pitch-deck's live-15-minute-defense/rubric
   framing because the home-page copy at the time came from Andrei's
   landing repo, which had none of it.
2. The user then explicitly reinstated it for `index.html`'s first build,
   dictating the flow themselves as "Post/Apply → Async submission → Live
   15-min defense → Rubric scoring → Hire decision."
3. **The user has now explicitly removed it again**: *"I dont want the
   15min call scored on a rubric. Keep that in memory for now, but remove
   it."* The "keep in memory" is why this is written up in this much
   detail rather than just deleted — treat a future request to bring the
   defense/rubric concept back as a real possibility, not a closed
   question.

Current state of `index.html`, as a result:

- **No live defense, no 15-minute call, no rubric anywhere** — not in the
  hero (copy, eyebrow, or the hero-card mock), not in How it works, not in
  Success stories, not in testimonials, not in the final CTA or footer.
  "Defend"/"defense" as verbs are gone from visible copy entirely — the
  narrative is "post a challenge → builders submit real work → evaluated
  on real output → hire," full stop.
- **How it works dropped the 5-step pinned-scrub design** (Post/Apply →
  Async submission → Live defense → Rubric scoring → Hire decision) for a
  **4-step static grid** the user pointed to directly (a screenshot of the
  archived `business.html`'s own How-it-works section): Business posts a
  challenge → Builders compete → Top performers get evaluated →
  Interviews, internships & recognition. **The pinned-scrub mechanic itself
  was later brought back** (the user liked the old zoomed-background-scroll
  animation and asked for it applied to these same 4 steps) — the content
  stayed defense/rubric-free throughout; only the delivery mechanism
  flip-flopped. See "5. How it works" under "The landing page, section by
  section" below for the current (restored-scrub) implementation.
- The **Hack & Hire pilot numbers that were defense-specific are gone**:
  "10+ live defenses" is dropped from both the hero stat row and the
  Success-stories stat grid (each now shows 3 stats, not 4) since the
  number has no meaning without the defense concept to anchor it. The
  other three figures (120+ builders, 7 companies, 2 hires) are unaffected
  — they aren't defense-specific.

Andrei's `content.ts` copy ("challenge-based talent discovery") is still
not what this page is written from. The hero eyebrow now reads "Where real
work is the strongest hiring signal" instead (that phrase's own established
tagline, not new copy) — see "The landing page, section by section" below.

Still true, and unchanged: **"Builder", never "Students"** in visible copy
— even though the reference screenshot for the How-it-works rebuild (the
archived page) uses "Students," the rebuilt version here says "Builders."

## The landing page, section by section

All six sections the user specified, in order, plus a final CTA. Nav and
footer are the two universal components.

### Nav / footer (universal)
Sticky nav, compacts past 48px of scroll. Anchor links to the four
in-page destinations + Log in / Sign up. Collapses to a hamburger below
900px (`#navToggle` / `#mobileMenu`, closes on link tap, Escape, and on
resize past the breakpoint). `nav.links a` now gets an active-section
highlight (`.is-current`) driven by a single `IntersectionObserver` over
the four in-page targets, picking whichever section is closest to
viewport centre — no scroll listener of its own.

**Audience mode toggle** (`.mode-switch`, next to the logo — added after
the initial build; the user asked for it explicitly). **Order and labels
changed once more since**: it now reads **"For students" (left) / "For
companies" (right)** — a deliberate, narrow exception to "Builder, never
Students" (see "Copy framing" above): only this one button's own visible
label says "students"; the internal value is still `data-audience="builder"`
and every other mention of the audience anywhere else on the page still
says "Builder". Re-tints `--accent` site-wide via `html[data-audience]`
and updates the nav's Sign-up link to `signup.html?role=…`, matching the
convention the old audience chooser used. Choice persists via
`localStorage["projet:audience"]`.

**Builder/student is now the DEFAULT mode, not business** — asked
explicitly. `landing.js`'s audience-toggle IIFE resolves to `"builder"`
unless `localStorage["projet:audience"]` says otherwise (was the reverse).
This flows through to every no-js/pre-JS-paint default too, not just the
JS-resolved state: the `:root` `--accent` default, `.mode-indicator`'s
resting position/colour, and the inline HTML fallback content on the H1/
hero-sub/hero-ctas/`.hero-card`/`.flow-steps` were all swapped so a no-js
visitor and a JS visitor see the same thing on first paint.

**Colour mapping reversed: students/builders are ORANGE, companies are
BLUE** — asked explicitly, opposite of the original pairing. `--accent`
now defaults to `var(--orange)` with `html[data-audience="business"]`
overriding to `var(--blue)`; `.mode-indicator`'s resting colour/position
flipped to match. The same pairing was extended to every other place the
two audiences are colour-coded, for consistency: the testimonial
`.t-badge`/top-bar accent (Builder=orange, Company=blue) and the
spectrum-split's two CTA buttons (`.btn-solid-orange` "Sign up to
compete", `.btn-solid-blue` "Post a challenge" — fixed to the literal
colour, not `--accent`, since these tag which SIDE of the split a button
belongs to, not the current toggle state). **Not** extended to
`.hero-card`'s own accents (`.hero-card-live`, `.hc-rank`) — those stayed
fixed orange on purpose, since that card sits on `hero-visual.webp`'s
fixed warm/fire palette and would clash if they turned blue in company
mode.

**It now DOES rewrite copy per mode, reversing the original "re-theme,
not a router" design.** A generic system drives this: any element carrying
`data-mode-copy` plus `data-business="<html>"` / `data-builder="<html>"`
attributes gets its `.innerHTML` swapped by `applyModeCopy()` in
`landing.js` on every toggle. Currently wired to the hero H1, hero
sub-copy, the hero CTAs, the `.hero-card` mock, and all four How-it-works
step cards (see their sections below) — still one shared page, not two
routed ones, just one that relabels its own copy in place. One piece of
plumbing this requires: `.flow-steps` is also re-scanned and re-scrubbed
by the How-it-works scroll effect, which caches its own `NodeList` of
`.flow-step`/`.flow-dot` — a raw `innerHTML` swap would leave that code
holding references to detached nodes, so `#flow` exposes a
`wrap.refreshFlow()` hook that `applyModeCopy()` calls after every swap to
force a re-query + repaint.

**The switch now animates, both the toggle and the page content — asked
explicitly, this used to be an instant snap.** `.mode-indicator`'s slide
already had its own transition; new is a content crossfade on every
`[data-mode-copy]` element (`.mode-swap` class, opacity 0 with `!important`
since `[data-reveal].revealed`'s own higher-specificity rule would
otherwise keep it pinned at opacity 1) — `applyModeCopy()` adds the class,
waits `SWAP_MS` (160ms), swaps `.innerHTML`, then removes it. Skipped
entirely (`animate=false`) on the very first page-load call, where the
inline HTML already matches the resolved default mode, so there's nothing
to visibly swap. One easy-to-miss gotcha it had to work around: the
entrance stagger leaves an inline `transition-delay` (e.g. `.16s`) sitting
on these same elements forever after load, and since inline
`transition-delay` outranks a stylesheet's implicit `0s`, it was also
silently delaying this fade by the same amount — `applyModeCopy()` zeroes
`el.style.transitionDelay` right before adding `.mode-swap` to kill that.

**Footer** got an accent-gradient top edge (`footer::before`, orange →
purple → blue — the same gradient identity as the hero headline and the
mode toggle it tracks) and a "get notified about new challenges" email
capture in the brand column (`#footerNotify`). The capture is **front end
only, same honesty rule as `login.html`/`signup.html`**: its
`data-endpoint` attribute is empty, and submitting says so — "Not
connected yet — this form is the finished front end, waiting on the
API." — rather than faking a success. Point `data-endpoint` at a real
route to wire it up.

### 1. Hero & call to action
Headline "Hire on proof, not paper." (second line carries a spectrum
gradient via `background-clip:text`). **Two CTAs** as specified — "Post a
challenge" (primary) and "Browse challenges" — with the Hack & Hire
statistic directly below them (3 figures, not 4 — see "Copy framing"
above for why "10+ live defenses" is gone).

- The eyebrow reads "Where real work is the strongest hiring signal" (the
  page's own established tagline) and has **no leading bullet dot**
  (`.eyebrow--plain` — every other section eyebrow keeps the dot; this was
  a specific ask for the hero only).
- The `+` in "120+" lives **inside** the `<b>`, not as a bare text node
  after it. `.hero-stat-row span` is a flex row, so its `gap` would
  otherwise land between the number and the plus and render "120 + builders".
  (Same class of bug as the old `.cand-left` one — worth remembering: a flex
  `gap` applies between *anonymous* text-node flex items too.)
- H1, hero sub-copy, hero CTAs, and the `.hero-card` mock are all
  **mode-aware** (`data-mode-copy`, see "Nav / footer" above): business
  mode keeps the copy above; builder/student mode swaps the H1 to "Prove
  your skills, not your resume.", the sub-copy to the builder framing, the
  primary CTA to "Participate" (`signup.html?role=builder`, "Browse
  challenges" is unchanged either mode), and the `.hero-card` mock from a
  "YOUR CHALLENGE" progress readout (challenge live → submissions →
  shortlist → interview) to a "YOUR SUBMISSION" one (challenge joined →
  submitted → ranked → noticed). The count-up numbers inside the card are
  static in the swapped HTML — they don't re-run their count animation on
  a mode switch, an accepted tradeoff.

**The hero visual now has a real background image again — a still frame,
not a photo/video texture that changes on scroll.** `hero-visual.webp`
(92KB, converted+compressed from the existing `assets/Logo Background
2.png` master via `ffmpeg -q:v 82`) sits behind `.hero-card` as a plain
CSS `background-image`; a dark linear-gradient wash on top keeps the card
text legible, and the old flat gradient is still there as a fallback fill
underneath. This is **not** a reintroduction of the earlier
"Spectrum-to-Waveform Hero Handoff" (two images crossfading on scroll) —
there's still no `<video>`, no `<img>`, no scroll listener, and the image
never changes once painted, so the two complaints that got the old
handoff removed (changes on scroll; overuse of the fluid/spectrum texture
specifically) still don't apply. A gentle cursor-tilt (`#heroVisual` in
`landing.js`, desktop pointer only — gated on `(hover:hover) and
(pointer:fine)`, max 7deg, no permanent CSS `transition` on the element
itself to avoid fighting `[data-reveal]`'s own transform transition) is
the one interaction it keeps. **`hero-visual.webp` is reused a second time**
as the Testimonials scroll-scrub background — see "6. Testimonials" below.

**The hero was also resized down to get the logo carousel above the
fold** — asked explicitly ("it is currently just below the end of the
screen"). Two changes together, both scoped to desktop: the H1's clamp max
dropped from 86px to 72px (the builder/student headline is longer than the
business one and was wrapping to 4 lines instead of 2 at the old max,
adding ~170px of height — 72px is the largest size that still fits both
headlines in one line per `<br>` segment within the ~605px text column at
1280–1920px widths), and `.hero-visual`'s aspect ratio went from `1/1.04`
to `1/0.86` (it had become the taller of the two grid columns and was the
height bottleneck once the text column shrank). Together these bring the
logo carousel comfortably on-screen at 1366×768, 1440×900, and 1920×1080
without touching any copy.

### 2. Logo carousel
**A true recycling marquee, not a duplicate-and-reset loop** — the user was
explicit that it must not jump back, only reintroduce what scrolled off.
`landing.js` moves each chip from the head of the track to its tail the
moment it clears the left edge and credits the offset back by exactly that
chip's width, so the transform oscillates near zero forever instead of
rewinding. It clones the source chips until the track is ≥2× viewport width
so something is always entering on the right, and pauses via
`IntersectionObserver` when off-screen.

**The logos are PLACEHOLDERS and are not customers.** See "Known issues" #1
— this is the one thing on the page that must not ship as-is.

Chips are now `<a href="#stories">` (real anchors, not bare `<span>`s), so
the carousel is clickable — each should point at that partner's own real
case study/site once real partners exist; `#stories` is a placeholder
target, not a final one. The marquee also now pauses on hover and on
keyboard focus (`mouseenter`/`focusin` on the track), not just when
scrolled off-screen — needed once the chips became focusable links, so a
keyboard user tabbing through them isn't fighting a moving target.

### 3 + 4. Featured challenges | Success stories
One "light spectrum wave" stage, split down the middle, exactly as
specified: **featured challenges + sign-up CTA on the left, success stories
+ problem validation on the right, defaulting to featured challenges.**

`.spectrum-split` is a **170vh** wrapper (was 260vh — the user flagged "too
much scrolling without any movement," so this was cut by roughly a third
while keeping the veil-dissolve entrance/exit intact); `.ss-stage` sticks
for the duration. Scrolling in fades `.ss-veil` (a white sheet matching the
page background) from 1 to 0, so the white background dissolves and the
viewer drops into the spectrum; it fades back up on the way out so the
return to the white page is a transition rather than a cut.

- Hover previews the other side; leaving returns to whichever side is
  *pinned* (the tab choice, or the `challenges` default). Desktop pointers
  only, gated on `(hover:hover) and (pointer:fine)`.
- `.ss-tabs` exists because hover is unreachable on touch and by keyboard.
- **The bars must not overlap the copy.** They are deliberately wider than
  the band (`--bar-w: 1.7 × --stripe-w`) so they fan past it, and that
  overhang has to land on empty panel margin — hence the seam-side padding
  (`.ss-panel--challenges{padding-right}` / `--stories{padding-left}`).
  This was a real bug on the first pass: at 2.5× the fan sat directly over
  the Success-stories headline and stat numbers.
- **The bars showed flat black instead of colour — fixed by zooming into
  each bar's own row of the source image, not just recolouring the gaps.**
  `assets/spectrum.webp` is mostly black margin either side of its diagonal
  colour band, and because the band is diagonal, its centre drifts by most
  of the image's width between the top bar and the bottom one. The original
  approach squeezed the *whole* image into each narrow bar
  (`background-size:var(--bar-w) 100vh`), so most of each bar showed
  black margin, not colour, and no single recolour/gradient trick on the
  container behind the bars could fix that — the black pixels were coming
  from the bars themselves, not gaps between them. The fix: a small
  Python/Pillow script (see below) sampled the image at each of the 14
  bars' rows, found where the colour band actually sits at that row, and
  computed a per-bar zoom + horizontal offset that re-centres just that
  row's band inside the bar. `landing.js`'s `BAND_ZOOM` table (14
  `[zoom, offsetK]` pairs) feeds `--zx`/`--ox` custom properties per bar;
  `.ss-bar`'s `background-size`/`background-position` in `landing.css`
  consume them. **Regenerate `BAND_ZOOM` with a fresh sampling script if
  `spectrum.webp` is ever re-exported** — the table is specific to this
  exact image.
- `.ss-stage`'s own background is a warm-to-cool gradient (not flat
  `#08080a`) and `.ss-stripe-inner` carries a second, more saturated
  version of the same gradient confined to the narrow stripe itself — belt
  and braces so any sliver the bars still don't cover (mask fade at each
  bar's edges, sub-pixel gaps) reads as part of the scene rather than a
  seam. Getting the *stripe's own* colours right mattered more than the
  page-wide gradient: a first attempt only tinted `.ss-stage`, but by the
  time that 90deg gradient reached the ~50% mark where the stripe actually
  sits, its stops were already close enough to black to look like the
  original bug hadn't been fixed at all.
- Active/inactive ratio is 1.5/1, not harder — the inactive side is real
  content, not a teaser, and has to stay readable.
- **The two panel CTAs ("Sign up to compete" / "Post a challenge") are both
  `.btn-white`** — filled, not one filled and one outlined. They were
  visually mismatched (one solid, one ghost) until this was flagged.
- Below 900px the whole mechanic is dropped: panels stack, both show their
  copy outright, and the band becomes a horizontal divider. A hover-to-expand
  split has no meaning on a screen that can only show one column.
- **Live countdown** (`.ss-countdown`) sits above the featured-challenge
  cards — see "Known issues" for why it's a relative placeholder deadline
  rather than a real one.
- Success-stories stats are a **3-item** grid (`.ss-stats--three`), not 4 —
  "10+ live defenses" was dropped along with the defense concept; see
  "Copy framing" above.
- A `.ss-view-all` link ("View all challenges →", pointing at
  `challenges.html`) sits after the 3 sample cards, **below** "Sign up to
  compete" — asked twice: first to reorder it under the button, then
  explicitly to make sure the two actually stack vertically rather than
  sitting side by side (`.ss-view-all` is `display:block; width:fit-content`
  now, not `inline-block` — a block-level sibling always starts its own
  line regardless of what precedes it, which is what forces the button
  above it onto its own line too). A reminder in the HTML that this split is
  **a brief overview of a few featured challenges, not a full listing**;
  the complete, filterable list belongs on `challenges.html`, a separate
  page that doesn't exist yet (see "Known issues" #4). A one-line `.ss-story` note
  ("Two of those companies hired directly off the back of a challenge
  submission.") was added under Success stories' `.ss-note` — grounded
  strictly in the existing "2 hires" fact, nothing further invented (an
  earlier draft added "no separate interview loop required," which wasn't
  an established fact, and was cut).
- `#ssHint` ("Hover to explore • tap to switch") sits above `.ss-tabs` and
  dismisses permanently on first tab click or panel hover/focus — hidden
  outright on mobile (`.ss-tabs` itself is gone below 900px).
- **Below 900px, the challenge/stat cards (`.ss-card`, `.ss-stat`) now get
  their own scroll-reveal**, separate from the generic `[data-reveal]`
  system: a dedicated `IntersectionObserver` in `landing.js`, gated by
  `matchMedia("(max-width:900px)")` so it never touches the desktop pin,
  fades/slides each card in with a small per-card stagger. Without this the
  whole split rendered as flat, motionless text on mobile the instant it
  scrolled on screen, since the hover/veil mechanic (the desktop entrance
  motion) is dropped entirely at that width. Reduced-motion and no-js both
  render the end state (`opacity:1`) directly, same rule as everywhere
  else on the page.

### 5. How it works — Fluid Flow Steps pinned scrub (RESTORED, 4 steps)
**This flipped a third time — read carefully before touching it again.**
The first build ran a 5-step pinned scroll-scrub (Post/Apply → Async
submission → Live defense → Rubric scoring → Hire decision) through
`fluid-full.png`, with a Rubric Spectrum Bar on the scoring step. When the
live-defense/rubric content was dropped (see "Copy framing" above) this
was replaced with a plain static 4-card grid matching a screenshot of the
archived `business.html`'s own How-it-works section. **The user then
explicitly asked for the scrub mechanic back** — *"I like the old
animation for the how it works, where it was zoomed in on the fluid
background and moved as the user scrolled. Use that but with the 4
steps"* — so the static grid is gone again and the pinned scrub is back,
restored from git history (`git show <pre-static-grid commit>:assets/
landing.css`/`landing.js`) and adapted from 5 steps to the current 4, with
no rubric content re-added.

Current implementation: `.flow` is a **368vh** wrapper (scaled down
proportionally from the old 460vh for 5 steps); `.flow-stage` pins for the
duration. `.flow-fluid` tracks `background-position` on `fluid-full.png`
as the reader scrolls (opacity `.58`, own `landing.js` scrub tied into the
shared `scrollUpdaters` ticker, not its own listener); `.flow-scrim` is a
center-heavy radial gradient (not just edge vignette) since the step copy
sits dead centre, which is exactly where the artwork's brightest passages
run — an edge-only vignette left the text unreadable. The 4 steps
crossfade with **asymmetric timing** (outgoing fades in `.24s`, incoming
waits `.14s` then fades in over `.5s`) since all four are stacked at the
same absolute position and a symmetric crossfade briefly rendered two
headlines on top of each other. Numbers are bare (`.flow-num`, "01" not
"STEP 01") per the earlier explicit ask, kept through this restoration.

**Mode-aware, same as the hero**: `.flow-steps` carries `data-mode-copy` +
full `data-business`/`data-builder` HTML strings for all 4 steps. Business:
Business posts a challenge (+ "Post a challenge →" link) → Builders
compete → Top performers get evaluated → Interviews, internships &
recognition. Builder/student: Find a challenge (+ "Browse challenges →"
link) → Submit your best work → Get evaluated on merit → Earn interviews &
recognition. See "Nav / footer" above for the `wrap.refreshFlow()` hook
this requires so the scrub doesn't animate stale, detached nodes after a
mode swap.

Below 900px / reduced motion / no-js, the pin collapses to a plain stacked
list (`.flow-step{position:static; opacity:1}` — a scroll-gated step that
never activates would hide content outright, the site's hard rule).
`fluid-full.png` **is loaded again** as `.flow-fluid`'s background — see
"Known issues" below, this reverses what was previously documented there.

### 6. Testimonials — pinned scroll-scrub (REBUILT — was a carousel)
**This section's whole interaction model changed again — read carefully
before touching it.** It used to be a carousel: highlighted centre card,
arrow buttons, 4s auto-advance, a true infinite loop (clone-before-first/
clone-after-last with a silent snap so it never visibly jumped back), and
real touch-swipe. All of that — `.t-viewport`, `.t-track`, `.t-controls`,
`.t-btn`, the clone/slot logic, the swipe handlers — is **gone**. The user
asked explicitly to revamp it: *"Use the logo background 2 asset and zoom
in (similar concept as the how it works using fluid background). As the
user scrolls, the direction will be from right to left and there will be
testimonials along different points on the main line in the asset."*

Current implementation is the same mechanic family as How It Works' Fluid
Flow Steps: `.t-scrub` is a **420vh** wrapper, `.t-scrub-inner` sticks for
the duration. `.t-scrub-bg` is `hero-visual.webp` (the same "Logo
Background 2" derivative used in the hero) zoomed in
(`background-size:260% auto`) with **`background-position-x` panning
100% → 0% (right to left)** as the reader scrolls — the opposite axis from
How It Works' diagonal pan, per the explicit ask. `.t-scrub-scrim` is a
center-heavy radial + linear gradient, same reasoning as `.flow-scrim`
(the stops sit near the stage's middle, which is where the artwork's
brightest passages run).

**Testimonials sit at different points along the wave, not all
dead-centre.** Each of the 5 `.t-stop` cards carries its own `--ty` inline
custom property (a hand-picked vertical pixel offset, not sampled from the
image the way `spectrum.webp`'s `BAND_ZOOM` table was) so they read as
riding different points of the glowing curve as the background pans
underneath them. `landing.js`'s scrub `tick()` buckets scroll progress into
5 segments (same `Math.floor(p * stops.length * 0.999)` pattern as flow)
and toggles `.is-active` accordingly; `.t-dots` are decorative progress
dots only, not click targets, same as `.flow-dots`.

**Two non-obvious bugs found while building this, both from equal-
specificity cascade conflicts — worth remembering for any future compound-
class component:**
- Every stop also carries `.t-card` for its visual chrome (background,
  border-radius, badge, colour bar — reused unchanged from the old
  carousel design). `.t-card{position:relative}` and `.t-stop{position:
  absolute}` are both single-class selectors of equal specificity, and
  `.t-card`'s rule happened to sit later in the file — it silently won,
  turning every stop back into a normal in-flow block instead of the
  overlapping, absolutely-positioned one the scrub needs. Fixed by using
  the compound selector `.t-card.t-stop` (higher specificity, order no
  longer matters) for all of the scrub-specific position/opacity/transform
  rules.
- The mobile/reduced-motion/no-js fallback (below) sets `.t-card.t-stop
  {position:static; transform:none}` to collapse the pin into a plain
  stacked list — but `collapsed()` in `landing.js` still marks every stop
  `.is-active` (so nothing stays hidden), and `.t-card.t-stop.is-active`
  (3 classes) outranks the fallback's 2-class selector regardless of media
  query or source order, so the desktop centring transform kept winning and
  every card rendered off-position, overflowing the viewport horizontally.
  Fixed with `!important` on the fallback's `position`/`transform`.

Below 900px / reduced motion / no-js: `.t-stops` becomes a plain vertical
stack (no pin, no pan, no absolute positioning) — same rule as How It
Works, since a scroll-gated stop that never activates would hide its
content outright.

- Quotes, names and avatars are **placeholders** — see "Known issues" #1.
  Avatars are illustrated silhouettes: an inline SVG, a gradient-filled
  circle with a clipped head-and-shoulders shape drawn on top (`clipPath`
  keeps the silhouette inside the circle), deliberately not photographs of
  real people.
- **Speaker badges**: each `.t-card` gets a `data-side="business"` /
  `"builder"` attribute and a `.t-badge` ("Company" / "Builder") — tags who's
  speaking, fixed orange/blue regardless of which audience mode the reader
  has toggled (see "Nav / footer" above for the colour pairing itself,
  which reversed this round).

### Final CTA
`.final-fineprint` ("Free for builders — no card required.") under the
buttons is grounded in the existing builder-model fact, not a new one.
Both buttons are `.btn-white` (**asked explicitly to match** — one was
`.btn-white`/filled, the other `.btn-outline-white`/ghost, the same
mismatch already flagged and fixed once for the spectrum-split panel CTAs)
and both carry `.btn-arrow`: a `→` glyph hidden at `max-width:0; opacity:0`
slides/fades in on hover/focus-visible. A slow gradient pulse
(`.final::before`, two radial gradients, `9s ease-in-out infinite`) sits
between the fluid video layer and the readability scrim (`.final::after`)
— explicit z-index stack (video → pulse `z-index:1` → scrim `z-index:2` →
content `z-index:3`) so the pulse never washes out text contrast. Reduced
motion collapses the animation's duration to near-zero via the page's
existing global guard; since the pulse's `0%`/`100%` keyframes share the
same values, it settles cleanly on the resting frame rather than freezing
mid-cycle.

**`.final-quote` was removed** — asked explicitly. It briefly reused the
same testimonial quote above the headline; gone now, along with its CSS.

## Animation reference library

`Projet — Scroll Animation Library` (the user's markdown doc, supplied in
chat) is the source for the named effects. Implemented and **still live**:
Section Reveal on Scroll (#2), and **Fluid Flow Steps (#3), now used
twice** — the original in How It Works (restored with 4 steps, no rubric
content — see "5. How it works" above) and a second, differently-tuned
instance now driving Testimonials too (right-to-left pan instead of
diagonal, per-stop vertical offsets instead of one shared crossfade
position — see "6. Testimonials" above). **Testimonials Fluid Parallax
(#8) is gone** — it was the old carousel's `.t-bg` layer, removed along
with the rest of the carousel in the testimonials rebuild; the section's
motion now comes entirely from the Fluid-Flow-Steps-style scrub instead.
**Removed and staying removed**: Spectrum-to-Waveform Hero Handoff (#1, see
"1. Hero & call to action" above — the hero's new background image is a
still frame, not this effect) and Rubric Spectrum Bar (#7, moot with the
rubric gone). Not used: Waveform Proof Ticker (#4), Defense Spotlight (#9,
moot now the defense concept itself is gone — see "Copy framing").
**Audience Spectrum Toggle (#5)** — the nav's `.mode-switch` (see "Nav /
footer" above) started as a lighter-weight version of it (re-tint only)
and has since grown into the full thing: it now also rewrites hero and
How-it-works copy per mode, with its own crossfade transition. **CTA
Waveform Pulse (#6) is now partly used** — a slow gradient pulse on the
final CTA's background (see "Final CTA" above), simpler than the
library's original waveform concept but the same "slow pulse" idea.

**Every scroll-linked effect runs off one shared rAF-gated ticker** in
`landing.js` (`scrollUpdaters`), not its own listener. Enter/exit-only
effects use `IntersectionObserver` instead, since they don't need a
continuous progress value.

**The non-negotiable rule on this page: every effect renders its END STATE
when motion is off or JS never runs — it never just skips.** Verified: under
both `prefers-reduced-motion` and JS-disabled, all reveals, all five
testimonials, all counters, the How-it-works steps (collapsed to a plain
stacked list, all visible), and the mobile-only spectrum-split card reveal
all render at their final values.

## Auth / accounts (front end only)

`login.html` and `signup.html` are kept and still work. **They are front end
only — no credentials go anywhere.** Validation, error/pending states and the
fetch call are written; each form just needs its empty `data-endpoint`
attribute pointed at a real route. With no endpoint set the form says
accounts aren't connected yet rather than faking a success.

**Division of labour: this repo is front end / UI-UX only. The API and the
MongoDB layer are Andrei's (co-founder).** The full contract is in
`BACKEND-HANDOFF.md` — read that before touching the auth forms.

**The two pages are mirrored, not identical: `login.html` is image-left/
form-right; `signup.html` is image-right/form-left.** Asked and confirmed.
Both share the exact same `.auth-page{grid-template-columns:1fr 1fr}` /
`.auth-aside` / `.auth-main` markup and CSS in `assets/site.css` — nothing
in that CSS is order-dependent, so the mirroring is done purely by which
element (`<aside>` vs `<main>`) comes first in each file's DOM. Don't
"fix" this by making them consistent — the asymmetry is the point.

Both pages' logo now links to `index.html` (it pointed at the chooser, which
is archived). `signup.html` still reads `?role=` from the query string, which
is what the landing CTAs pass. Its `localStorage["projet:mode"]` fallback is
vestigial now that the chooser is gone — harmless, just never populated.

## Known issues / open tasks

1. **PLACEHOLDER CONTENT — the launch blocker.** Three things on the landing
   page are stand-ins and are marked as such in the HTML:
   - **The logo carousel** — asked and confirmed: generic, obviously-
     fictional company names (Northwind, Acme Labs, Vertex Studio, Meridian
     Co., Lumen Works, Cobalt & Co, Fieldstone, Anchorpoint), not real
     brands. An earlier pass used real names (Google, Apple, etc.) per the
     user's original phrasing ("e.g. Google, apple"); when asked directly
     whether to keep that or go generic, the user chose generic — zero
     trademark/false-clientele risk if this is ever shared or deployed
     before real partners exist. The strip is still labelled "Placeholder
     logos — pending real partners" rather than "trusted by". **Swap for
     real, permissioned partner logos before any public deploy.**
   - **Testimonials** — quotes are invented, attributed to roles only
     ("Hiring lead, early pilot"), never a named real person. Avatars are
     illustrated silhouettes (a clipped head-and-shoulders shape over a
     gradient, `assets/landing.css` `.t-avatar`) — asked and confirmed over
     gradient-initials or empty photo frames. Replace with real,
     permissioned quotes and portraits before launch.
   - **Featured challenge cards** — three sample briefs, not live listings.
2. **The countdown clock — built, into Featured Challenges, on a placeholder
   deadline.** Asked and confirmed: a "next challenge closes in" timer
   (`.ss-countdown` in `index.html`, ticking logic in `landing.js`) sits
   above the challenge cards. It counts down from a **relative** placeholder
   — `data-countdown-hours="144"` (144h = 6 days, matching the top card's
   "6 days left") computed from page-load time, not a fixed calendar date,
   since there's no live challenge data yet. The HTML pre-renders
   "06d 00h 00m 00s" so a no-js visitor sees a sane static value instead of
   nothing. Swap `data-countdown-hours` (or point it at a real deadline
   timestamp) once real challenge data exists. Distinct from the original
   "clock counting down to the next event" idea floated for the hero — that
   one is still not built, since there's still no real *event* date, only a
   per-challenge deadline concept.
3. **Superseded — both assets are back in use, the opposite of what this
   note used to say.** The hero background is `hero-visual.webp`, a
   compressed derivative of `assets/Logo Background 2.png` (see "1. Hero &
   call to action" above) — a still frame, not the removed scroll-linked
   handoff. **The same `hero-visual.webp` is also the Testimonials
   scroll-scrub background** now (see "6. Testimonials" above) — if
   `Logo Background 2.png` is ever re-exported, regenerating
   `hero-visual.webp` (`ffmpeg -q:v 82`) updates both sections at once.
   How it works loads `fluid-full.png` again as `.flow-fluid`'s scrubbed
   background, since the pinned Fluid Flow Steps mechanic came back (see
   "5. How it works" above); `fluid-full.png` is used directly, no
   derivative.
4. **No real backend/routing.** Static HTML/CSS/JS, no framework, no build
   step. `challenges.html` doesn't exist yet, so "Browse challenges" CTAs
   point at `#challenges` (the in-page section) or `signup.html`. The one
   exception is deliberate: `.ss-view-all` ("View all challenges →" under
   Featured challenges — see "3 + 4." above) links straight to
   `challenges.html`, since that's meant to become the real full-listing
   page the user described ("a separate page for all challenges") — it
   will 404 until that page is built.
5. **`assets/fluid_animation_3500ms.mp4` (18.7MB) is the raw master export**
   and is not referenced by any page. `assets/fluid-loop.mp4` (~1.1MB,
   `ffmpeg -vf scale=1280:-2 -an -crf 23`) is what ships (final CTA and
   testimonials background only now — not the hero). Re-run that same
   command if the animation is ever re-exported; never hand the raw export
   to a page.
6. **`spectrum.webp`'s per-bar `BAND_ZOOM` table is tied to the exact
   current image.** See "3 + 4. Featured challenges | Success stories"
   above — if this asset is ever re-exported or replaced, the 14
   `[zoom, offsetK]` pairs in `landing.js` need regenerating from the new
   file, or the wave will show black/misaligned bars again.

## Working conventions established so far

- Deck figures are used as-is — don't invent new stats or soften specific
  ones (the Hack & Hire pilot numbers, S$250/S$500). The rubric percentages
  aren't currently live copy at all (see "Copy framing" above) — don't
  reintroduce them without a fresh instruction to do so.
- Placeholder content is always **labelled** as placeholder rather than
  dressed up as real. No invented customer names presented as customers, no
  fake named people attached to invented quotes.
- Keep pages dependency-free static HTML/CSS/JS unless asked for a framework
  — nothing here uses React/Vue/build tooling.
- Brand accent orange is `#ff5b24` exactly (from the real Figma file, not
  eyeballed from a screenshot).
- Fonts load from Fontshare (Satoshi) and Google Fonts (JetBrains Mono) via
  `<link>` — no local font files.
- Any texture/photo asset pulled from Figma gets downloaded and committed as
  a local file (`assets/...`) — never a hardcoded
  `figma.com/api/mcp/asset/...` URL, since those expire in ~7 days.
- Every animation degrades to its end state under `prefers-reduced-motion`
  and with JS off. Nothing is ever gated behind a scroll effect that might
  not run.
- **Any front-end-only form** (auth forms, the footer's "get notified"
  capture) follows the same honesty rule: an empty `data-endpoint` makes it
  say the wiring is pending, never a faked success. Reuse this convention
  rather than inventing a new one for the next such form.
- **Mobile-only JS effects gate on `matchMedia`, not just CSS breakpoints**,
  and are kept in their own dedicated `IntersectionObserver`/listener
  rather than folded into a desktop mechanic — see the spectrum-split
  card reveal (`landing.js`) as the reference pattern. This keeps them from
  ever touching the desktop behaviour they're not meant to affect.
- **When a component uses two co-applied classes (e.g. `class="t-card
  t-stop"`), give the class that must win a compound selector
  (`.t-card.t-stop`), not a plain single-class one.** Two single-class
  rules of equal specificity fall back to source order, which is easy to
  get backwards by accident as a file grows — the Testimonials rebuild hit
  this twice in one component (see "6. Testimonials" above) before landing
  on this pattern. Fallback overrides (mobile/no-js/reduced-motion) need
  the same treatment, and if a JS-added state class (like `.is-active`) can
  still apply underneath a fallback, the fallback needs `!important` too,
  since a 3-class `.is-active` combination outranks a 2-class fallback
  selector regardless of where either is declared.
