/* ==========================================================================
   Projet — smoke test

   Dependency-free. Node 22+ (global fetch + WebSocket), no npm install,
   matching this repo's own no-build-step rule. Drives a real headless
   Chromium over the DevTools protocol, because every bug worth catching on
   this site was found by running it rather than reading it.

     node test/smoke.mjs            # all checks
     node test/smoke.mjs --pages    # page checks only
     node test/smoke.mjs --fixtures # backend-seam checks only

   Env:
     CHROME_PATH   path to a Chrome/Chromium binary (auto-detected if unset)
     PORT          port for the throwaway static server (default 8199)

   Exit code is 1 if anything fails, so CI can gate on it.
   ========================================================================== */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

if (typeof WebSocket === "undefined") {
  console.error("This needs Node 22+ — the global WebSocket it drives Chrome with\n" +
                "landed there. You are on " + process.version + ".");
  process.exit(1);
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 8199);
const CDP  = PORT + 1;
const BASE = `http://127.0.0.1:${PORT}/`;
const only = process.argv.includes("--pages") ? "pages"
           : process.argv.includes("--fixtures") ? "fixtures" : "all";

const PAGES = ["index.html","challenges.html","about.html","faq.html",
               "dashboard.html","login.html","signup.html","404.html"];

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------------- process plumbing ---------------- */
async function waitFor(url, tries = 100) {
  for (let i = 0; i < tries; i++) {
    try { await fetch(url); return true; } catch { await sleep(100); }
  }
  return false;
}

async function startServer() {
  const p = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"],
                  { cwd: ROOT, stdio: "ignore" });
  if (!await waitFor(BASE)) throw new Error(`static server never came up on ${PORT}`);
  return p;
}

async function startChrome() {
  const bin = CHROME_CANDIDATES.find(existsSync);
  if (!bin) throw new Error(
    "No Chrome/Chromium found. Set CHROME_PATH to a binary.\n  Tried:\n   " +
    CHROME_CANDIDATES.join("\n   "));
  const p = spawn(bin, [`--remote-debugging-port=${CDP}`, "--headless=new",
                        "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
                        "--disable-dev-shm-usage", "about:blank"], { stdio: "ignore" });
  if (!await waitFor(`http://127.0.0.1:${CDP}/json/version`))
    throw new Error(`Chrome never exposed a debugging port on ${CDP}`);
  return p;
}

/* ---------------- one page, one websocket ---------------- */
async function open(url, { width = 1440, height = 900, before = null } = {}) {
  const t = await (await fetch(`http://127.0.0.1:${CDP}/json/new?about:blank`,
                               { method: "PUT" })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  let id = 0; const pending = new Map(); const events = [];
  const send = (m, p = {}) => new Promise(r => {
    const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  await new Promise(r => { ws.onopen = r; });
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    if (m.method) events.push(m);
  };
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Emulation.setDeviceMetricsOverride",
             { width, height, deviceScaleFactor: 1, mobile: width < 700 });
  // runs before any page script — how a seam gets its data-endpoint set
  if (before) await send("Page.addScriptToEvaluateOnNewDocument", { source: before });
  await send("Page.navigate", { url });
  await new Promise(res => { const c = setInterval(() => {
    if (events.find(e => e.method === "Page.loadEventFired")) { clearInterval(c); res(); }
  }, 50); setTimeout(() => { clearInterval(c); res(); }, 15000); });
  const evalx = async x =>
    (await send("Runtime.evaluate", { expression: x, returnByValue: true })).result.value;
  return {
    evalx, events,
    errors: () => [
      ...events.filter(e => e.method === "Runtime.exceptionThrown").map(e =>
        "uncaught: " + ((e.params.exceptionDetails.exception || {}).description ||
                        e.params.exceptionDetails.text || "").split("\n")[0]),
      ...events.filter(e => e.method === "Runtime.consoleAPICalled" && e.params.type === "error")
        .map(e => "console.error: " +
             e.params.args.map(a => a.value || a.description).join(" ")),
    ],
    // local requests only: the font CDNs are unreachable in CI and that is not a site bug
    failedLocal: () => events.filter(e => e.method === "Network.loadingFailed")
      .map(e => e.params.requestId)
      .map(rid => (events.find(x => x.method === "Network.requestWillBeSent" &&
                                    x.params.requestId === rid) || {}).params)
      .filter(p => p && p.request.url.startsWith(BASE))
      .map(p => p.request.url.replace(BASE, "")),
    close: async () => { await send("Target.closeTarget", { targetId: t.id }); ws.close(); },
  };
}

/* ---------------- page checks ---------------- */
const AUDIT = `(() => {
  const ids = {}, dup = [];
  document.querySelectorAll('[id]').forEach(e => { if (ids[e.id]) dup.push(e.id); ids[e.id] = 1; });
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .filter(h => h.offsetParent !== null && !h.closest('dialog')).map(h => +h.tagName[1]);
  const skips = [];
  for (let i = 1; i < heads.length; i++)
    if (heads[i] - heads[i-1] > 1) skips.push(heads[i-1] + ' -> ' + heads[i]);
  return {
    dupIds: dup,
    headingSkips: skips,
    h1Count: document.querySelectorAll('h1').length,
    imgNoAlt: [...document.querySelectorAll('img:not([alt])')].map(i => i.src.split('/').pop()),
    imgBroken: [...document.querySelectorAll('img')]
      .filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.split('/').pop()),
    inputsNoLabel: [...document.querySelectorAll('input:not([type=hidden])')].filter(i =>
      !i.labels?.length && !i.getAttribute('aria-label') &&
      !i.getAttribute('aria-labelledby') && !i.closest('label')).map(i => i.id || i.name || i.type),
    btnNoName: [...document.querySelectorAll('button')].filter(b =>
      !b.textContent.trim() && !b.getAttribute('aria-label') &&
      !b.getAttribute('title')).length,
    blankNoRel: [...document.querySelectorAll('a[target=_blank]')]
      .filter(a => !/noopener/.test(a.rel)).map(a => a.href),
    deadHash: [...document.querySelectorAll('a[href="#"]')].map(a => a.textContent.trim()),
    badAnchors: [...document.querySelectorAll('a[href^="#"]')]
      .map(a => a.getAttribute('href'))
      .filter(h => h.length > 1 && !document.querySelector(h)),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
})()`;

async function checkPages() {
  for (const page of PAGES) {
    for (const [label, w, h] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
      const where = `${page} @${label}`;
      const p = await open(BASE + page, { width: w, height: h });
      await sleep(600);
      const a = await p.evalx(AUDIT);
      for (const e of p.errors()) fail(where, e);
      for (const f of p.failedLocal()) fail(where, `failed local request: ${f}`);
      if (a.overflow > 1) fail(where, `horizontal overflow: ${a.overflow}px`);
      if (a.dupIds.length) fail(where, `duplicate ids: ${a.dupIds.join(", ")}`);
      if (a.headingSkips.length) fail(where, `heading level skipped: ${a.headingSkips.join(", ")}`);
      if (a.imgNoAlt.length) fail(where, `img without alt: ${a.imgNoAlt.join(", ")}`);
      if (a.imgBroken.length) fail(where, `broken image: ${a.imgBroken.join(", ")}`);
      if (a.inputsNoLabel.length) fail(where, `unlabelled input: ${a.inputsNoLabel.join(", ")}`);
      if (a.btnNoName) fail(where, `${a.btnNoName} button(s) with no accessible name`);
      if (a.blankNoRel.length) fail(where, `target=_blank without rel=noopener: ${a.blankNoRel.join(", ")}`);
      if (a.badAnchors.length) fail(where, `anchor with no target: ${a.badAnchors.join(", ")}`);
      // dashboard's placeholder actions are real <button>s now; a href="#" is a regression
      if (a.deadHash.length) fail(where, `href="#" link(s): ${a.deadHash.join(", ")}`);
      // login/signup legitimately carry one h1 per face; everything else needs exactly one
      const wantH1 = /login|signup/.test(page) ? 2 : 1;
      if (a.h1Count !== wantH1) fail(where, `expected ${wantH1} <h1>, found ${a.h1Count}`);
      console.log(`  ${a.overflow === 0 && !p.errors().length ? "ok  " : "FAIL"} ${where}`);
      await p.close();
    }
  }
}

/* ---------------- backend-seam checks against the fixtures ---------------- */
/* Sets a seam's data-endpoint the instant the element is parsed. It has to be
   a MutationObserver, not readystatechange: both page scripts sit at the end
   of <body>, and readyState only reaches "interactive" AFTER they have run —
   by which point the seam has already read an empty attribute and given up. */
const setEndpoint = (sel, path) => `
  (function(){
    var done = false, obs;
    function trySet(){
      if (done) return;
      var el = ${sel};
      if (!el) return;
      el.setAttribute('data-endpoint', ${JSON.stringify(path)});
      done = true; if (obs) obs.disconnect();
    }
    obs = new MutationObserver(trySet);
    obs.observe(document, { childList: true, subtree: true });
    trySet();
  })();`;

const FIXTURES = [
  { name: "dashboard-student", page: "dashboard.html?view=student",
    before: setEndpoint("document.body", "/fixtures/dashboard-student.json"),
    expect: async p => ({
      // asserted against values ONLY the fixture produces — an earlier version
      // of this test passed against the sample data by coincidence
      name:    [await p.evalx("document.getElementById('dpName').textContent"), "Chloe Lim"],
      org:     [await p.evalx("document.getElementById('dpDetOrg').textContent"), "SUTD · Year 3 Design & AI"],
      entries: [await p.evalx("document.querySelectorAll('#dpEntries .dp-card').length"), 3],
      entry2:  [await p.evalx("document.querySelectorAll('#dpEntries .dp-card')[1].dataset.hkCompany"), "Fieldstone"],
      heat:    [await p.evalx("(()=>{const g=[...document.querySelectorAll('.dp-heat')].find(g=>g.offsetParent!==null);return [...g.querySelectorAll('i')].reduce((a,i)=>a+(+i.dataset.count||0),0)})()"), 187],
    })},
  { name: "dashboard-student-empty", page: "dashboard.html?view=student",
    before: setEndpoint("document.body", "/fixtures/dashboard-student-empty.json"),
    expect: async p => ({
      emptyShown: [await p.evalx("!document.querySelector('.dp-empty').hidden"), true],
      // showEmpty(true) hides the whole student view via [hidden] rather than
      // emptying the list, so assert on VISIBILITY — counting DOM nodes here
      // reported a failure against correct behaviour.
      entriesHidden: [await p.evalx("document.querySelector('#dpEntries').offsetParent === null"), true],
    })},
  { name: "dashboard-company", page: "dashboard.html?view=company",
    before: setEndpoint("document.body", "/fixtures/dashboard-company.json"),
    expect: async p => ({
      name:       [await p.evalx("document.getElementById('dpName').textContent"), "Nordwave"],
      briefRows:  [await p.evalx("document.querySelectorAll('.dp-table tbody tr').length"), 5],
      metrics:    [await p.evalx("document.querySelectorAll('.dp-metrics--six .dp-metric').length"), 6],
      months:     [await p.evalx("document.querySelectorAll('.dp-cols i').length"), 12],
      candidates: [await p.evalx("document.querySelectorAll('#dpCandidates .dp-card').length"), 5],
      // derived, never sent: must agree with briefs[].submitted
      heatTotal:  [await p.evalx("(()=>{const g=[...document.querySelectorAll('.dp-heat')].find(g=>g.offsetParent!==null);return [...g.querySelectorAll('i')].reduce((a,i)=>a+(+i.dataset.count||0),0)})()"), 96],
      splitSum:   [await p.evalx("[...document.querySelectorAll('.dp-split i')].reduce((a,i)=>a+parseFloat(i.style.width),0)>95"), true],
    })},
  { name: "dashboard-company-empty", page: "dashboard.html?view=company",
    before: setEndpoint("document.body", "/fixtures/dashboard-company-empty.json"),
    expect: async p => ({
      // the zero-state that used to show stale sample figures
      heatTotal: [await p.evalx("(()=>{const g=[...document.querySelectorAll('.dp-heat')].find(g=>g.offsetParent!==null);return [...g.querySelectorAll('i')].reduce((a,i)=>a+(+i.dataset.count||0),0)})()"), 0],
      heading:   [await p.evalx("/^0 /.test([...document.querySelectorAll('[id^=dpHeatTitle]')].find(e=>e.offsetParent!==null).textContent)"), true],
      splitBars: [await p.evalx("document.querySelectorAll('.dp-split i').length"), 0],
      briefRows: [await p.evalx("document.querySelectorAll('.dp-table tbody tr').length"), 1],
    })},
  { name: "challenges", page: "challenges.html",
    before: setEndpoint("document.getElementById('clGrid')", "/fixtures/challenges.json"),
    expect: async p => ({
      cards:       [await p.evalx("document.querySelectorAll('.cl-card').length"), 4],
      noneHidden:  [await p.evalx("document.getElementById('clNone').hidden"), true],
      placeholder: [await p.evalx("!!document.querySelector('[data-placeholder=\"sample-briefs\"]')"), false],
      noUndefined: [await p.evalx("/undefined/.test(document.querySelector('.cl-grid').textContent)"), false],
    })},
  { name: "challenges-empty", page: "challenges.html",
    before: setEndpoint("document.getElementById('clGrid')", "/fixtures/challenges-empty.json"),
    expect: async p => ({
      cards:        [await p.evalx("document.querySelectorAll('.cl-card').length"), 0],
      noneShown:    [await p.evalx("!document.getElementById('clNone').hidden"), true],
      filtersGone:  [await p.evalx("getComputedStyle(document.querySelector('.cl-filters')).display"), "none"],
    })},
];

async function checkFixtures() {
  for (const fx of FIXTURES) {
    const p = await open(BASE + fx.page, { before: fx.before });
    await sleep(900);
    for (const e of p.errors()) fail(`fixture ${fx.name}`, e);
    const got = await fx.expect(p);
    let ok = true;
    for (const [k, [actual, want]] of Object.entries(got)) {
      if (actual !== want) { ok = false; fail(`fixture ${fx.name}`, `${k}: got ${JSON.stringify(actual)}, want ${JSON.stringify(want)}`); }
    }
    console.log(`  ${ok && !p.errors().length ? "ok  " : "FAIL"} fixture ${fx.name}`);
    await p.close();
  }
}

/* ---------------- run ---------------- */
let server, chrome;
try {
  server = await startServer();
  chrome = await startChrome();
  if (only !== "fixtures") { console.log("\npages:");    await checkPages(); }
  if (only !== "pages")    { console.log("\nfixtures:"); await checkFixtures(); }
} catch (e) {
  fail("harness", e.message);
} finally {
  chrome?.kill(); server?.kill();
}

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log("\nall checks passed");
