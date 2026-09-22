const newsletterSignupUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdhSlAeNGTWPpnG3ZrEx8mASD-W70i7KKJsN-8llZlmvkwTJw/viewform";
if (newsletterSignupUrl) {
  const url = new URL(newsletterSignupUrl);
  if (url.protocol === "https:" && url.hostname === "docs.google.com" && url.pathname.startsWith("/forms/d/e/") && url.pathname.endsWith("/viewform")) {
    const frame = document.createElement("iframe");
    const embedUrl = new URL(url);
    embedUrl.searchParams.set("embedded", "true");
    frame.src = embedUrl.href;
    frame.title = "Subscribe to the monthly Future Leaders newsletter";
    frame.className = "newsletter-frame";
    frame.loading = "lazy";
    const link = document.createElement("a");
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open signup form";
    document.getElementById("newsletter-signup").replaceChildren(link, frame);
  }
}
