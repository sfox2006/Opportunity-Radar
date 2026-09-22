function checkExisting31Responses() {
  const rows = SpreadsheetApp.openById(FORM_RESPONSE_SHEET).getSheetByName(FORM_RESPONSE_TAB).getRange(2, 1, 31, 3).getValues();
  const contacts = new Map();
  rows.forEach(row => {
    const name = String(row[1] || "").trim(), email = String(row[2] || "").trim().toLowerCase();
    if (!name || name.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error("Invalid response; no contacts changed.");
    if (!contacts.has(email)) contacts.set(email, name);
  });
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const props = PropertiesService.getScriptProperties(), group = props.getProperty("GROUP");
    if (!group || people_(group).name !== "Future Leaders") throw new Error("Newsletter label does not match.");
    const summary = { responses: rows.length, uniqueEmails: contacts.size, created: 0, existing: 0, labelAdded: 0, alreadyLabelled: 0, verified: 0 };
    for (const [email, name] of contacts) {
      const key = "BACKFILL_31_" + hash_(email);
      let person = props.getProperty(key) || findContact_(email);
      if (!person) {
        person = people_("people:createContact", "post", {
          names: [{ unstructuredName: name }], emailAddresses: [{ value: email }]
        }).resourceName;
        if (!person) throw new Error("Contact creation returned no identifier.");
        summary.created++;
      } else summary.existing++;
      props.setProperty(key, person);
      const read = () => people_(person + "?personFields=emailAddresses,memberships");
      const labelled = value => (value.memberships || []).some(m => m.contactGroupMembership && m.contactGroupMembership.contactGroupResourceName === group);
      let current = read();
      if (!(current.emailAddresses || []).some(a => String(a.value).trim().toLowerCase() === email))
        throw new Error("Contact email verification failed.");
      if (labelled(current)) summary.alreadyLabelled++;
      else {
        const result = people_(group + "/members:modify", "post", { resourceNamesToAdd: [person] });
        if ((result.notFoundResourceNames || []).length) throw new Error("Contact could not be labelled.");
        summary.labelAdded++;
        current = read();
      }
      if (!labelled(current)) throw new Error("Label verification failed; rerun to check again.");
      summary.verified++;
    }
    props.setProperty("BACKFILL_31_REPORT", JSON.stringify(summary));
    console.log(JSON.stringify(summary));
  } finally { lock.releaseLock(); }
}
