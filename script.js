(function () {
  "use strict";
  var cfg = window.OPP || {};
  var base = (cfg.shopBase || "").replace(/\/$/, "");

  // Kjøpsknapper -> Shopify
  document.querySelectorAll("[data-buy]").forEach(function (a) {
    a.href = base + (cfg.buyPath || "/pages/kjop") + "?pakke=" + encodeURIComponent(a.getAttribute("data-buy"));
  });
  document.querySelectorAll("[data-shop-path]").forEach(function (a) {
    a.href = base + a.getAttribute("data-shop-path");
  });
  document.querySelectorAll("[data-mail]").forEach(function (a) {
    if (cfg.email) { a.href = "mailto:" + cfg.email; a.textContent = cfg.email; }
  });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Neste utsendelse = første søndag i måneden (etter i dag)
  function firstSunday(y, m) {
    var d = new Date(y, m, 1);
    return new Date(y, m, 1 + ((7 - d.getDay()) % 7));
  }
  function nextShipDate(now) {
    var y = now.getFullYear(), m = now.getMonth();
    var today = new Date(y, m, now.getDate());
    var d = firstSunday(y, m);
    if (d <= today) { m++; if (m > 11) { m = 0; y++; } d = firstSunday(y, m); }
    return d;
  }
  var ship = nextShipDate(new Date());
  document.querySelectorAll("[data-next-ship]").forEach(function (el) {
    el.textContent = ship.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  });

  // Mobilmeny
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  // Steg-illustrasjonen følger scrollingen
  var scene = document.querySelector(".scene");
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  if (scene && steps.length) {
    scene.setAttribute("data-step", "1");
    var mobile = window.matchMedia("(max-width: 860px)");
    function set(n) {
      scene.setAttribute("data-step", String(n));
      steps.forEach(function (s) { s.classList.toggle("active", s.getAttribute("data-step") === String(n)); });
    }
    function onScroll() {
      var line = window.innerHeight * (mobile.matches ? 0.62 : 0.5);
      var current = 1;
      steps.forEach(function (s) {
        if (s.getBoundingClientRect().top <= line) current = Number(s.getAttribute("data-step"));
      });
      set(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    steps.forEach(function (s) {
      s.addEventListener("click", function () { set(Number(s.getAttribute("data-step"))); });
    });
  }
})();
