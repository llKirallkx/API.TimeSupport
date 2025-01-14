const checkHelper = require("./afdCheckHelper");
const stream = require('stream');
const readline = require('readline');
const afd671 = require("./afd671")

async function processFile(buffer) {
  const readStream = new stream.PassThrough();
  readStream.end(buffer);

  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
  });

  let lineNumber = 0;

  // criar objeto para retornar o json
  const cabecalho = await checkHelper.getCabecalho(rl);
  const afdVersion = checkHelper.getVersion(cabecalho);

  let processed = null;
  if(afdVersion === "671"){
    processed = await afd671.processLine671(buffer);
  }

  return processed;
}


module.exports = { processFile }
