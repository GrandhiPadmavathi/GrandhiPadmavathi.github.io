(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Starfield
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let stars = [];
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((innerWidth * innerHeight) / 5500);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.3 + 0.2,
      a: Math.random(),
      da: (Math.random() * 0.012 + 0.003) * (Math.random() < 0.5 ? -1 : 1),
      vy: Math.random() * 0.12 + 0.02,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const s of stars) {
      s.a += s.da;
      if (s.a <= 0.1 || s.a >= 1) s.da = -s.da;
      s.y += s.vy;
      if (s.y > innerHeight) { s.y = 0; s.x = Math.random() * innerWidth; }
      ctx.globalAlpha = Math.max(0.1, Math.min(1, s.a));
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  resize();
  draw();
  addEventListener("resize", () => { resize(); if (reduceMotion) draw(); });

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
