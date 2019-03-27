const mongoose = require('mongoose')
let Schema = mongoose.Schema


let conciertoSchema = new Schema({

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    fecha: {
        type: String,
        required: [true, 'La fecha es obligatoria']
    },
    ubicacion: {
        type: String,
        required: [true, 'La ubicación es obligatoria']
    },
    hora: {
        type: String,
        required: [true, 'La hora es obligatoria']
    },
    terminado: {
        type: Boolean,
        default: false
    }

})


module.exports = mongoose.model('Concierto', conciertoSchema)