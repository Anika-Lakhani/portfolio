/*
 * "Who's watching?" — after the intro, visitors pick a persona. The choice is
 * stored for the session and exposed as <body data-persona="..."> and
 * window.Profiles.current(), so views can be personalized later.
 */
(function () {
  const KEY = "nik-persona";

  // Each avatar is a small original SVG: a colored tile, a face, and one accessory
  const face = (extra = "", mouth = "M34 64 Q50 76 66 64") => `
    <circle cx="36" cy="44" r="5" fill="#fff"/><circle cx="64" cy="44" r="5" fill="#fff"/>
    <path d="${mouth}" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>${extra}`;

  const PERSONAS = [
    {
      id: "recruiter",
      label: "Recruiter",
      colors: ["#2563eb", "#1e3a8a"],
      // round glasses
      art: face(`<circle cx="36" cy="44" r="11" fill="none" stroke="#0b1b45" stroke-width="4"/>
        <circle cx="64" cy="44" r="11" fill="none" stroke="#0b1b45" stroke-width="4"/>
        <path d="M47 44h6M25 42l-8-3M75 42l8-3" stroke="#0b1b45" stroke-width="4" stroke-linecap="round"/>`),
    },
    {
      id: "product",
      label: "Product / Business",
      colors: ["#f59e0b", "#b45309"],
      // a little rising bar chart on the cheek
      art: face(`<rect x="70" y="72" width="6" height="10" rx="1.5" fill="#fff8"/>
        <rect x="79" y="66" width="6" height="16" rx="1.5" fill="#fffb"/>
        <rect x="88" y="58" width="6" height="24" rx="1.5" fill="#fff"/>`),
    },
    {
      id: "investor",
      label: "Investor",
      colors: ["#10b981", "#065f46"],
      // a top hat and a monocle
      art: face(`<rect x="30" y="8" width="40" height="20" rx="3" fill="#0b2e24"/>
        <rect x="22" y="26" width="56" height="6" rx="3" fill="#0b2e24"/>
        <circle cx="64" cy="44" r="10" fill="none" stroke="#fde68a" stroke-width="3"/>
        <path d="M72 51 L78 66" stroke="#fde68a" stroke-width="2"/>`, "M36 64 Q50 72 64 62"),
    },
    {
      id: "creative",
      label: "Creative",
      colors: ["#a855f7", "#6b21a8"],
      // a beret
      art: face(`<path d="M18 30 Q50 6 82 26 Q78 34 50 32 Q26 34 18 30Z" fill="#e11d48"/>
        <circle cx="54" cy="14" r="4" fill="#e11d48"/>`, "M34 62 Q50 80 66 62"),
    },
    {
      id: "guest",
      label: "Guest",
      colors: ["#ef4444", "#991b1b"],
      art: face(""),
    },
  ];

  function avatarSvg(p) {
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <defs><linearGradient id="g-${p.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.colors[0]}"/><stop offset="1" stop-color="${p.colors[1]}"/>
      </linearGradient></defs>
      <rect width="100" height="100" fill="url(#g-${p.id})"/>${p.art}</svg>`;
  }

  function current() {
    let id = null;
    try { id = sessionStorage.getItem(KEY); } catch (_) {}
    return PERSONAS.find((p) => p.id === id) || null;
  }

  // Reflect the chosen persona in the page (nav avatar + body attribute)
  function apply(p) {
    document.body.dataset.persona = p ? p.id : "";
    const avatar = document.querySelector(".nav__profile .avatar");
    if (!avatar) return;
    if (p) {
      avatar.innerHTML = avatarSvg(p);
      avatar.classList.add("avatar--persona");
      document.querySelector(".nav__profile").setAttribute("aria-label", `About me (watching as ${p.label})`);
    }
  }

  // Show the picker; resolves once a persona is chosen
  function show(onPicked) {
    const el = document.getElementById("profiles");
    el.querySelector(".profiles__grid").innerHTML = PERSONAS.map((p) => `
      <li><button class="profile" data-id="${p.id}">
        <span class="profile__avatar">${avatarSvg(p)}</span>
        <span class="profile__name">${p.label}</span>
      </button></li>`).join("");
    el.hidden = false;
    el.classList.remove("is-leaving");
    document.body.classList.add("no-scroll");
    el.querySelector(".profile").focus({ preventScroll: true });

    el.querySelectorAll(".profile").forEach((btn) => {
      btn.onclick = () => {
        const p = PERSONAS.find((x) => x.id === btn.dataset.id);
        try { sessionStorage.setItem(KEY, p.id); } catch (_) {}
        apply(p);
        btn.classList.add("is-chosen");
        el.classList.add("is-leaving");
        document.body.classList.remove("no-scroll");
        setTimeout(() => { el.hidden = true; }, 700);
        onPicked?.(p);
      };
    });
  }

  // After the intro: ask once per session, unless the visitor arrived on a deep link
  function run(onDone) {
    const p = current();
    apply(p);
    const isDeepLink = location.hash && location.hash !== "#/" && location.hash !== "#";
    if (p || isDeepLink) return onDone();
    show(() => onDone());
  }

  window.Profiles = { run, show, current, PERSONAS };
})();
