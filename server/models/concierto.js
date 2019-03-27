const mongoose = require('mongoose')
let Schema = mongoose.Schema


let conciertoSchema = new Schema({

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
    }

})


module.exports = mongoose.model('Concierto', conciertoSchema)