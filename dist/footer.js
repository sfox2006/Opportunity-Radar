// Verified destinations only. Set each site's own approved form or contact URL.
const footerRoutes = { listing: "", organisation: "", promotion: "" };
for (const [kind, destination] of Object.entries(footerRoutes)) {
  if (!destination || !/^(https:\/\/|mailto:)/.test(destination)) continue;
  const link = document.querySelector(`[data-footer-route="${kind}"]`);
  if (!link) continue;
  link.href = destination;
  link.hidden = false;
  document.querySelector(`[data-footer-pending="${kind}"]`)?.setAttribute("hidden", "");
}
