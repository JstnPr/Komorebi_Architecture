const menuButton = document.querySelector('.mobile-nav-toggle');
const drawer = document.querySelector('.mobile-nav-drawer');
const backdrop = document.querySelector('.mobile-nav-backdrop');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pageExitDelay = prefersReducedMotion ? 0 : 220;

document.addEventListener('click', (event) => {
  const link = event.target.closest('a');

  if (
    !link ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    link.target === '_blank' ||
    link.hasAttribute('download')
  ) {
    return;
  }

  const destination = new URL(link.href, window.location.href);
  const isPageNavigation =
    destination.origin === window.location.origin &&
    (destination.pathname !== window.location.pathname || destination.search !== window.location.search);

  if (!isPageNavigation) return;

  event.preventDefault();
  document.documentElement.classList.add('is-page-leaving');
  window.setTimeout(() => window.location.assign(destination.href), pageExitDelay);
});

document.querySelectorAll('a[aria-current="page"]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});

if (menuButton && drawer && backdrop) {
  const drawerLinks = [...drawer.querySelectorAll('a')];
  const desktopBreakpoint = window.matchMedia('(min-width: 768px)');
  const drawerCloseDelay = prefersReducedMotion ? 0 : 420;
  let lastFocusedElement = menuButton;
  let previousBodyOverflow = '';

  const isOpen = () => menuButton.getAttribute('aria-expanded') === 'true';

  const setOpen = (open, { moveFocus = true } = {}) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    drawer.setAttribute('aria-hidden', String(!open));
    drawer.inert = !open;

    if (open) {
      lastFocusedElement = document.activeElement;
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      if (moveFocus) {
        requestAnimationFrame(() => drawerLinks[0]?.focus());
      }
      return;
    }

    document.body.style.overflow = previousBodyOverflow;
    if (moveFocus && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const handleKeydown = (event) => {
    if (!isOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key !== 'Tab' || drawerLinks.length === 0) return;

    const firstLink = drawerLinks[0];
    const lastLink = drawerLinks[drawerLinks.length - 1];

    if (event.shiftKey && document.activeElement === firstLink) {
      event.preventDefault();
      lastLink.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      firstLink.focus();
    }
  };

  const handleDrawerLinkClick = (event) => {
    const link = event.currentTarget;

    setOpen(false, { moveFocus: false });

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    window.setTimeout(() => {
      document.documentElement.classList.add('is-page-leaving');
      window.setTimeout(() => window.location.assign(link.href), pageExitDelay);
    }, drawerCloseDelay);
  };

  menuButton.addEventListener('click', () => setOpen(!isOpen()));
  backdrop.addEventListener('click', () => setOpen(false));
  drawerLinks.forEach((link) => link.addEventListener('click', handleDrawerLinkClick));
  document.addEventListener('keydown', handleKeydown);
  desktopBreakpoint.addEventListener('change', ({ matches }) => {
    if (matches && isOpen()) setOpen(false, { moveFocus: false });
  });
}
