const fs = require('fs');
const { throws, rejects } = require('assert');
require("dotenv").config()
const { MongoMissingCredentialsError } = require("mongodb");
const ObjectId = require('mongoose').Types.ObjectId;

// default

const tipo = 3;

// Express server API

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware para analisar os dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(10000, () => {
    console.log('API Iniciada');
  });

require("./database/connection");
const db = require("./models");
const afdModel = require('./models/afd.model');


// functions

async function Nsr(Afd){
    let nsr = await Afd.findOne({});
    return nsr
}

function fillMes(mes){
    return mes.toString().padStart(2, "0")
}

function fillDate(dates){
    return dates.toString().padStart(2, "0")
}

// ajusta o nsr com os 00 na frente
function fillNum(nsrs){
    return nsrs.toString().padStart(9, "0")
}

function formatarRazaoSocial(str) {
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

function calcularCRC16Modbus(data) {
    const POLYNOMIAL = 0xA001; // Polinômio utilizado no cálculo do CRC-16/MODBUS
    let crc = 0xFFFF; // Valor inicial do CRC
  
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i); // XOR byte a byte com o CRC atual
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x0001) !== 0) {
          crc = (crc >> 1) ^ POLYNOMIAL;
        } else {
          crc >>= 1;
        }
      }
    }
  
    // Formatar o resultado para 4 dígitos hexadecimais (exemplo: "ABCD")
    const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  
    return crcHex;
}

function timeZoneAjust(date){
    
    if(date === null || date === undefined){
        var dateNow = new Date();
    } else {
        var dateNow = new Date(date);
    }
    
    if(dateNow.getTimezoneOffset() === 0){
        dateNow.addHours(-3)
    }
    
    
    return dateNow
}

Date.prototype.addHours = function (value) {
    this.setHours(this.getHours() + value);
}

// Rota para processar o formulário
app.post('/download', async (req, res) => {
    console.log('Api chamada');
    
    const Afd = db.afds;
    let nsrBanco = await Nsr(Afd);
    let nsr = nsrBanco.nsr;

    let trabalhadores = req.body.content.split('\n');
    let numTrab = trabalhadores.length;

    const tipoDeIdentificador = req.body.tipoDeIdentificador; // 1 CNPJ - 2 CPF
    const cnpjOuCpf = req.body.cnpjOuCpf;
    let reqRazaoSocial = req.body.razaoSocial;

    try {
        var razaosocial = formatarRazaoSocial(reqRazaoSocial);
    } catch (error) {
        console.error(error.message);
    }

    let entrada1 = req.body.entrada1;
    let saida1 = req.body.saida1;
    let entrada2 = req.body.entrada2;
    let saida2 = req.body.saida2;
    let recieveEvent = req.body.event;
    const event = timeZoneAjust(recieveEvent);
    const finaleventCabecalho = req.body.finalevent;
    const recieveFinalEvent = new Date(req.body.finalevent)
    const finalevent = recieveFinalEvent.setDate(recieveFinalEvent.getDate() + 1);
    const yearSet = event.getFullYear();

    let horarios = [entrada1, saida1 ,entrada2, saida2];
    const hoje = timeZoneAjust().toISOString();

    const cabecalho = `0000000001${tipoDeIdentificador}${cnpjOuCpf}              ${razaosocial}99999999999999999${recieveEvent}${finaleventCabecalho}${hoje}003146100098000150                                  `;

    fs.writeFileSync('Afd-GeneretorAFD.txt', cabecalho);
    console.log('arquivo criado');
    

    for (const trab of trabalhadores){
        let countTrabs = 0;
        let cpf = trabalhadores[countTrabs];
    
        event.setDate(event.getDate() + 1);
        while(finalevent >= event) {
            

            if (event.getDay() === 0 || event.getDay() === 6 ) {
                event.setDate(event.getDate() + 1);
            } else {
                      
                let mesGet = event.getMonth();
                const nMes = fillMes(mesGet + 1); // mes do bilhete
                const nDia = fillDate(event.getDate()); // data do bilhete
                let contador = 0;
            
                for(const batidas of horarios){ 
            
                    const batida = horarios[contador];
                    const nNsr = fillNum(nsr); // NSR do bilhete
                    
                    // Portaria 373
                    // fs.appendFileSync('Afd-GeneretorAFD.txt', `\n${nNsr}${tipo}${nDia}${nMes}${yearSet}${batida}${pis}`);

                    // Poratira 671
                    let registro = `${nNsr}${tipo}${yearSet}-${nMes}-${nDia}T${batida}:00-0300${cpf}`;
                    let crcCalculado = calcularCRC16Modbus(registro);
                    fs.appendFileSync('Afd-GeneretorAFD.txt', `\n${registro}${crcCalculado}`);
                    
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
    
    
    // Enviar o arquivo recém-criado como resposta de download
    res.download('Afd-GeneretorAFD.txt', 'Afd-GeneretorAFD.txt', err => {
        if (err) {
        console.error(err);
        res.status(500).send('Erro ao enviar arquivo');
    }else{
        console.log("Arquivo enviado para o front")
    }
    });
});