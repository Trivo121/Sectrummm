const { getSnapAccount, signMessage } = require('../../services/wallet');
const { createTopic, submitMessage } = require('../../services/hedera');
const { createDidDocument } = require('../../services/did');
const bs58 = require('bs58');
const { saveDid } = require('../../utils/storage');

async function createDid() {
  //await connectMetaMask();
  const snapAccount = await getSnapAccount();
  const topicId = await createTopic(snapAccount);
  const base58PublicKey = bs58.encode(snapAccount.publicKey.toBytes());
  const did = `did:hedera:testnet:${base58PublicKey}_${topicId}`;
  const didDocument = createDidDocument(did, snapAccount.publicKey);
  const messageObject = {
    operation: 'create',
    did: did,
    event: Buffer.from(JSON.stringify(didDocument)).toString('base64'),
    timestamp: new Date().toISOString(),
  };
  const messageString = JSON.stringify(messageObject);
  const signature = await signMessage(messageString);
  const signatureBase64 = Buffer.from(signature, 'hex').toString('base64');
  const hcsMessage = { message: messageObject, signature: signatureBase64 };
  await submitMessage(topicId, JSON.stringify(hcsMessage), snapAccount, signMessage);
  saveDid(did);
  console.log(`DID created: ${did}`);
}

module.exports = createDid;