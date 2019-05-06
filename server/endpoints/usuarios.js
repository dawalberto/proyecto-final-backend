const app = require('express')()
const bcrypt = require('bcrypt')
const qs = require('qs')
const Usuario = require('../models/usuario')
const Concierto = require('../models/concierto')
const Programa = require('../models/programa')
const { verificarToken, verificarUsuario } = require('../middlewares/autenticacion')


app.get('/usuarios', (req, res) => {

    Usuario.find({estado: true}, (err, usuariosDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        let recuento = usuariosDB.length

        res.json({
            ok: true,
            total: recuento,
            usuarios: usuariosDB
        })
    
    })

})

app.post('/usuarios', (req, res) => {

    let body = req.body
    let redes = undefined
    let fechaNac = undefined

    if (!body.password) {
        return res.status(400).json({
            ok: false,
            msg: 'La contraseña es obligatoria'
        })
    }

    let regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!regEx.test(body.password)) {
        return res.status(400).json({
            ok: false,
            msg: 'La contraseña debe tener como mínimo 8 caracteres, al menos una letra minúscula, una mayúscula, un número y un caracter especial(@ $ ! % * ? &)'
        })
    }

    if (body.redes) {

        try {
            redes = JSON.parse(body.redes)
        } catch {
            return res.status(400).json({
                ok: false,
                msg: 'El formato de las redes no es correcto'
            })
        }

    }

    if (body.fechaNac) {

        try {

            fechaNac = new Date(body.fechaNac)
    
            if (fechaNac == 'Invalid Date') {
                return res.status(400).json({
                    ok: false,
                    msg: 'El formato de la fecha de nacimiento no es correcto'
                })
            }
    
        } catch {
            return res.status(400).json({
                ok: false,
                msg: 'El formato de la fecha de nacimiento no es correcto'
            })
        }

    }

    let usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        sexo: body.sexo,
        nacionalidad: body.nacionalidad,
        biografia: body.biografia,
        fechaNac,
        guitarra: body.guitarra,
        nomUsuario: body.nomUsuario,
        img: body.img,
        webpage: body.webpage,
        redes
    })

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            msg: 'Usuario creado correctamente',
            usuario: usuarioDB
        })

    })

})

app.get('/usuarios/:id', (req, res) => {

    let id = req.params.id

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Usuario no encontrado',
                err
            })
        }

        if (!usuarioDB.estado) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado'
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

})

app.put('/usuarios/:id', [verificarToken, verificarUsuario], (req, res) => {

    let id = req.params.id
    let reqBody = req.body
    let body = {}


    if (reqBody.redes) {

        try {
            body.redes = JSON.parse(reqBody.redes)
        } catch {
            return res.status(400).json({
                ok: false,
                msg: 'El formato de las redes no es correcto'
            })
        }

    }

    if (reqBody.fechaNac) {

        try {

            body.fechaNac = new Date(reqBody.fechaNac)
    
            if (body.fechaNac == 'Invalid Date') {
                return res.status(400).json({
                    ok: false,
                    msg: 'El formato de la fecha de nacimiento no es correcto'
                })
            }
    
        } catch {
            return res.status(400).json({
                ok: false,
                msg: 'El formato de la fecha de nacimiento no es correcto'
            })
        }

    }

    reqBody.nombre ? body.nombre = reqBody.nombre : ''
    reqBody.apellidos ? body.apellidos = reqBody.apellidos : ''
    reqBody.img ? body.img = reqBody.img : ''
    reqBody.webpage ? body.webpage = reqBody.webpage : ''
    reqBody.nacionalidad ? body.nacionalidad = reqBody.nacionalidad : ''
    reqBody.biografia ? body.biografia = reqBody.biografia : ''
    reqBody.guitarra ? body.guitarra = reqBody.guitarra : ''
    reqBody.sexo ? body.sexo = reqBody.sexo : ''



    Usuario.updateOne({_id: id, estado: true}, body, (err, updated) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (updated.nModified === 0) {
            return res.json({
                ok: true,
                msg: 'Nada para actualizar'
            })
        }

        res.json({
            ok: true,
            msg: 'Actualizado correctamente',
            update: updated
        })

    })

})

app.delete('/usuarios/:id', [verificarToken, verificarUsuario], (req, res) => {

    let id = req.params.id
    let supposedPassword = req.body.supposedPassword

    if (supposedPassword === null || supposedPassword === undefined || supposedPassword === '') {
        return res.status(400).json({
            ok: false,
            msg: 'Contraseña obligatoria'
        })
    }

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado',
                err
            })
        }

        if (!usuarioDB || !usuarioDB.estado) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado'
            })
        }

        if ( !bcrypt.compareSync(supposedPassword, usuarioDB.password) ) {
            return res.status(401).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        Usuario.updateOne({_id: id}, {estado: false}, (err, deleted) => {
    
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if (deleted.nModified === 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuario no encontrado'
                })
            }
    
            res.json({
                ok: true,
                msg: 'Eliminado correctamente',
                delete: deleted
            })
    
            Programa.deleteMany({usuario: {_id: id}}, (err, conciertoDeleted) => {
    
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
    
                Concierto.deleteMany({usuario: {_id: id}}, (err, programaDeleted) => {
        
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }
        
                })

            })
    
        })

    })


})

app.get('/usuarios/buscar/:nombre', (req, res) => {

    let nombreCompletoArray = req.params.nombre.split(" ")
    let nombre = nombreCompletoArray[0]
    nombreCompletoArray.splice(0, 1)
    let apellidos = null
    if (nombreCompletoArray.length !== 0) {
        apellidos = nombreCompletoArray.toString()
        apellidos = apellidos.replace(/(,)/g, ' ')
    }

    let regexNom = new RegExp(nombre, 'i')
    let regexApellidos = new RegExp(apellidos, 'i')

    if (apellidos !== null) {
        Usuario.find({ $and: [ {nombre: regexNom}, {apellidos: regexApellidos} ] , estado: true }, (err, buesquedas) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            let recuento = buesquedas.length

            if (recuento === 0) {
                return res.status(400).json({
                    ok: false,
                    msg: `No se encontro ningún usuario con el nombre '${nombre}'`
                })
            }

            res.json({
                ok: true,
                total: recuento,
                usuarios: buesquedas
            })

        })
    } else {
        Usuario.find({ $or: [ {nombre: regexNom}, {apellidos: regexApellidos} ] , estado: true }, (err, buesquedas) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            let recuento = buesquedas.length

            if (recuento === 0) {
                return res.status(400).json({
                    ok: false,
                    msg: `No se encontro ningún usuario con el nombre '${nombre}'`
                })
            }

            res.json({
                ok: true,
                total: recuento,
                usuarios: buesquedas
            })

        })
    }

})

app.post('/usuarios/:id/change-password', [verificarToken, verificarUsuario], (req, res) => {

    let id = req.params.id
    let supposedPassword = req.body.supposedPassword
    let newPassword = req.body.newPassword

    if (supposedPassword === null || supposedPassword === undefined || supposedPassword === '') {
        return res.status(400).json({
            ok: false,
            msg: 'Contraseña obligatoria'
        })
    }

    if (newPassword === null || newPassword === undefined || newPassword === '') {
        return res.status(400).json({
            ok: false,
            msg: 'Contraseña obligatoria'
        })
    }

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado',
                err
            })
        }

        if (!usuarioDB || !usuarioDB.estado) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado'
            })
        }

        if ( !bcrypt.compareSync(supposedPassword, usuarioDB.password) ) {
            return res.status(401).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        newPassword = bcrypt.hashSync(newPassword, 10)

        Usuario.updateOne({_id: id, estado: true}, { password: newPassword }, (err, updated) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if (updated.nModified === 0) {
                return res.json({
                    ok: true,
                    msg: 'Nada para actualizar'
                })
            }
    
            res.json({
                ok: true,
                msg: 'Contraseña actualizada',
                update: updated
            })
    
        })

    })

})


module.exports = app