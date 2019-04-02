const app = require('express')()
const _ = require('underscore')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
const Concierto = require('../models/concierto')
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
    let redes = null
    let fechaNac = null

    if (!body.password) {
        return res.status(400).json({
            ok: false,
            msg: 'La contraseña es obligatoria'
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

    let body = _.pick( req.body, ['nombre', 'apellidos', 'img', 'webpage', 'nacionalidad', 'biografia', 'guitarra', 'sexo'])

    if (req.body.redes) {

        try {
            body.redes = JSON.parse(req.body.redes)
        } catch {
            return res.status(400).json({
                ok: false,
                msg: 'El formato de las redes no es correcto'
            })
        }

    }

    if (req.body.fechaNac) {

        try {

            body.fechaNac = new Date(req.body.fechaNac)
    
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

    if (req.body.email) {
        body.email = req.body.email
    }

    if (req.body.nomUsuario) {
        body.nomUsuario = req.body.nomUsuario
    }

    if (req.body.password) {
        body.password = bcrypt.hashSync(req.body.password, 10)
    }


    Usuario.updateOne({_id: id, estado: true}, body, (err, updated) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (updated.nModified === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no actualizado o no encontrado'
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


        Concierto.remove({usuario: {_id: id}}, (err, conciertosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (conciertosDB.length === 0) {
                return res.status(500).json({
                    ok: false,
                    msg: 'No se encontraron conciertos para este usuario'
                })
            }

        })

    })

})

app.get('/usuarios/buscar/:nombre', (req, res) => {

    let nombre = req.params.nombre

    let regex = new RegExp(nombre, 'i')

    Usuario.find({ $or: [ {nombre: regex}, {apellidos: regex} ] , estado: true }, (err, buesquedas) => {

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

})


module.exports = app