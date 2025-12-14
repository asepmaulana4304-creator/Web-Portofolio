// main.js — Handles menu, smooth scroll, modal, lightbox, carousel, counters, form validation.
// Vanilla JS, production-ready

// ======================
// Utility
// ======================
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

document.addEventListener("DOMContentLoaded", () => {
  // ======================
  // Accessibility
  // ======================
  const isReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ======================
  // CONTACT FORM → WHATSAPP
  // ======================
  const form = $("#contactForm");
  const formMessage = $("#formMessage");

  if (form && formMessage) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      if (data.get("website")) return; // honeypot

      const name = data.get("name")?.trim();
      const email = data.get("email")?.trim();
      const phone = data.get("phone")?.trim();
      const service = data.get("service")?.trim();
      const message = data.get("message")?.trim();

      if (!name || !email || !service || !message) {
        formMessage.textContent =
          "Nama, Email, Layanan, dan Pesan wajib diisi.";
        formMessage.style.color = "#f87171";
        return;
      }

      formMessage.textContent = "Membuka WhatsApp...";
      formMessage.style.color = "#4ade80";

      const adminPhone = "6283870871349"; // GANTI NOMOR KAMU

      const waText =
        "Halo, saya ingin konsultasi.\n\n" +
        "Nama: " +
        name +
        "\nEmail: " +
        email +
        "\nPhone: " +
        (phone || "-") +
        "\nLayanan: " +
        service +
        "\n\nPesan:\n" +
        message;

      window.open(
        "https://wa.me/" + adminPhone + "?text=" + encodeURIComponent(waText),
        "_blank"
      );

      form.reset();
    });
  }

  // ======================
  // Footer year
  // ======================
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ======================
  // Mobile menu
  // ======================
  const mobileMenu = $("#mobileMenu");
  $("#mobileMenuBtn")?.addEventListener("click", () => {
    mobileMenu.style.transform = "translateX(0)";
    mobileMenu.setAttribute("aria-hidden", "false");
  });
  $("#mobileClose")?.addEventListener("click", closeMobile);
  $$(".mobile-link").forEach((a) => a.addEventListener("click", closeMobile));

  function closeMobile() {
    mobileMenu.style.transform = "";
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  // ======================
  // Smooth scroll
  // ======================
  $$('.nav-link, .mobile-link, .btn-ghost, a[href^="#"]').forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");
      if (href && href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: isReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // ======================
  // Parallax hero
  // ======================
  const heroParallax = $("#heroParallax");
  window.addEventListener("mousemove", (e) => {
    if (!heroParallax || isReducedMotion) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 6;
    const y = (e.clientY / window.innerHeight - 0.5) * 6;
    heroParallax.style.transform = `rotateX(${-y}deg) rotateY(${x}deg)`;
  });

  // ======================
  // Progress bars
  // ======================
  const progressBars = $$(".progress-bar");
  if (progressBars.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = (entry.target.dataset.value || 0) + "%";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    progressBars.forEach((pb) => obs.observe(pb));
  }

  // ======================
  // Course modal
  // ======================
  const courseModal = $("#courseModal");
  let lastFocused = null;

  $$(".open-course").forEach((btn) =>
    btn.addEventListener("click", () => {
      lastFocused = document.activeElement;
      courseModal.classList.remove("hidden");
      courseModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    })
  );

  window.closeCourseModal = function () {
    courseModal.classList.add("hidden");
    courseModal.style.display = "";
    document.body.style.overflow = "";
    lastFocused?.focus();
  };

  $("#closeCourseModal")?.addEventListener("click", closeCourseModal);
  courseModal?.addEventListener("click", (e) => {
    if (e.target === courseModal || e.target.dataset.close === "true")
      closeCourseModal();
  });

  // ======================
  // Lightbox events
  // ======================
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");

  const eventImages = [
    { src: "event1.jpg", caption: "Class Ijazah Kubro Jilid 4 — 1447H" },
    { src: "event2.jpg", caption: "Ijazah Kubro — Lebak — 2025" },
    { src: "event3.jpg", caption: "Gemblengan Akbar — 2024" },
    { src: "event4.jpg", caption: "Ijazah Kubro — 2024" },
    { src: "event5.jpg", caption: "Class Ijazah ilmu hikmah — 2024" },
    { src: "event6.jpg", caption: "Ijazah Ilmu Hikmah — 2025" },
    { src: "event7.jpg", caption: "Ijazah kubro — 2024" },
  ];

  $$(".eventBtn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const img = eventImages[Number(btn.dataset.index)];
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxCaption.textContent = img.caption;
      lightbox.classList.remove("hidden");
      lightbox.style.display = "flex";
      document.body.style.overflow = "hidden";
    })
  );

  $("#closeLightbox")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.dataset.close === "true")
      closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.style.display = "";
    document.body.style.overflow = "";
  }

  // ======================
  // ESC handler
  // ======================
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox && !lightbox.classList.contains("hidden")) closeLightbox();
      if (courseModal && !courseModal.classList.contains("hidden"))
        closeCourseModal();
    }
  });
});
