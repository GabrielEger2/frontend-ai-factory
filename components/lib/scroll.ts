/**
 * Smooth-scrolls to a DOM element by selector, accounting for a fixed header offset.
 */
export function scrollToElement(targetId: string, headerHeight = 50) {
  if (typeof window === "undefined") return;
  const element = document.querySelector(targetId);
  if (element) {
    const topOffset = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: topOffset - headerHeight,
      behavior: "smooth",
    });
  }
}

/**
 * Click handler for anchor links (#section) and hybrid links (/#section).
 * Handles cross-page navigation — if the user is not on /, it redirects to /#hash first.
 */
export function handleLinkClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  headerHeight = 50,
) {
  const href = event.currentTarget.getAttribute("href") || "";

  if (href.startsWith("#")) {
    event.preventDefault();

    if (window.location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }

    scrollToElement(href, headerHeight);
    return;
  }

  if (href.startsWith("/#")) {
    event.preventDefault();
    const hash = href.slice(1);

    if (window.location.pathname !== "/") {
      window.location.href = href;
      return;
    }

    scrollToElement(hash, headerHeight);
    return;
  }
}
