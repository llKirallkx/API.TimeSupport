const mongoose = require("mongoose")

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const connect = () => {
    mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.hos1qwb.mongodb.net/AFD-Generate`)

    const connection = mongoose.connection;

    connection.on("error", () => {
        console.log("Erro ao conectar com o mongoDB")
    })

    connection.on("open", () => {
        console.log("Conectado ao MongoDB com sucesso")
    })
}

connect();

module.exports = mongoose;