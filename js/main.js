(() => {
  const SFX_SRC = "assets/sounds/hover.wav";
  const sfx = new Audio(SFX_SRC);
  sfx.preload = "auto";
  let soundOn = true;
  try { soundOn = localStorage.getItem("sound") !== "off"; } catch (e) {}

  const playHover = () => {
    if (!soundOn) return;
    const s = sfx.cloneNode();       // sons sobrepostos
    s.volume = 0.4;
    s.play().catch(() => {});
  };

  const toggleBtn = document.getElementById("sound-toggle");
  const setSound = (on) => {
    soundOn = on;
    toggleBtn.textContent = on ? "Som: on" : "Som: off";
    toggleBtn.setAttribute("aria-pressed", String(on));
    try { localStorage.setItem("sound", on ? "on" : "off"); } catch (e) {}
  };
  toggleBtn.addEventListener("click", () => setSound(!soundOn));
  setSound(soundOn);

  /* tela inicial (sobre) */
  const intro = document.getElementById("sobre");
  const others = [document.querySelector("main"), document.querySelector("footer")];

  const showIntro = (on) => {
    intro.classList.toggle("is-hidden", !on);
    others.forEach((el) => { el.inert = on; });
  };
  // #sobre (ou nenhum #) = tela inicial; qualquer outro #id = fecha a tela inicial e vai até a seção
  const applyHash = () => {
    const id = location.hash.slice(1);
    if (!id || id === "sobre") { showIntro(true); return; }
    showIntro(false);
    const target = document.getElementById(id);
    if (target) target.scrollIntoView();
  };
  window.addEventListener("hashchange", applyHash);
  applyHash();
  intro.querySelector(".btn--blink").addEventListener("click", playHover);

  /* cards */
  const roster = document.getElementById("roster");
  let current = null;
  let timer = null;

  const showShot = (card, i) => {
    const shots = card.querySelectorAll(".shots img");
    shots.forEach((img, n) => img.classList.toggle("on", n === i));
    return shots.length;
  };

  const activate = (card) => {
    if (current === card) return;
    deactivate();
    current = card;
    card.classList.add("is-active");
    roster.classList.add("has-active");
    playHover();
    let i = 0;
    if (showShot(card, 0) > 1) {
      timer = setInterval(() => {
        const total = card.querySelectorAll(".shots img").length;
        i = (i + 1) % total;
        showShot(card, i);
      }, 1400);
    }
  };

  const deactivate = () => {
    clearInterval(timer);
    if (!current) return;
    current.classList.remove("is-active");
    showShot(current, 0);
    roster.classList.remove("has-active");
    current = null;
  };

  // áreas de um projeto: o campo manual "areas" manda; sem ele, deduz pelas tecnologias
  const areasOf = (p) => {
    if (Array.isArray(p.areas)) return p.areas;
    const found = new Set();
    (p.tech || []).forEach((t) => {
      const key = t.trim().toLowerCase();
      for (const [area, techs] of Object.entries(TECH_AREAS)) if (techs.includes(key)) found.add(area);
    });
    return [...found];
  };

  const cards = [];
  PROJECTS.forEach((p, n) => {
    const imgs = [p.cover, ...(p.images || [])];
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("aria-haspopup", "dialog");
    card.innerHTML = `
      <span class="card__tag">P${n + 1}</span>
      <div class="shots">
        ${imgs.map((src, i) => `<img src="${src}" alt="${i === 0 ? "Capa do projeto " + p.name : ""}" class="${i === 0 ? "on" : ""}" onerror="this.remove()">`).join("")}
      </div>
      <div class="card__info">
        <h3 class="card__name">${p.name}</h3>
        <p class="card__desc">${p.description}</p>
        <p class="card__more">Clique para ver detalhes</p>
      </div>`;

    card.addEventListener("mouseenter", () => activate(card));
    card.addEventListener("mouseleave", deactivate);
    card.addEventListener("focus", () => activate(card));
    card.addEventListener("blur", deactivate);
    // clique (ou Enter) no card abre a janela de detalhes
    card.addEventListener("click", () => {
      // celular: o 1º toque só seleciona o card (mostra a descrição), o 2º abre os detalhes
      if (matchMedia("(hover: none)").matches && current !== card) { activate(card); return; }
      openModal(p);
    });
    card.addEventListener("keydown", (e) => {
      if (e.target === card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openModal(p); }
    });
    card.addEventListener("animationend", (e) => { if (e.animationName === "card-in") card.classList.remove("pop-in"); });
    cards.push({ card, areas: areasOf(p) });
    roster.appendChild(card);
  });


  /* filtros por área */
  const filterBar = document.getElementById("filters");
  const filterStatus = document.getElementById("filter-status");
  const usedAreas = AREAS.filter((a) => cards.some((c) => c.areas.includes(a.id)));
  const countOf = (id) => cards.filter((c) => id === "all" || c.areas.includes(id)).length;

  const applyFilter = (id) => {
    deactivate();
    let shown = 0;
    cards.forEach(({ card, areas }) => {
      const show = id === "all" || areas.includes(id);
      card.hidden = !show;
      if (!show) return;
      card.querySelector(".card__tag").textContent = "P" + ++shown;   // renumera: P1, P2...
      card.style.setProperty("--i", shown - 1);
      card.classList.remove("pop-in");
      void card.offsetWidth;                                           // reinicia a animação de entrada
      card.classList.add("pop-in");
    });
    filterBar.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.area === id)));
    filterStatus.textContent = id === "all" ? `Mostrando todos os ${shown} projetos` : `Mostrando ${shown} de ${cards.length} projetos`;
  };

  if (usedAreas.length >= 2) {
    [{ id: "all", label: "Todos" }, ...usedAreas].forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "filter";
      b.dataset.area = a.id;
      b.innerHTML = `${a.label}<span class="filter__n">${countOf(a.id)}</span>`;
      b.addEventListener("click", () => { playHover(); applyFilter(a.id); });
      filterBar.appendChild(b);
    });
    filterBar.hidden = false;
    applyFilter("all");
  }

  /* janelas de detalhes */
  const modal = document.getElementById("project-modal");
  const $ = (id) => document.getElementById(id);
  const gallery = modal.querySelector(".gallery");
  let shots = [], shotIdx = 0;

  const showImage = (i) => {
    if (!shots.length) { $("m-img").hidden = true; return; }
    shotIdx = (i + shots.length) % shots.length;
    const img = $("m-img");
    img.hidden = false;
    img.src = shots[shotIdx];
    img.alt = "Imagem " + (shotIdx + 1) + " de " + shots.length;
    $("m-thumbs").querySelectorAll("button").forEach((b, n) =>
      b.setAttribute("aria-current", String(n === shotIdx)));
  };

  const loadable = (src) => new Promise((ok) => {
    const im = new Image();
    im.onload = () => ok(src);
    im.onerror = () => ok(null);
    im.src = src;
  });

  const fillList = (wrapId, listId, items) => {
    const list = $(listId);
    list.innerHTML = "";
    items.forEach((t) => { const li = document.createElement("li"); li.textContent = t; list.appendChild(li); });
    $(wrapId).hidden = !items.length;
  };

  const setLink = (id, url) => { const a = $(id); a.hidden = !url; if (url) a.href = url; };

  async function openModal(p) {
    $("m-title").textContent = p.name;
    $("m-desc").textContent = p.longDescription || p.description;
    fillList("m-tech-wrap", "m-tech", p.tech || []);
    fillList("m-feat-wrap", "m-feat", p.features || []);
    setLink("m-repo", p.repo);   // botão "Abrir projeto"
    setLink("m-link", p.link);   // botão "Ver projeto"
    $("m-actions").hidden = !p.repo && !p.link;   // sem nenhum dos dois, some a área dos botões
    shots = []; $("m-thumbs").innerHTML = ""; $("m-img").hidden = true;
    gallery.className = "gallery gallery--empty";
    playHover();
    modal.showModal();
    modal.scrollTop = 0;

    shots = (await Promise.all([p.cover, ...(p.images || [])].map(loadable))).filter(Boolean);
    shots.forEach((src, n) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ver imagem " + (n + 1));
      b.innerHTML = `<img src="${src}" alt="">`;
      b.addEventListener("click", () => showImage(n));
      $("m-thumbs").appendChild(b);
    });
    gallery.className = "gallery" + (shots.length > 1 ? "" : shots.length ? " gallery--single" : " gallery--empty");
    showImage(0);
  }

  $("m-close").addEventListener("click", () => modal.close());
  $("m-prev").addEventListener("click", () => showImage(shotIdx - 1));
  $("m-next").addEventListener("click", () => showImage(shotIdx + 1));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  modal.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showImage(shotIdx - 1);
    if (e.key === "ArrowRight") showImage(shotIdx + 1);
  });

  // toque fora dos cards
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".card")) deactivate();
  });
})();