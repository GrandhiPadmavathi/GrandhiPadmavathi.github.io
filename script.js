(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Neural-network background
  const canvas = document.getElementById("network");
  const ctx = canvas.getContext("2d");
  const LINK = 140;
  const mouse = { x: -1e4, y: -1e4 };
  let nodes = [];
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(110, Math.round((innerWidth * innerHeight) / 14000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.8,
      hue: Math.random() < 0.7 ? "167,139,250" : "45,212,191",
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > innerWidth) n.vx = -n.vx;
      if (n.y < 0 || n.y > innerHeight) n.vy = -n.vy;
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${a.hue},${(1 - d / LINK) * 0.28})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < LINK * 1.4) {
        ctx.strokeStyle = `rgba(246,196,83,${(1 - dm / (LINK * 1.4)) * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(${a.hue},0.85)`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  resize();
  draw();
  addEventListener("resize", () => { resize(); if (reduceMotion) draw(); });
  addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  addEventListener("mouseout", () => { mouse.x = mouse.y = -1e4; });

  // Typing effect
  const roles = [
    "an AI Software Engineer",
    "I build LLM Agents",
    "I build RAG Systems",
    "an ML Engineer",
  ];
  const typed = document.getElementById("typed");
  if (reduceMotion) {
    typed.textContent = roles[0];
  } else {
    let role = 0, pos = 0, deleting = false;
    (function tick() {
      const word = roles[role];
      pos += deleting ? -1 : 1;
      typed.textContent = word.slice(0, pos);
      let delay = deleting ? 45 : 95;
      if (!deleting && pos === word.length) { deleting = true; delay = 1600; }
      else if (deleting && pos === 0) { deleting = false; role = (role + 1) % roles.length; delay = 400; }
      setTimeout(tick, delay);
    })();
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Nav: shadow, active link, mobile menu
  const nav = document.getElementById("nav");
  const links = [...document.querySelectorAll("#menu a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
  addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", scrollY > 10);
    const y = scrollY + 120;
    let current = 0;
    sections.forEach((s, i) => { if (s && s.offsetTop <= y) current = i; });
    links.forEach((a, i) => a.classList.toggle("active", i === current));
  }, { passive: true });

  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  menuBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  links.forEach((a) => a.addEventListener("click", () => {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }));
})();
