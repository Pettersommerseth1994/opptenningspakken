(function () {
  "use strict";
  var cfg = window.OPP || {};
  var base = (cfg.shopBase || "").replace(/\/$/, "");
  var buyPath = cfg.buyPath || "/pages/kjop";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // ---------- lenker, e-post, år ----------
  $$("[data-shop-path]").forEach(function (a) { a.href = base + a.getAttribute("data-shop-path"); });
  $$("[data-mail]").forEach(function (a) {
    if (!cfg.email) return;
    a.href = "mailto:" + cfg.email;
    if (a.textContent.trim() === "E-post") a.textContent = cfg.email;
  });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ---------- neste utsendelse: første søndag i måneden ----------
  function firstSunday(y, m) {
    var d = new Date(y, m, 1);
    return new Date(y, m, 1 + ((7 - d.getDay()) % 7));
  }
  var now = new Date();
  var y = now.getFullYear(), m = now.getMonth();
  var today = new Date(y, m, now.getDate());
  var ship = firstSunday(y, m);
  if (ship <= today) { m++; if (m > 11) { m = 0; y++; } ship = firstSunday(y, m); }
  $$("[data-next-ship]").forEach(function (el) {
    el.textContent = ship.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" });
  });
  $$("[data-next-ship-short]").forEach(function (el) {
    el.textContent = ship.toLocaleDateString("nb-NO", { day: "numeric", month: "long" });
  });

  // ---------- kjøpsvalg ----------
  var form = $("[data-buy-form]");
  if (form) {
    var link = $("[data-buy-link]", form);
    var update = function () {
      var c = $('input[name="pakke"]:checked', form);
      if (!c || !link) return;
      var n = c.value;
      var price = Number(c.getAttribute("data-price")).toLocaleString("nb-NO");
      link.href = base + buyPath + "?pakke=" + encodeURIComponent(n);
      link.textContent = "Kjøp " + n + " pakker · " + price + " kr";
    };
    form.addEventListener("change", update);
    update();
  }

  // ---------- header får strek når man scroller ----------
  var header = $("[data-header]");
  var onScrollHeader = function () { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  // ---------- steg ----------
  var scene = $(".scene");
  var list = $("[data-steps]");
  var steps = $$(".step");
  var dots = $$("[data-dot]");
  var mobile = window.matchMedia("(max-width: 860px)");
  var current = 0;

  function setStep(n) {
    n = Number(n);
    if (n === current) return;
    current = n;
    if (scene) scene.setAttribute("data-step", String(n));
    steps.forEach(function (s) { s.classList.toggle("is-active", Number(s.getAttribute("data-step")) === n); });
    dots.forEach(function (d) {
      if (Number(d.getAttribute("data-dot")) === n) d.setAttribute("aria-current", "step");
      else d.removeAttribute("aria-current");
    });
  }

  if (scene && steps.length) {
    setStep(1);

    // Stor skjerm: illustrasjonen følger scrollingen
    var onScrollSteps = function () {
      if (mobile.matches) return;
      var line = window.innerHeight * 0.55;
      var active = 1;
      steps.forEach(function (s) {
        if (s.getBoundingClientRect().top <= line) active = Number(s.getAttribute("data-step"));
      });
      setStep(active);
    };
    window.addEventListener("scroll", onScrollSteps, { passive: true });
    window.addEventListener("resize", onScrollSteps);
    onScrollSteps();

    // Mobil: sveip mellom kortene
    if ("IntersectionObserver" in window && list) {
      var io = new IntersectionObserver(function (entries) {
        if (!mobile.matches) return;
        entries.forEach(function (e) {
          if (e.isIntersecting) setStep(e.target.getAttribute("data-step"));
        });
      }, { root: list, threshold: 0.6 });
      steps.forEach(function (s) { io.observe(s); });
    }
    dots.forEach(function (d) {
      d.addEventListener("click", function () {
        var n = Number(d.getAttribute("data-dot"));
        var target = steps[n - 1];
        if (!target || !list) return;
        var pad = parseFloat(getComputedStyle(list).paddingLeft) || 0;
        list.scrollTo({ left: target.offsetLeft - pad, behavior: "smooth" });
        setStep(n);
      });
    });
    steps.forEach(function (s) {
      s.addEventListener("click", function () { if (!mobile.matches) setStep(s.getAttribute("data-step")); });
    });
  }

  // ---------- kjøpslinje på mobil ----------
  var bar = $("[data-buybar]");
  var hero = $(".hero");
  var buy = $("#pakker");
  var footer = $(".site-footer");
  if (bar && hero && buy && "IntersectionObserver" in window) {
    var seen = { hero: true, buy: false, footer: false };
    var watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.target === hero) seen.hero = e.isIntersecting;
        else if (e.target === buy) seen.buy = e.isIntersecting;
        else if (e.target === footer) seen.footer = e.isIntersecting;
      });
      var show = !seen.hero && !seen.buy && !seen.footer;
      bar.classList.toggle("is-visible", show);
      if (show) bar.removeAttribute("inert"); else bar.setAttribute("inert", "");
    }, { threshold: 0 });
    watch.observe(hero);
    watch.observe(buy);
    if (footer) watch.observe(footer);
  }
})();
