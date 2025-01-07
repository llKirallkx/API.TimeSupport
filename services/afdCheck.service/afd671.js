const stream = require('stream');
const readline = require('readline');
const checkHelper = require("./afdCheckHelper");
const { error } = require('console');

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
    let lastNsr = "start";
    let intRegistros = 0;
    let repp = false;
    let hasCrc16 = cabecalho.hasCrc16;

    const rlForHeader = createReadline();
    const cabecalhoLine = await checkHelper.getCabecalho(rlForHeader);
    cabecalho = checkHelper.isNullorEmpty(cabecalhoLine) ? null : cabecalhoFunction(cabecalhoLine);

    if (!cabecalho) {
        erros.push("Cabeçalho não encontrado no arquivo.");
    }

    

    const rlForRecords = createReadline();
    for await (const line of rlForRecords) {
        lineNumber++;
        let currentNsr = line !== cabecalhoLine ? line.substring(0, 9) : "start";
        
        if (checkHelper.invalidLine(line)) {
            invalidLines.push(`Linha ${lineNumber} inválida`)
            continue;
        };

        // verificar se a sequencia do NSR está correta
        if (lastNsr !== 'start' && parseInt(currentNsr) !== parseInt(lastNsr) + 1){
            erros.push(`Linha ${lineNumber} possui NSR incompatível com anterior`)
        }

        if (line[9] === '3') {
            let registrosProcess = registroCFunction(line, lineNumber, hasCrc16);
            
            if(registrosProcess.hasError){
                erros.push(registrosProcess.errors)
            }
            intRegistros++;
        }

        if (line[9] === '7') {
            repp = true;
            let mgsRepp = registroPFunction()
            erros.push(`Linha ${lineNumber}: ${mgsRepp}`)
            intRegistros++;
        }
        lastNsr = currentNsr;
    }

    registros.push({hasCrc16, repp, intRegistros })
    return { cabecalho, registros, invalidLines, erros }
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

function registroCFunction(line, lineNumber, hasCrc16) {
    let errors = [];
    let hasError = false;
    const crc16 = line.substring(46)
    const hasCrc16Line = !checkHelper.isNullorEmpty(crc16);
    const dateTimeLine = line.substring(10, 34)
    const registerDateTime = checkHelper.parseDateTime(dateTimeLine);
    
    // verificar pelo tipo de registro se a linha possui o tamanho adequado
    if (line.length > 50 || line.length < 46){
        errors.push(`Linha ${lineNumber} possui tamanho inválido`)
    }

    // verificar inconsistência nas datas
    if(registerDateTime instanceof Error){
        errors.push(`Linha ${lineNumber} possui data inválida`)
    }

    if(hasCrc16 && !hasCrc16Line){
        errors.push(`Linha ${lineNumber} não possui CRC-16`)
    }

    if (errors.length > 0){
        hasError = true
    }

    return { hasError, errors, hasCrc16Line }
}

function registroPFunction() {
    return 'Registro realizado por REP-P, não é aceito pelo Pontofopag'
    // verificar nas linhas de registro se possui crc16
    // verificar pelo tipo de registro se a linha possui o tamanho adequado
    // verificar se a sequencia do NSR está correta
    // verificar inconsistência nas datas
}

module.exports = { processLine671 }