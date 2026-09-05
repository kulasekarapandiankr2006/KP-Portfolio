(() => {
  'use strict';

  /* ==========================================================
     WINDOWS DOWNLOAD — single configurable path.
     When the real installer is ready, change the ONE line below
     (WIN_DOWNLOAD_PATH) and replace downloads/exe.txt with the
     actual .exe file. No other file needs to be touched.
  ========================================================== */
  const WIN_DOWNLOAD_PATH = 'downloads/RE SensorIQ Setup.exe';
  /* ========================================================== */

  document.querySelectorAll('[data-win-dl]').forEach(el => {
    el.href = WIN_DOWNLOAD_PATH;
    el.setAttribute('download', '');
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMobile.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Animated counters ---------- */
  const statEls = document.querySelectorAll('.stat__num');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    let start = null;

    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statEls.length) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statEls.forEach(el => statIO.observe(el));
  } else {
    statEls.forEach(animateCount);
  }

  /* ---------- Carousel ---------- */
  const track = document.getElementById('carTrack');
  const prevBtn = document.getElementById('carPrev');
  const nextBtn = document.getElementById('carNext');
  if (track && prevBtn && nextBtn) {
    const scrollAmount = () => (track.querySelector('.slide')?.offsetWidth || 260) + 18;
    prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxLabel = document.getElementById('lightboxLabel');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  let lastFocused = null;

  const openLightbox = (label, imgSrc) => {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    if (lightboxLabel) lightboxLabel.textContent = label;
    if (lightboxImg && imgSrc) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = label;
    }
    lightbox.hidden = false;
    if (lightboxClose) lightboxClose.focus();
    document.addEventListener('keydown', onLightboxKey);
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.removeEventListener('keydown', onLightboxKey);
    if (lastFocused) lastFocused.focus();
  };
  const onLightboxKey = (e) => {
    if (e.key === 'Escape') closeLightbox();
  };

  document.querySelectorAll('.slide').forEach(slide => {
    slide.addEventListener('click', () => openLightbox(slide.dataset.label || '', slide.dataset.img || ''));
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ---------- Nav background on scroll ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.style.boxShadow = window.scrollY > 8 ? '0 8px 30px rgba(0,0,0,.35)' : 'none';
          ticking = false;
        });
        ticking = true;
      }
    });
  }
})();
