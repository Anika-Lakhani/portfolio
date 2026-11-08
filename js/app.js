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
  };

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
    app.innerHTML = `<div class="home">${rows.map(renderRow).join("")}</div>`;
    app.querySelectorAll(".row__viewport").forEach(wireRow);
  }

  function renderRow(row) {
    const cards = row.ids
      .filter((id) => projects[id])
      .map((id) => {
        const p = projects[id];
        return `
          <a class="card" href="#/title/${id}" aria-label="${esc(p.title)}">
            ${art(p)}
            ${p.top10 ? '<span class="top10"><small>TOP</small><b>10</b></span>' : ""}
            ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
          </a>`;
      })
      .join("");
    return `
      <section class="row">
        <h2 class="row__title">${esc(row.title)}</h2>
        <div class="row__viewport">
          <button class="row__arrow row__arrow--left" aria-label="Scroll left">‹</button>
          <div class="row__track">${cards}</div>
          <button class="row__arrow row__arrow--right" aria-label="Scroll right">›</button>
        </div>
      </section>`;
  }

  function wireRow(vp) {
    const track = vp.querySelector(".row__track");
    const left = vp.querySelector(".row__arrow--left");
    const right = vp.querySelector(".row__arrow--right");
    const update = () => {
      left.disabled = track.scrollLeft < 5;
      right.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    };
    left.onclick = () => track.scrollBy({ left: -track.clientWidth * 0.85, behavior: "smooth" });
    right.onclick = () => track.scrollBy({ left: track.clientWidth * 0.85, behavior: "smooth" });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // ---------- Project listing (modal) ----------
  let lastFocus = null;

  function openListing(id) {
    const p = projects[id];
    if (!p) return closeListing();
    lastFocus = document.activeElement;
    const liked = getLikes().has(id);
    const eps = p.episodes || [];
    const year = (p.created || "").match(/\d{4}/)?.[0] || "";

    modalRoot.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="listing-title">
        <article class="modal__panel">
          <button class="modal__close" aria-label="Close">✕</button>

          <div class="hero">
            ${art(p, { title: "" })}
            ${p.video ? `<video src="${esc(p.video)}" autoplay muted loop playsinline preload="auto"></video>` : ""}
            <div class="hero__fade"></div>
            <div class="hero__content">
              <h1 class="hero__title" style="font-family:'${esc(p.font)}'">${esc(p.title)}</h1>
              <div class="hero__actions">
                <a class="btn-play" href="${esc(p.link)}" target="_blank" rel="noopener">${icons.play}Watch Now</a>
                <button class="btn-circle like ${liked ? "is-on" : ""}" aria-pressed="${liked}" aria-label="I like this">${icons.thumb}</button>
              </div>
            </div>
            ${p.video ? `<button class="btn-circle hero__mute" aria-label="Turn sound on">${icons.soundOff}</button>` : ""}
          </div>

          <div class="details">
            <div>
              <div class="meta-line">
                ${p.badge ? `<span class="new">${esc(p.badge)}</span>` : ""}
                ${year ? `<span>${year}</span>` : ""}
                <span>${eps.length} Episode${eps.length === 1 ? "" : "s"}</span>
                <span class="pill">HD</span>
              </div>
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

    const likeBtn = modal.querySelector(".like");
    likeBtn.onclick = () => {
      const on = !likeBtn.classList.contains("is-on");
      likeBtn.classList.toggle("is-on", on);
      likeBtn.setAttribute("aria-pressed", on);
      setLiked(id, on);
    };

    // Demo video: fade in once frames arrive; if it fails, the key art stays as the thumbnail
    const video = modal.querySelector("video");
    if (video) {
      const mute = modal.querySelector(".hero__mute");
      video.addEventListener("playing", () => video.classList.add("is-playing"));
      video.addEventListener("error", () => { video.remove(); mute.remove(); });
      video.play?.().catch(() => {});
      mute.onclick = () => {
        video.muted = !video.muted;
        mute.innerHTML = video.muted ? icons.soundOff : icons.soundOn;
        mute.setAttribute("aria-label", video.muted ? "Turn sound on" : "Turn sound off");
      };
    }
  }

  function closeListing() {
    if (!modalRoot.innerHTML) return;
    modalRoot.innerHTML = "";
    document.body.classList.remove("no-scroll");
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
  window.addEventListener("hashchange", route);

  route();
  window.Intro.run(() => {});
})();
