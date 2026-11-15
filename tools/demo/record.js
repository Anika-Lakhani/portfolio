// Records a walkthrough of the heart-risk app as timestamped JPEG frames (CDP screencast).
// Usage: node record.js <outDir> [--dry]
const { chromium } = require("/Users/anikalakhani/.npm/_npx/e41f203b7505f1fb/node_modules/playwright");
const fs = require("fs");
const path = require("path");

const URL = "https://anika-lakhani.github.io/south-asian-heart-risk/";
const outDir = process.argv[2];
const dry = process.argv.includes("--dry");
fs.mkdirSync(path.join(outDir, "frames"), { recursive: true });

// A visible cursor + click ripple, since headless Chromium doesn't paint one
const CURSOR = `
  window.addEventListener('DOMContentLoaded', () => {
    const c = document.createElement('div');
    c.id = '__cursor';
    c.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 2l15 9.5-6.6 1.4 3.9 7.6-2.9 1.5-3.9-7.6L4 19z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    Object.assign(c.style, {position:'fixed', left:'0', top:'0', zIndex: 2147483647, pointerEvents:'none', transform:'translate(-100px,-100px)', filter:'drop-shadow(0 2px 3px rgba(0,0,0,.3))'});
    document.documentElement.appendChild(c);
    addEventListener('mousemove', e => { c.style.transform = 'translate(' + (e.clientX - 4) + 'px,' + (e.clientY - 2) + 'px)'; }, true);
    addEventListener('mousedown', e => {
      const r = document.createElement('div');
      Object.assign(r.style, {position:'fixed', left:(e.clientX-18)+'px', top:(e.clientY-18)+'px', width:'36px', height:'36px', borderRadius:'50%', background:'rgba(37,99,235,.35)', zIndex:2147483646, pointerEvents:'none', transition:'transform .45s ease-out, opacity .45s ease-out'});
      document.documentElement.appendChild(r);
      requestAnimationFrame(() => { r.style.transform = 'scale(1.8)'; r.style.opacity = '0'; });
      setTimeout(() => r.remove(), 500);
    }, true);
  });`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  await page.addInitScript(CURSOR);

  // Safety: this records the live site, so block anything that could write a donation.
  // Reads (like the contributor count) still go through.
  const blocked = [];
  await page.route("**/*", (route) => {
    const req = route.request();
    const writes = req.method() !== "GET" && req.method() !== "HEAD" && req.method() !== "OPTIONS";
    const readOnlyRpc = /\/rpc\/contributor_count/.test(req.url()); // a read that happens to use POST
    if (writes && !readOnlyRpc && /supabase|functions|turnstile|challenges\.cloudflare/i.test(req.url())) {
      blocked.push(`${req.method()} ${req.url()}`);
      return route.abort();
    }
    return route.continue();
  });

  const frames = [];
  const cdp = await page.context().newCDPSession(page);
  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    const file = `f${String(frames.length).padStart(5, "0")}.jpg`;
    fs.writeFileSync(path.join(outDir, "frames", file), Buffer.from(data, "base64"));
    frames.push({ file, t: metadata.timestamp });
    cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });

  let mouse = { x: 640, y: 400 };
  async function moveTo(locator) {
    await locator.scrollIntoViewIfNeeded();
    const b = await locator.boundingBox();
    const x = b.x + b.width / 2, y = b.y + b.height / 2;
    await page.mouse.move(x, y, { steps: 22 });
    mouse = { x, y };
  }
  async function click(locator, pause = 700) {
    await moveTo(locator);
    await sleep(250);
    await page.mouse.down(); await page.mouse.up();
    await sleep(pause);
  }
  async function smoothScrollTo(locator, offset = 90) {
    const top = await locator.evaluate((el, off) => el.getBoundingClientRect().top + scrollY - off, offset);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "smooth" }), top);
    await sleep(1100);
  }
  const shot = async (name) => dry && page.screenshot({ path: path.join(outDir, name + ".png") });

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.mouse.move(mouse.x, mouse.y);
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
  await sleep(1500);

  // Step 1: about you. First the ineligible path: someone who's already had a heart event
  // gets an explanation instead of a misleading score, and an invitation to donate.
  await click(page.getByRole("button", { name: "Yes", exact: true }), 900);
  const why = page.getByRole("button", { name: "Learn why" });
  if (await why.count()) await click(why, 1600);
  await moveTo(page.getByRole("button", { name: /Donate my data/ }));
  await sleep(1400);
  await shot("0-ineligible");
  await click(page.getByRole("button", { name: "No", exact: true }));
  await click(page.getByRole("button", { name: "Male", exact: true }));
  const ancestry = page.locator("select").first();
  await moveTo(ancestry);
  await ancestry.selectOption("pakistani");
  await sleep(700);
  await shot("1-about");
  await click(page.getByRole("button", { name: /Continue/ }), 900);

  // Step 2: numbers. Defaults are kept so the results match the case study (4.0%, 2.4%, 7.5%).
  await shot("2-numbers");
  await moveTo(page.getByText("Systolic blood pressure").first());
  await sleep(900);
  await click(page.getByRole("button", { name: /Continue/ }), 900);

  // Step 3: health history, then review
  await shot("3-history");
  await click(page.getByRole("button", { name: /Continue/ }), 900);
  await shot("4-review");
  await click(page.getByRole("button", { name: /See my heart risk/ }), 1400);

  // Results: big picture, then the three calculator cards
  await shot("5-results");
  await page.mouse.move(1100, 650, { steps: 15 });
  await sleep(1200);
  const cards = page.getByText("10-year estimate", { exact: false });
  if (await cards.count()) {
    await smoothScrollTo(cards.first(), 260);
    await sleep(600);
    // Point at QRISK3 to show its plain-language explainer
    const qrisk = page.getByText("QRISK3", { exact: true }).first();
    await moveTo(qrisk);
    await sleep(2200);
    await shot("6-explainer");
    await page.mouse.move(640, 690, { steps: 15 });
    await sleep(600);
  }

  // Measurement uncertainty: dots, ranges, in words, back to dots
  await smoothScrollTo(page.getByText("How sure is that number?").first(), 80);
  await sleep(900);
  const group = page.getByRole("group", { name: "Show uncertainty as" });
  await click(group.getByRole("button", { name: "Ranges" }), 1600);
  await shot("7-ranges");
  await click(group.getByRole("button", { name: "In words" }), 1600);
  await click(group.getByRole("button", { name: "Dots" }), 1200);

  // People like you
  await click(page.getByText("Compare with people like you").first(), 1800);
  await smoothScrollTo(page.locator(".dotplots").first(), 120);
  await sleep(2400);
  await shot("8-peers");

  // Donate my data, from the results page
  const card = page.locator(".donate-card");
  await smoothScrollTo(card, 220);
  await sleep(900);
  await click(card.getByRole("button", { name: /Learn more and donate/ }), 1400);
  await page.mouse.move(1150, 420, { steps: 12 });
  await sleep(1200);
  await shot("9-story");
  const flatten = page.getByText("The system flattens it").first();
  if (await flatten.count()) { await smoothScrollTo(flatten, 120); await sleep(1800); }
  const consent = page.locator(".consent-check input");
  await smoothScrollTo(consent, 380);
  await click(consent, 800);
  await click(page.getByRole("button", { name: /^Start/ }), 1400);
  await shot("10-survey");
  // Answer a couple of research questions, then stop: Submit is never clicked
  const fields = page.locator(".survey-card .survey-field");
  for (let i = 0; i < Math.min(2, await fields.count()); i++) {
    const opt = fields.nth(i).locator(".survey-options button").first();
    if (await opt.count()) await click(opt, 700);
  }
  await moveTo(page.locator(".survey-card .primary-button").first());
  await sleep(1500);

  await cdp.send("Page.stopScreencast");
  await sleep(300);

  // Stills of the privacy page for the portfolio's "Whose detail goes first?" episode
  await page.goto(URL + "#privacy", { waitUntil: "networkidle" });
  await page.evaluate(() => document.getElementById("__cursor")?.remove());
  await sleep(800);
  await page.screenshot({ path: path.join(outDir, "privacy-full.png"), fullPage: true });
  await page.screenshot({ path: path.join(outDir, "privacy.png") });
  console.log(`blocked writes: ${blocked.length}`, blocked.slice(0, 3));
  fs.writeFileSync(path.join(outDir, "frames.json"), JSON.stringify(frames));
  console.log(`frames: ${frames.length}, seconds: ${(frames.at(-1).t - frames[0].t).toFixed(1)}`);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
