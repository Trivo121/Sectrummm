const fs = require('fs');
const path = require('path');

const STORAGE_PATH = path.join(__dirname, '../../storage');

if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH);
}

function saveDID(did, document) {
  const filePath = path.join(STORAGE_PATH, `${did}.json`);
  fs.writeFileSync(filePath, JSON.stringify(document, null, 2));
}

function loadDID(did) {
  const filePath = path.join(STORAGE_PATH, `${did}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
}

module.exports = { saveDID, loadDID };