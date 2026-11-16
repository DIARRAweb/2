/* Orena — petits comportements du site (menu mobile, animations, formulaire). */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");

  // En-tête : léger trait quand on fait défiler la page
  var header = document.querySelector(".site-header");
  var toTop = document.querySelector(".to-top");
  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (toTop) toTop.classList.toggle("show", y > 700);
    if (header) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      header.style.setProperty("--p", max > 0 ? Math.min(1, y / max) : 0);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  // Menu mobile
  var btn = document.querySelector(".menu-btn");
  if (btn) {
    btn.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        document.body.classList.remove("menu-open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
  }

  // Apparition douce des blocs au défilement
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Une seule vidéo joue à la fois
  var medias = document.querySelectorAll("video, audio");
  medias.forEach(function (m) {
    m.addEventListener("play", function () {
      medias.forEach(function (o) { if (o !== m) o.pause(); });
    });
  });

  // Formulaire de contact : ouvre la messagerie avec le message déjà rempli
  var form = document.querySelector("#form-contact");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var v = function (n) { return (form.elements[n] && form.elements[n].value || "").trim(); };
      var sujet = v("sujet") || "Demande d'information";
      var corps = v("message") + "\n\n— " + v("nom") + (v("telephone") ? "\nTéléphone : " + v("telephone") : "") + "\nE-mail : " + v("email");
      var dest = form.getAttribute("data-to");
      window.location.href = "mailto:" + dest + "?subject=" + encodeURIComponent("[Site Orena] " + sujet) + "&body=" + encodeURIComponent(corps);
      var st = form.querySelector(".form-status");
      if (st) st.textContent = "Votre messagerie s'ouvre avec votre message prêt à être envoyé.";
    });
  }

  // Halo lumineux qui suit la souris sur les cartes
  document.querySelectorAll("a.card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // Année du pied de page
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
