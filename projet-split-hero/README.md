# Projet — Split-hero chooser prototype

A full-viewport landing screen that asks a visitor to pick a path — **Business**
or **Builder** — before anything else. The light-spectrum image is sliced into
a stack of horizontal bars running down the seam between the two panels;
hovering (or tapping, on touch) one panel grows it to 5/8 of the screen while
the bars shear away from that side in a staggered cascade, and the panel's
description copy fades/slides into view.

## Files

```
index.html      — markup for the nav + two panels
styles.css      — the split-panel mechanic, bar stripe, responsive/touch states
script.js       — builds the bar stack, hover/focus/touch wiring
```

The divisor image (`spectrum.webp`) lives at the repo-root `assets/` folder
and is shared with `projet-landing.html` — `styles.css` references it via
`../assets/spectrum.webp` rather than keeping its own copy.

Everything is dependency-free static HTML/CSS/JS — no build step. Open
`index.html` directly, or serve the folder with any static server:

```
npx serve .
```

## How the mechanic works

- `assets/spectrum.webp` bakes in 14 horizontal bands (matching `BAR_COUNT` in
  `script.js`) whose black/colour boundary follows a **slight curve**, not a
  straight diagonal — that curve is what makes the divisor read as an organic
  light-spectrum sweep rather than a rigid staircase. It's a generated
  placeholder standing in for the real Figma export (see the root
  `CLAUDE.md`, "Known issues" #2–4) — swap it for the real asset whenever
  that's available, keeping the same curved-envelope, 14-band structure so
  the bar mechanic still lines up.
- `script.js` builds `BAR_COUNT = 14` `.bar` divs inside `.stripe-inner`. Each
  bar shows one full-width horizontal slice of `spectrum.webp` via
  `background-position`, so at rest the stack reassembles into one
  continuous image.
- Hovering or focusing a `.panel` sets `data-hover="business"|"student"` on
  `#split`. The CSS reads that attribute to both grow the hovered panel's
  `flex-grow` (5:3 ratio — the hovered side reaches 5/8 of the screen) and
  shear every `.bar` sideways, away from the hovered side — each bar's
  amplitude follows a sine curve (bulging toward the middle bars) and its
  own `transition-delay`, so the motion cascades rather than moving as a
  single rigid block.
- `.panel-title`, `.panel-eyebrow`, and `.panel-cta` are always visible;
  `.panel-copy` (the descriptive sentence) is hidden at rest (`opacity:0`,
  offset down slightly) and only fades/slides into place on that panel's
  `:hover`/`:focus-within` — so the reveal itself is the payoff for engaging
  a side, not something you see for free at rest.
- Each panel is an `<a>`, so keyboard focus triggers the same expand state as
  hover — tab to a panel and it grows, same as hovering it.

## Touch / mobile behaviour

The desktop mechanic is hover-driven, and touch has no hover, so the mobile
build adapts rather than emulates:

- **Both panels show their copy outright**, and a **single tap navigates.**
  An earlier build intercepted the first tap to "preview" the panel; that
  reads as a dead tap on the one screen whose entire job is letting someone
  pick a side, and the hidden copy left an empty gap holding its place.
- **State is driven by the `data-hover` attribute on `#split`**, not bare
  `:hover`. Touch browsers emulate a sticky `:hover` that would otherwise
  leave one panel's copy stuck open after a tap. `:hover` still applies
  inside `@media (hover:hover)` as a no-JS fallback.
- **Keyboard focus is gated behind `:focus-visible`** (`keyboardFocused()`
  in `script.js`). Tapping a link also focuses it — without this guard the
  focus handler fired on tap and set state before the click handler ran.
- Below 760px the panels stack, and the band is **clipped and thinned** into
  a horizontal divider between them. The 90° rotation maps each bar's
  horizontal shear onto the screen's vertical axis, so bars still push away
  from the active side. Clipping matters: the bars are designed to fan past
  the seam into empty panel margin, and once stacked that overflow otherwise
  runs straight through the headline and CTA.
- A `max-height:560px` query trims type and band thickness for landscape
  phones.

## Known placeholders to swap before shipping

- **Navigation targets** — resolved. The two panels link to the real
  audience home pages, `../business.html` and `../builders.html` (paths
  are relative since this folder sits one level below the repo root).
  Update these if the pages ever move or a real router replaces the
  static-file layout.
- **Logo mark** — the nav logo is a small CSS-drawn circle standing in
  for the real Projet icon, so the prototype has zero external asset
  dependencies. Swap in the real exported logomark (SVG/PNG) whenever
  it's convenient.
- **Divisor image** — `assets/spectrum.webp` is a generated placeholder, not
  the real Figma export. Replace it with the actual light-spectrum asset
  when it's exported, keeping the 14-band curved structure described above.
- **Copy** — panel headline/body copy is a first pass; adjust freely,
  the layout accommodates longer or shorter copy on both sides.

## Accessibility notes already handled

- Panels are real links with `aria-label`s, reachable and triggerable by
  keyboard (`:focus-within` mirrors `:hover`).
- `prefers-reduced-motion: reduce` disables the bar cascade/shear and
  collapses transition durations.
- On touch devices (`hover: none`), the first tap previews the expanded
  panel instead of navigating immediately; a second tap (or tapping the
  CTA directly) follows the link.
