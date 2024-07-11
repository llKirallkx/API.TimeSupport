async function Nsr(Afd){
    let nsr = await Afd.findOne({});
    return nsr
}

module.exports = Nsr;