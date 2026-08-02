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

Full positioning language (headlines, stats, evidence citations, pricing
math) is already written into `projet-landing.html` — treat that file as
the source of truth for copy/voice, don't re-derive it from this summary.

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
Black. It exists in a Figma file (see below) in dark/white/orange variants.
Neither prototype in this folder currently embeds the *real* logo asset —
both use a small CSS-drawn circle as a placeholder to avoid depending on
Figma's temporary export URLs (see "Known issues" below). **Swapping in the
real logo file is an open task.**

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

## Copy source of truth — IMPORTANT, read before editing home-page copy

**The home pages are NOT written from the pitch deck.** The user explicitly
redirected this: home-page content comes from Andrei's existing landing app,
`https://github.com/AndreiYo037/projet-landing`, specifically
`src/lib/content.ts` (plus a little hardcoded copy in `src/components/Hero.tsx`).

That repo is a different owner, so `add_repo` refuses it (cross-tier). It is
public, though, and `git clone https://github.com/AndreiYo037/projet-landing.git`
works through the session's git proxy. The deployed site
(`projet-landing.vercel.app`) is **blocked** by this environment's network
policy — WebFetch, headless Chromium and curl all get a 403 at the gateway, so
clone the repo instead of trying to fetch the URL.

`tools-build-pages.py` at the repo root regenerates `business.html` and
`builders.html` from that copy. It is a one-shot generator, not a build step —
run it, commit the HTML, and the site stays dependency-free. Edit the generator
rather than the two HTML files directly, or the next run will overwrite you.

### What the product actually is (per that content)

Challenge-based talent discovery: a business **posts a challenge** from its
backlog, **students compete** on it, businesses **review real output instead of
resumes**, and top performers advance to interviews/internships. Tagline:
"Where real work is the strongest hiring signal."

Business model is `Pay to publish a challenge` for businesses and `Join free`
for students.

### Deck-era content that was REMOVED — do not reintroduce

The earlier build of these pages was written from the pitch deck and framed
the product around a **live 15-minute defense scored on a rubric**. None of
that exists in Andrei's content, so it was all cut from the home pages:

- the live defense / defense demo / rubric (Ownership 40% etc.)
- the Schmidt, Oh & Shaffer validity chart
- S$250 listing / S$500 unlock pricing
- Hack & Hire pilot traction (120+ builders, 7 companies, 10+ defenses, 2 hires)
  and the Block71 @ NUS proof strip

**Update: the per-audience FAQ was reintroduced (see `business.html` /
`builders.html` below), on explicit user confirmation, when Thi's wireframe
called for one in the nav's Resources dropdown.** Its content is new,
though — written from this page's own established copy (`MODEL_BIZ`/
`MODEL_STU`, the offers, `HOW`), not the deck-era rubric/pricing FAQ this
section originally described. Don't confuse the two if a future edit finds
old deck-FAQ copy lying around; that version stays removed.

Two things still carry the deck framing and were deliberately left alone —
**flag them rather than silently reconciling**: `projet-landing.html` (the
legacy "overview" page) and the "Who/what Projet is" section at the top of
this file.

**Terminology — resolved: "Builder", never "Students".** Andrei's content
said "Students" throughout; the user asked explicitly to use "Builder"
everywhere instead. Applied across the generator (mission line, how-it-works
copy, the business-model card heading, final-CTA headline, footer tagline),
the chooser, `login.html`, and the legacy overview page's traction stats.
The one place still saying "student" is intentional: `projet-split-hero`'s
internal `data-audience="student"` attribute / `.panel--student` class are
JS/CSS plumbing, not visible copy — `script.js` already maps that value to
`"builder"` before it ever reaches `localStorage` or the UI. If Andrei's
`content.ts` is re-pulled later, re-apply the student→builder swap; it isn't
upstream.

**Accent color — orange for business, blue for builder, one mechanism.**
Don't hand-patch a new component with `style="color:var(--blue)"` on the
builder page; that's exactly how `pain-card`/`offer-num`/`model-list` ended
up staying orange there while `eyebrow` and the hero accent-span (patched
per-instance) didn't. Instead: components read `var(--accent)`, which
`assets/site.css` defines as `var(--orange)` by default and overrides to
`var(--blue)` under `html.mode-builder`. `tools-build-pages.py` adds that
class to `<html>` for the builder page — that's the only place the mode is
set. Legacy-only sections still on `projet-landing.html` (defense, evidence,
pricing, comparison) intentionally keep `var(--orange)` directly, since that
page has no mode.

## Site architecture / user flow (decided)

The user flow is now wired end to end:

```
projet-split-hero/index.html   (the actual landing page / entry point)
        │  choose Business or Builder
        ├──► business.html     (dual-mode homepage, wireframe-based)
        └──► builders.html     (same page, generated in builder mode)

projet-landing.html is now a secondary "Overview" page (audience-agnostic,
reachable from either home page's footer / logo-adjacent link) — it's no
longer the primary entry point.
```

**`business.html` / `builders.html` are now built from Thi's hand-drawn
wireframe (July 2026), not the earlier problem-first Willo-style layout.**
The previous version (hero-opens-on-the-problem, proof strip, take-homes-
broke comparison) is archived at `archive/business-v1.html` /
`archive/builders-v1.html` for reference — do not resurrect it as the live
page. Section order top to bottom now: hero, logo strip, featured-
challenges teaser, problem statement + pain points, what we offer, how it
works (pinned scrub), testimonials, product-demo placeholder, business
model, final CTA. See "`business.html` / `builders.html`" below for the
detail on each new piece.

All three pages plus `projet-split-hero/` now share one stylesheet and one
script file: `assets/site.css` and `assets/site.js` (previously each page
carried its own copy of the same ~14KB of CSS — this was extracted once to
kill that duplication). Page-specific tweaks (e.g. the builder page's blue
accent overrides) live in a small inline `<style>` block in that page only.

### Mobile / responsive

All four pages are responsive and verified with no horizontal overflow from
320px up. Breakpoints in `assets/site.css`: **900px** (nav collapses to a
hamburger), **640px** (main phone layout), **480px / 420px / 359px** (fine
adjustments), and **760px** for `projet-split-hero`. Notable decisions:

- **Mobile nav.** Below 900px the inline links are replaced by a hamburger
  (`#navToggle`) opening `#mobileMenu`, which holds the section links plus
  the audience switch and CTAs. The primary CTA stays in the header bar down
  to 359px. Toggle logic is in `assets/site.js` (closes on link tap, Escape,
  and on resize past the breakpoint).
- **`.hero` / `.section` use longhand vertical padding.** They must *not*
  use the `padding: Xpx 0` shorthand: both are applied alongside `.wrap` on
  the same element, have equal specificity, and sit later in the file, so a
  shorthand silently zeroes `.wrap`'s horizontal padding and flattens every
  page against the viewport edge on mobile. This was a real (long-standing)
  bug — it was invisible on desktop only because `.wrap`'s `max-width`
  centred the content anyway.
- **Evidence chart** (`.bar-row`) restacks at 640px: its fixed 180px label
  column left the bar just 134px wide on a 390px screen, so the label moves
  to its own row above a full-width bar.
- **`projet-split-hero` on touch** shows both panels' description copy
  outright and navigates on a **single tap**, rather than reproducing the
  desktop hover-reveal as a two-tap preview. A first tap that only previews
  reads as a dead tap on the one screen whose whole job is choosing a side,
  and the hidden copy left an empty gap holding its place. Desktop keeps the
  hover reveal + 5/8 expand unchanged.
- **Hover state is driven by the `data-hover` attribute**, not bare `:hover`.
  Touch browsers emulate a sticky `:hover` that otherwise left one panel's
  copy stuck open. `:hover` survives only inside `@media (hover:hover)` as a
  no-JS fallback.
- **Keyboard focus is gated on `:focus-visible`** (`keyboardFocused()` in
  `projet-split-hero/script.js`). Tapping a link also focuses it, which used
  to set `data-hover` *before* the click handler ran — so the click saw
  "already previewed" and navigated immediately, meaning the touch preview
  never actually worked.
- The split-hero band is **clipped** (`overflow:hidden`) and thinned on
  mobile. Its bars are meant to fan past the seam into empty panel margin on
  desktop; once the panels stack, that same overflow ran straight through the
  headline and CTA.
- `.final-cta` has a **scrim** over the swirl texture — white copy vanished
  into the artwork's bright cream/orange passages, worst on mobile where the
  block is short enough to put the light part directly behind the headline.
- `[id]{scroll-margin-top:92px}` keeps in-page anchor targets from landing
  underneath the sticky header.

### `projet-landing.html`
A single-file marketing/overview page (static HTML/CSS/JS, no build step).
The "scroll story" version: hero, problem stats, take-homes-broke
comparison, 5-step how-it-works, an interactive defense rubric section
with animated bars, the Schmidt/Oh/Shaffer evidence chart, traction stats,
pricing cards, final CTA, footer. Content is drawn directly from the pitch
deck (`Projet_consultant` project files / uploaded pitch deck PDF),
upgraded from an earlier, more generic draft that lived at
`https://projet-landing.vercel.app/` (that URL is blocked by this
environment's network policy — CLAUDE-in-this-repo has never actually
fetched it; treat this file's content as the source of truth instead of
trying to diff against the old draft).

**Status**: Functionally complete as a secondary overview page. No longer
the primary entry point (see "Site architecture" above) — its hero now
offers two direct links ("I'm hiring" / "I'm building") into
`business.html` / `builders.html` instead of the old JS toggle that swapped
hero copy in place. The Figma-hosted favicon, logo mark, and hero/final-CTA
texture images have been swapped for local files (`assets/favicon.svg`, a
CSS-drawn `.logo-mark`, and `assets/spectrum.webp`) so the page no longer
depends on expiring Figma export URLs. The texture is a generated
placeholder standing in for the real fluid-swirl composite (see "Known
issues" #4) — swap it for the real export whenever that's available.

### `business.html` / `builders.html`
The single dual-mode homepage a visitor lands on after picking a path in
`projet-split-hero/` — one generator (`tools-build-pages.py`), two output
files (business/builder mode), built from Thi's hand-drawn wireframe. See
"Site architecture" above for the section order. Both are single, self-
contained HTML files that pull in `assets/site.css` and `assets/site.js` —
no page-specific build step.

**Nav dropdowns (Challenges / Resources).** Replace the old flat anchor
links above 900px. `.nav-dropdown` opens its `.nav-drop-panel` via plain
CSS `:hover`/`:focus-within` (works with JS off), with `site.js` layering
click-to-toggle + outside-click/Escape-to-close on top for touch and
explicit keyboard control — `nav()` in `tools-build-pages.py` builds both
the desktop dropdown markup and a separate flattened `mobile_links` list
for `#mobileMenu` (a floating panel doesn't make sense in the stacked
sheet). Challenges' "sort" links (All / Active / Newest / Most popular)
are decorative previews, not real filtering — `challenges.html` is still a
stub with no listing to filter, so nothing here promises functionality
that doesn't exist. Below 900px `.nav-dropdown{display:none;}` — the
mobile menu's flat links cover the same destinations.

**Logo strip.** No real customer logos exist yet, so `LOGOS` in
`tools-build-pages.py` is a list of placeholder chip labels ("Company",
"Studio", …), never invented company names. `.logo-track` contains that
list rendered twice back to back — translating it by exactly `-50%` via a
`26s linear infinite` CSS animation loops seamlessly with no JS. Paused
under `.no-js` / `.reduced-motion` and `prefers-reduced-motion`.

**Testimonials carousel.** Same placeholder-content rule as the logo strip
— quotes in `MODES[...]["testimonials"]` are attributed to a role only
("Hiring lead, early pilot"), never a named person or company, until real
ones exist. The carousel itself is a real, working native horizontal
scroller (`scroll-snap-type:x mandatory`) — the prev/next buttons in
`site.js` just call `scrollBy()` one card-width at a time; touch users can
already swipe it directly, so the buttons hide below 640px. Don't mistake
the placeholder copy for a reason the mechanic itself is fake — it isn't.

**Product demo placeholder.** No real demo video exists, so `#demo` is a
dark placeholder card (play-button glyph + "Product demo coming soon") —
deliberately *not* the hero's abstract fluid-swirl loop presented as if it
were a product demo, which would be misleading about what that asset
actually shows.

**Featured-challenges teaser moved earlier.** The `.challenges-teaser`
banner (see below) now sits right after the logo strip, matching the
wireframe's "Featured challenges (in the future)" placement — it used to
sit between "How it works" and "Business model." There's only one teaser
banner on the page; it was not duplicated in both places.

**The three problem-section pain points animate on scroll**
(`.pain-track` / `[data-pain-step]` in the markup, driven by the IIFE in
`assets/site.js`). A connecting vertical line runs down the left edge; a
fixed reference line at 55% of viewport height drives both the line's fill
height (continuous 0–100%, updated every scroll/resize via `requestAnimationFrame`)
and which point is "active" (a point activates once its vertical midpoint
crosses that line) — so scrolling down visibly emphasises point 1, then 2,
then 3 in sequence. Deliberately scroll+rAF rather than
`IntersectionObserver`: IO only reports enter/exit, not the continuous
progress value the line fill needs. `prefers-reduced-motion` and a `no-js`
fallback both show all three points active and the line full immediately —
there's no scroll-gated content that becomes permanently unreachable if JS
never runs. The active point doesn't just recolor — `.pain-item.is-active`
also grows (`h3` 19px→22px, plus `transform:scale(1.045)` on the whole item,
`transform-origin:left center` so it doesn't push sideways) so the emphasis
reads as physically larger, not just a color/opacity swap.

**Five more scroll effects run off one shared ticker in `assets/site.js`**
(a single `scroll`/`resize` listener gated by `requestAnimationFrame`, with
each effect registering an update function into `scrollUpdaters` rather than
adding its own listener):
- A thin accent-colored bar (`#scrollProgress`, fixed top) tracks overall
  page-scroll position.
- `header.nav` gets `.is-compact` past 48px of scroll (tighter padding +
  shadow) so the sticky header doesn't read as static.
- The hero visual (`.hero-visual .texture`) gets a small parallax
  `translateY`, capped so it does nothing once you've scrolled well past
  the hero. It's oversized to 112% (`inset:-6%`) so the drift never
  exposes an edge.
- The `.offer-grid` / `.model-grid` cards (`[data-stagger]` in the markup)
  fade/lift in one after another rather than all at once, via
  `IntersectionObserver` (one-shot, unlike the continuous pain-track).
- The hero-visual and final-CTA fluid-swirl `<video>` (see "Fluid animation
  video" below) plays/pauses itself based on scroll visibility via a
  dedicated `IntersectionObserver` (separate from `scrollUpdaters` since it
  only needs enter/exit, not continuous progress).

All of the above skip themselves under `prefers-reduced-motion` (the shared
`reducedMotion` flag at the top of `site.js`) by showing the end state
immediately — same rule as the pain-track: nothing becomes permanently
hidden if motion is disabled or JS doesn't run.

**Fluid animation video.** The hero-visual and final-CTA texture — previously
a static `<img src="assets/fluid.webp">` — is now a `<video>` (see
"Known issues" #4 for the transcode story). No `autoplay` attribute in the
markup; `site.js` plays each `[data-autoplay-video]` only while its section
is on-screen (via `IntersectionObserver`) and never does under
`prefers-reduced-motion`, so no-JS/reduced-motion visitors see the
`fluid.webp` poster frame exactly like the old static image.

**Challenges teaser.** A body-level CTA banner (`.challenges-teaser`, now
right after the logo strip — see "Featured-challenges teaser moved
earlier" above) links into `challenges.html`, so the challenges page is
reachable from the home page's content, not just its nav/footer. Copy is
per-audience (`m["teaser_h"]` / `m["teaser_p"]` in `tools-build-pages.py`'s
`MODES` dict); the button reuses `m["accent"]` so it's orange on
`business.html` and blue on `builders.html` like every other mode-aware
CTA.

**How it works is now a pinned scroll-scrub, not a static grid.**
`.how-pin` (`data-how-pin` in the markup, generated from the same `HOW`
list as before) is a 400vh-tall wrapper; `.how-pin-inner` sticks to the
viewport while the user scrolls through it, and a continuous scroll-progress
value — same shape as the pain-track math, off the shared ticker — decides
which of the four `.how-stage-step`s is active (large centered heading +
dot indicator). Collapses to a plain static stacked list under 900px / no-js
/ reduced-motion (`.how-pin` loses its height and `.how-pin-inner` its
sticky/flex positioning via CSS overrides) — sticky-scrubbing a narrow
phone viewport reads as broken, not immersive, and the fallback has to
reapply `.wrap`'s own side padding by hand since `.how-pin` sits outside
`.wrap` (it needs full-bleed width for the sticky mechanics). The
`#how-it-works` header section (the short "How it works" eyebrow+heading
lead-in right before the pin) is deliberately excluded from section
snapping (see below) — as its own snap point it sat only ~600px from the
pin's own start, a second target close enough to be redundant.

**Gentle section-to-section scroll snapping.** `html{scroll-snap-type:y
proximity}` plus `scroll-snap-align:start` on every `section.wrap` (and
`.how-pin`) — "proximity", not "mandatory", so it only nudges the scroll
position once a gesture has essentially stopped near a section boundary,
never fighting a fast wheel/trackpad scroll. Wrapped in
`@media (prefers-reduced-motion: no-preference)` since even proximity
snapping is still browser-driven motion. **This was tested against the
how-it-works pin specifically** (real multi-chunk wheel-scroll simulation,
not a single instant `scrollTo` jump — an earlier test using the latter
produced a false-positive "snap fights the pin" result caused by
`scroll-behavior:smooth` animating through an intermediate snap point, not
an actual conflict) and confirmed to coexist fine: scrolling all the way
through the pin in realistic discrete increments advances every step in
order with no skips or snap-backs, and dwelling near the pin's end (close
to `#business-model`'s own snap point) only produces a ~9px drift, not a
jump.

**Count-up numbers.** The hero card's mockup rows already contained real
numbers as plain text ("42 submissions", "Ranked top 8%") — `countify()` in
`tools-build-pages.py` wraps the first integer in each `card_rows` string
in `<span class="count-up" data-count-to="N">N</span>`, pre-rendered with
the real value so no-js/reduced-motion visitors just see the finished
number. With JS + motion on, `site.js` resets each one to 0 and animates it
up over ~900ms (eased) the first time it scrolls into view. Deliberately
didn't invent new stats for this — these are the pre-existing hero-card
mockup numbers, not marketing traction figures, so animating them doesn't
run afoul of the "don't invent stats" rule below.
- `.cand-left{display:flex; gap:10px;}`'s children must be exactly two
  elements (`.cand-rank` + a `.cand-desc` wrapper around the rest of the
  row). Letting `countify()`'s output sit as bare text + a `<span>` +
  more bare text directly inside `.cand-left` split the row into several
  anonymous flex items, and the flex `gap` landed *between* them too —
  "Ranked top 8%" rendered as "Ranked top  8  %" with visible gaps around
  the count-up span. Wrapping everything after `.cand-rank` in one
  `.cand-desc` span fixes it: only two flex items, gap applies once.

**Card tilt.** `.offer-card` / `.model-card` tilt a few degrees toward the
cursor on `mousemove`, restricted to `(hover: hover) and (pointer: fine)`
devices via `matchMedia` (touch has no hover, so this would just leave a
stuck tilt on whichever card was last tapped) and skipped under reduced
motion. Plain inline `transform`/`transition` set directly in `site.js`,
reset to `''` on `mouseleave` so it falls back to the CSS-driven
`translateY(0)` resting state from the stagger reveal.

### `challenges.html`
A deliberately empty stub, linked from both home pages' nav (a real link,
not an anchor), footer "Product" column, and now a body-level
`.challenges-teaser` banner too (see above). Its own small nav (no mode
switch, no section anchors — there's nothing on the page for them to point
at yet) plus a centered "coming soon" message and a CTA into `signup.html`.
Exists so the nav's browse-challenges path isn't a dead link; replace the
body with the real listing UI when that's built.

### `projet-split-hero/`
A second, separate prototype: a full-viewport "choose your path" landing
screen (Business vs. Builder) meant to sit *before* the marketing page in
the user journey. Self-contained, dependency-free static site, structured
for a direct GitHub commit (see its own `README.md` inside the folder for
mechanic details).

**Design history / status — read carefully, this is mid-iteration:**

1. **First version** (superseded): two flex panels with a shared
   `position: fixed` background image behind both, panel width animating
   50/50 → 66/33 on hover via `flex-grow`, plus a cursor-parallax shift on
   the backdrop. User confirmed the proportions/structure were right but
   the *visual design* was wrong.
2. **Current version** (what's in this folder now): the light-spectrum
   image is broken into a vertical stack of horizontal **bars** running
   down the seam *between* the two panels (not as a shared full-bleed
   backdrop anymore). On hover/focus of a panel, the bars shear
   horizontally *away* from the hovered side (`translateX`), each bar
   offset by a different amplitude (bulges toward the middle bars, via a
   sine curve) and a staggered `transition-delay` per bar index, so the
   motion reads as a cascade/ripple rather than a rigid block sliding.
   The hovered panel's `flex-grow` increases simultaneously, so the effect
   reads as "the bars fan open and the chosen side gets bigger."
   - `index.html` and `styles.css` for this version were written and are
     believed correct/current.
   - `script.js` was rewritten in the same pass to: generate the bar
     elements (`BAR_COUNT = 14`, sine-curve amplitude, staggered delay),
     wire `mouseenter`/`mouseleave`/`focus`/`blur` on each `.panel` to set
     `data-hover="business"|"student"` on `#split` (which the CSS reads to
     drive both the panel `flex-grow` and the bar `transform`), and retain
     touch handling (first tap previews via the same `data-hover`
     mechanism, second tap or tapping the CTA text navigates).
   - **Visually verified**: the divisor image (`assets/spectrum.jpg`) bakes
     in 14 bands (matching `BAR_COUNT`) whose black/colour boundary follows
     a slight curve rather than a straight diagonal — the user flagged that
     the straight-line staircase looked wrong and asked for the curve, so
     the asset generation was corrected (power-curve envelope, `t ** 1.55`)
     before it was committed. Re-check in a live browser still worth doing
     for cascade timing/amplitude feel, but the asset itself is confirmed
     correct.
   - The mobile/touch breakpoint logic in `styles.css` (`@media
     (max-width:760px)`) rotates the band 90° for the stacked mobile
     layout — carried over from the previous design, double check it still
     reads well with the new curved asset.
3. **Description text now hides on the seam side, revealed by the retreating
   spectrum, not a plain fade-in-place.** Each panel's content is split into
   two pieces: `.panel-content` (the "For" eyebrow + big title) stays on the
   panel's *outer* edge exactly where it always was; `.panel-copy` +
   `.panel-cta` are now wrapped in a new `.panel-reveal` block pinned to the
   panel's *inner*, seam-side edge — right where the bars rest. `.panel`
   became `display:flex; justify-content:space-between` with these two
   blocks as its children (order flipped via CSS `order` for the student
   panel, so its header still lands on its own outer/right edge). At rest
   `.panel-reveal` is `clip-path:inset()`-collapsed to zero width *against
   the seam* and `opacity:0`; on hover/focus it un-clips in the same
   direction the bars shear away (business un-clips left-to-right, student
   right-to-left) over the same `.85s` duration as the bar transform, so the
   retreating spectrum reads as physically uncovering the text rather than
   two unrelated animations happening to overlap. Verified mid-transition
   (250ms into the 850ms hover transition) that the text is visibly clipped
   exactly at the bars' current position, confirming the sync.
   - `min-width:0` on both `.panel-content` and `.panel-reveal` was
     necessary — without it the flex items don't shrink when a panel is
     squeezed to its 3/8 hover-away width, and the far panel's title clips
     against the *screen* edge instead of wrapping/shrinking.
   - Touch (`@media (hover:none)`) and mobile (`@media (max-width:760px)`)
     both still show `.panel-reveal` outright rather than clip-hidden — the
     seam-side positioning is a desktop-hover-only refinement; stacked
     mobile panels reset `.panel` to `flex-direction:column` and cancel the
     `order` flip, back to a plain top-to-bottom read.
   - Reduced motion snaps `.panel-reveal`'s transition to `.001ms` (same
     treatment as the bars), rather than forcing it permanently visible —
     it's still reachable via hover/focus regardless of motion preference,
     unlike the scroll-gated content on the home pages, so the "never
     permanently hide content" rule doesn't apply the same way here.

## Auth / accounts (front end only)

`login.html` and `signup.html` exist and are reachable from every content
page's nav ("Log in" + the primary CTA, which now points at
`signup.html?role=…`). **They are front end only — no credentials go
anywhere.** Validation, error/pending states and the fetch call are all
written; each form just needs its empty `data-endpoint` attribute pointed at
a real route. With no endpoint set the form says accounts aren't connected
yet rather than faking a success.

**Division of labour: this repo is front end / UI-UX only. The API and the
MongoDB layer are Andrei's (co-founder).** The full contract — request
bodies, response shapes, how `role` is resolved, and what still needs a
decision (sessions, password reset, CSRF) — is in `BACKEND-HANDOFF.md`.
Read that before touching the auth forms.

The split-hero chooser writes the chosen side to
`localStorage["projet:mode"]`, which pre-selects the role on the signup form
for returning visitors.

## Known issues / open tasks

1. **`projet-split-hero` visual check — mostly done.** The bar cascade and
   the curved divisor asset have been generated and wired up; still worth
   opening it in a browser (`npx serve .` from inside that folder, or just
   open `index.html` directly) to check cascade timing/amplitude feel and
   the mobile rotation. Tune `BAR_COUNT`, the amplitude curve, and the
   per-bar delay in `script.js` to taste.
2. **Resolved.** The user pushed the real logo exports to `assets/`
   (`Logo Full Black/White/Orange.png`, `Logo 3 V2*.png`, `Logo O Alone.png`,
   `Logo Background*.png`, `Test.png`). Trimmed, resized web copies are what
   pages reference: **`assets/logo-dark.png`** on light backgrounds and
   **`assets/logo-white.png`** on dark ones (chooser, auth asides), via
   `.logo-img`. Favicons come from the icon mark — `favicon.ico`,
   `favicon-32.png`, `apple-touch-icon.png`. `.logo-mark` / `.logo-word` are
   still in the CSS purely as a no-image fallback; nothing renders them.
3. **Resolved.** Favicon, logo mark, and hero/final-CTA texture all point
   at local files instead of expiring Figma URLs, and (see #4) the
   hero/final-CTA texture is now the real fluid-swirl composite rather
   than a placeholder.
4. **Resolved.** The user exported the real assets directly into
   `assets/`: `official-spectrum.png` (the real diagonal light-spectrum
   stripe) and `fluid-full.png` (the composited background+foreground
   swirl — `fluid-foreground.png` is also there for reference, showing the
   flat corners the user described before compositing). Optimized `.webp`
   derivatives of both are what's actually referenced from HTML/CSS:
   `assets/spectrum.webp` (used by `projet-split-hero`'s bar divisor) and
   `assets/fluid.webp` (used as the `<video poster>` / no-video fallback for
   the hero-visual/final-CTA texture — see below). The user later replaced
   the original animation export with a shorter one, `assets/
   fluid_animation_3500ms.mp4` (3.5s, but 4K/42Mbps/18.7MB straight out of
   the export — far too heavy to ship as-is for a looping background). That
   source file is kept in `assets/` as the master; **`assets/fluid-loop.mp4`**
   (transcoded via ffmpeg — `scale=1280:-2`, audio stripped, h264 crf 23 —
   down to ~1.1MB) is what pages actually reference. Re-run the same ffmpeg
   command against a new source export if the animation is ever swapped
   again; don't hand the raw export straight to a page.
   `business.html`/`builders.html` hero-visual and final-CTA now render
   `<video class="texture" muted loop playsinline preload="none"
   poster="assets/fluid.webp" data-autoplay-video><source
   src="assets/fluid-loop.mp4" type="video/mp4"></video>` (generated from
   the `FLUID_VIDEO` constant in `tools-build-pages.py`, not hand-edited).
   Deliberately **no `autoplay` attribute in the markup** — `assets/site.js`
   plays/pauses each `[data-autoplay-video]` via `IntersectionObserver`
   (only decoding the loop while its section is on screen) and skips this
   entirely under `prefers-reduced-motion`, so no-JS and reduced-motion
   visitors just see the static `fluid.webp` poster frame, exactly like the
   old `<img>` did. `login.html`/`signup.html`'s `auth-aside` still uses the
   plain `fluid.webp` image (not this video) — not part of this pass.
5. **Resolved.** `projet-split-hero`'s panels now link to `business.html`
   and `builders.html` (relative paths, `../business.html` /
   `../builders.html` from inside the `projet-split-hero/` folder) — real
   audience-specific home pages, not placeholder routes. See "Site
   architecture / user flow" above for the full picture.
6. **No real backend/routing exists.** Everything so far is static
   HTML/CSS/JS prototypes with no framework, no build step, and no actual
   page-to-page navigation implemented.
7. **Flagging, not silently reconciling: the wireframe's Resources dropdown
   listed "FAQs," which was deliberately dropped.** An earlier, explicit
   decision in this file (see "Copy source of truth" above) says the
   per-audience FAQ from the deck-era design should **not** be reintroduced.
   The new nav's Resources dropdown ships with How it works / Testimonials /
   Projects showcase / Contact only — no FAQ link, no FAQ section — pending
   an explicit call from the user on whether to reintroduce one now that
   the ask comes from a different source (a wireframe, not the deck).
8. **Content still needing the real thing, clearly marked as placeholder in
   the interim (never fabricated as if real):** the logo strip (generic
   chip labels, no invented company names), the testimonials (quotes
   attributed to a role only — "Hiring lead, early pilot" — never a named
   person/company), and the product-demo section (an explicit "coming
   soon" card, not the hero's abstract fluid loop repurposed as if it were
   a demo). Swap each in once real content exists; the surrounding
   mechanics (marquee loop, carousel, section layout) don't need to change.

## Working conventions established so far

- Copy is written directly from the pitch deck's actual numbers/claims —
  don't invent new stats or soften specific figures (S$250/S$500, the
  rubric percentages, the Schmidt/Oh/Shaffer validity numbers, etc.).
- Keep new pages dependency-free static HTML/CSS/JS unless the user asks
  for a framework — nothing here uses React/Vue/build tooling yet.
- Brand accent orange is `#ff5b24` exactly (confirmed from the real Figma
  file, not eyeballed from a screenshot).
- Fonts are loaded from Fontshare (Satoshi) and Google Fonts (JetBrains
  Mono) via `<link>` tags — no local font files yet.
- Any texture/photo asset pulled from Figma gets downloaded and committed
  as a local file (`/assets/...`) — never a hardcoded `figma.com/api/mcp/asset/...`
  URL, since those expire in ~7 days.
