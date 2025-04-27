const { getSnapAccount } = require('./wallet');
const { saveDID, loadDID } = require('../utils/storage'); // Placeholder for storage utils

/**
 * Creates a new DID using the connected MetaMask account's public key.
 * @returns {Promise<{did: string, didDocument: Object}>} The created DID and its document.
 * @throws {Error} If account retrieval or DID creation fails.
 */
async function createDID() {
  try {
    const { accountId, publicKey } = await getSnapAccount();
    const did = `did:hedera:testnet:${accountId.toString()}`;

    const didDocument = {
      '@context': 'https://www.w3.org/ns/did/v1',
      id: did,
      verificationMethod: [
        {
          id: `${did}#key-1`,
          type: 'Ed25519VerificationKey2018',
          controller: did,
          publicKeyBase58: publicKey.toString(), // Adjust encoding if needed
        },
      ],
      authentication: [`${did}#key-1`],
    };

    // Save locally for now; in production, use Hedera Consensus Service (HCS)
    saveDID(did, didDocument);
    return { did, didDocument };
  } catch (error) {
    console.error('Failed to create DID:', error);
    throw error;
  }
}

/**
 * Retrieves the DID document for a given DID.
 * @param {string} did - The DID to retrieve.
 * @returns {Object} The DID document.
 * @throws {Error} If the DID is not found.
 */
function showDID(did) {
  const didDocument = loadDID(did);
  if (!didDocument) {
    throw new Error(`DID not found: ${did}`);
  }
  return didDocument;
}

/**
 * Resolves the DID document for a given DID.
 * @param {string} did - The DID to resolve.
 * @returns {Object} The DID document.
 * @throws {Error} If the DID is not found.
 */
function resolveDID(did) {
  // Placeholder: Uses local storage; in production, query Hedera network
  return showDID(did);
}

module.exports = { createDID, showDID, resolveDID };