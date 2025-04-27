//const { MetaMaskSDK } = require('@metamask/sdk');
const { AccountId, PublicKey } = require('@hashgraph/sdk');
require('dotenv').config();

// Snap ID for Hedera Wallet Snap
const snapId = 'npm:@hashgraph/hedera-wallet-snap';

// Initialize MetaMask SDK with dapp metadata
const mmSdk = new MetaMaskSDK({
  dappMetadata: { name: 'Hedera DID CLI', url: 'http://localhost:3000' }, // Placeholder URL
});
const provider = mmSdk.getProvider();

/**
 * Connects to MetaMask and requests account access.
 * @returns {Promise<void>}
 * @throws {Error} If connection fails or user denies access.
 */
async function getSnapAccount() {
  if (!process.env.HEDERA_ACCOUNT_ID || !process.env.HEDERA_PUBLIC_KEY) {
    throw new Error('Please set HEDERA_ACCOUNT_ID and HEDERA_PUBLIC_KEY in .env');
  }
  return {
    accountId: AccountId.fromString(process.env.HEDERA_ACCOUNT_ID),
    publicKey: PublicKey.fromString(process.env.HEDERA_PUBLIC_KEY),
  };
}

/**
 * Retrieves Hedera account information from the Hedera Wallet Snap.
 * @returns {Promise<Object>} Snap response containing account info.
 * @throws {Error} If snap invocation fails.
 */
async function getSnapAccountInfo() {
  try {
    const response = await provider.request({
      method: 'wallet_invokeSnap',
      params: [
        snapId,
        {
          method: 'getAccountInfo',
          params: { network: 'testnet' },
        },
      ],
    });
    return response;
  } catch (error) {
    console.error('Failed to get snap account info:', error);
    throw error;
  }
}

/**
 * Signs a message using the Hedera Wallet Snap.
 * @param {string} message - The message to sign.
 * @returns {Promise<string>} The signature of the message.
 * @throws {Error} If signing fails.
 */
async function signMessage(message) {
  try {
    const response = await provider.request({
      method: 'wallet_invokeSnap',
      params: [
        snapId,
        {
          method: 'signMessage',
          params: { network: 'testnet', message },
        },
      ],
    });
    return response.signature;
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw error;
  }
}

/**
 * Retrieves Hedera account details from the snap and converts them to SDK objects.
 * @returns {Promise<{accountId: AccountId, publicKey: PublicKey}>} Hedera account details.
 * @throws {Error} If account info retrieval or conversion fails.
 */
async function getSnapAccount() {
  const info = await getSnapAccountInfo();
  return {
    accountId: AccountId.fromString(info.hederaAccountId),
    publicKey: PublicKey.fromString(info.publicKey),
  };
}

module.exports = {
  getSnapAccountInfo,
  signMessage,
  getSnapAccount,
};