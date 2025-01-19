const generatorService = require("../../services/afd.service/generator.service");

const download671 = async (req, res) => {
    console.log('Api chamada');
    
    try {
        const filePath = await generatorService.generator671(req.body)
        // Enviar o arquivo recém-criado como resposta de download
        res.download(filePath, 'Afd-GeneretorAFD.txt', err => {
            if (err) {
                console.error(err);
                res.status(500).send('Erro ao enviar arquivo');
            } else {
                console.log("Arquivo enviado para o front")
            }
        });

    } catch (error) {
        console.error('afdController: Internal error ', error);
        res.status(500).send(`afdController: Internal error: ${error.message}`)
    }


};

const download1510 = async (req, res) => {
    console.log('Api chamada');
    
    try {
        const filePath = await generatorService.generator1510(req.body);
        
        res.download(filePath, 'Afd-GeneretorAFD.txt', err => {
            if (err) {
            console.error(err);
            res.status(500).send('Erro ao enviar arquivo');
        }else{
            console.log("Arquivo enviado para o front")
        }
        });

    } catch (error) {
        console.error('afdController: Internal error ', error);
        res.status(500).send(`afdController: Internal error: ${error.message}`)
    }

}


module.exports = { download671, download1510 };