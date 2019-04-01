const mongoose = require('mongoose')
let Schema = mongoose.Schema


const programaSchema = new Schema({

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    obras: {
        type: Array,
        required: [true, 'Las obras son obligatorias']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del programa es obligatorio']
    },
    duracion: {
        type: String,
        required: false
    },
    fechaCreacion: {
        type: Date,
        default: new Date()
    }

})


module.exports = mongoose.model('Programa', programaSchema)