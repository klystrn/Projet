---
name: Projet
description: Hiring on proof, not paper — a two-audience Singapore startup landing page where a single accent color signals which side (builder or company) is speaking.
colors:
  signal: "#ff5b24"
  signal-deep: "#c73e10"
  current: "#2f6bff"
  current-deep: "#1d4fd6"
  spectrum-violet: "#7a3f8f"
  ink: "#14130f"
  ink-soft: "#3a382f"
  paper: "#ffffff"
  paper-warm: "#f5f4ef"
  hairline: "#e6e3da"
  muted: "#726d5f"
  muted-large: "#8f8874"
typography:
  display:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2.625rem, 6.4vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.75rem, 3.6vw, 3.25rem)"
    fontWeight: 900
    lineHeight: 1.03
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14.5px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "11.5px"
    fontWeight: 600
    letterSpacing: "0.14em"
rounded:
  pill: "999px"
  sm: "13px"
  md: "16px"
  lg: "20px"
  xl: "26px"
  xxl: "28px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  2xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "13px 24px"
  button-primary-hover:
    backgroundColor: "{colors.signal}"
    textColor: "#ffffff"
  button-accent:
    backgroundColor: "{colors.signal}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "13px 24px"
  button-accent-hover:
    backgroundColor: "{colors.signal-deep}"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "13px 24px"
  card-testimonial:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "28px 26px"
  card-mini:
    backgroundColor: "rgba(255,255,255,0.09)"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "14px 16px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 13px"
  badge:
    backgroundColor: "rgba(47,107,255,0.12)"
    textColor: "{colors.current-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 9px"
---

# Design System: Projet

## Overview

**Creative North Star: "Signal Flare"**

Projet's whole surface is built around one idea: a single warm accent burning against a calm, mostly-neutral field, and that flare only ever means one thing — real activity, happening right now. The live-status pulse on the hero card, the countdown ticking down to a challenge deadline, the recycling logo and testimonial marquees, the shear of the light-spectrum wave as a visitor hovers between "Featured challenges" and "Success stories" — none of it is ambient decoration. Every moving element on the page is standing in for the same claim the copy makes in words: that proof is live and ongoing, not a static portfolio.

The system carries a second, cooler signal alongside the first: builders and students read the page in Signal orange, companies read it in Current blue, and the accent color itself is the audience switch. This is not two different designs pretending to be one — it's one calm, confident-startup shell (bold black-on-white type, real stated numbers, no soft SaaS gradients or stock illustration standing in for substance) that relabels its own accent depending on who's looking. The spectrum gradient bridging orange to blue — through a middle violet — appears everywhere a designer might otherwise reach for a divider: the hero headline, the footer's top edge, the seam of the light-spectrum wave. It's the visual proof that the two audiences are joined by one process, not two separate products bolted together.

Density is generous, not dense — this is a persuade-mode marketing surface, not a dashboard, and it gives its stats, cards, and CTAs room to breathe. Nothing renders in hard corners, and nothing sits completely still without a reason: every interactive control confirms itself with a lift, a color shift, or a sliding glyph the instant it's touched.

**Key Characteristics:**
- One accent lit against a mostly-neutral (ink/paper) field, never two accents competing for attention on the same surface
- The accent itself carries meaning — it names which audience is currently being addressed
- Motion is evidentiary, not decorative: it always stands in for "this is live, this is real work happening now"
- Confident, plainly-stated startup tone: bold headlines, real numbers, no hedge-everything softness
- Every interactive element visibly responds to hover/focus — nothing is static once touched

## Colors

The palette is two accents and a warm-neutral field: nothing else competes for the eye except when the two accents deliberately meet in the connecting gradient.

### Primary
- **Signal** (`#ff5b24`): The builder/student accent and the page's default accent color. Used on primary CTAs in builder mode, the live-pulse dot, the hero card's rank markers, the mode-switch pill, eyebrow dots, and the "For students" nav toggle. Reads as urgent and warm — the color of something happening right now.
- **Signal Deep** (`#c73e10`): Hover/active state of Signal, and also the resting color of small mono eyebrow text/dots on paper — the base Signal hue only hits ~3.1:1 contrast at that size, which fails WCAG AA; Signal Deep hits 5.09:1.

### Secondary
- **Current** (`#2f6bff`): The company accent. Overrides Signal site-wide the moment `data-audience="business"` is set — CTAs, the mode-switch pill, badges, and the "For companies" nav toggle all re-tint to Current. Cooler and steadier than Signal on purpose: it reads as trust and process rather than urgency.
- **Current Deep** (`#1d4fd6`): Hover/active state of Current, mirroring Signal Deep's role on the other side of the toggle — including the same eyebrow-text contrast fix (6.68:1 on paper).

### Tertiary
- **Spectrum Violet** (`#7a3f8f`): Never a control color — it only ever appears as the midpoint in a Signal→Violet→Current gradient (the hero headline's gradient word, the footer's top accent edge, the light-spectrum wave's seam). It exists purely to make the bridge between the two accents read as one continuous spectrum rather than a hard cut.

### Neutral
- **Ink** (`#14130f`): Primary text color and the fill for dark surfaces (final CTA background, primary/ghost buttons at rest).
- **Ink Soft** (`#3a382f`): Secondary/body text — sub-headlines, descriptive copy, nav links at rest.
- **Paper** (`#ffffff`): The default page and card background.
- **Paper Warm** (`#f5f4ef`): A warmer off-white reserved for sections that need to feel calmer than pure white — the testimonial wall, the mode-switch track, footer.
- **Hairline** (`#e6e3da`): The only border color on light surfaces — dividers, card outlines, input borders at rest.
- **Muted Label** (`#726d5f`): The color of every small mono caption — stat captions, footer labels, testimonial role lines. Now a real CSS custom property (`--muted`); darkened from an earlier `#9c988c` that failed WCAG AA (2.6-2.9:1) at the 10-12.5px sizes it's used at — this passes 5.16:1 on paper / 4.69:1 on paper-warm.
- **Muted Label Large** (`#8f8874`): The placeholder-logo marquee's wordmark color (`--muted-large`) — 23px/900-weight text qualifies for the large-text 3:1 threshold rather than the 4.5:1 small-text one, so it's darkened less than Muted Label.

### Named Rules
**The Two-Signal Rule.** Only Signal or Current is active as the page's accent at any moment — never both, and a surface never lets orange and blue compete as two live CTAs. The one deliberate exception is the light-spectrum wave's two panel buttons ("Sign up to compete" / "Post a challenge"), which are pinned to their literal side color regardless of audience mode, because their job is to label which half of the split they belong to, not to reflect who's currently browsing.

## Typography

**Display Font:** Satoshi (with -apple-system, BlinkMacSystemFont, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (monospace fallback)

**Character:** Satoshi at heavy weight (900) carries every headline with a tight, confident, slightly compressed feel (`-0.02em` letter-spacing); JetBrains Mono at small sizes and wide tracking (`0.14em`+) marks anything that's a label, a stat, or a status — the pairing reads as "bold startup voice, backed by real data," not decoration on top of decoration.

### Hierarchy
- **Display** (900, `clamp(42px, 6.4vw, 72px)`, line-height 1.05): The H1 only. Capped at 72px rather than the type scale's natural ceiling because the builder/student headline is longer than the business one and was wrapping past two lines at a larger max.
- **Headline** (900, `clamp(28px, 3.6vw, 52px)`, line-height ~1.03): Section H2s (How it works, Featured challenges/Success stories, Testimonials, Final CTA).
- **Title** (700, 14.5px, line-height 1.2): Card and component titles — testimonial names, challenge-card titles, hero-card headings.
- **Body** (400–500, 16–18.5px, line-height 1.55–1.6, ~34–52ch max width): Hero sub-copy, section ledes, testimonial quotes.
- **Label** (600–700, 10–12.5px, letter-spacing 0.06em–0.16em, uppercase, JetBrains Mono): Eyebrows, nav mono data, badges, stat captions, countdown digits.

### Named Rules
**The Mono-Label Rule.** Any small-caps or label-scale text — eyebrows, badges, nav toggle labels, stat captions, countdown digits — is always set in JetBrains Mono, never Satoshi. It's the page's dedicated typeface for "this is data or status," distinct from Satoshi's role carrying voice and headlines.

## Layout

The page is a single scrolling document (`max-width: 1240px`, `padding: 0 32px` down to `20px` under 640px) built from full-bleed sections rather than a persistent grid — each section (hero, logo marquee, light-spectrum split, how-it-works, testimonials, final CTA) owns its own internal layout and background treatment. Section padding is generous and consistent: `96px` top/bottom on desktop, collapsing to `64px` under 640px.

Two sections break the single-column flow deliberately: the hero uses a `1.08fr / .92fr` two-column grid (collapsing to one column under 980px), and the light-spectrum split is a sticky-pinned, horizontally-split stage that only exists above 900px — below that breakpoint it unwinds into two full-width stacked panels with the band rotated into a horizontal divider. Nothing on the page is ever hidden outright at a breakpoint; scroll-pinned and hover-driven mechanics always collapse to a plain stacked, fully-visible list rather than disappearing.

## Elevation & Depth

The system is layered, not flat and not heavily skeuomorphic: most of the page (nav, footer, running text) sits with no shadow at all, and depth is reserved for a specific set of "floating" elements — the hero's live-status card, testimonial cards, the light-spectrum split's mini cards, and the compacted nav bar. Shadows are soft and diffused (14–34px blur radius, low opacity, always with a negative spread to keep the shadow tucked close to its source rather than smearing outward), never a hard drop shadow. Buttons carry no shadow at rest or on hover at all — their interactivity is signaled by a translateY lift instead (see the Named Rule below), keeping shadow reserved purely for surface separation, not for interaction feedback.

### Shadow Vocabulary
- **Card ambient** (`box-shadow: 0 14px 40px -20px rgba(20,19,15,.22)`): Resting elevation for light-surface cards (testimonial wall).
- **Floating hero card** (`box-shadow: 0 24px 54px -20px rgba(0,0,0,.65)`): The glass hero-status card floating over the hero visual.
- **Visual frame** (`box-shadow: 0 34px 80px -34px rgba(20,19,15,.55)`): The hero image frame itself, separating it from the page behind it.
- **Compact nav** (`box-shadow: 0 8px 26px -20px rgba(20,19,15,.3)`): Applied only once the nav has scrolled past 48px and gone compact — a flat sticky header with zero visual change on scroll reads as static.
- **Mini-card hover** (`box-shadow: 0 14px 30px -16px rgba(0,0,0,.55)`): Light-spectrum split's featured-challenge cards, on hover only.

### Named Rules
**The Motion-Over-Shadow Rule.** Buttons never change shadow on hover — they lift (`translateY(-2px)`) instead. Shadow answers "is this surface floating above another," motion answers "did you just interact with this."

## Shapes

Every visible rectangle on the page rounds — there is no hard 0px corner anywhere in the system. Radius scales with a component's size and weight: interactive controls (buttons, badges, chips, inputs, the mode-switch track) are always full pill (`999px`), while containers round more generously as they grow — `13px` for compact mini-cards, `16px` for the hero-status card, `20px` for testimonial cards, up to `26–28px` for the largest hero and final-CTA frames. Borders are hairline (`1px`, `var(--line)` / `#e6e3da`) on light surfaces and translucent white (`rgba(255,255,255,.15–.4)`) on dark or glass surfaces — never a heavy or colored border.

### Named Rules
**The No-Hard-Corner Rule.** Nothing in the system ships a 0px corner. The only question is how generous the round is, never whether to round at all.

## Components

Every interactive component is pill-shaped and always visibly in motion — buttons lift, links grow underlines or reveal an arrow glyph, badges and cards shift color or position on hover/focus. Nothing renders as a dead, static control.

### Buttons
- **Shape:** Full pill (`border-radius: 999px`), `13px 24px` padding, `14.5px` / 700-weight label text.
- **Primary** (`.btn-primary`): Ink (`#14130f`) background, white text; hovers to Signal orange.
- **Accent** (`.btn-orange` / `.btn-solid-orange` / `.btn-solid-blue`): Filled with the current accent (Signal or Current, or a side-fixed color on the light-spectrum split's two panel CTAs); hovers to that accent's deep variant.
- **Ghost / White:** Transparent-on-light or white-fill variants used on dark backgrounds (final CTA, footer notify) — same pill shape and hover-lift, differing only in fill.
- **Hover / Focus:** All variants share a `translateY(-2px)` lift (never a shadow change). Keyboard focus adds a universal two-tone ring (`box-shadow: 0 0 0 2px paper, 0 0 0 4px ink`) instead of the browser default outline — a light-then-dark pair so at least one ring is visible whether the button sits on a light or dark section, without needing per-variant color-matching. `.btn-arrow` variants additionally reveal a `→` glyph that slides in from zero width — used on the final CTA and footer links.

### Cards / Containers
- **Corner Style:** `13px` (light-spectrum mini cards) to `20px` (testimonial cards) to `26–28px` (hero visual, final CTA).
- **Background:** White (`#fff`) on light sections; translucent white (`rgba(255,255,255,.07–.16)` with `backdrop-filter: blur`) on dark sections.
- **Shadow Strategy:** See Elevation & Depth — soft ambient ~14–40px blur, negative spread.
- **Border:** Hairline on light cards where present; translucent white border (`1px`) on glass/dark cards.
- **Internal Padding:** `14–16px` for compact cards, `28px 26px` for testimonial cards.

### Inputs / Fields
- **Style:** Full pill (`999px` radius), `1px` hairline border, white background, `10px 13px` padding.
- **Focus:** Border shifts to the current accent color; no glow or ring.
- **Error:** Border shifts to the fail-red (`#c73e10`, shared with Signal Deep); an inline error line appears below the field.

### Navigation
- Sticky header, translucent white with backdrop blur, becomes visibly "compact" (tighter padding, a hairline border, and the Compact-nav shadow) once scrolled past 48px. Links carry a bottom-border sweep on hover that fills from 0 to 100% width; the section currently in view keeps that same underline permanently via an `is-current` class, driven by scroll position rather than hover.

### Audience Mode Toggle (signature component)
A pill-track toggle beside the logo with a sliding indicator pill behind whichever option is active (rather than each option independently toggling its own fill). The indicator's color and position both animate (`.32s`) between Signal-orange/left ("For students," the default) and Current-blue/right ("For companies"). Selecting an option re-tints the page's `--accent` custom property site-wide and cross-fades every audience-aware copy block (`opacity → swap innerHTML → opacity`, 160ms) rather than snapping the text instantly.

## Do's and Don'ts

### Do:
- **Do** let the accent color (`--accent`) name the audience — never hardcode Signal or Current onto a control that should track the current mode.
- **Do** pair every hover/focus state with visible motion (lift, underline sweep, arrow reveal, color shift) — a static default-only control reads as dead.
- **Do** round every corner — pill for controls, 13–28px for containers, scaled to size.
- **Do** set any label-scale text (eyebrows, badges, stats, captions) in JetBrains Mono, uppercase, wide tracking.
- **Do** treat scroll-linked and hover-driven motion as enhancement only — every effect must render its end state under `prefers-reduced-motion` or with JavaScript disabled, never disappear.

### Don't:
- **Don't** run Signal and Current as two live, competing CTAs on the same surface outside the light-spectrum split's side-fixed panel buttons.
- **Don't** apply a shadow change as a button's hover feedback — use the `translateY(-2px)` lift instead.
- **Don't** revert Muted Label to a lighter value than `#726d5f` (or Muted Label Large below `#8f8874`) — both were darkened specifically to clear WCAG AA at the small sizes they're used at; a lighter shade reintroduces the contrast failure this fixed.
- **Don't** apply the base Signal or Current hue directly to small text (eyebrows, labels) — use Signal Deep / Current Deep instead; the base hues fail WCAG AA at those sizes.
- **Don't** introduce a third accent hue. Spectrum Violet exists only as a gradient midpoint, never as a control fill.
