// Public enquiry address authorised by Sam on 6 October 2026. No email is sent by this site.
const footerRoutes = {
  "listing": "mailto:samfoxanu@gmail.com?subject=Free+Society+Noticeboard+-+Opportunity+suggestion&body=Website%3A+https%3A%2F%2Fsfox2006.github.io%2FOpportunity-Radar%2F%0A%0AName+of+listing+or+organisation%3A%0AOfficial+source+link%3A%0ADetails+of+suggestion+or+promotion+enquiry%3A%0A",
  "organisation": "mailto:samfoxanu@gmail.com?subject=Free+Society+Noticeboard+-+Organisation+suggestion&body=Website%3A+https%3A%2F%2Fsfox2006.github.io%2FOpportunity-Radar%2F%0A%0AName+of+listing+or+organisation%3A%0AOfficial+source+link%3A%0ADetails+of+suggestion+or+promotion+enquiry%3A%0A",
  "promotion": "mailto:samfoxanu@gmail.com?subject=Free+Society+Noticeboard+-+Job+or+company+promotion+enquiry&body=Website%3A+https%3A%2F%2Fsfox2006.github.io%2FOpportunity-Radar%2F%0A%0AName+of+listing+or+organisation%3A%0AOfficial+source+link%3A%0ADetails+of+suggestion+or+promotion+enquiry%3A%0A"
};
for (const [kind, destination] of Object.entries(footerRoutes)) {
  if (!destination || !/^(https:\/\/|mailto:)/.test(destination)) continue;
  const link = document.querySelector(`[data-footer-route="${kind}"]`);
  if (!link) continue;
  link.href = destination;
  link.hidden = false;
  document.querySelector(`[data-footer-pending="${kind}"]`)?.setAttribute("hidden", "");
}
