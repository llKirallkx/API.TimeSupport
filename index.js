const fs = require('fs');
const { throws, rejects } = require('assert');
const prompt = require('prompt-sync')({sigint: true});



// default

//Implementar banco de dados
let nsr = parseInt(fs.readFileSync('nsr.txt', {encoding:'utf-8'}));

const tipo = 3;

//Ajustar novo cabeçalho
const cabecalho = '0000000001191706623000130000000000000PONTOFOPAG EMPRESA DA IMPLANTAÇÃO EPAYS                                                                                                               000917066230001302001202317022023200220231844';



// Express server API

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware para analisar os dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(3000, () => {
    console.log('API Iniciada');
  });

// Rota para processar o formulário
app.post('/download', (req, res) => {
    console.log('Api chamada');
    

    let trabalhadores = req.body.content.split('\n');
    let numTrab = trabalhadores.length;

    let entrada1 = req.body.entrada1.replace(/:/g, '');
    let saida1 = req.body.saida1.replace(/:/g, '');
    let entrada2 = req.body.entrada2.replace(/:/g, '');
    let saida2 = req.body.saida2.replace(/:/g, '');
    let recieveEvent = req.body.event;
    const event = new Date(recieveEvent);
    const recieveFinalEvent = new Date(req.body.finalevent)
    const finalevent = recieveFinalEvent.setDate(recieveFinalEvent.getDate() + 1);
    const yearSet = event.getFullYear();

    let horarios = [entrada1, saida1 ,entrada2, saida2]



    // Gerador de AFD
    function fillMes(mes){
        return mes.toString().padStart(2, "0")
    }

    
    fs.writeFileSync('Afd-GeneretorAFD.txt', cabecalho);
    console.log('arquivo criado');
    

      for (const trab of trabalhadores){
        let countPIS = 0;
        let pis = trabalhadores[countPIS];
    
        event.setDate(event.getDate() + 1);
        while(finalevent >= event) {
            

            if (event.getDay() === 0 || event.getDay() === 6 ) {
                event.setDate(event.getDate() + 1);
            } else {
                function fillNum(nsrs){
                    return nsrs.toString().padStart(9, "0")
                } // ajusta o nsr com os 00 na frente
            
            
                function fillDate(dates){
                    return dates.toString().padStart(2, "0")
                }
    
                let mesGet = event.getMonth();
                const nMes = fillMes(mesGet + 1); // mes do bilhete
                const nDia = fillDate(event.getDate()); // data do bilhete
                let contador = 0;
            
                for(const batidas of horarios){ 
            
                    const batida = horarios[contador];
            
                    
                    const nNsr = fillNum(nsr); // NSR do bilhete
            
                    fs.appendFileSync('Afd-GeneretorAFD.txt', `\n${nNsr}${tipo}${nDia}${nMes}${yearSet}${batida}${pis}`);
                    
                    nsr++;
                    contador++;
                }
            
                
                event.setDate(event.getDate() + 1);

            }

            
        }
    
    
        let initDate = event.setDate(recieveEvent);
    }
    
    fs.writeFileSync('nsr.txt', `${nsr}`, (err) => {
        if (err){
            throw err;
        }
    });


        // Enviar o arquivo recém-criado como resposta de download
        res.download('Afd-GeneretorAFD.txt', 'Afd-GeneretorAFD.txt', err => {
          if (err) {
            console.error(err);
            res.status(500).send('Erro ao enviar arquivo');
          }});
});