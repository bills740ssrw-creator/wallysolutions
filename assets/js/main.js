/* Wally Solutions — interactions
   No dependencies. Everything guarded so shared pages
   (privacy / terms / 404) work with the same script. */

(function () {
  "use strict";

  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScrollNav = function () {
      nav.classList.toggle("scrolled", window.scrollY > 30);
    };
    window.addEventListener("scroll", onScrollNav, { passive: true });
    onScrollNav();
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    var backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    var closeMenu = function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      backdrop.classList.remove("show");
    };
    var openMenu = function () {
      menu.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      backdrop.classList.add("show");
    };
    toggle.addEventListener("click", function () {
      if (menu.classList.contains("open")) closeMenu();
      else openMenu();
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("hashchange", closeMenu);
    var placeBackdrop = function () {
      var navEl = document.getElementById("nav");
      if (navEl && backdrop.parentNode !== navEl) navEl.appendChild(backdrop);
    };
    placeBackdrop();
  }

  /* ---------- Custom cursor (desktop, motion allowed) ---------- */
  var cursor = document.querySelector(".cursor");
  var cursorDot = document.querySelector(".cursor-dot");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (cursor && cursorDot && finePointer && !reduceMotion) {
    docEl.classList.add("has-cursor");
    var cx = 0, cy = 0, tx = 0, ty = 0, raf;
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      cursorDot.style.left = tx + "px";
      cursorDot.style.top = ty + "px";
      if (!raf) raf = requestAnimationFrame(loop);
    });
    function loop() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      cursor.style.transform = "translate(" + cx + "px," + cy + "px)";
      raf = requestAnimationFrame(loop);
    }
    var hoverables = "a, button, .hz-acc__item, .faq__btn, .card__media";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(hoverables)) cursor.classList.add("hovering");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hoverables)) cursor.classList.remove("hovering");
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealEls.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var stagger = 0;
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.style.transitionDelay = Math.min(stagger * 90, 360) + "ms";
              stagger = (stagger + 1) % 5;
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-in");
      });
    }
  }

  /* ---------- Back to top ---------- */
  var backTop = document.getElementById("back-top");
  if (backTop) {
    var onScrollTop = function () {
      backTop.classList.toggle("show", window.scrollY > 400);
    };
    window.addEventListener("scroll", onScrollTop, { passive: true });
    onScrollTop();
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Process: horizontal accordion ---------- */
  var accItems = Array.prototype.slice.call(document.querySelectorAll(".hz-acc__item"));
  if (accItems.length) {
    accItems.forEach(function (item) {
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      var activate = function () {
        accItems.forEach(function (other) {
          other.classList.remove("active");
        });
        item.classList.add("active");
      };
      item.addEventListener("click", activate);
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll(".faq__item"));
  if (faqItems.length) {
    faqItems.forEach(function (item) {
      var btn = item.querySelector(".faq__btn");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("active");
        faqItems.forEach(function (other) {
          other.classList.remove("active");
          var b = other.querySelector(".faq__btn");
          if (b) b.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("active");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------- About image parallax ---------- */
  var parallaxTargets = Array.prototype.slice.call(document.querySelectorAll("[data-parallax] img"));
  if (parallaxTargets.length && !reduceMotion && finePointer) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        parallaxTargets.forEach(function (img) {
          var rect = img.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          img.style.transform = "translateY(" + (progress - 0.5) * -36 + "px) scale(1.06)";
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Copy email ---------- */
  var copyBtns = Array.prototype.slice.call(document.querySelectorAll(".copy[data-copy]"));
  if (copyBtns.length) {
    var copyText = function (text, btn) {
      var done = function () {
        var title = btn.querySelector(".btn__title");
        var old = title ? title.textContent : btn.textContent;
        if (title) title.textContent = "Copied!";
        else btn.textContent = "Copied!";
        setTimeout(function () {
          if (title) title.textContent = old;
          else btn.textContent = old;
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
        } catch (err) { /* noop */ }
        document.body.removeChild(ta);
        done();
      }
    };
    copyBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        copyText(btn.getAttribute("data-copy"), btn);
      });
    });
  }

  /* ---------- Work category filtering ---------- */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".work__filter"));
  var workCards = Array.prototype.slice.call(document.querySelectorAll(".work__grid .card"));
  if (filterBtns.length && workCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        workCards.forEach(function (card) {
          var cat = card.getAttribute("data-category");
          if (filter === "all" || cat === filter) {
            card.style.display = "";
            card.classList.add("is-in");
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
