const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
let Schema = mongoose.Schema


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}


let usuarioSchema = new Schema({

    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    nombre: {
        type: String,
        required: false
    },
    apellidos: {
        type: String,
        required: false
    },
    sexo: {
        type: Boolean,
        required: false
    },
    nacionalidad: {
        type: String,
        required: false
    },
    biografia: {
        type: String,
        required: false
    },
    fechaNac: {
        type: Date,
        required: false
    },
    guitarra: {
        type: String,
        required: false
    },
    nomUsuario: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true
    },
    img: {
        type: String,
        required: false
    },
    webpage: {
        type: String,
        required: false
    },
    redes: {
        type: Array,
        required: false
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    google: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true
    },
    seguidores: {
        type: Array,
        required: false
    },
    fechaRegistro: {
        type: Date,
        default: new Date()
    }

})

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}


usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único' } )
module.exports = mongoose.model('Usuario', usuarioSchema)