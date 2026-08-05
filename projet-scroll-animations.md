# Projet — Scroll Animation Library

## How to use this file (Claude Code)

This document is a reference library of scroll/interaction animations for the Projet landing page. Each animation has a **bolded title** — when a prompt references a title (e.g. "add the **Spectrum-to-Waveform Hero Handoff** to the hero"), find that section below and implement the HTML/CSS/JS pattern in the context of the actual page structure, adapting selectors/class names to match the existing markup rather than pasting verbatim.

All code is vanilla HTML/CSS/JS — no external libraries required. Wire animations into the existing `projet-landing.html` structure; don't create a parallel page unless asked.

**Shared conventions used throughout:**
- Asset paths are written as `/assets/[filename]` — update to match wherever images actually live in the project.
- All animations must respect `prefers-reduced-motion: reduce` (see [Global Setup](#global-setup) below) — wrap or gate every animation so it degrades to a simple fade or no-op.
- Use `IntersectionObserver` for anything scroll-triggered rather than scroll event listeners, except where a continuous scroll-linked effect (like parallax) genuinely requires one — those are marked accordingly.
- CSS custom properties (`--variable-name`) are used for anything themeable (colors, offsets) so effects can be recolored without touching JS.

---

## Quick Reference

| Animation Title | Used In | Primary Asset(s) |
|---|---|---|
| **Spectrum-to-Waveform Hero Handoff** | Hero → Logo Carousel transition | `official-spectrum.png`, `Logo_Background_2.png` |
| **Section Reveal on Scroll** | Every section (universal) | none |
| **Fluid Flow Steps** | How It Works | `fluid-full.png` |
| **Waveform Proof Ticker** | Why This Works / validation stats | `Logo_Background_2.png` (style reference) |
| **Audience Spectrum Toggle** | Nav bar (Companies/Builders toggle) | `official-spectrum.png` (color reference) |
| **CTA Waveform Pulse** | All primary CTA buttons | `Logo_Background_2.png` |
| **Rubric Spectrum Bar** | How It Works — scoring step | `official-spectrum.png` (color reference) |
| **Testimonials Fluid Parallax** | Testimonials section | `fluid-foreground.png` |
| **Defense Spotlight** | Live-defense moment / featured testimonial | `Logo_Background_4.png` |

---

## Asset Manifest

| Filename | Description | Character |
|---|---|---|
| `official-spectrum.png` | Horizontal orange-to-blue striped color band | Transparency, full spectrum, calm |
| `Logo_Background_2.png` | Dotted/pixel wave pattern, glowing orange S-curve on dark bg | Live signal, waveform, proof-in-motion |
| `Logo_Background_4.png` | Radial orange spotlight cone on black | Focus, single subject, stage lighting |
| `fluid-foreground.png` | Purple/orange fluid ribbon, lots of negative (white) space | Lightweight, layerable, foreground accent |
| `fluid-full.png` | Purple/orange fluid ribbon, full-bleed, no negative space | Rich background, full immersion |

---

## Global Setup

Add this once, site-wide, before any animation code:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```javascript
// Global flag other scripts can check before running JS-driven animation
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

---

## 1. Spectrum-to-Waveform Hero Handoff

**Purpose:** Hero opens on the spectrum image (full transparency, nothing hidden). As the user scrolls past the hero, it crossfades into the dotted waveform (live proof, signal, motion) — visually enacting "we go from transparent to proven" as the handoff into the rest of the page.

**Used in:** Hero section, triggered on first scroll.

**Assets:** `official-spectrum.png`, `Logo_Background_2.png`

```html
<section class="hero">
  <div class="hero-content">
    <!-- existing hero copy / CTAs -->
  </div>
</section>
```

```css
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/assets/official-spectrum.png');
  background-size: cover;
  background-position: center;
  opacity: 1;
  transition: opacity 0.6s ease;
  z-index: 0;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/assets/Logo_Background_2.png');
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.6s ease;
  z-index: 0;
}

.hero.faded::before { opacity: 0; }
.hero.faded::after { opacity: 1; }

.hero-content {
  position: relative;
  z-index: 1;
}
```

```javascript
const hero = document.querySelector('.hero');
let heroFaded = false;

window.addEventListener('scroll', () => {
  if (!heroFaded && window.scrollY > 100) {
    hero.classList.add('faded');
    heroFaded = true;
  } else if (heroFaded && window.scrollY <= 100) {
    hero.classList.remove('faded');
    heroFaded = false;
  }
});
```

**Notes:** Keep the toggle threshold (100px) low so the handoff reads as immediate, not laggy. If the hero is meant to stay pinned while this happens, add `position: sticky; top: 0;` and control the fade via an `IntersectionObserver` on the section *below* the hero instead of raw scroll position.

---

## 2. Section Reveal on Scroll

**Purpose:** Universal fade/slide-in for any section as it enters the viewport. This is the connective tissue animation — apply it broadly so the page feels considered without being loud.

**Used in:** Every section — Logo Carousel, Why This Works, How It Works, Testimonials, Footer, etc.

**Assets:** none

```html
<section data-reveal>
  <!-- any section content -->
</section>
```

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

[data-reveal].revealed {
  opacity: 1;
  transform: translateY(0);
}
```

```javascript
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
```

**Notes:** Add `data-reveal` to section-level wrappers, not every child element, or the page will feel busy. For staggered children (e.g. testimonial cards, pricing tiers), add a modifier — see the `stagger-item` pattern in the Testimonials section below.

---

## 3. Fluid Flow Steps

**Purpose:** The "How It Works" 5-step flow (Post/Apply → Async submission → Live 15-min defense → Rubric scoring → Hire decision) is visually represented as a journey through the fluid image — each step reveals a different crop/zone of the same asset via `background-position`, so scrolling through the steps feels like moving through one continuous flow rather than five disconnected blocks.

**Used in:** How It Works section.

**Assets:** `fluid-full.png`

```html
<section class="how-it-works">
  <div class="step" data-step="1">
    <div class="step-visual" style="background-position: 0% 100%;"></div>
    <h3>Post a Challenge</h3>
  </div>
  <div class="step" data-step="2">
    <div class="step-visual" style="background-position: 25% 75%;"></div>
    <h3>Async Submission</h3>
  </div>
  <div class="step" data-step="3">
    <div class="step-visual" style="background-position: 50% 50%;"></div>
    <h3>Live 15-min Defense</h3>
  </div>
  <div class="step" data-step="4">
    <div class="step-visual" style="background-position: 75% 25%;"></div>
    <h3>Rubric Scoring</h3>
  </div>
  <div class="step" data-step="5">
    <div class="step-visual" style="background-position: 100% 0%;"></div>
    <h3>Hire Decision</h3>
  </div>
</section>
```

```css
.step {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.step-visual {
  position: absolute;
  inset: 0;
  background-image: url('/assets/fluid-full.png');
  background-size: 200% 200%;
  opacity: 0.3;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.step.active .step-visual {
  opacity: 0.6;
}

.step h3 {
  position: relative;
  z-index: 1;
  font-size: 2.5rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}
```

```javascript
const steps = document.querySelectorAll('.how-it-works .step');

const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      steps.forEach(s => s.classList.remove('active'));
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.5 });

steps.forEach(step => stepObserver.observe(step));
```

**Notes:** This assumes full-height (`100vh`) steps, i.e. a pinned/scrollytelling treatment. If the design calls for shorter, non-full-height steps instead, drop `height: 100vh` and adjust the `threshold` down (e.g. `0.3`) so the "active" state still triggers reliably.

---

## 4. Waveform Proof Ticker

**Purpose:** Renders an animated dotted waveform (visually referencing `Logo_Background_2.png`'s aesthetic) as a live "signal" next to validation stats — dots light up left-to-right in sequence, implying real, live data rather than a static claim.

**Used in:** Why This Works / validation stats section.

**Assets:** `Logo_Background_2.png` (style reference only — this pattern is drawn as SVG, not the raster image, for crisp scaling and animation control)

```html
<section class="proof-stats" data-reveal>
  <div class="waveform-ticker">
    <svg viewBox="0 0 800 100" class="ticker-wave"></svg>
  </div>
  <div class="stat">
    <strong>80%</strong> of builders felt their live defense captured their true skill
  </div>
</section>
```

```css
.waveform-ticker {
  height: 80px;
  margin-bottom: 32px;
}

.ticker-wave {
  width: 100%;
  height: 100%;
}

.ticker-dot {
  fill: transparent;
  stroke: #FF6B35;
  stroke-width: 2;
}

.ticker-dot.animate {
  animation: dot-pulse 0.6s ease-in-out forwards;
  animation-delay: var(--delay);
}

@keyframes dot-pulse {
  0%   { fill: transparent; r: 3; }
  50%  { fill: #FF6B35; r: 5; }
  100% { fill: #FF6B35; r: 3; }
}
```

```javascript
const svg = document.querySelector('.ticker-wave');
const dotCount = 40;
const waveHeight = 30;

for (let i = 0; i < dotCount; i++) {
  const x = (i / dotCount) * 800;
  const y = 50 + Math.sin(i * 0.5) * waveHeight;

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', 3);
  circle.classList.add('ticker-dot');
  circle.style.setProperty('--delay', `${i * 0.03}s`);
  svg.appendChild(circle);
}

const proofObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.ticker-dot').forEach(dot => dot.classList.add('animate'));
      proofObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

proofObserver.observe(document.querySelector('.proof-stats'));
```

**Notes:** Fires once, on first entry into viewport. If real Hack & Hire stat data isn't finalized yet, keep the copy in brackets as a placeholder rather than shipping an invented number.

---

## 5. Audience Spectrum Toggle

**Purpose:** The nav's Companies/Builders toggle re-themes the whole page using colors pulled from the spectrum concept — warm orange tones for Companies, cooler blue tones for Builders — reinforcing that both audiences sit on the same spectrum, just viewed differently.

**Used in:** Nav bar, plus any element that reads `--spectrum-start` / `--spectrum-end`.

**Assets:** `official-spectrum.png` (color reference only — implemented as CSS gradient variables, not the raster image)

```html
<nav class="navbar">
  <button class="audience-toggle" data-audience="companies">
    <span class="toggle-pill">For Companies</span>
  </button>
</nav>

<main id="app" data-audience="companies">
  <!-- rest of page -->
</main>
```

```css
#app[data-audience="companies"] {
  --spectrum-start: #FF6B35;
  --spectrum-end: #FFB703;
}

#app[data-audience="builders"] {
  --spectrum-start: #004E89;
  --spectrum-end: #1D3557;
}

.hero {
  background: linear-gradient(135deg, var(--spectrum-start) 0%, var(--spectrum-end) 100%);
  transition: background 0.4s ease;
}

.toggle-pill {
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255,255,255,0.1);
  transition: background 0.3s ease;
}
```

```javascript
const toggle = document.querySelector('.audience-toggle');
const app = document.querySelector('#app');
const heroHeadline = document.querySelector('.hero h1');
const primaryCta = document.querySelector('.cta-primary');

const copy = {
  companies: { headline: 'Hire on proof, not paper.', cta: 'Post a Challenge' },
  builders:  { headline: 'Prove it live. Get hired.', cta: 'Browse Challenges' }
};

toggle.addEventListener('click', () => {
  const current = app.getAttribute('data-audience');
  const next = current === 'companies' ? 'builders' : 'companies';

  app.setAttribute('data-audience', next);
  toggle.querySelector('.toggle-pill').textContent = next === 'companies' ? 'For Companies' : 'For Builders';
  heroHeadline.textContent = copy[next].headline;
  primaryCta.textContent = copy[next].cta;
});
```

**Notes:** Only re-theme elements that reference `--spectrum-start`/`--spectrum-end` — keep the logo carousel, footer, and testimonials audience-agnostic per the earlier decision to remove the hard chooser gate. Persist the last-selected state via `localStorage` if cross-visit memory is wanted (`localStorage.setItem('projet-audience', next)`).

---

## 6. CTA Waveform Pulse

**Purpose:** On hover, primary CTA buttons ripple with the dotted-waveform texture, reinforcing "live, responsive, proof-driven" on every interaction — a small, fast micro-interaction, not a showpiece.

**Used in:** All primary CTA buttons (`Post a Challenge`, `Browse Challenges`, etc.)

**Assets:** `Logo_Background_2.png`

```html
<button class="cta-primary">Post a Challenge</button>
```

```css
.cta-primary {
  position: relative;
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--spectrum-start), var(--spectrum-end));
  color: white;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.cta-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/assets/Logo_Background_2.png');
  background-size: 400% 400%;
  opacity: 0;
  pointer-events: none;
  border-radius: 8px;
}

.cta-primary:hover::before {
  animation: waveform-ripple 0.6s ease-out;
}

.cta-primary:hover {
  transform: scale(1.05);
}

@keyframes waveform-ripple {
  0%   { opacity: 0.6; background-position: 0% 0%; }
  100% { opacity: 0;   background-position: 100% 100%; }
}
```

**Notes:** Pure CSS, no JS required. Apply the `.cta-primary` class to every primary CTA site-wide for consistency; use a lighter/no-op variant for secondary CTAs so the primary action stays visually dominant.

---

## 7. Rubric Spectrum Bar

**Purpose:** Visualizes the defense rubric weighting (Ownership 40% / Technical depth 25% / Live navigation 20% / Communication 15%) as a single horizontal bar built from spectrum-derived colors, rather than a generic bar chart — ties the scoring visualization back to the "transparency" theme.

**Used in:** How It Works — Rubric Scoring step, or Why This Works section.

**Assets:** `official-spectrum.png` (color reference only — rendered as SVG rects for crisp rendering and hover states)

```html
<div class="rubric-breakdown" data-reveal>
  <svg class="rubric-bar" viewBox="0 0 400 40"></svg>
  <div class="rubric-legend">
    <div class="legend-item">Ownership <span>40%</span></div>
    <div class="legend-item">Technical Depth <span>25%</span></div>
    <div class="legend-item">Live Navigation <span>20%</span></div>
    <div class="legend-item">Communication <span>15%</span></div>
  </div>
</div>
```

```css
.rubric-bar {
  width: 100%;
  margin-bottom: 20px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.rubric-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.legend-item span {
  font-weight: 600;
}

.rubric-segment {
  transition: opacity 0.2s ease, filter 0.2s ease;
}

.rubric-segment:hover {
  opacity: 1 !important;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
}
```

```javascript
const rubricData = [
  { label: 'Ownership',        percent: 40, color: '#FF6B35' },
  { label: 'Technical Depth',  percent: 25, color: '#FFB703' },
  { label: 'Live Navigation',  percent: 20, color: '#8ECAE6' },
  { label: 'Communication',    percent: 15, color: '#004E89' }
];

const svg = document.querySelector('.rubric-bar');
let currentX = 0;

rubricData.forEach(item => {
  const width = (item.percent / 100) * 400;
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', currentX);
  rect.setAttribute('y', 0);
  rect.setAttribute('width', width);
  rect.setAttribute('height', 40);
  rect.setAttribute('fill', item.color);
  rect.setAttribute('opacity', '0.8');
  rect.classList.add('rubric-segment');
  svg.appendChild(rect);
  currentX += width;
});
```

**Notes:** For a fuller "draw-in" effect (bars grow from 0 width when scrolled into view), animate `width` via CSS transition triggered by adding a class from an `IntersectionObserver`, same pattern as Section Reveal on Scroll.

---

## 8. Testimonials Fluid Parallax

**Purpose:** A softly-moving fluid background sits behind the testimonial carousel, giving the section a sense of energy/motion without competing with the (static, readable) testimonial cards on top.

**Used in:** Testimonials section.

**Assets:** `fluid-foreground.png` (chosen over `fluid-full.png` here for its negative space — reads lighter behind white cards)

```html
<section class="testimonials">
  <div class="testimonials-bg"></div>
  <div class="testimonial-carousel">
    <div class="testimonial-card stagger-item">
      <p>Quote from a Hack & Hire participant.</p>
      <strong>Name, Builder</strong>
    </div>
    <!-- repeat -->
  </div>
</section>
```

```css
.testimonials {
  position: relative;
  padding: 80px 40px;
  overflow: hidden;
}

.testimonials-bg {
  position: absolute;
  inset: 0;
  background-image: url('/assets/fluid-foreground.png');
  background-size: 150%;
  background-position: center;
  opacity: 0.15;
  z-index: -1;
  pointer-events: none;
  will-change: transform;
}

.testimonial-carousel {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
}

.testimonial-card {
  flex: 0 0 300px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, opacity 0.5s ease;
}

.testimonial-card:hover {
  transform: translateY(-4px);
}

/* staggered entrance, paired with Section Reveal on Scroll observer */
.stagger-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.stagger-item.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

```javascript
// Parallax (scroll-linked, so a raw listener is appropriate here)
const bgElement = document.querySelector('.testimonials-bg');
const testimonialSection = document.querySelector('.testimonials');

window.addEventListener('scroll', () => {
  if (prefersReducedMotion) return;
  const sectionTop = testimonialSection.offsetTop;
  const sectionBottom = sectionTop + testimonialSection.offsetHeight;
  const scrollY = window.scrollY;

  if (scrollY + window.innerHeight > sectionTop && scrollY < sectionBottom) {
    const offset = (scrollY - sectionTop) * 0.3;
    bgElement.style.transform = `translateY(${offset}px)`;
  }
});

// Staggered card entrance
const cards = document.querySelectorAll('.stagger-item');
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), i * 100);
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => staggerObserver.observe(card));
```

**Notes:** Keep `opacity` on the background low (0.1–0.2) — this is meant to be felt, not seen directly. The parallax listener is gated by `prefersReducedMotion` since it's a continuous scroll-linked effect, unlike the Intersection-Observer-driven animations elsewhere.

---

## 9. Defense Spotlight

**Purpose:** A radial spotlight cone highlights a single subject — used to single out one thing at a time: a featured testimonial, a "live now" indicator during the defense-call explanation, or a hero moment for an individual builder's story.

**Used in:** Live-defense explainer moment (How It Works step 3), or a featured/pinned testimonial.

**Assets:** `Logo_Background_4.png`

```html
<div class="spotlight-container">
  <div class="spotlight-bg"></div>
  <div class="spotlight-content">
    <!-- featured content: quote, live-call illustration, etc. -->
  </div>
</div>
```

```css
.spotlight-container {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #0a0a0a;
}

.spotlight-bg {
  position: absolute;
  inset: 0;
  background-image: url('/assets/Logo_Background_4.png');
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease;
}

.spotlight-container.active .spotlight-bg {
  opacity: 0.8;
}

.spotlight-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  max-width: 600px;
}
```

```javascript
const spotlightObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('active', entry.isIntersecting);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.spotlight-container').forEach(el => spotlightObserver.observe(el));
```

**Notes:** Deliberately restrained — one spotlight moment per page at most, so it retains impact. Good candidate for the "Live 15-min Defense" step specifically, since the cone visually reads as a literal stage/camera light.

---

## Implementation Order (suggested)

1. Global Setup (reduced-motion guard)
2. Section Reveal on Scroll — apply broadly first, cheapest win
3. Audience Spectrum Toggle
4. CTA Waveform Pulse
5. Fluid Flow Steps
6. Rubric Spectrum Bar
7. Waveform Proof Ticker
8. Testimonials Fluid Parallax
9. Spectrum-to-Waveform Hero Handoff
10. Defense Spotlight
