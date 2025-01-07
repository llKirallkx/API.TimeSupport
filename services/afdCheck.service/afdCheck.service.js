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


// # CNPJ / CPF, razao social, numero de serie, data inicial e final dos registros, data de criação do arquivo.
// verificar caracteres inválidos
// verificar nas linhas de registro se possui crc16
// verificar pelo tipo de registro se a linha possui o tamanho adequado
// verificar se a sequencia do NSR está correta
// verificar inconsistência nas datas
// resumo das linhas processadas por tipo (Alteração de empresa, marcação de ponto, alteração de data e hora, alteraçao e incluão de funcionários, exclusão de funcionários)


module.exports = { processFile }
