// Google Apps Script mail relay. Sends email from the Google account that deploys it.
// Setup: script.google.com > New project > paste this > set SECRET below >
// Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone > Deploy > copy the URL.
const SECRET = "CHANGE_ME_TO_A_LONG_RANDOM_STRING";

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.secret !== SECRET) return out({ ok: false, error: "unauthorized" });
    MailApp.sendEmail({ to: d.to, subject: d.subject, body: d.text, htmlBody: d.html, name: "Expense Tracker" });
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
