// utils/helpers.js
const { randomUUID } = require('node:crypto');

function generateUniqueEmail(prefix, domain) {
  return `${prefix}-${randomUUID()}${domain}`;
}
async function submitAndAcceptDialog(page, submit) {
  let acceptPromise;
  page.once('dialog', (dialog) => {
    acceptPromise = dialog.accept();
  });
  await submit();
  if (acceptPromise) {
    await acceptPromise;
  }
}

module.exports = {
  generateUniqueEmail,
  submitAndAcceptDialog,
};