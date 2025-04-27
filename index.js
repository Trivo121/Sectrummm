const { Command } = require('commander');
const createDid = require('./src/commands/did/create');
const { getDid } = require('./src/utils/storage');
const resolveDid = require('./src/services/did').resolveDid;

const program = new Command();

program
  .command('did create')
  .description('Create a new DID')
  .action(async () => {
    await createDid();
  });

program
  .command('did show')
  .description('Show the DID')
  .action(() => {
    const did = getDid();
    if (did) console.log(did);
    else console.log('No DID found');
  });

program
  .command('did resolve <did>')
  .description('Resolve a DID')
  .action(async (did) => {
    const didDocument = await resolveDid(did);
    console.log(JSON.stringify(didDocument, null, 2));
  });

program.parse(process.argv);