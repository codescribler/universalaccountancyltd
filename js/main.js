/* ============================================
   CBS Accountants — Main JavaScript
   Features: Sticky header, mobile nav, scroll reveal,
   smooth anchor scrolling
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Sticky Header ----
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function handleScroll() {
    const y = window.scrollY;
    if (y > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Mobile Nav Toggle ----
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // ---- Scroll Reveal ----
  if (!prefersReducedMotion) {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          // Stagger siblings
          const parent = entry.target.parentElement;
          const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
          const siblingIndex = siblings.indexOf(entry.target);
          const delay = siblingIndex >= 0 ? siblingIndex * 80 : 0;

          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // If reduced motion, show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---- Demo Modal ----
  var modal = document.getElementById('demo-modal');
  var modalClose = document.getElementById('demo-modal-close');

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modal && modalClose) {
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  // Intercept all CTA buttons (but not modal-internal links)
  document.querySelectorAll('.btn').forEach(function (btn) {
    if (btn.closest('.demo-modal')) return;
    btn.addEventListener('click', openModal);
  });

  // ---- Counter Animation for Stats ----
  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const isVisible = element.offsetParent !== null;

    if (!isVisible) return;

    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 30);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0 && !prefersReducedMotion) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-counter'), 10);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  // ---- Parallax-Lite Hero Effect ----
  const hero = document.getElementById('hero');
  const heroImg = hero ? hero.querySelector('.hero-img') : null;

  if (heroImg && !prefersReducedMotion) {
    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;
      const heroBottom = hero.offsetTop + hero.offsetHeight;

      if (scrollY < heroBottom) {
        const offset = scrollY * 0.5;
        heroImg.style.transform = 'translateY(' + offset + 'px)';
      }
    }, { passive: true });
  }

  // ---- Nav Links → Modal ----
  document.querySelectorAll('.nav-list a').forEach(function (link) {
    link.addEventListener('click', openModal);
  });

})();
