const helperService = require("../helpers");

// Função para verificar o dígito 10 e chamar outra função se necessário
async function processFile(buffer, lineCallback, specificCallback) {
    const readStream = new stream.PassThrough();
    readStream.end(buffer);
  
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity
    });
  
    let lineNumber = 0;
    const adjustedLines = [];
    
    for await (const line of rl) {
      lineNumber++;
      let adjustedLine = lineCallback(line, lineNumber);
      if (line[9] === '3') { // Verifica se o décimo caractere é '3'
        adjustedLine = specificCallback(line, lineNumber);
      }
      adjustedLines.push(adjustedLine);
    }
    return adjustedLines;
}

function handleSpecificLine(line, lineNumber) {
    return helperService.calcularCRC16Modbus(line);
}

function defaultLineHandler(line, lineNumber) {
    return line;
}

module.exports = { processFile, handleSpecificLine, defaultLineHandler };