const AfdService = require("../../services/afd.service/datas.service");
const Nsr = require("../../services/afd.service/generator.service");

async function collectNsr (db){
    const Afd = db.afds;
    let nsrBanco = await Nsr(Afd);
    

    console.log(nsrBanco.nsr);
    return nsrBanco
}


module.exports = collectNsr;