const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema


let suscriptorSchema = new Schema({

    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    }

})


suscriptorSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único' } )
module.exports = mongoose.model('Suscriptores', suscriptorSchema)