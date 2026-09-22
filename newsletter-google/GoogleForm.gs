const FORM_RESPONSE_SHEET = "YOUR_FORM_RESPONSE_SHEET_ID";
const FORM_RESPONSE_TAB = "Form responses 1";

function setupGoogleFormTrigger() {
  const sheet = SpreadsheetApp.openById(FORM_RESPONSE_SHEET).getSheetByName(FORM_RESPONSE_TAB);
  if (!sheet || sheet.getRange(1, 1, 1, 3).getValues()[0].join("|") !== "Timestamp|Full name|Email")
    throw new Error("Response sheet columns do not match the signup form.");
  if (!PropertiesService.getScriptProperties().getProperty("GROUP"))
    throw new Error("Run the existing contact setup first.");
  const matching = ScriptApp.getProjectTriggers().filter(t =>
    t.getHandlerFunction() === "newsletterFormSubmitted_" && t.getTriggerSourceId() === FORM_RESPONSE_SHEET);
  if (!matching.length) ScriptApp.newTrigger("newsletterFormSubmitted_").forSpreadsheet(FORM_RESPONSE_SHEET).onFormSubmit().create();
}

function newsletterFormSubmitted_(e) {
  if (!e || !e.triggerUid || !e.source || e.source.getId() !== FORM_RESPONSE_SHEET ||
      !e.range || e.range.getSheet().getName() !== FORM_RESPONSE_TAB || e.range.getRow() < 2)
    throw new Error("Only submissions from the newsletter form are accepted.");
  const name = String((e.namedValues["Full name"] || [""])[0]).trim();
  const email = String((e.namedValues.Email || [""])[0]).trim().toLowerCase();
  if (!name || name.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Submission has an invalid name or email.");
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const props = PropertiesService.getScriptProperties();
    const group = props.getProperty("GROUP");
    if (!group) throw new Error("Contact label is not configured.");
    const ledger = sheet_().getParent();
    const log = ledger.getSheetByName("Google Form imports") || ledger.insertSheet("Google Form imports");
    const key = hash_(FORM_RESPONSE_SHEET + ":" + e.range.getRow() + ":" + JSON.stringify(e.values));
    const records = log.getLastRow() ? log.getRange(1, 1, log.getLastRow(), 1).getValues().map(r => JSON.parse(r[0])) : [];
    const index = records.findIndex(r => r.key === key);
    const record = index < 0 ? { key, status: "pending" } : records[index];
    if (record.status === "complete") return;
    const row = index < 0 ? log.getLastRow() + 1 : index + 1;
    record.person = record.person || findContact_(email);
    if (!record.person) record.person = people_("people:createContact", "post", {
      names: [{ unstructuredName: name }], emailAddresses: [{ value: email }]
    }).resourceName;
    if (!record.person) throw new Error("Contact service did not return a contact.");
    // Persist before membership changes so a failed label update can be retried.
    log.getRange(row, 1).setValue(JSON.stringify(record));
    SpreadsheetApp.flush();
    const result = people_(group + "/members:modify", "post", { resourceNamesToAdd: [record.person] });
    if ((result.notFoundResourceNames || []).length) throw new Error("Could not apply the newsletter label.");
    record.status = "complete";
    record.completedAt = Date.now();
    log.getRange(row, 1).setValue(JSON.stringify(record));
  } finally { lock.releaseLock(); }
}
