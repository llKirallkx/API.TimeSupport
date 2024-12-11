//#region imports
const fs = require('fs');
require("dotenv").config()
const { MongoMissingCredentialsError } = require("mongodb");
const ObjectId = require('mongoose').Types.ObjectId;
const cors = require('cors');
const afdRoutes = require('./routes/afdRoutes')
const crc16Route = require("./routes/crc16Route")
const wokeupRoute = require("./routes/wokeupRoute")
const afdCheckRoute = require("./routes/afdCheckRoute")

//#endregion

//#region Express server API

const express = require('express');
const app = express();
app.use(cors());
const bodyParser = require('body-parser');

// Middleware para analisar os dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(10000, () => {
    console.log('API Iniciada');
  });

require("./database/connection");

//#endregion

//#region Routes call

app.use(afdRoutes);
app.use(crc16Route);
app.use(wokeupRoute);
app.use(afdCheckRoute);

//#endregion