#!/usr/bin/env python3
"""
Generates business.html / builders.html from the copy in Andrei's landing repo
(AndreiYo037/projet-landing -> src/lib/content.ts). Run once; the HTML output is
what ships. Kept out of the site repo so there's still no build step.
"""
import html, pathlib

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

FOOTER_COLS = [
    ("Product", [("How it works", "#how-it-works"), ("What we offer", "#offer"),
                 ("Business model", "#business-model")]),
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
    ),
}


def nav(m):
    biz_cur = ' aria-current="page"' if m["role"] == "business" else ''
    bld_cls = "mode-opt is-builder" if m["role"] == "builder" else "mode-opt"
    bld_cur = ' aria-current="page"' if m["role"] == "builder" else ''
    switch = (f'<div class="mode-switch" role="group" aria-label="Switch mode">\n'
              f'        <a href="business.html" class="mode-opt"{biz_cur}>Business</a>\n'
              f'        <a href="builders.html" class="{bld_cls}"{bld_cur}>Builder</a>\n'
              f'      </div>')
    links = ('      <a href="#problem">The problem</a>\n'
             '      <a href="#offer">What we offer</a>\n'
             '      <a href="#how-it-works">How it works</a>\n'
             '      <a href="#business-model">Business model</a>\n')
    return f'''<header class="nav">
  <div class="nav-inner">
    <div class="nav-left">
      <a href="projet-split-hero/index.html" class="logo">
        <img class="logo-img" src="assets/logo-dark.png" alt="Projet" width="267" height="88">
      </a>
      {switch}
    </div>
    <nav class="links">
{links}    </nav>
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
{links}    <div class="mobile-menu-ctas">
      <a href="login.html" class="btn btn-ghost">Log in</a>
      <a href="signup.html?role={m["role"]}" class="btn {m["accent"]}">Sign up</a>
    </div>
  </div>
</header>'''


def page(m):
    body_class = " mode-builder" if m["role"] == "builder" else ""
    rows = "\n".join(
        f'          <div class="cand-row"><div class="cand-left">'
        f'<span class="cand-rank">{i+1:02d}</span> {r}</div></div>'
        for i, r in enumerate(m["card_rows"]))
    pains = "\n".join(
        f'      <div class="pain-card"><h3>{t}</h3><p>{d}</p></div>'
        for t, d in m["pains"])
    offers = "\n".join(
        f'      <div class="offer-card"><span class="offer-num">{i+1:02d}</span>'
        f'<h3>{t}</h3><p>{d}</p></div>'
        for i, (t, d) in enumerate(m["offers"]))
    steps = "\n".join(
        f'      <div class="step"><div class="step-badge">{i+1:02d}</div>'
        f'<h4>{t}</h4><p>{d}</p></div>'
        for i, (t, d) in enumerate(HOW))
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

  <!-- 1. BRIEF DESCRIPTION — what Projet is, and the promise for this mode -->
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
        <p class="hero-mission reveal">{MISSION}</p>
      </div>

      <div class="hero-visual reveal">
        <img class="texture" src="assets/fluid.webp" alt="">
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

  <!-- 2. PROBLEM STATEMENT + 3. PAIN POINTS -->
  <section class="section wrap" id="problem">
    <div class="section-head reveal">
      <span class="eyebrow">The problem</span>
      <h2>{m["problem_statement"]}</h2>
      <p>{m["problem_lead"]}</p>
    </div>
    <div class="pain-grid reveal">
{pains}
    </div>
  </section>

  <!-- 4. WHAT PROJET OFFERS — the solutions -->
  <section class="section wrap" id="offer" style="padding-top:0;">
    <div class="section-head reveal">
      <span class="eyebrow">What we offer</span>
      <h2>{m["offer_headline"]}</h2>
    </div>
    <div class="offer-grid reveal">
{offers}
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="section wrap" id="how-it-works">
    <div class="section-head reveal">
      <span class="eyebrow">How it works</span>
      <h2>One pipeline. Two sides. Real outcomes.</h2>
    </div>
    <div class="steps-grid steps-4 reveal">
{steps}
    </div>
  </section>

  <!-- BUSINESS MODEL -->
  <section class="section wrap traction-section" id="business-model">
    <div class="section-head reveal">
      <span class="eyebrow">Business model</span>
      <h2>Simple for both sides.</h2>
    </div>
    <div class="model-grid reveal">
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

  <!-- FINAL CTA -->
  <section class="wrap final-cta-wrap">
    <div class="final-cta reveal" id="final-cta">
      <img class="texture" src="assets/fluid.webp" alt="">
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

<footer>
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
