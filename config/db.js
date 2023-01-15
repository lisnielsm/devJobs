const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE);
// mongoose.set('strictQuery', true);

mongoose.connection.on("error", error => console.log(error));

mongoose.connection.on("open", () => console.log("Conectado a la base de datos"));

// importar los modelos
require('../models/Usuarios');
require('../models/Vacantes');