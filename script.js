(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }
  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('toggle', () => {
      const icon = item.querySelector('.service-toggle');
      if (icon) icon.textContent = item.open ? '−' : '＋';
    });
  });
  // Autoplay muted looping project videos only while they are in view.
  // This keeps long case studies lightweight while preserving continuous loops for visible clips.
  const loopingVideos = document.querySelectorAll('video[data-autoplay-visible]');
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
        const playResult = video.play();
        if (playResult && typeof playResult.catch === 'function') playResult.catch(() => {});
      } else {
        video.pause();
      }
    }), {threshold: [0, 0.25]});
    loopingVideos.forEach(video => videoObserver.observe(video));
  } else {
    loopingVideos.forEach(video => { const p = video.play(); if (p && p.catch) p.catch(() => {}); });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold: .1, rootMargin: '0px 0px -25px 0px'});
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('is-visible'));

  // Local, client-side image viewer for the case-study assets.
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const close = () => { lightbox.classList.remove('is-open'); lightbox.setAttribute('aria-hidden','true'); lightboxImg.src=''; document.body.style.overflow=''; };
    document.querySelectorAll('.asset-figure img').forEach(img => img.addEventListener('click', () => {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || 'Expanded project image';
      lightbox.classList.add('is-open'); lightbox.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
    }));
    lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target.classList.contains('lightbox-close')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // Highlight the active chapter in the sticky NOTE 60 navigation.
  const chapters = [...document.querySelectorAll('.case-section[id], .case-intro[id]')];
  const chapterLinks = [...document.querySelectorAll('.case-nav a')];
  if (chapters.length && 'IntersectionObserver' in window) {
    const chapterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) chapterLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }), {rootMargin:'-25% 0px -65% 0px'});
    chapters.forEach(chapter => chapterObserver.observe(chapter));
  }
})();