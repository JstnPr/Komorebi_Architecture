{
  // Enable page entry and exit transitions.
  document.documentElement.classList.add("js-page-transitions");
}

{
  const isHomePage = ["/", "/index.html"].includes(window.location.pathname);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealSessionKey = "komorebi-home-reveals-played-v2";

  if (isHomePage) {
    let shouldAnimate = false;
    const openedInNewTab = Boolean(window.opener);

    try {
      shouldAnimate = openedInNewTab || !sessionStorage.getItem(revealSessionKey);
      sessionStorage.setItem(revealSessionKey, "played");
    } catch {
      shouldAnimate = true;
    }

    const revealElements = [
      [".hero-shell > div:first-child > h1", "landing-reveal landing-reveal-hero-title"],
      [".hero-shell > div:first-child > h2", "landing-reveal landing-reveal-hero-support"],
      [".hero-description", "landing-reveal landing-reveal-hero-description"],
      [".hero-actions", "landing-reveal landing-reveal-hero-actions"],
      [".hero-shell > article", "landing-reveal landing-reveal-featured"],
      [".gradient-principles", "landing-reveal landing-reveal-section"],
      [".studio-note-divider", "landing-reveal landing-reveal-section"],
      [".studio-note", "landing-reveal landing-reveal-section"],
      [".impact-section", "landing-reveal landing-reveal-section"],
      [".inquiry-panel", "landing-reveal landing-reveal-section"],
    ].flatMap(([selector, classNames]) => {
      return [...document.querySelectorAll(selector)].map((element) => {
        element.className += ` ${classNames}`;
        return element;
      });
    });

    if (!shouldAnimate || reducedMotion.matches) {
      revealElements.forEach((element) => element.classList.add("is-revealed"));
    } else {
      document.documentElement.classList.add("has-landing-reveals");

      window.requestAnimationFrame(() => {
        const observer = new IntersectionObserver(
          (entries, currentObserver) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              entry.target.classList.add("is-revealed");
              currentObserver.unobserve(entry.target);
            });
          },
          {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px",
          }
        );

        revealElements.forEach((element) => observer.observe(element));
      });
    }
  }
}

{
  // Animate internal navigation before changing documents.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (
      !link ||
      !document.documentElement.classList.contains("js-page-transitions") ||
      reducedMotion.matches ||
      link.target === "_blank" ||
      link.hasAttribute("download") ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const destination = new URL(link.href, window.location.href);
    const currentPath = window.location.pathname === "/"
      ? "/index.html"
      : window.location.pathname;
    const destinationPath = destination.pathname === "/"
      ? "/index.html"
      : destination.pathname;

    if (destination.origin !== window.location.origin) {
      return;
    }

    // Keep the current page link inert while preserving in-page anchors.
    if (destinationPath === currentPath) {
      if (!destination.hash) {
        event.preventDefault();
      }

      return;
    }

    event.preventDefault();
    document.documentElement.classList.add("is-leaving");

    window.setTimeout(() => {
      window.location.href = destination.href;
    }, 260);
  });
}