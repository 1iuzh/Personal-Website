(function () {
  const toggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (!toggle || !mobileNav) return;

  const closeMenu = () => {
    mobileNav.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    mobileNav.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    mobileNav.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobileNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!toggle.contains(event.target) && !mobileNav.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });
})();
