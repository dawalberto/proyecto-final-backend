const mongoose = require('mongoose')
let Schema = mongoose.Schema


let conciertoSchema = new Schema({

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    programa: {
        type: Schema.Types.ObjectId,
        ref: 'Programa',
        required: false
    },
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio']
    },
    img: {
        type: String,
        required: false
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
        type: Date,
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
    },
    fechaCreacion: {
        type: Date,
        default: new Date()
    }

})


module.exports = mongoose.model('Concierto', conciertoSchema)