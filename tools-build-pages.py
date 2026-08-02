#!/usr/bin/env python3
"""
Generates business.html / builders.html — the single dual-mode homepage
(Thi's hand-drawn wireframe, July 2026). Run once; the HTML output is what
ships. Kept out of the site repo so there's still no build step.

Superseded a two-page "problem-first" design (archive/business-v1.html,
archive/builders-v1.html) which itself came from Andrei's landing repo
content — that copy (pains/offers/how-it-works/business-model) carries
forward into this page largely unchanged; only the page's overall
structure and nav changed to match the wireframe.
"""
import html, pathlib, re

OUT = pathlib.Path("/home/user/Projet")

TAGLINE = "Where real work is the strongest hiring signal."
MISSION = ("To bridge the gap between businesses and builder talent by making "
           "real work the strongest hiring signal.")

HOW = [
    ("Business posts a challenge",
     "Companies publish real business or technical problems for builders to solve."),
    ("Builders compete",
     "Builders tackle the challenge and submit their best work."),
    ("Top performers get evaluated",
     "Businesses review real output — not resumes — and shortlist standouts."),
    ("Interviews, internships &amp; recognition",
     "Top talent advances to opportunities; builders earn rankings and visibility."),
]

MODEL_BIZ = ["Pay to publish a challenge", "Choose online or in-person formats",
             "Access all builder submissions", "Invite top performers to interview"]
MODEL_STU = ["Join free", "Solve real business problems", "Earn rankings and recognition"]

FINAL_HEADLINE = "Where businesses with problems meet builders with potential."

# Placeholder company names only (never a real company/customer without permission).
LOGOS = ["Company", "Studio", "Startup", "Venture", "Collective", "Workshop"]

FLUID_VIDEO = (
    '<video class="texture" muted loop playsinline preload="none" '
    'poster="assets/fluid.webp" data-autoplay-video>\n'
    '          <source src="assets/fluid-loop.webm" type="video/webm">\n'
    '          <source src="assets/fluid-loop.mp4" type="video/mp4">\n'
    '        </video>'
)

FOOTER_COLS = [
    ("Product", [("How it works", "#how-it-works"), ("What we offer", "#offer"),
                 ("Testimonials", "#testimonials"), ("Challenges", "challenges.html")]),
    ("Company", [("About", "#"), ("Careers", "#"), ("Contact", "#")]),
    ("Legal", [("Privacy", "#"), ("Terms", "#")]),
]

MODES = {
    "business": dict(
        file="business.html", other="builders.html", other_label="Builder",
        role="business", accent="btn-primary", label="Business",
        title="Projet for businesses — Hire on proven work, not polished claims.",
        desc="Post real challenges, evaluate actual work, and build a talent pipeline "
             "— without the noise of CV inflation or costly screening.",
        eyebrow="For businesses",
        headline=("De-risk and streamline hiring, so you can focus on "
                  "<span class=\"accent\">growing your business.</span>"),
        subtext="Post real challenges, evaluate actual work, and build a talent pipeline — "
                "without the noise of CV inflation or costly screening.",
        cta="Post a Challenge",
        cta2=("See what we offer", "#offer"),
        checkpoints=["No resumes to screen", "Real work, not claims", "Pay only to publish"],
        problem_statement="Traditional hiring is expensive, noisy, and risky.",
        problem_lead="Resumes keep getting stronger while the signal behind them gets weaker. "
                     "Here is what that costs a hiring team.",
        pains=[
            ("CV inflation", "Resumes look stronger than the skills behind them, making it hard to trust credentials alone."),
            ("Screening costs", "Hours of filtering applications burn time and budget before you ever see real capability."),
            ("Poor-hire risk", "Interviews and paper trails still leave uncertainty about how someone will perform on the job."),
        ],
        offer_headline="Hire on proven work, not polished claims.",
        offers=[
            ("Publish challenges", "Post real business or technical problems your team needs solved."),
            ("Evaluate real work", "Review submissions based on actual output — not resumes or cover letters."),
            ("Crowdsource solutions", "Tap a pool of motivated builder talent competing to deliver their best."),
            ("Reduce hiring risk", "See how candidates think and build before you commit to interviews."),
            ("Build a talent pipeline", "Invite top performers into internships, roles, and ongoing relationships."),
            ("Focus on growth", "Streamline discovery so your team spends less time screening and more time shipping."),
        ],
        card_tag="YOUR CHALLENGE", card_title="Rebuild the pricing page conversion flow",
        card_rows=["Challenge live", "42 submissions", "Top 5 shortlisted", "Invite to interview"],
        teaser_h="See the kind of talent that's already building.",
        teaser_p="Browse open challenges to see real submissions in action before you post your own.",
        testimonials=[
            ("“We saw exactly how candidates think, not just what they claimed on paper.”",
             "Hiring lead, early pilot"),
            ("“Cut our screening time down to almost nothing — we only spoke with people who'd already proven themselves.”",
             "Hiring manager, early pilot"),
            ("“Seeing the actual submissions side by side made the final call so much easier.”",
             "Founder, early pilot"),
        ],
        faqs=[
            ("How does posting a challenge work?",
             "Publish a real business or technical problem from your backlog. Builders compete to solve it, "
             "and you review actual submissions instead of resumes."),
            ("What does it cost?",
             "You pay to publish a challenge — there's no subscription, and no cost to browse or evaluate "
             "submissions."),
            ("Can challenges run in person?",
             "Yes — choose an online or in-person format when you publish, depending on what fits your team."),
            ("Do I see every submission, or just a shortlist?",
             "You get access to all builder submissions, so you can evaluate the full pool yourself before "
             "deciding who to shortlist and invite to interview."),
        ],
    ),
    "builder": dict(
        file="builders.html", other="business.html", other_label="Business",
        role="builder", accent="btn-blue", label="Builder",
        title="Projet for builders — Stand out through what you build.",
        desc="Work on real company problems, get direct exposure, and compete for "
             "internships, prizes, and recognition — beyond another AI-polished CV.",
        eyebrow="For builders",
        headline=("Stand out through what you build, "
                  "<span class=\"accent\">not just what's on your resume.</span>"),
        subtext="Work on real company problems, get direct exposure, and compete for internships, "
                "prizes, and recognition — beyond another AI-polished CV.",
        cta="Join a Challenge",
        cta2=("See what we offer", "#offer"),
        checkpoints=["Free to join", "Real company problems", "Get noticed for what you ship"],
        problem_statement="Standing out in a crowded builder market is harder than ever.",
        problem_lead="Everyone has the same coursework, the same clubs, and now the same "
                     "AI-written applications. Here is what that costs you.",
        pains=[
            ("Saturated market", "Thousands of builders apply with similar coursework, clubs, and internship titles."),
            ("AI-flattened resumes", "Generic, AI-written applications make it harder for genuine talent to get noticed."),
            ("Differentiation difficulty", "Without proof of real work, it's tough to show companies what you can actually do."),
        ],
        offer_headline="Build proof. Get discovered. Grow faster.",
        offers=[
            ("Work on real problems", "Solve challenges from actual businesses — not toy assignments."),
            ("Direct company exposure", "Put your work in front of decision-makers looking for talent."),
            ("Compete for opportunities", "Earn shots at internships, prizes, and recognition based on performance."),
            ("Hands-on learning", "Level up by building under real constraints and feedback loops."),
            ("Rankings &amp; recognition", "Build a visible track record that goes beyond your resume."),
            ("Join free", "Start competing without paywalls — prove yourself through what you ship."),
        ],
        card_tag="YOUR SUBMISSION", card_title="Rebuild the pricing page conversion flow",
        card_rows=["Challenge joined", "Solution submitted", "Ranked top 8%", "Company noticed"],
        teaser_h="Ready to prove what you can do?",
        teaser_p="Browse open challenges and jump into one that matches your skills.",
        testimonials=[
            ("“I finally had something real to point to instead of another bullet point on a resume.”",
             "Builder, early pilot"),
            ("“Got noticed off the back of one challenge — no cover letter needed.”",
             "Builder, early pilot"),
            ("“It's the first time a company actually asked how I think, instead of just reading a resume.”",
             "Builder, early pilot"),
        ],
        faqs=[
            ("Is it free to join?",
             "Yes — joining and competing on challenges is completely free for builders."),
            ("What kind of challenges will I work on?",
             "Real business or technical problems companies need solved — not toy assignments or generic "
             "coursework."),
            ("How do I get noticed?",
             "Submit your best work and get ranked against other builders. Top performers get direct "
             "visibility with the company, plus a track record you can point to going forward."),
            ("What happens after I submit?",
             "Businesses review real submissions from every builder who competed, and shortlist standouts "
             "for interviews, internships, or other opportunities."),
        ],
    ),
}


def nav(m):
    biz_cur = ' aria-current="page"' if m["role"] == "business" else ''
    bld_cls = "mode-opt is-builder" if m["role"] == "builder" else "mode-opt"
    bld_cur = ' aria-current="page"' if m["role"] == "builder" else ''
    switch = (f'<div class="mode-switch" role="group" aria-label="Switch mode">\n'
              f'        <a href="business.html" class="mode-opt"{biz_cur}>For company</a>\n'
              f'        <a href="builders.html" class="{bld_cls}"{bld_cur}>For builders</a>\n'
              f'      </div>')

    # Desktop: two dropdowns (Challenges, Resources) instead of plain anchor links —
    # matches the wireframe's nav flyouts. Challenges' sort pills are all decorative
    # previews (no real listing/filtering exists yet — challenges.html is still a
    # stub) rather than promising functionality that isn't there.
    desktop_links = f'''      <div class="nav-dropdown" data-dropdown>
        <button class="nav-drop-trigger" aria-expanded="false">Challenges <span class="chev" aria-hidden="true">&#9662;</span></button>
        <div class="nav-drop-panel">
          <span class="drop-label">Browse</span>
          <a href="challenges.html">All challenges</a>
          <a href="challenges.html">Active</a>
          <a href="challenges.html">Newest</a>
          <a href="challenges.html">Most popular</a>
          <a href="signup.html?role=business" class="drop-cta">Post a challenge &#8594;</a>
        </div>
      </div>
      <div class="nav-dropdown" data-dropdown>
        <button class="nav-drop-trigger" aria-expanded="false">Resources <span class="chev" aria-hidden="true">&#9662;</span></button>
        <div class="nav-drop-panel">
          <a href="#how-it-works">How it works</a>
          <a href="#testimonials">Testimonials</a>
          <a href="challenges.html">Projects showcase</a>
          <a href="#faq">FAQs</a>
          <a href="#footer">Contact</a>
        </div>
      </div>
'''
    # Mobile: the same destinations, flattened to plain links (no floating panels
    # in the stacked sheet).
    mobile_links = ('      <a href="challenges.html">Browse challenges</a>\n'
                    '      <a href="signup.html?role=business">Post a challenge</a>\n'
                    '      <a href="#how-it-works">How it works</a>\n'
                    '      <a href="#testimonials">Testimonials</a>\n'
                    '      <a href="#faq">FAQs</a>\n'
                    '      <a href="#footer">Contact</a>\n')

    return f'''<div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
<header class="nav">
  <div class="nav-inner">
    <div class="nav-left">
      <a href="projet-split-hero/index.html" class="logo">
        <img class="logo-img" src="assets/logo-dark.png" alt="Projet" width="267" height="88">
      </a>
      {switch}
    </div>
    <nav class="links">
{desktop_links}    </nav>
    <div class="nav-cta">
      <a href="login.html" class="nav-auth">Log in</a>
      <a href="signup.html?role={m["role"]}" class="btn {m["accent"]} btn-sm">Sign up</a>
    </div>
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
      <span class="nav-toggle-bars" aria-hidden="true"></span>
    </button>
  </div>
  <div class="mobile-menu" id="mobileMenu">
    {switch}
{mobile_links}    <div class="mobile-menu-ctas">
      <a href="login.html" class="btn btn-ghost">Log in</a>
      <a href="signup.html?role={m["role"]}" class="btn {m["accent"]}">Sign up</a>
    </div>
  </div>
</header>'''


def countify(text):
    """Wrap the first integer in a UI-mockup string so site.js can count it
    up from 0 when the hero card scrolls into view — e.g. "42 submissions"
    -> "<span class="count-up" data-count-to="42">42</span> submissions".
    The pre-rendered value is the real number so no-js/reduced-motion just
    shows the final count with no animation, same fallback rule as every
    other scroll effect on the page."""
    m = re.search(r'\d+', text)
    if not m:
        return text
    n = m.group(0)
    return (text[:m.start()] +
            f'<span class="count-up" data-count-to="{n}">{n}</span>' +
            text[m.end():])


def page(m):
    body_class = " mode-builder" if m["role"] == "builder" else ""
    rows = "\n".join(
        f'          <div class="cand-row"><div class="cand-left">'
        # cand-desc keeps the countify()'d text as one flex item — .cand-left's
        # own gap would otherwise land between every anonymous flex item the
        # count-up span's text splits the row into, spacing out "8" and "%"
        f'<span class="cand-rank">{i+1:02d}</span><span class="cand-desc">{countify(r)}</span></div></div>'
        for i, r in enumerate(m["card_rows"]))
    checkpoints = "\n".join(f'          <span>&#10003; {c}</span>' for c in m["checkpoints"])
    pains = "\n".join(
        f'      <div class="pain-item" data-pain-step="{i}">\n'
        f'        <div class="pain-num">{i+1:02d}</div>\n'
        f'        <h3>{t}</h3><p>{d}</p>\n'
        f'      </div>'
        for i, (t, d) in enumerate(m["pains"]))
    offers = "\n".join(
        f'      <div class="offer-card"><span class="offer-num">{i+1:02d}</span>'
        f'<h3>{t}</h3><p>{d}</p></div>'
        for i, (t, d) in enumerate(m["offers"]))
    how_steps = "\n".join(
        f'        <div class="how-stage-step" data-how-step="{i}">\n'
        f'          <span class="how-num">{i+1:02d}</span>\n'
        f'          <h3>{t}</h3><p>{d}</p>\n'
        f'        </div>'
        for i, (t, d) in enumerate(HOW))
    how_dots = "\n".join(
        f'        <span class="how-dot" data-how-dot="{i}"></span>'
        for i in range(len(HOW)))
    logo_chips = "\n".join(f'        <span class="logo-chip">{l}</span>' for l in LOGOS)
    # duplicated once so the marquee's -50% CSS translate loops seamlessly
    logo_track = logo_chips + "\n" + logo_chips
    testimonial_cards = "\n".join(
        f'        <div class="testimonial-card">\n'
        f'          <p class="testimonial-quote">{q}</p>\n'
        f'          <p class="testimonial-attr">{a}</p>\n'
        f'        </div>'
        for q, a in m["testimonials"])
    faq_items = "\n".join(
        f'      <div class="faq-item">\n'
        f'        <button class="faq-q">{q} <span class="plus" aria-hidden="true"></span></button>\n'
        f'        <div class="faq-a"><div class="faq-a-inner"><p>{a}</p></div></div>\n'
        f'      </div>'
        for q, a in m["faqs"])
    fcols = "\n".join(
        '      <div class="footer-col">\n        <h6>' + title + '</h6>\n' +
        "".join(f'        <a href="{h}">{l}</a>\n' for l, h in links) +
        '      </div>'
        for title, links in FOOTER_COLS)
    mbiz = "\n".join(f'          <li>{p}</li>' for p in MODEL_BIZ)
    mstu = "\n".join(f'          <li>{p}</li>' for p in MODEL_STU)

    return f'''<!DOCTYPE html>
<html lang="en" class="no-js{body_class}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{m["title"]}</title>
<link rel="icon" href="assets/favicon.ico" sizes="any">
<link rel="icon" href="assets/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400,300&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
<meta name="description" content="{m["desc"]}">
<link rel="canonical" href="https://myprojet.co/{m["file"]}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Projet">
<meta property="og:url" content="https://myprojet.co/{m["file"]}">
<meta property="og:title" content="{m["title"]}">
<meta property="og:description" content="{m["desc"]}">
<meta property="og:image" content="https://myprojet.co/assets/og-cover.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Projet — where real work is the strongest hiring signal.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{m["title"]}">
<meta name="twitter:description" content="{m["desc"]}">
<meta name="twitter:image" content="https://myprojet.co/assets/og-cover.jpg">
<meta name="theme-color" content="#14130f">
<noscript><style>.reveal{{opacity:1 !important; transform:none !important;}}</style></noscript>
<script>document.documentElement.classList.remove("no-js");</script>
</head>
<body>

{nav(m)}

<main id="top">

  <!-- HERO -->
  <section class="hero wrap">
    <div class="hero-grid">
      <div>
        <div class="hero-eyebrow-row">
          <span class="eyebrow">{m["eyebrow"]} · {TAGLINE}</span>
        </div>
        <h1 class="reveal">{m["headline"]}</h1>
        <p class="hero-sub reveal">{m["subtext"]}</p>
        <div class="hero-ctas reveal">
          <a href="signup.html?role={m["role"]}" class="btn {m["accent"]}">{m["cta"]}</a>
          <a href="{m["cta2"][1]}" class="btn btn-ghost">{m["cta2"][0]}</a>
        </div>
        <div class="hero-stats reveal">
{checkpoints}
        </div>
      </div>

      <div class="hero-visual reveal">
        {FLUID_VIDEO}
        <div class="hero-card">
          <div class="hero-card-top">
            <span class="tag">{m["card_tag"]}</span>
            <span class="tag">LIVE</span>
          </div>
          <div class="hero-card-title">{m["card_title"]}</div>
{rows}
        </div>
      </div>
    </div>
  </section>

  <!-- LOGO STRIP — placeholder chips (no real customer logos yet); pure-CSS
       marquee, paused under reduced-motion/no-js. -->
  <section class="wrap logo-strip-wrap">
    <div class="logo-marquee" aria-hidden="true">
      <div class="logo-track">
{logo_track}
      </div>
    </div>
  </section>

  <!-- FEATURED CHALLENGES — challenges.html is still a stub, so this is a
       teaser into it rather than a real listing. -->
  <section class="wrap">
    <div class="challenges-teaser reveal">
      <div>
        <span class="eyebrow">Featured challenges</span>
        <h3>{m["teaser_h"]}</h3>
        <p>{m["teaser_p"]}</p>
      </div>
      <a href="challenges.html" class="btn {m["accent"]}">Browse challenges</a>
    </div>
  </section>

  <!-- PROBLEM STATEMENT + PAIN POINTS -->
  <section class="section wrap" id="problem">
    <div class="section-head reveal">
      <span class="eyebrow">The problem</span>
      <h2>{m["problem_statement"]}</h2>
      <p>{m["problem_lead"]}</p>
    </div>
    <div class="pain-track reveal" data-pain-track>
      <div class="pain-line"><div class="pain-line-fill" data-pain-fill></div></div>
{pains}
    </div>
  </section>

  <!-- WHAT PROJET OFFERS -->
  <section class="section wrap" id="offer" style="padding-top:0;">
    <div class="section-head reveal">
      <span class="eyebrow">What we offer</span>
      <h2>{m["offer_headline"]}</h2>
    </div>
    <div class="offer-grid" data-stagger>
{offers}
    </div>
  </section>

  <!-- HOW IT WORKS — steps stick in view while scroll advances which one
       is active; collapses to a plain static list under 900px / no-js /
       reduced-motion (see .how-pin in site.css). -->
  <section class="section wrap" id="how-it-works">
    <div class="section-head reveal">
      <span class="eyebrow">How it works</span>
      <h2>One pipeline. Two sides. Real outcomes.</h2>
    </div>
  </section>
  <div class="how-pin" data-how-pin>
    <div class="how-pin-inner">
      <div class="how-stage">
{how_steps}
      </div>
      <div class="how-dots">
{how_dots}
      </div>
    </div>
  </div>

  <!-- TESTIMONIALS — placeholder quotes (no named individuals/companies)
       until real ones exist; the carousel mechanic itself is real. -->
  <section class="section wrap" id="testimonials">
    <div class="section-head reveal">
      <span class="eyebrow">Testimonials</span>
      <h2>What people are saying.</h2>
    </div>
    <div class="testimonial-carousel reveal">
      <button class="carousel-btn carousel-prev" aria-label="Previous testimonial">&#8592;</button>
      <div class="testimonial-track" data-testimonial-track>
{testimonial_cards}
      </div>
      <button class="carousel-btn carousel-next" aria-label="Next testimonial">&#8594;</button>
    </div>
  </section>

  <!-- PRODUCT DEMO — no real demo video yet, so this is a clearly-labelled
       placeholder rather than repurposing the hero's abstract texture loop
       as if it were a demo. -->
  <section class="section wrap" id="demo" style="padding-top:0;">
    <div class="section-head reveal">
      <span class="eyebrow">See it in action</span>
      <h2>Product demo — coming soon.</h2>
    </div>
    <div class="video-placeholder reveal">
      <span class="video-play-btn" aria-hidden="true">&#9658;</span>
      <p>Product demo coming soon</p>
    </div>
  </section>

  <!-- BUSINESS MODEL -->
  <section class="section wrap traction-section" id="business-model">
    <div class="section-head reveal">
      <span class="eyebrow">Business model</span>
      <h2>Simple for both sides.</h2>
    </div>
    <div class="model-grid" data-stagger>
      <div class="model-card {"dark" if m["role"] == "business" else "light"}">
        <h3>For Businesses</h3>
        <ul class="model-list">
{mbiz}
        </ul>
      </div>
      <div class="model-card {"dark" if m["role"] == "builder" else "light"}">
        <h3>For Builders</h3>
        <ul class="model-list">
{mstu}
        </ul>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section wrap" id="faq">
    <div class="section-head reveal">
      <span class="eyebrow">FAQ</span>
      <h2>Questions, answered.</h2>
    </div>
    <div class="faq-list reveal">
{faq_items}
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="wrap final-cta-wrap">
    <div class="final-cta reveal" id="final-cta">
      {FLUID_VIDEO}
      <div class="final-cta-inner">
        <h2>{FINAL_HEADLINE}</h2>
        <p>{TAGLINE}</p>
        <div class="final-cta-btns">
          <a href="signup.html?role=business" class="btn btn-white">Post a Challenge</a>
          <a href="signup.html?role=builder" class="btn btn-outline-white">Join a Challenge</a>
        </div>
      </div>
    </div>
  </section>

</main>

<footer id="footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <img class="logo-img" src="assets/logo-dark.png" alt="Projet" width="267" height="88">
        <p>Challenge-based talent discovery for businesses and builders.</p>
      </div>
{fcols}
    </div>
    <div class="footer-bottom">
      <span>© 2026 Projet. All rights reserved.</span>
      <span><a href="{m["other"]}">Switch to {m["other_label"]} view &#8594;</a></span>
    </div>
  </div>
</footer>

<script src="assets/site.js"></script>
</body>
</html>
'''


for key, m in MODES.items():
    (OUT / m["file"]).write_text(page(m))
    print("wrote", m["file"])
