function getVersion(line) {

    const substring = line.substring(226, 250)
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{4}$/;

    return regex.test(substring) ? "671" : "1510";
}

function getTypeAfd(line) {

    if (input.length < 10) {
        return 'invalid line'
    }

    const typeNumber = input[9];

    return type;

}

const tipos = {
    '1': 'Cabeçalho',
    '2': 'Inclusão ou alteração da identificação da empresa'
    // Adicione outros tipos aqui, se necessário
};

function invalidLine(line) {
    const regex = /[!@#$%¨&*(){}?/\\"]/;
    const hasInvalidCaracteres = line.match(regex);

    if (line.length < 10 || hasInvalidCaracteres) {
        return true;
    }

    return false
}

async function getCabecalho(rl) {
    for await (const line of rl) {

        if (invalidLine(line)) {
            continue;
        }

        if (line[9] === '1') {
            return line;
        }
    }
    return null;
}

function isNullorEmpty(string) {
    return string === '' || !string ? true : false
}

function parseDateTime(input) {
    try {
      const sanitizedInput = input.replace(/([-+]\d{2}):?(\d{2})$/, "$1$2");
     
      // Tenta criar o objeto Date
      const dateTime = new Date(sanitizedInput);
      
      // Valida se o objeto Date é válido
      if (isNaN(dateTime.getTime())) {
        throw new Error("Formato de data/hora inválido.");
      }
      
      return dateTime;
    } catch (error) {
      return { error: error.message };
    }
  }

module.exports = { getTypeAfd, invalidLine, getVersion, getCabecalho, isNullorEmpty, parseDateTime }
