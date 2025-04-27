const { resolveDid } = require('../../services/did');

async function resolveDidCommand(did) {
  try {
    const didDocument = await resolveDid(did);
    console.log(JSON.stringify(didDocument, null, 2));
  } catch (error) {
    console.error('Error resolving DID:', error.message);
  }
}

module.exports = resolveDidCommand;