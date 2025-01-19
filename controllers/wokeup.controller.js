const wokeup = (req, res) => {
    res.status(200).send({ "status": true })
}

module.exports = { wokeup }