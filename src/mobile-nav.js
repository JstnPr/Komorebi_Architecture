const menuButton = document.querySelector('[data-mobile-nav-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (menuButton && mobileNav) {
  const mobileNavLinks = mobileNav.querySelectorAll('a');

  mobileNav.removeAttribute('hidden');
  mobileNav.setAttribute('aria-hidden', 'true');

  const setMenuState = (isOpen) => {
    menuButton.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    mobileNav.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('mobile-nav-open', isOpen);

    if (isOpen) {
      mobileNavLinks[0]?.focus();
    } else {
      menuButton.focus();
    }
  };

  menuButton.addEventListener('click', () => {
    setMenuState(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  mobileNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setMenuState(false);
    }
  });

  document.addEventListener('click', (event) => {
    if (menuButton.getAttribute('aria-expanded') === 'true'
      && !mobileNav.contains(event.target)
      && !menuButton.contains(event.target)) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenuState(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 768px)').matches
      && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenuState(false);
    }
  });
}
