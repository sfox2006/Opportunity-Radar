const LABEL = "Future Leaders";
const CONSENT = "I want to receive the monthly Future Leaders newsletter. I can unsubscribe at any time.";

function setup() {
  const props = PropertiesService.getScriptProperties();
  const groups = [];
  let page = "";
  do {
    const result = people_("contactGroups?pageSize=1000" + (page ? "&pageToken=" + encodeURIComponent(page) : ""));
    groups.push.apply(groups, result.contactGroups || []);
    page = result.nextPageToken || "";
  } while (page);
  const group = groups.find(item => item.name === LABEL);
  if (!group) throw new Error("The Future Leaders label was not found in this Google account.");
  props.setProperty("GROUP", group.resourceName);
  if (!props.getProperty("LEDGER")) {
    const file = SpreadsheetApp.create("Future Leaders signup consent");
    file.getSheets()[0].appendRow(["Private signup records"]);
    props.setProperty("LEDGER", file.getId());
  }
}

function people_(path, method, body) {
  const response = UrlFetchApp.fetch("https://people.googleapis.com/v1/" + path, {
    method: method || "get",
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    contentType: "application/json",
    ...(body ? { payload: JSON.stringify(body) } : {}),
    muteHttpExceptions: true
  });
  if (response.getResponseCode() >= 300) throw new Error("Contact service is temporarily unavailable.");
  return JSON.parse(response.getContentText());
}

function sheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("LEDGER");
  if (!id) throw new Error("Signup is not connected yet.");
  return SpreadsheetApp.openById(id).getSheets()[0];
}

function records_(sheet) {
  return sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map((row, i) => ({ row: i + 2, data: JSON.parse(row[0]) }));
}

function hash_(token) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token).map(b => ("0" + ((b + 256) % 256).toString(16)).slice(-2)).join("");
}

function save_(sheet, row, data) {
  sheet.getRange(row, 1).setValue(JSON.stringify(data));
  SpreadsheetApp.flush();
}

function subscribe(input) {
  if (!input || input.consent !== true) throw new Error("Please agree to receive the newsletter.");
  if (input.website) throw new Error("Signup could not be completed.");
  const data = {};
  for (const key of ["name", "email", "country", "linkedin"]) data[key] = String(input[key] || "").trim();
  data.email = data.email.toLowerCase();
  if (!data.name || data.name.length > 120 || !data.country || data.country.length > 100 ||
      data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
      (data.linkedin && !/^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_%.-]+\/?$/.test(data.linkedin)))
    throw new Error("Check your name, email, country and optional LinkedIn profile URL.");
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = sheet_(), rows = records_(sheet), now = Date.now();
    const existing = rows.find(row => row.data.email === data.email);
    const message = "You are subscribed to the monthly Future Leaders newsletter.";
    if (existing && existing.data.status === "subscribed") return { message };
    if (!existing && rows.filter(row => now - row.data.requestedAt < 86400000).length >= 75)
      throw new Error("Signup is temporarily busy. Please try again tomorrow.");
    const group = PropertiesService.getScriptProperties().getProperty("GROUP");
    if (!group) throw new Error("Signup is not connected yet.");
    const token = Utilities.getUuid() + Utilities.getUuid();
    const url = ScriptApp.getService().getUrl();
    if (!url) throw new Error("Signup has not been deployed.");
    Object.assign(data, { status: "saving", requestedAt: now, tokenHash: hash_(token), consent: CONSENT, consentVersion: "2026-09-10" });
    const row = existing ? existing.row : sheet.getLastRow() + 1;
    data.person = existing && existing.data.person || findContact_(data.email);
    if (!data.person) {
      data.person = people_("people:createContact", "post", {
        names: [{ unstructuredName: data.name }],
        emailAddresses: [{ value: data.email }],
        addresses: [{ country: data.country }],
        ...(data.linkedin ? { urls: [{ value: data.linkedin, type: "profile" }] } : {})
      }).resourceName;
    }
    // Save the contact reference before adding the label so retries reuse it.
    save_(sheet, row, data);
    const response = people_(group + "/members:modify", "post", { resourceNamesToAdd: [data.person] });
    if ((response.notFoundResourceNames || []).length) throw new Error("Signup could not be completed. Please try again later.");
    data.status = "subscribed";
    data.subscribedAt = Date.now();
    save_(sheet, row, data);
    return { message, unsubscribe: url + "?action=unsubscribe&token=" + encodeURIComponent(token) };
  } finally { lock.releaseLock(); }
}

function findContact_(email) {
  let page = "";
  do {
    const response = people_("people/me/connections?personFields=emailAddresses&pageSize=1000" + (page ? "&pageToken=" + encodeURIComponent(page) : ""));
    const match = (response.connections || []).find(person => (person.emailAddresses || []).some(address => address.value.toLowerCase() === email));
    if (match) return match.resourceName;
    page = response.nextPageToken || "";
  } while (page);
  return null;
}

function completeSubscription(action, token) {
  if (action !== "unsubscribe" || !/^[a-f0-9-]{72}$/.test(token || "")) throw new Error("This link is invalid.");
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = sheet_(), record = records_(sheet).find(row => row.data.tokenHash === hash_(token));
    if (!record) throw new Error("This link is no longer valid.");
    const data = record.data;
    const group = PropertiesService.getScriptProperties().getProperty("GROUP");
    if (!group) throw new Error("Signup is not connected yet.");
    if (action === "unsubscribe") {
      if (data.person && data.status === "subscribed") {
        const response = people_(group + "/members:modify", "post", { resourceNamesToRemove: [data.person] });
        if ((response.canNotRemoveLastContactGroupResourceNames || []).length) throw new Error("Please contact the sender to unsubscribe.");
      }
      data.status = "unsubscribed";
      data.unsubscribedAt = Date.now();
      save_(sheet, record.row, data);
      return { message: "You have been unsubscribed from Future Leaders." };
    }

  } finally { lock.releaseLock(); }
}

function doGet(e) {
  const template = HtmlService.createTemplateFromFile("Signup");
  const token = String((e && e.parameter.token) || "");
  template.token = /^[a-f0-9-]{72}$/.test(token) ? token : "";
  template.action = "unsubscribe";
  return template.evaluate().setTitle("Future Leaders newsletter").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
