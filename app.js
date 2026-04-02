
(function () {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('tm-theme');
  if (storedTheme) root.setAttribute('data-theme', storedTheme);

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('tm-theme', next);
    });
  });

  const siteHeader = document.querySelector('.site-header');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const closeMenu = () => {
    if (!siteHeader || !menuToggle) return;
    siteHeader.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '打开导航菜单');
  };
  if (siteHeader && menuToggle) {
    menuToggle.addEventListener('click', () => {
      const nextOpen = !siteHeader.classList.contains('menu-open');
      siteHeader.classList.toggle('menu-open', nextOpen);
      menuToggle.setAttribute('aria-expanded', String(nextOpen));
      menuToggle.setAttribute('aria-label', nextOpen ? '关闭导航菜单' : '打开导航菜单');
    });
    siteHeader.querySelectorAll('.main-nav a, .header-actions a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 760) closeMenu();
      });
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  const progress = document.getElementById('scrollProgress');
  const backTop = document.querySelector('[data-back-top]');
  const syncScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop || document.body.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    if (backTop) backTop.style.opacity = scrolled > 480 ? '1' : '0';
  };
  window.addEventListener('scroll', syncScroll, { passive: true });
  syncScroll();

  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    backTop.style.opacity = '0';
    backTop.style.transition = 'opacity .25s ease';
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  const parallaxCards = document.querySelectorAll('[data-parallax]');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    parallaxCards.forEach((el, idx) => {
      const offset = (y * (0.03 + idx * 0.005));
      el.style.transform = `translateY(${Math.max(-24, Math.min(24, offset))}px)`;
    });
  }, { passive: true });

  const tocLinks = document.querySelectorAll('[data-floating-toc] a');
  if (tocLinks.length) {
    const sections = Array.from(tocLinks)
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);
    const tocObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = '#' + entry.target.id;
        const link = Array.from(tocLinks).find((a) => a.getAttribute('href') === id);
        if (link && entry.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-35% 0px -50% 0px', threshold: 0.01 });
    sections.forEach((s) => tocObserver.observe(s));
  }

  const resourceGrid = document.getElementById('resourceGrid');
  const resourceSearch = document.getElementById('resourceSearch');
  const categoryButtons = document.querySelectorAll('[data-category]');
  let activeCategory = '全部';
  const filterResources = () => {
    if (!resourceGrid) return;
    const term = (resourceSearch?.value || '').trim().toLowerCase();
    resourceGrid.querySelectorAll('.resource-card').forEach((card) => {
      const cat = card.getAttribute('data-category');
      const text = (card.getAttribute('data-search') || '').toLowerCase();
      const passCategory = activeCategory === '全部' || cat === activeCategory;
      const passSearch = !term || text.includes(term);
      card.classList.toggle('hidden-card', !(passCategory && passSearch));
    });
  };
  categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterResources();
    });
  });
  resourceSearch?.addEventListener('input', filterResources);
  filterResources();

  const contactGrid = document.getElementById('contactGrid');
  const contactTabButtons = document.querySelectorAll('[data-contact-tab]');
  const contactRegionButtons = document.querySelectorAll('[data-contact-region]');
  let activeTab = contactTabButtons[0]?.getAttribute('data-contact-tab') || null;
  let activeRegion = '全部';
  const filterContacts = () => {
    if (!contactGrid) return;
    contactGrid.querySelectorAll('.contact-card').forEach((card) => {
      const tab = card.getAttribute('data-contact-tab');
      const region = card.getAttribute('data-contact-region');
      const passTab = !activeTab || tab === activeTab;
      const passRegion = activeRegion === '全部' || activeRegion === region;
      card.classList.toggle('hidden-card', !(passTab && passRegion));
    });
  };
  contactTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      contactTabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.getAttribute('data-contact-tab');
      filterContacts();
    });
  });
  contactRegionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      contactRegionButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeRegion = btn.getAttribute('data-contact-region');
      filterContacts();
    });
  });

  const query = new URLSearchParams(window.location.search);
  const wantedRegion = query.get('region');
  if (wantedRegion) {
    const regionBtn = Array.from(contactRegionButtons).find((b) => b.getAttribute('data-contact-region') === wantedRegion);
    if (regionBtn) regionBtn.click();
  }
  filterContacts();
})();
