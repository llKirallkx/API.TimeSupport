const path = require('path');
const fs = require('fs');

async function getNsr(Afd) {
    let nsr = await Afd.findOne({});
    return nsr
}

function fillMes(mes) {
    return mes.toString().padStart(2, "0")
}

function fillDate(dates) {
    return dates.toString().padStart(2, "0")
}

// ajusta o nsr com os 00 na frente
function fillNum(nsrs) {
    return nsrs.toString().padStart(9, "0")
}

function formatRazaoSocial(str) {
    if (str.length < 150) {
        // Preencher a string com espaços em branco até atingir 150 caracteres
        while (str.length < 150) {
            str += ' ';
        }
        return str;
    } else if (str.length === 150) {
        // Retornar a string sem alterações se já tiver 150 caracteres
        return str;
    } else {
        // Caso a string seja maior que 150 caracteres, retornar um erro
        throw new Error('A string tem mais de 150 caracteres.');
    }
}

function createFile(cabecalho) {
    const filePath = path.resolve(__dirname, '../../files/Afd-GeneretorAFD.txt');

    fs.writeFileSync(filePath, cabecalho);
    console.log('arquivo criado');

    return filePath
}

function timeZoneAjust(date) {

    if (date === null || date === undefined) {
        var dateNow = new Date();
    } else {
        var dateNow = new Date(date);
    }

    if (dateNow.getTimezoneOffset() === 0) {
        dateNow.addHours(-3)
    }

    return dateNow
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0'); // Obtém o dia e adiciona zero à esquerda, se necessário
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtém o mês (adicionando 1, pois getMonth() retorna de 0 a 11) e adiciona zero à esquerda, se necessário
    const year = date.getFullYear(); // Obtém o ano
  
    return `${day}${month}${year}`; // Concatena no formato ddmmaaaa
}


module.exports = { getNsr, fillMes, fillDate, fillNum, formatRazaoSocial, createFile, timeZoneAjust, formatDate };