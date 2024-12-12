const stream = require('stream');
const readline = require('readline');
const checkHelper = require("./afdCheckHelper");

async function processLine671(buffer) {

    const createReadline = () => {
        const readStream = new stream.PassThrough();
        readStream.end(buffer);

        return readline.createInterface({
            input: readStream,
            crlfDelay: Infinity,
        });
    };

    let lineNumber = 0;
    let cabecalho = null;
    let invalidLines = [];
    let registros = [];
    let erros = [];
    let hasCrc16 = false;

    const rlForHeader = createReadline();
    const cabecalhoLine = await checkHelper.getCabecalho(rlForHeader);
    cabecalho = checkHelper.isNullorEmpty(cabecalhoLine) ? null : cabecalhoFunction(cabecalhoLine);

    if (!cabecalho) {
        erros.push("Cabeçalho não encontrado no arquivo.");
    }

    const rlForRecords = createReadline();
    for await (const line of rlForRecords) {
        lineNumber++;
        
        if (checkHelper.invalidLine(line)) {
            invalidLines.push(`Linha ${lineNumber} inválida`)
            continue;
        };

        if (line[9] === '3') {
            let registrosProcess = registroCFunction(line, lineNumber);
            
            if(registrosProcess.hasError){
                erros.push(registrosProcess.errors)
            }

            // registros.push(registrosProcess.hasCrc16)
        }

        if (line[9] === '7') {
            registroPFunction()
        }
    }

    registros.push({hasCrc16})
    return { cabecalho, registros }
}


function cabecalhoFunction(line, lineNumber) {
    
    let erros = [];
    const razaoSocial = line.substring(39, 189).trim()
    const identificationType = line[10] === '1' ? 'CNPJ' : line[10] === '2' ? 'CPF' : null;
    const nREP = line.substring(189, 206)
    const initialDate = line.substring(206, 216)
    const finalDate = line.substring(216, 226)
    const generationdateTime = line.substring(226, 249)
    const modelREP = line.substring(268, 298).trim()
    const crc16 = line.substring(298)
    const hasCrc16 = !checkHelper.isNullorEmpty(crc16);

    if (line.substring(0, 9) != "000000000")
        erros.push("Campo 1 inválido");

    if (checkHelper.isNullorEmpty(identificationType))
        erros.push("Não foi possível identificar o tipo do empregador")

    if (!hasCrc16)
        erros.push("Cabeçalho não possui CRC-16")


    return { erros, razaoSocial, identificationType, nREP, initialDate, finalDate, generationdateTime, modelREP, hasCrc16, crc16 }
}

function registroCFunction(line, lineNumber) {
    let errors = [];
    let hasError = false;
    const crc16 = line.substring(46)
    const hasCrc16 = !checkHelper.isNullorEmpty(crc16);
    const dateTimeLine = line.substring(10, 34)
    const registerDateTime = checkHelper.parseDateTime(dateTimeLine);
    
    if (line.length > 50 || line.length < 46){
        errors.push(`Linha ${lineNumber} possui tamanho inválido`)
    }
    // verificar pelo tipo de registro se a linha possui o tamanho adequado
    // verificar se a sequencia do NSR está correta
    // verificar inconsistência nas datas

    if (errors.length > 0){
        hasError = true
    }

    return { hasError, errors, hasCrc16 }
}

function registroPFunction() {
    
    // verificar nas linhas de registro se possui crc16
    // verificar pelo tipo de registro se a linha possui o tamanho adequado
    // verificar se a sequencia do NSR está correta
    // verificar inconsistência nas datas
}

module.exports = { processLine671 }