// Public submission forms. Response spreadsheets stay private in Google Drive.
const footerRoutes = {
  "listing": "https://docs.google.com/forms/d/e/1FAIpQLSe8qHuPxSnBhHBDQ8RutvVsBWJ06LHEpkLAw41eo-r9MKjbZQ/viewform",
  "organisation": "https://docs.google.com/forms/d/e/1FAIpQLScQAmk6DazqUNP417iAsgcOFP62FxE3LLDY6nuOu4I-avRQyw/viewform",
  "promotion": "https://docs.google.com/forms/d/e/1FAIpQLSfZI9ClBDkwlXP0_oan20etCCAAfl0Ev3CxohymaNzhiGUgDA/viewform"
};
for (const [kind, destination] of Object.entries(footerRoutes)) {
  if (!destination || !/^https:\/\/docs\.google\.com\/forms\/d\/e\/[^/]+\/viewform$/.test(destination)) continue;
  const link = document.querySelector(`[data-footer-route="${kind}"]`);
  if (!link) continue;
  link.href = destination;
  link.hidden = false;
  document.querySelector(`[data-footer-pending="${kind}"]`)?.setAttribute("hidden", "");
}
