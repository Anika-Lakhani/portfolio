/*
 * The opening ident: an orange "nik" splat that pops in, holds, then zooms
 * through the camera and dissolves into the homepage.
 *
 * The logo appears on its own and waits; clicking it (or anywhere, or pressing
 * a key) launches the zoom and the sound. Browsers only allow sound after a
 * click, so the click is what makes the audio work. It only plays once per
 * browser session, and deep links (e.g. #/title/codemic) skip it entirely.
 */
(function () {
  const SEEN_KEY = "nik-intro-seen";

  // Build a wobbly paint-splat outline with a few drips, centered in a 400x260 box.
  function splatPath() {
    const cx = 200, cy = 118, rx = 165, ry = 98;
    const wobble = [1, .92, 1.08, .95, 1.12, .9, 1.04, .97, 1.1, .88, 1.06, .94, 1.02, .9];
    const pts = wobble.map((w, i) => {
      const a = (i / wobble.length) * Math.PI * 2;
      return [cx + Math.cos(a) * rx * w, cy + Math.sin(a) * ry * w];
    });
    // Smooth closed curve through the midpoints of each edge
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    let d = `M${mid(pts[pts.length - 1], pts[0]).join(",")}`;
    pts.forEach((p, i) => {
      const m = mid(p, pts[(i + 1) % pts.length]);
      d += ` Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${m[0].toFixed(1)},${m[1].toFixed(1)}`;
    });
    // Drips hanging off the bottom edge
    const drips = [[150, 46, 11], [228, 66, 13], [282, 34, 9]];
    const dripPaths = drips.map(([x, len, w]) =>
      `M${x - w},${cy + 70} L${x - w},${cy + 70 + len} A${w},${w} 0 0 0 ${x + w},${cy + 70 + len} L${x + w},${cy + 70} Z`
    );
    return [d + " Z", ...dripPaths];
  }

  function drawSplat(svg) {
    svg.innerHTML = splatPath().map((d) => `<path d="${d}"/>`).join("");
  }

  function sprinkleStars(el) {
    let html = "";
    for (let i = 0; i < 70; i++) {
      const size = Math.random() < 0.15 ? 3 : 2;
      html += `<i style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;animation-delay:${(Math.random() * 2.4).toFixed(2)}s"></i>`;
    }
    el.innerHTML = html;
  }

  /*
   * An original "ba-dum... whoosh" made with the Web Audio API — two soft low
   * thumps followed by a warm chord that swells and fades with the zoom.
   * No audio files needed.
   */
  function playSting() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime + 0.05;
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    function thump(t, freq) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + 0.35);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.9, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 0.6);
    }
    thump(now, 110);
    thump(now + 0.32, 82);

    // The swell: detuned saws through a filter that opens up as the logo zooms
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(180, now + 0.7);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 2.4);
    filter.frequency.exponentialRampToValueAtTime(300, now + 3.8);
    const pad = ctx.createGain();
    pad.gain.setValueAtTime(0.0001, now + 0.7);
    pad.gain.exponentialRampToValueAtTime(0.16, now + 2.0);
    pad.gain.exponentialRampToValueAtTime(0.0001, now + 3.9);
    filter.connect(pad).connect(master);

    // D major-ish voicing, spread over a few octaves
    [73.42, 110, 146.83, 185, 220, 293.66].forEach((f) => {
      [-6, 6].forEach((detune) => {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = f;
        o.detune.value = detune;
        o.connect(filter);
        o.start(now + 0.7);
        o.stop(now + 4);
      });
    });

    setTimeout(() => ctx.close(), 4500);
  }

  function run(onDone) {
    const el = document.getElementById("intro");
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch (_) {}
    const isDeepLink = location.hash && location.hash !== "#/" && location.hash !== "#";
    if (!el || seen || isDeepLink) return onDone();

    drawSplat(el.querySelector(".intro__splat"));
    sprinkleStars(el.querySelector(".intro__stars"));
    el.hidden = false;
    document.body.classList.add("no-scroll");

    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem(SEEN_KEY, "1"); } catch (_) {}
      el.classList.add("is-leaving");
      document.body.classList.remove("no-scroll");
      onDone();
      setTimeout(() => { el.hidden = true; }, 650);
    }

    const logo = el.querySelector(".intro__logo");
    el.classList.add("is-ready");
    logo.focus({ preventScroll: true });

    let launched = false;
    function launch() {
      if (launched) return;
      launched = true;
      el.removeEventListener("click", launch);
      window.removeEventListener("keydown", launch);
      el.classList.replace("is-ready", "is-launching");
      playSting();
      logo.addEventListener("animationend", (e) => {
        if (e.animationName === "logo-launch") finish();
      });
      setTimeout(finish, 3800); // safety net if animationend never fires
    }

    el.addEventListener("click", launch);
    window.addEventListener("keydown", launch);
  }

  window.Intro = { run };
})();
