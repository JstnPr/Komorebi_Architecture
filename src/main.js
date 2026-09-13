{
  // Enable page entry and exit transitions.
  document.documentElement.classList.add("js-page-transitions");
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