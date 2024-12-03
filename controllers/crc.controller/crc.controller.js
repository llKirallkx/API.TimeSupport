const crcService = require("../../services/crc.service/crc.service")

const generateCrc = async (req, res) => {
    console.log("API Chamada")
    try {
        if (!req.file) {
            return res.status(400).send('Nenhum arquivo enviado.');
        }

        const adjustedLines = await crcService.processFile(
            req.file.buffer, // O conteúdo do arquivo recebido
            crcService.defaultLineHandler,
            crcService.handleSpecificLine
        );

        const adjustedFileBuffer = Buffer.from(adjustedLines.join('\n'));
        res.setHeader('Content-Disposition', 'attachment; filename=adjusted-file.txt');
        res.setHeader('Content-Type', 'text/plain');
        res.send(adjustedFileBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao processar o arquivo.');
    }
}

module.exports = { generateCrc };