/* =========================================================
   Ellison Olivo — Portfolio scripts (shared by every page)
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCase = document.body.classList.contains("case-page");
  const root = isCase ? "../" : "";

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* ---------- Nav: scrolled state, progress, mobile menu, active link ---------- */
  const nav = $("#nav");
  const progress = $(".scroll-progress");
  function onScroll() {
    const y = window.scrollY;
    nav && nav.classList.toggle("scrolled", y > 20);
    if (progress) {
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    }
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menuBtn = $("#menu-toggle");
  const navLinks = $("#nav-links");
  function closeMenu() {
    if (!menuBtn) return;
    menuBtn.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
  }
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const open = menuBtn.getAttribute("aria-expanded") !== "true";
      menuBtn.setAttribute("aria-expanded", String(open));
      navLinks.classList.toggle("open", open);
    });
    $$("a", navLinks).forEach((a) => a.addEventListener("click", closeMenu));
  }

  const sectionLinks = $$('.nav-links a[href^="#"]');
  if ("IntersectionObserver" in window && sectionLinks.length) {
    const map = new Map(sectionLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            sectionLinks.forEach((a) => a.classList.remove("active"));
            map.get(e.target.id)?.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    map.forEach((_, id) => { const el = document.getElementById(id); el && io.observe(el); });
  }

  /* ---------- Cursor glow ---------- */
  const glow = $(".cursor-glow");
  if (glow && !reduceMotion && matchMedia("(hover: hover)").matches) {
    addEventListener("pointermove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }, { passive: true });
  }

  /* ---------- Background particle network ---------- */
  const canvas = $("#bg-canvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, pts = [];
    const mouse = { x: -9999, y: -9999 };
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      const n = Math.min(90, Math.floor((innerWidth * innerHeight) / 16000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * dpr, vy: (Math.random() - 0.5) * 0.25 * dpr,
        r: (Math.random() * 1.3 + 0.5) * dpr,
      }));
    }
    resize();
    addEventListener("resize", resize);
    addEventListener("pointermove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; }, { passive: true });
    const maxD = 130;
    let running = true;
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(tick);
    });
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const md = maxD * dpr;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 140 * dpr) { p.x += (dx / d) * 0.6; p.y += (dy / d) * 0.6; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(190, 242, 100, 0.55)"; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < md) {
            ctx.strokeStyle = `rgba(45, 212, 191, ${0.16 * (1 - d / md)})`;
            ctx.lineWidth = dpr * 0.8;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Project cards (from js/projects.js) ---------- */
  const grid = $("#project-grid");
  if (grid && typeof PROJECTS !== "undefined") {
    const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const statusLabel = { live: "Live", "in-progress": "In progress", "coming-soon": "Coming soon" };
    const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
    grid.innerHTML = PROJECTS.map((p, i) => {
      const soon = p.status === "coming-soon";
      const external = p.url && /^https?:/.test(p.url);
      const link = p.url
        ? `<a class="card-link" href="${esc(p.url)}" ${external ? 'target="_blank" rel="noopener"' : ""} aria-label="${soon ? esc(p.title) : "Open " + esc(p.title)}"></a>`
        : "";
      const media = p.image
        ? `<div class="card-media"><div class="card-bar"><span></span><span></span><span></span><em class="mono">${esc((p.url || "").replace(/^https?:\/\//, ""))}</em></div><img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy"/><div class="card-hover mono">${external ? "Open live app" : "Open"} ${arrow}</div></div>`
        : `<div class="card-media card-empty" aria-hidden="true"><span class="mono">&lt;/&gt;</span><div class="soon-lines"><i></i><i></i><i></i></div></div>`;
      const extras = [
        p.caseStudy ? `<a class="card-btn" href="${esc(p.caseStudy)}">Case study →</a>` : "",
        p.repo ? `<a class="card-btn" href="${esc(p.repo)}" target="_blank" rel="noopener">Code ↗</a>` : "",
      ].join("");
      return `
        <article class="pcard ${soon ? "pcard-soon" : ""} reveal" style="--d:${i * 90}ms">
          ${link}
          ${media}
          <div class="card-body">
            <div class="card-meta mono">
              <span class="badge badge-${esc(p.status)}">${p.status === "live" ? '<span class="live-dot"></span>' : ""}${statusLabel[p.status] || ""}</span>
              ${p.type ? `<span>${esc(p.type)}</span>` : ""}${p.year ? `<span>${esc(p.year)}</span>` : ""}
            </div>
            <h3>${esc(p.title)}</h3>
            <p class="card-tagline">${esc(p.tagline)}</p>
            <p class="card-desc">${esc(p.description)}</p>
            ${p.role ? `<p class="card-role mono">${esc(p.role)}</p>` : ""}
            <ul class="tags">${(p.tags || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
            ${extras ? `<div class="card-actions">${extras}</div>` : ""}
          </div>
        </article>`;
    }).join("");
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const ro = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el, i) => {
      if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${(i % 4) * 70}ms`);
      ro.observe(el);
    });
  } else revealEls.forEach((el) => el.classList.add("in"));

  /* ---------- Typed roles ---------- */
  const typed = $("#typed");
  if (typed) {
    const roles = ["Flutter Developer", "Full-Stack Web Developer", "Supabase & Firebase Developer", "Mobile App Developer", "Problem Solver"];
    if (reduceMotion) typed.textContent = roles[0];
    else {
      let r = 0, c = 0, del = false;
      typed.textContent = "";
      (function loop() {
        const word = roles[r];
        typed.textContent = word.slice(0, c);
        if (!del && c === word.length) { del = true; return setTimeout(loop, 1700); }
        if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
        c += del ? -1 : 1;
        setTimeout(loop, del ? 35 : 75);
      })();
    }
  }

  /* ---------- Hero code window ---------- */
  const codeEl = $("#code-typed");
  if (codeEl) {
    // [text, class] tokens. k=keyword t=type s=string c=comment f=function n=number
    const T = [
      ["// lib/developer.dart\n", "c"],
      ["class ", "k"], ["Developer", "t"], [" {\n", ""],
      ["  final ", "k"], ["name", ""], [" = ", ""], ["'Ellison Olivo'", "s"], [";\n", ""],
      ["  final ", "k"], ["role", ""], [" = ", ""], ["'Flutter & Web Developer'", "s"], [";\n", ""],
      ["  final ", "k"], ["based", ""], [" = ", ""], ["'Pangasinan, PH'", "s"], [";\n\n", ""],
      ["  final ", "k"], ["stack", ""], [" = [\n", ""],
      ["    'Flutter'", "s"], [", ", ""], ["'Dart'", "s"], [", ", ""], ["'Supabase'", "s"], [",\n", ""],
      ["    'PostgreSQL'", "s"], [", ", ""], ["'React'", "s"], [", ", ""], ["'TypeScript'", "s"], [",\n", ""],
      ["  ];\n\n", ""],
      ["  final ", "k"], ["shipped", ""], [" = [", ""], ["'I-Judge'", "s"], [", ", ""], ["'Kuryente Tracker'", "s"], ["];\n", ""],
      ["  bool get ", "k"], ["openToRemote", "f"], [" => ", ""], ["true", "n"], [";\n", ""],
      ["}", ""],
    ];
    const html = (txt, cls) => cls ? `<span class="tk-${cls}">${txt.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>` : txt.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    if (reduceMotion) codeEl.innerHTML = T.map(([t, c]) => html(t, c)).join("");
    else {
      let ti = 0, ci = 0, done = "";
      const step = () => {
        if (ti >= T.length) return;
        const [t, c] = T[ti];
        ci++;
        codeEl.innerHTML = done + html(t.slice(0, ci), c);
        if (ci >= t.length) { done += html(t, c); ti++; ci = 0; }
        setTimeout(step, t[ci - 1] === "\n" ? 90 : 16 + Math.random() * 22);
      };
      setTimeout(step, 700);
    }
  }

  /* ---------- Count-up stats ---------- */
  const counters = $$(".stat-num[data-count]");
  if (counters.length) {
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const suf = el.dataset.suffix || "";
      if (reduceMotion) { el.textContent = target.toFixed(dec) + suf; return; }
      const t0 = performance.now(), dur = 1500;
      const f = (t) => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * e).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    };
    const co = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } }), { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  /* ---------- Evaluation bars ---------- */
  const bars = $("#bars");
  if (bars) {
    const bo = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { bars.classList.add("go"); bo.disconnect(); } }), { threshold: 0.3 });
    bo.observe(bars);
  }

  /* ---------- Pointer effects: tilt, spotlight, magnetic ---------- */
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest?.(".feature, .pcard, .stat-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Gallery tabs, thumbnails, lightbox ---------- */
  $$(".tabs").forEach((tabs) => {
    const wrap = tabs.closest(".gallery");
    $$(".tab", tabs).forEach((tab) => tab.addEventListener("click", () => {
      $$(".tab", tabs).forEach((t) => { t.classList.toggle("active", t === tab); t.setAttribute("aria-selected", String(t === tab)); });
      $$(".tab-panel", wrap).forEach((p) => { const on = p.dataset.panel === tab.dataset.tab; p.hidden = !on; p.classList.toggle("active", on); });
    }));
  });
  $$(".thumbs").forEach((group) => {
    const main = document.getElementById(group.dataset.target);
    const cap = document.getElementById(group.dataset.target + "-cap");
    $$(".thumb", group).forEach((b) => b.addEventListener("click", () => {
      $$(".thumb", group).forEach((x) => x.classList.toggle("active", x === b));
      main.classList.add("swap");
      setTimeout(() => {
        main.src = b.dataset.src; main.alt = b.dataset.alt;
        if (cap) cap.innerHTML = b.dataset.cap;
        main.classList.remove("swap");
      }, 180);
    }));
  });
  const lb = $("#lightbox"), lbImg = $("#lb-img");
  if (lb) {
    const open = (img) => { lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt; lb.hidden = false; document.body.style.overflow = "hidden"; };
    const close = () => { lb.hidden = true; document.body.style.overflow = ""; };
    $$(".browser-shot, .phone-frame img").forEach((img) => { img.style.cursor = "zoom-in"; img.addEventListener("click", () => open(img)); });
    lb.addEventListener("click", close);
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) close(); });
  }

  /* ---------- I-Judge mini demo ---------- */
  const board = $("#board");
  if (board) {
    const CANDS = [
      { n: 1, name: "Adrian Dela Cruz", col: "BSIT", c: "#bef264" },
      { n: 2, name: "Angela Reyes", col: "BSHM", c: "#2dd4bf" },
      { n: 3, name: "Marco Villanueva", col: "BSBA", c: "#60a5fa" },
      { n: 4, name: "Bea Mendoza", col: "BEED", c: "#fb923c" },
      { n: 5, name: "Joshua Ramos", col: "BSEd", c: "#c084fc" },
      { n: 6, name: "Camille Santos", col: "BSMB", c: "#f472b6" },
    ];
    const JUDGES = ["Maria Garcia (Chair)", "Elena Bautista", "Roberto Aquino"];
    const jList = $("#judges"), log = $("#log"), podium = $("#podium");
    const btnScore = $("#demo-score"), btnVerify = $("#demo-verify"), btnReveal = $("#demo-reveal"), btnReset = $("#demo-reset");
    let state, timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    function addLog(html) {
      const li = document.createElement("li");
      const t = new Date().toTimeString().slice(0, 8);
      li.innerHTML = `<b>${t}</b> ${html}`;
      log.prepend(li);
      while (log.children.length > 7) log.lastChild.remove();
    }
    function setJudge(i, cls, label) {
      const s = jList.children[i].querySelector(".j-status");
      s.className = "j-status " + cls; s.textContent = label;
    }
    function render() {
      // FLIP: remember old positions
      const first = new Map($$("li", board).map((li) => [li.dataset.n, li.getBoundingClientRect().top]));
      const sorted = [...state.cands].sort((a, b) => b.score - a.score || a.n - b.n);
      const max = Math.max(1, ...sorted.map((c) => c.score));
      board.innerHTML = "";
      sorted.forEach((c, i) => {
        const li = document.createElement("li");
        li.dataset.n = c.n;
        if (c.score > 0 && i < 3) li.classList.add("top-" + (i + 1));
        if (c.flash) li.classList.add("flash");
        li.innerHTML = `
          <span class="rank">${c.score > 0 ? (i < 3 ? ["🥇", "🥈", "🥉"][i] : "#" + (i + 1)) : "–"}</span>
          <span class="cand"><span class="avatar" style="background:${c.c}">${c.n}</span><span class="cand-name">${c.name}</span></span>
          <span class="college">${c.col}</span>
          <span class="score">${c.score.toFixed(2)}%</span>
          <span class="score-bar"><span style="width:${(c.score / max) * 100}%"></span></span>`;
        board.appendChild(li);
      });
      if (!reduceMotion) {
        $$("li", board).forEach((li) => {
          const f = first.get(li.dataset.n);
          if (f === undefined) return;
          const d = f - li.getBoundingClientRect().top;
          if (d) {
            li.style.transform = `translateY(${d}px)`; li.style.transition = "none";
            requestAnimationFrame(() => requestAnimationFrame(() => { li.style.transition = ""; li.style.transform = ""; }));
          }
        });
      }
      state.cands.forEach((c) => (c.flash = false));
    }
    function reset() {
      timers.forEach(clearTimeout); timers = [];
      state = { cands: CANDS.map((c) => ({ ...c, score: 0, parts: [] })), phase: "idle" };
      jList.innerHTML = JUDGES.map((j) => `<li><span>${j}</span><span class="j-status">waiting</span></li>`).join("");
      log.innerHTML = "";
      podium.hidden = true; board.hidden = false; $(".board-head").hidden = false;
      $$(".pod-card", podium).forEach((p) => { p.textContent = "?"; p.classList.remove("shown"); });
      $$(".pod", podium).forEach((p) => p.classList.remove("up"));
      btnScore.disabled = false; btnVerify.disabled = true; btnReveal.disabled = true;
      addLog("Event <em>Mr. &amp; Ms. Intramurals</em> is live");
      render();
    }
    btnScore.addEventListener("click", () => {
      if (state.phase !== "idle") return;
      state.phase = "scoring"; btnScore.disabled = true;
      addLog("Stage opened: <em>Final</em>");
      JUDGES.forEach((j, ji) => {
        later(() => setJudge(ji, "scoring", "scoring…"), 200 + ji * 250);
        state.cands.forEach((c, ci) => {
          later(() => {
            const s = 78 + Math.random() * 20;
            c.parts[ji] = s;
            c.score = c.parts.reduce((a, b) => a + b, 0) / c.parts.filter((x) => x !== undefined).length;
            c.flash = true;
            render();
            if (ci === 0 && ji === 0) addLog("Scores streaming in (Realtime)");
          }, 600 + ji * 1300 + ci * 190);
        });
        later(() => {
          setJudge(ji, "submitted", "submitted");
          addLog(`${j.split(" (")[0]} submitted final scores`);
          if (ji === JUDGES.length - 1) {
            state.phase = "scored"; btnVerify.disabled = false;
            addLog("All judges submitted ✓ ready to verify");
          }
        }, 600 + ji * 1300 + CANDS.length * 190 + 150);
      });
    });
    btnVerify.addEventListener("click", () => {
      if (state.phase !== "scored") return;
      state.phase = "verifying"; btnVerify.disabled = true;
      addLog("Verification request sent to all judges");
      JUDGES.forEach((j, ji) => {
        later(() => setJudge(ji, "pending", "reviewing"), 150);
        later(() => {
          setJudge(ji, "verified", "verified ✓");
          addLog(`${j.split(" (")[0]} confirmed &amp; verified`);
          if (ji === JUDGES.length - 1) {
            state.phase = "verified"; btnReveal.disabled = false;
            addLog("Official results unlocked");
          }
        }, 700 + ji * 650);
      });
    });
    btnReveal.addEventListener("click", () => {
      if (state.phase !== "verified") return;
      state.phase = "revealing"; btnReveal.disabled = true;
      const top = [...state.cands].sort((a, b) => b.score - a.score).slice(0, 3);
      board.hidden = true; $(".board-head").hidden = true; podium.hidden = false;
      addLog("Projector mode: revealing winners");
      [3, 2, 1].forEach((place, k) => {
        later(() => {
          const c = top[place - 1];
          const card = $(`.pod-card[data-place="${place}"]`, podium);
          card.innerHTML = `<strong>#${c.n}</strong><span>${c.name}</span><em class="mono">${c.score.toFixed(2)}%</em>`;
          card.classList.add("shown");
          card.parentElement.classList.add("up");
          addLog(`${["", "1st", "2nd", "3rd"][place]} place: ${c.name}`);
          if (place === 1) addLog("Official tally PDF generated ✓");
        }, 500 + k * 1100);
      });
    });
    btnReset.addEventListener("click", reset);
    reset();
  }

  /* ---------- Copy email ---------- */
  const copyBtn = $("#copy-email");
  async function copyEmail() {
    const email = "ellisonolivo5@gmail.com";
    try { await navigator.clipboard.writeText(email); }
    catch {
      const ta = document.createElement("textarea"); ta.value = email; document.body.appendChild(ta);
      ta.select(); try { document.execCommand("copy"); } catch {} ta.remove();
    }
    showToast("✓ Email copied to clipboard");
  }
  copyBtn && copyBtn.addEventListener("click", copyEmail);

  /* ---------- Command palette (Ctrl/Cmd + K) ---------- */
  const pal = $("#palette"), palInput = $("#palette-input"), palList = $("#palette-list");
  if (pal) {
    const go = (href) => () => { location.href = href; };
    const cmds = [
      ...$$(".nav-links a").map((a) => ({ label: "Go to " + a.textContent.replace(/^[\d.←]+/, "").trim(), hint: "section", run: go(a.getAttribute("href")) })),
      { label: "View I-Judge case study", hint: "page", run: go(root + "projects/i-judge.html") },
      { label: "Open I-Judge live app", hint: "link ↗", run: () => open("https://i-judge-psu.vercel.app", "_blank", "noopener") },
      { label: "Download resume (PDF)", hint: "file", run: () => { const a = document.createElement("a"); a.href = root + "assets/Ellison_Olivo_Resume.pdf"; a.download = ""; a.click(); } },
      { label: "Copy email address", hint: "action", run: copyEmail },
      { label: "Send an email", hint: "mailto", run: go("mailto:ellisonolivo5@gmail.com") },
      { label: "Open GitHub profile", hint: "link ↗", run: () => open("https://github.com/Ellieboy112", "_blank", "noopener") },
      { label: "Back to top", hint: "scroll", run: () => scrollTo({ top: 0, behavior: "smooth" }) },
    ];
    let sel = 0, shown = cmds;
    const draw = () => {
      palList.innerHTML = shown.map((c, i) => `<li role="option" aria-selected="${i === sel}" class="${i === sel ? "sel" : ""}" data-i="${i}"><span>${c.label}</span><span class="hint">${c.hint}</span></li>`).join("") || '<li class="empty"><span>No results</span></li>';
    };
    const openPal = () => { pal.hidden = false; palInput.value = ""; shown = cmds; sel = 0; draw(); setTimeout(() => palInput.focus(), 10); };
    const closePal = () => { pal.hidden = true; };
    const runSel = () => { const c = shown[sel]; if (c) { closePal(); c.run(); } };
    $("#open-palette")?.addEventListener("click", openPal);
    addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.hidden ? openPal() : closePal(); }
      else if (!pal.hidden) {
        if (e.key === "Escape") closePal();
        else if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % shown.length; draw(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + shown.length) % shown.length; draw(); }
        else if (e.key === "Enter") { e.preventDefault(); runSel(); }
      }
    });
    palInput.addEventListener("input", () => {
      const q = palInput.value.toLowerCase().trim();
      shown = cmds.filter((c) => c.label.toLowerCase().includes(q)); sel = 0; draw();
    });
    palList.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (li) { sel = +li.dataset.i; runSel(); } });
    pal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closePal(); });
  }
})();
