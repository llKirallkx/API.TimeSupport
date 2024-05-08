const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.afds = require("./afd.model.js")(mongoose);

module.exports = db;
