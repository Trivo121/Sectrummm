const { PrivateKey } = require("@hashgraph/sdk");

function generateKeyPair() {
  const privateKey = PrivateKey.generateED25519();
  const publicKey = privateKey.publicKey;
  return { privateKey, publicKey };
}

module.exports = { generateKeyPair };