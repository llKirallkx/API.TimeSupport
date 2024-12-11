const afdCheckService = require("../../services/afdCheck.service/afdCheck.service")

const afdCheck = async (req, res) => {
    console.log("API Chamada")

    try {
        if (!req.file) {
            return res.status(400).send('Nenhum arquivo enviado.');
        }

        // service principal que irá receber o arquivo
        const verificated = await afdCheckService.processFile(req.file.buffer);
        
        // ajustar o retorno para ser o objeto resumo retorno do verificated
        res.json(verificated);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao processar o arquivo.');
    }

}

module.exports = { afdCheck }
