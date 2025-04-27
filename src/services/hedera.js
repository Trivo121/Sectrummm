const { Client } = require('@hashgraph/sdk');
const { getSnapAccount } = require('./wallet');

/**
 * Retrieves a Hedera client configured with the connected MetaMask account.
 * @returns {Promise<Client>} Hedera client instance.
 * @throws {Error} If account retrieval or client setup fails.
 */
async function getHederaClient() {
  try {
    const { accountId, publicKey } = await getSnapAccount();
    const client = Client.forTestnet();
    // Note: Private key is managed by MetaMask Snap; signing is handled via signMessage.
    client.setOperator(accountId, null); // Public key not needed for operator here.
    return client;
  } catch (error) {
    console.error('Failed to get Hedera client:', error);
    throw error;
  }
}

module.exports = { getHederaClient };