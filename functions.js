document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Build the wheel spokes
  const spokes = document.getElementById("spokes");
  const NS = "http://www.w3.org/2000/svg";
  const count = 32;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const hubR = 10, rimR = 84;
    // Spokes leave the hub at a tangent for a classic laced look
    const off = (i % 2 ? 1 : -1) * 0.35;
    const line = document.createElementNS(NS, "line");
    line.setAttribute("class", "spoke");
    line.setAttribute("x1", Math.cos(a + off) * hubR);
    line.setAttribute("y1", Math.sin(a + off) * hubR);
    line.setAttribute("x2", Math.cos(a) * rimR);
    line.setAttribute("y2", Math.sin(a) * rimR);
    spokes.appendChild(line);
  }

  // The wheel turns as the page scrolls
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        spokes.style.transform = `rotate(${window.scrollY * 0.25}deg)`;
        ticking = false;
      });
    }, { passive: true });
  }

  // Mobile menu
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", e => {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Service filter tabs
  const tabs = document.querySelectorAll(".tab");
  const items = document.querySelectorAll(".service-list li");
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(t => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab);
    });
    const f = tab.dataset.filter;
    items.forEach(li => { li.hidden = f !== "all" && li.dataset.type !== f; });
  }));

  // Booking form validation
  const form = document.getElementById("booking");
  const status = document.getElementById("form-status");
  const rules = {
    name: v => v.trim().length >= 2 || "Enter your name.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
    service: v => v !== "" || "Choose a service."
  };
  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;
    Object.keys(rules).forEach(name => {
      const field = form.elements[name];
      const result = rules[name](field.value);
      const msg = result === true ? "" : result;
      field.classList.toggle("invalid", !!msg);
      field.parentElement.querySelector(".error").textContent = msg;
      if (msg) valid = false;
    });
    if (valid) {
      status.textContent = `Thanks, ${form.elements.name.value.trim()}. We will email you a quote within a day.`;
      form.reset();
    } else {
      status.textContent = "";
    }
  });
});
