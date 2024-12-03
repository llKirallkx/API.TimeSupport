const db = require("../../models");
const fs = require('fs');
const afdHelperService = require("./afdHelpers.service");
const helperService = require("../helpers");

const tipo = 3;

Date.prototype.addHours = function (value) {
    this.setHours(this.getHours() + value);
}

async function generator671(bodyData) {

    const Afd = db.afds;
    let nsrBanco = await afdHelperService.getNsr(Afd);
    let nsr = nsrBanco.nsr;

    let trabalhadores = bodyData.content.split('\n');
    let numTrab = trabalhadores.length;
    const tipoDeIdentificador = bodyData.tipoDeIdentificador; // 1 CNPJ - 2 CPF
    const cnpjOuCpf = bodyData.cnpjOuCpf;
    let reqRazaoSocial = bodyData.razaoSocial;

    try {
        var razaosocial = afdHelperService.formatRazaoSocial(reqRazaoSocial);
    } catch (error) {
        console.error(error.message);
    }

    let entrada1 = bodyData.entrada1;
    let saida1 = bodyData.saida1;
    let entrada2 = bodyData.entrada2;
    let saida2 = bodyData.saida2;
    let recieveEvent = bodyData.event;

    const event = afdHelperService.timeZoneAjust(recieveEvent);
    const finaleventCabecalho = bodyData.finalevent;
    const recieveFinalEvent = new Date(bodyData.finalevent)
    const finalevent = recieveFinalEvent.setDate(recieveFinalEvent.getDate() + 1);
    const yearSet = event.getFullYear();

    let horarios = [entrada1, saida1, entrada2, saida2];
    const hoje = afdHelperService.timeZoneAjust().toISOString();

    const cabecalho = `0000000001${tipoDeIdentificador}${cnpjOuCpf}              ${razaosocial}99999999999999999${recieveEvent}${finaleventCabecalho}${hoje}003146100098000150                                  `;

    let filePath = afdHelperService.createFile(cabecalho);

    for (const trab of trabalhadores) {
        let countTrabs = 0;
        let cpf = trabalhadores[countTrabs];

        event.setDate(event.getDate() + 1);
        while (finalevent >= event) {


            if (event.getDay() === 0 || event.getDay() === 6) {
                event.setDate(event.getDate() + 1);
            } else {

                let mesGet = event.getMonth();
                const nMes = afdHelperService.fillMes(mesGet + 1); // mes do bilhete
                const nDia = afdHelperService.fillDate(event.getDate()); // data do bilhete
                let contador = 0;

                for (const batidas of horarios) {

                    const batida = horarios[contador];
                    const nNsr = afdHelperService.fillNum(nsr); // NSR do bilhete

                    // Poratira 671
                    let registro = `${nNsr}${tipo}${yearSet}-${nMes}-${nDia}T${batida}:00-0300${cpf}`;
                    let crcCalculado = helperService.calcularCRC16Modbus(registro);
                    fs.appendFileSync(filePath, `\n${crcCalculado}`);

                    nsr++;
                    contador++;
                }

                event.setDate(event.getDate() + 1);

            }


        }


        let initDate = event.setDate(recieveEvent);
    }

    nsrBanco.nsr = nsr;
    await nsrBanco
        .save()
        .then(resultado => {

            console.log("NSR Atualizado no banco");

        }).catch(erro => {

            console.error(erro);

        });

    return filePath;
}

async function generator1510(bodyData) {
    const Afd = db.afds;
    let nsrBanco = await Nsr(Afd);
    let nsr = nsrBanco.nsr;

    let trabalhadores = req.body.content.split('\n');
    let numTrab = trabalhadores.length;

    const tipoDeIdentificador = req.body.tipoDeIdentificador; // 1 CNPJ - 2 CPF
    const cnpjOuCpf = req.body.cnpjOuCpf;
    let reqRazaoSocial = req.body.razaoSocial;

    try {
        var razaosocial = afdHelperService.formatRazaoSocial(reqRazaoSocial);
    } catch (error) {
        console.error(error.message);
    }

    let entrada1 = req.body.entrada1.replace(/:/g, '');
    let saida1 = req.body.saida1.replace(/:/g, '');
    let entrada2 = req.body.entrada2.replace(/:/g, '');
    let saida2 = req.body.saida2.replace(/:/g, '');
    let recieveEvent = req.body.event;
    const event = afdHelperService.timeZoneAjust(recieveEvent);
    const timeEvent = afdHelperService.formatDate(event);
    const recieveFinalEvent = new Date(req.body.finalevent)
    const finaleventCabecalho = helperService.formatDate(recieveFinalEvent);
    const finalevent = recieveFinalEvent.setDate(recieveFinalEvent.getDate() + 1);
    const yearSet = event.getFullYear();

    let horarios = [entrada1, saida1, entrada2, saida2];
    const hojeTz = helperService.timeZoneAjust();
    const hoje = helperService.formatDate(hojeTz);

    const cabecalho = `0000000001${tipoDeIdentificador}${cnpjOuCpf}            ${razaosocial}99999999999999999${timeEvent}${finaleventCabecalho}${hoje}`;

    let filePath = helperService.createFile(cabecalho);

    for (const trab of trabalhadores) {
        let countTrabs = 0;
        let cpf = trabalhadores[countTrabs];

        event.setDate(event.getDate() + 1);
        while (finalevent >= event) {

            if (event.getDay() === 0 || event.getDay() === 6) {
                event.setDate(event.getDate() + 1);
            } else {

                let mesGet = event.getMonth();
                const nMes = helperService.fillMes(mesGet + 1); // mes do bilhete
                const nDia = helperService.fillDate(event.getDate()); // data do bilhete
                let contador = 0;

                for (const batidas of horarios) {

                    const batida = horarios[contador];
                    const nNsr = helperService.fillNum(nsr); // NSR do bilhete
                    let registro = `${nNsr}${tipo}${nDia}${nMes}${yearSet}${batida}${cpf}`;

                    let crcCalculado = helperService.calcularCRC16Modbus(registro);
                    fs.appendFileSync(filePath, `\n${crcCalculado}`);

                    nsr++;
                    contador++;
                }

                event.setDate(event.getDate() + 1);
            }
        }
        let initDate = event.setDate(recieveEvent);
    }

    nsrBanco.nsr = nsr;
    await nsrBanco
        .save()
        .then(resultado => {

            console.log("NSR Atualizado no banco");

        }).catch(erro => {

            console.error(erro);

        });

    return filePath;

}


module.exports = { generator671, generator1510 };