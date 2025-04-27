// src/commands/did/show.js
const { loadDID } = require("../../utils/storage");

function showDIDCommand() {
  const data = loadDID();
  if (data) {
    console.log(`Your DID: ${data.did}`);
    console.log(`Associated Topic ID: ${data.topicId}`);
  } else {
    console.log("No DID found. Run 'create-did' first.");
  }
}

module.exports = showDIDCommand;