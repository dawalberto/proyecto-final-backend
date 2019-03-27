const mongoose = require('mongoose')
let Schema = mongoose.Schema


let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellidos: {
        type: String,
        required: false
    },

})


module.exports = mongoose.model('Usuario', usuarioSchema)