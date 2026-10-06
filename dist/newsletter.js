const newsletterSignupUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdhSlAeNGTWPpnG3ZrEx8mASD-W70i7KKJsN-8llZlmvkwTJw/viewform";
const signup = document.getElementById("newsletter-signup");
if (newsletterSignupUrl && signup) {
  const url = new URL(newsletterSignupUrl);
  if (url.protocol === "https:" && url.hostname === "docs.google.com" && url.pathname.startsWith("/forms/d/e/") && url.pathname.endsWith("/viewform")) {
    signup.href = url.href;
    signup.target = "_blank";
    signup.rel = "noopener noreferrer";
  } else {
    signup.removeAttribute("href");
  }
}
