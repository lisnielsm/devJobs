const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: 'El email es obligatorio'
    },
    nombre: {
        type: String,
        required: 'El nombre es obligatorio',
        trim: true
    },
    password: {
        type: String,
        required: 'El password es obligatorio',
        trim: true
    },
    token: String,
    expira: Date,
    imagen: String
})

// Método para hashear los passwords
usuariosSchema.pre('save', function(next) {
    // Si el password ya está hasheado
    if(!this.isModified('password')) {
        return next(); // Detener la ejecución
    }

    // Hashear el password
    const hash = bcrypt.hashSync(this.password, 12);
    this.password = hash;

    next();
})

// Envia Alerta cuando un correo esta en uso
// usuariosSchema.post('save', function(error, doc, next) {
//     if(error.name === 'MongoError' && error.code === 11000) {
//         next('Ese correo ya está registrado');
//     } else {
//         next(error);
//     }
// })

// Autenticar Usuarios
usuariosSchema.methods = {
    compararPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = mongoose.model('Usuarios', usuariosSchema);