const { Client, TopicCreateTransaction, ConsensusSubmitMessageTransaction, TransactionId, Hbar } = require('@hashgraph/sdk');
const client = Client.forTestnet();

async function createTopic(snapAccount) {
  const { accountId, publicKey } = snapAccount;
  const transaction = new TopicCreateTransaction()
    .setTransactionId(TransactionId.generate(accountId))
    .setMaxTransactionFee(new Hbar(1));
  const frozenTx = transaction.freezeWith(client);
  const txBodyBytes = frozenTx.toBytes();
  const signature = await signTransactionBody(txBodyBytes.toString('hex'));
  frozenTx.addSignature(publicKey, signature);
  const receipt = await frozenTx.execute(client);
  return receipt.topicId.toString();
}

async function submitMessage(topicId, message, snapAccount, signFunction) {
  const { accountId, publicKey } = snapAccount;
  const transaction = new ConsensusSubmitMessageTransaction()
    .setTopicId(topicId)
    .setMessage(message)
    .setTransactionId(TransactionId.generate(accountId))
    .setMaxTransactionFee(new Hbar(1));
  const frozenTx = transaction.freezeWith(client);
  const txBodyBytes = frozenTx.toBytes();
  const signature = await signFunction(txBodyBytes.toString('hex'));
  frozenTx.addSignature(publicKey, Buffer.from(signature, 'hex'));
  await frozenTx.execute(client);
}

async function signTransactionBody(txBodyBytes) {
  const { signMessage } = require('./wallet');
  return Buffer.from(await signMessage(txBodyBytes), 'hex');
}