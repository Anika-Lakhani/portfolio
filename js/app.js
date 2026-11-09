/*
 * Tiny hash router + views. Routes:
 *   #/              home (rows of projects)
 *   #/title/<id>    home with a project's listing open on top
 *   #/about         about me
 * Hash routing keeps everything working on GitHub Pages with no server config.
 */
(function () {
  const { projects, rows, owner } = window.PORTFOLIO;
  const app = document.getElementById("app");
  const modalRoot = document.getElementById("modal-root");
  const nav = document.getElementById("nav");
  const LIKES_KEY = "nik-likes";

  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // ---------- Likes (per-visitor, stored in this browser only) ----------
  function getLikes() {
    try { return new Set(JSON.parse(localStorage.getItem(LIKES_KEY) || "[]")); } catch (_) { return new Set(); }
  }
  function setLiked(id, on) {
    const likes = getLikes();
    on ? likes.add(id) : likes.delete(id);
    try { localStorage.setItem(LIKES_KEY, JSON.stringify([...likes])); } catch (_) {}
  }

  // ---------- Shared pieces ----------
  const icons = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8z"/></svg>',
    thumb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 11v9H4v-9h3zm0 0l4-8c1.7 0 2.5 1 2.2 2.6L12.6 9H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7"/></svg>',
    soundOn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
    soundOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5v.5"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  };

  const yearOf = (p) => (p.created || "").match(/\d{4}/)?.[0] || "";

  // "New Season · 2026 · 3 Episodes · HD"
  function metaLine(p) {
    const n = (p.episodes || []).length;
    return `
      <div class="meta-line">
        ${p.badge ? `<span class="new">${esc(p.badge)}</span>` : ""}
        ${yearOf(p) ? `<span>${yearOf(p)}</span>` : ""}
        <span>${n} Episode${n === 1 ? "" : "s"}</span>
        <span class="pill">HD</span>
      </div>`;
  }

  function likeButton(id) {
    const on = getLikes().has(id);
    return `<button class="btn-circle like ${on ? "is-on" : ""}" data-id="${esc(id)}" aria-pressed="${on}" aria-label="I like this">${icons.thumb}</button>`;
  }

  function wireLike(btn) {
    btn.onclick = (e) => {
      e.preventDefault();
      const on = !btn.classList.contains("is-on");
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on);
      setLiked(btn.dataset.id, on);
    };
  }

  // Muted autoplay demo: fades in once frames arrive; on error the key art underneath stays as the thumbnail
  function wireVideo(video, muteBtn) {
    if (!video) return;
    video.addEventListener("playing", () => video.classList.add("is-playing"));
    video.addEventListener("error", () => { video.remove(); muteBtn?.remove(); });
    video.play?.().catch(() => {});
    if (!muteBtn) return;
    muteBtn.onclick = () => {
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted ? icons.soundOff : icons.soundOn;
      muteBtn.setAttribute("aria-label", video.muted ? "Turn sound on" : "Turn sound off");
    };
  }

  const demoVideo = (p) => (p.video ? `<video src="${esc(p.video)}" autoplay muted loop playsinline preload="auto"></video>` : "");
  const muteButton = (cls) => `<button class="btn-circle ${cls}" aria-label="Turn sound on">${icons.soundOff}</button>`;

  // Key art: a real image if the project has one, otherwise a painted gradient
  // with the title set in the project's font. `shift` varies the art for episodes.
  function art(p, { title = p.title, num, image = p.image, shift = 0 } = {}) {
    const [a1, a2, a3 = a2] = p.palette || ["#333", "#555"];
    const style = `--a1:${a1};--a3:${a3};background:linear-gradient(${135 + shift * 40}deg, ${a1}, ${a2} 60%, ${a3});`;
    const inner = image
      ? `<img src="${esc(image)}" alt="" loading="lazy" />`
      : `${num != null ? `<span class="art__num">${num}</span>` : ""}<span class="art__title" style="font-family:'${esc(p.font)}'">${esc(title)}</span>`;
    return `<div class="art" style="${style}">${inner}</div>`;
  }

  function setActiveNav(route) {
    nav.querySelectorAll("[data-route]").forEach((a) => a.classList.toggle("is-active", a.dataset.route === route));
  }

  // ---------- Home ----------
  function renderHome() {
    if (app.dataset.view === "home") return; // keep scroll position when closing a listing
    app.dataset.view = "home";
    app.innerHTML = `<div class="home">${renderBillboard()}<div class="home__rows">${rows.map(renderRow).join("")}</div></div>`;
    wireBillboard();
    app.querySelectorAll(".row").forEach(wireRow);
    introDone.then(() => revealRows(app.querySelectorAll(".row")));
  }

  // ---------- Billboard (the big featured project at the top of the homepage) ----------
  function renderBillboard() {
    const f = window.PORTFOLIO.featured;
    const p = f && projects[f.id];
    if (!p) return "";
    return `
      <section class="billboard">
        ${art(p, { title: "" })}
        ${demoVideo(p)}
        <div class="billboard__shade"></div>
        <div class="billboard__content">
          <div class="billboard__kicker"><b>A</b> PROJECT</div>
          <h1 class="billboard__title" style="font-family:'${esc(p.font)}'">${esc(p.title)}</h1>
          ${p.top10 ? '<div class="billboard__rank"><span class="rank-badge"><small>TOP</small>10</span>#1 in Projects Today</div>' : ""}
          <p class="billboard__pitch">${esc(f.pitch || p.description)}</p>
          <div class="billboard__actions">
            <a class="btn-play" href="${esc(p.link)}" target="_blank" rel="noopener">${icons.play}Watch Now</a>
            <a class="btn-info" href="#/title/${esc(f.id)}">${icons.info}More Info</a>
          </div>
        </div>
        ${p.video ? muteButton("billboard__mute") : ""}
      </section>`;
  }

  function wireBillboard() {
    const bb = app.querySelector(".billboard");
    const video = bb?.querySelector("video");
    if (!video) return;
    wireVideo(video, bb.querySelector(".billboard__mute"));
    // Pause the trailer when it's scrolled away or a listing is open on top
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !modalRoot.innerHTML) video.play?.().catch(() => {});
        else video.pause();
      }, { threshold: 0.25 }).observe(bb);
    }
  }

  function billboardVideo() { return app.querySelector(".billboard video"); }

  // Rows slide in as they scroll into view (waits until the intro has finished)
  function revealRows(rowEls) {
    if (!("IntersectionObserver" in window)) return rowEls.forEach((r) => r.classList.add("is-in"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.2 });
    rowEls.forEach((r) => io.observe(r));
  }

  function renderRow(row) {
    const cards = row.ids
      .filter((id) => projects[id])
      .map((id, i) => {
        const p = projects[id];
        return `
          <a class="card" href="#/title/${id}" aria-label="${esc(p.title)}" style="--i:${i}">
            ${art(p)}
            ${p.top10 ? '<span class="top10"><small>TOP</small><b>10</b></span>' : ""}
            ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
          </a>`;
      })
      .join("");
    return `
      <section class="row">
        <div class="row__head">
          <h2 class="row__title">${esc(row.title)}</h2>
          <div class="row__pages" aria-hidden="true"></div>
        </div>
        <div class="row__viewport">
          <button class="row__arrow row__arrow--left" aria-label="Scroll left">‹</button>
          <div class="row__track">${cards}</div>
          <button class="row__arrow row__arrow--right" aria-label="Scroll right">›</button>
        </div>
      </section>`;
  }

  function wireRow(row) {
    const track = row.querySelector(".row__track");
    const left = row.querySelector(".row__arrow--left");
    const right = row.querySelector(".row__arrow--right");
    const pagesEl = row.querySelector(".row__pages");

    // Arrows + the little page dashes in the row's top-right corner
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      left.disabled = track.scrollLeft < 5;
      right.disabled = track.scrollLeft >= max - 5;
      const pages = max > 5 ? Math.ceil(track.scrollWidth / track.clientWidth) : 0;
      if (pagesEl.childElementCount !== pages) pagesEl.innerHTML = "<i></i>".repeat(pages);
      const active = pages ? Math.round((track.scrollLeft / max) * (pages - 1)) : -1;
      [...pagesEl.children].forEach((d, i) => d.classList.toggle("is-active", i === active));
    };
    left.onclick = () => track.scrollBy({ left: -track.clientWidth * 0.85, behavior: "smooth" });
    right.onclick = () => track.scrollBy({ left: track.clientWidth * 0.85, behavior: "smooth" });

    // Cards lean into sideways motion, then settle back when scrolling stops
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastLeft = track.scrollLeft, tilt = 0, frame = null;
    function settle() {
      const velocity = track.scrollLeft - lastLeft;
      lastLeft = track.scrollLeft;
      const target = Math.max(-14, Math.min(14, -velocity * 0.6));
      tilt += (target - tilt) * 0.2;
      track.style.setProperty("--tilt", `${tilt.toFixed(2)}deg`);
      frame = Math.abs(tilt) > 0.05 || velocity !== 0 ? requestAnimationFrame(settle) : null;
      if (!frame) track.style.setProperty("--tilt", "0deg");
    }

    track.addEventListener("scroll", () => {
      update();
      if (!calm && !frame) frame = requestAnimationFrame(settle);
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // ---------- Hover preview ----------
  // Resting on a card for a moment grows it into a mini listing with the demo
  // playing. Only on devices with a real mouse; touch just taps through.
  const preview = document.createElement("div");
  preview.className = "preview";
  document.body.appendChild(preview);
  const PREVIEW_SCALE = 1.5;
  let hoverTimer = null, pendingCard = null;

  function showPreview(card) {
    const id = card.getAttribute("href").split("/").pop();
    const p = projects[id];
    if (!p || modalRoot.innerHTML) return;

    const r = card.getBoundingClientRect();
    const w = r.width * PREVIEW_SCALE;
    const artH = (w * 9) / 16;
    const vw = document.documentElement.clientWidth;
    // Keep the popup on screen at the row ends; it grows out of the card's own position
    const left = Math.min(Math.max(r.left + r.width / 2 - w / 2, 8), vw - w - 8);
    preview.innerHTML = `
      <a class="preview__art" href="#/title/${id}" aria-label="${esc(p.title)}">${art(p)}${demoVideo(p)}</a>
      <div class="preview__body">
        <div class="preview__actions">
          <a class="btn-circle btn-circle--solid" href="${esc(p.link)}" target="_blank" rel="noopener" aria-label="Watch now">${icons.play}</a>
          ${likeButton(id)}
          <a class="btn-circle preview__more" href="#/title/${id}" aria-label="More info">${icons.chevron}</a>
        </div>
        ${metaLine(p)}
        <div class="preview__tags">${(p.tags || []).map(esc).join('<i aria-hidden="true">•</i>')}</div>
      </div>`;
    wireLike(preview.querySelector(".like"));
    wireVideo(preview.querySelector("video"));

    // Center the art over the card, but nudge the popup to stay between the nav and the screen bottom
    preview.style.width = `${w}px`;
    const h = preview.offsetHeight;
    let top = r.top - (artH - r.height) / 2;
    top = Math.max(72, Math.min(top, window.innerHeight - h - 8));
    preview.style.cssText =
      `left:${left + window.scrollX}px;top:${top + window.scrollY}px;width:${w}px;` +
      `--origin-x:${r.left + r.width / 2 - left}px;--origin-y:${r.top + r.height / 2 - top}px;--from:${1 / PREVIEW_SCALE}`;

    preview.classList.remove("is-open");
    void preview.offsetWidth; // restart the grow animation
    preview.classList.add("is-open");
  }

  function hidePreview() {
    clearTimeout(hoverTimer);
    pendingCard = null;
    if (!preview.classList.contains("is-open")) return;
    preview.classList.remove("is-open");
    preview.querySelector("video")?.pause();
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    app.addEventListener("mouseover", (e) => {
      const card = e.target.closest(".card");
      if (!card || card === pendingCard) return;
      clearTimeout(hoverTimer);
      pendingCard = card;
      hoverTimer = setTimeout(() => showPreview(card), 450);
    });
    app.addEventListener("mouseout", (e) => {
      const card = e.target.closest(".card");
      if (!card || card.contains(e.relatedTarget)) return;
      clearTimeout(hoverTimer);
      pendingCard = null;
    });
    preview.addEventListener("mouseleave", hidePreview);
    preview.addEventListener("click", (e) => { if (e.target.closest('a[href^="#"]')) hidePreview(); });
    // Any scroll (page or row) would leave the popup floating in the wrong place
    document.addEventListener("scroll", hidePreview, { capture: true, passive: true });
  }

  // ---------- Project listing (modal) ----------
  let lastFocus = null;

  function openListing(id) {
    const p = projects[id];
    if (!p) return closeListing();
    lastFocus = document.activeElement;
    hidePreview();
    billboardVideo()?.pause();
    const eps = p.episodes || [];

    modalRoot.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="listing-title">
        <article class="modal__panel">
          <button class="modal__close" aria-label="Close">✕</button>

          <div class="hero">
            ${art(p, { title: "" })}
            ${demoVideo(p)}
            <div class="hero__fade"></div>
            <div class="hero__content">
              <h1 class="hero__title" style="font-family:'${esc(p.font)}'">${esc(p.title)}</h1>
              <div class="hero__actions">
                <a class="btn-play" href="${esc(p.link)}" target="_blank" rel="noopener">${icons.play}Watch Now</a>
                ${likeButton(id)}
              </div>
            </div>
            ${p.video ? muteButton("hero__mute") : ""}
          </div>

          <div class="details">
            <div>
              ${metaLine(p)}
              <div class="meta-line">${(p.tags || []).map((t) => `<span class="pill">${esc(t)}</span>`).join("")}</div>
              <h2 class="details__title" id="listing-title">${esc(p.title)}</h2>
              <p class="details__desc">${esc(p.description)}</p>
            </div>
            <div class="facts">
              <p><span>Date created:</span> ${esc(p.created)}</p>
              <p><span>Last revised:</span> ${esc(p.revised)}</p>
              <p><span>Collaborators:</span> ${esc(p.collaborators)}</p>
              <p><span>Target audience:</span> ${esc(p.audience)}</p>
              <p><span>Inspiration:</span> ${esc(p.inspiration)}</p>
            </div>
          </div>

          ${eps.length ? `
          <section class="episodes">
            <div class="episodes__head"><h3>Episodes</h3><span>${esc(p.title)}</span></div>
            ${eps.map((e, i) => `
              <div class="episode">
                <div class="episode__num">${i + 1}</div>
                <div class="episode__thumb">${art(p, { title: e.title, num: i + 1, image: e.image, shift: i + 1 })}</div>
                <div>
                  <div class="episode__top"><span>${esc(e.title)}</span><span>${esc(e.duration || "")}</span></div>
                  <p>${esc(e.description)}</p>
                </div>
              </div>`).join("")}
          </section>` : ""}
        </article>
      </div>`;

    document.body.classList.add("no-scroll");
    const modal = modalRoot.querySelector(".modal");
    modal.addEventListener("click", (e) => { if (e.target === modal) goHome(); });
    modal.querySelector(".modal__close").onclick = goHome;
    modal.querySelector(".modal__close").focus({ preventScroll: true });

    wireLike(modal.querySelector(".like"));
    wireVideo(modal.querySelector("video"), modal.querySelector(".hero__mute"));
  }

  function closeListing() {
    if (!modalRoot.innerHTML) return;
    modalRoot.innerHTML = "";
    document.body.classList.remove("no-scroll");
    billboardVideo()?.play?.().catch(() => {});
    lastFocus?.focus?.({ preventScroll: true });
  }

  function goHome() { location.hash = "#/"; }

  // ---------- About ----------
  function renderAbout() {
    app.dataset.view = "about";
    const seasons = [
      { when: "2026", title: "Now streaming", text: "Building tools at the intersection of health, data and AI. (Placeholder — tell me what you're up to!)" },
      { when: "2025", title: "Andromeda Protocol", text: "Built an onboarding playground for engineering interns working with LLM APIs." },
      { when: "2024–25", title: "Senior thesis & research", text: "Interpretability (CODEMIC) and bio-inspired noise robustness for CNNs." },
      { when: "2024", title: "Microsoft", text: "Summer internship." },
      { when: "Earlier", title: "Computer science, undergrad", text: "Distributed systems, algorithms, and a lot of late nights in the lab." },
    ];
    const skills = ["Python", "TypeScript", "PyTorch", "Data visualization", "LLM apps", "Interpretability", "Product thinking", "Health tech"];
    const likedTitles = [...getLikes()].filter((id) => projects[id]).map((id) => projects[id].title);

    app.innerHTML = `
      <div class="about">
        <section class="about__hero">
          <div class="about__intro">
            <div class="about__kicker"><b>A</b> ORIGINAL SERIES</div>
            <h1 class="about__name">${esc(owner.name)}</h1>
            <p class="about__logline">An engineer who builds friendly tools for serious problems — from heart-risk calculators to debugging what image models actually learn.</p>
            <a class="btn-play" href="#/">${icons.play}Browse Projects</a>
          </div>
        </section>

        <div class="about__body">
          <div>
            <h2>Synopsis</h2>
            <p>I like projects where good engineering meets a real person on the other end: a clinician trying to explain risk, a friend walking home late, an intern on their first day. I'm happiest when a model, a dataset and a well-designed interface all click together.</p>
            <p class="placeholder-note">Placeholder bio — we'll swap in your real words.</p>

            <h2>Seasons</h2>
            ${seasons.map((s) => `
              <div class="season">
                <div class="season__when">${esc(s.when)}</div>
                <div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
              </div>`).join("")}
          </div>

          <aside>
            <h2>Genres</h2>
            <div class="chips">${skills.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>

            <h2>Get in touch</h2>
            <div class="contact">
              <a href="${esc(owner.github)}" target="_blank" rel="noopener">GitHub ↗</a>
              <span class="placeholder-note">Email, LinkedIn and résumé links go here.</span>
            </div>

            ${likedTitles.length ? `<h2>Your thumbs up</h2><div class="chips">${likedTitles.map((t) => `<span class="chip">👍 ${esc(t)}</span>`).join("")}</div>` : ""}
          </aside>
        </div>
      </div>`;
    window.scrollTo(0, 0);
  }

  // ---------- Router ----------
  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    const [page, id] = hash.split("/");
    if (page === "about") {
      closeListing();
      setActiveNav("about");
      renderAbout();
    } else {
      setActiveNav("home");
      renderHome();
      page === "title" && id ? openListing(decodeURIComponent(id)) : closeListing();
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalRoot.innerHTML) goHome();
  });
  window.addEventListener("scroll", () => nav.classList.toggle("is-solid", window.scrollY > 40), { passive: true });
  window.addEventListener("hashchange", () => { hidePreview(); route(); });

  let markIntroDone;
  const introDone = new Promise((resolve) => { markIntroDone = resolve; });

  route();
  window.Intro.run(() => markIntroDone());
})();
