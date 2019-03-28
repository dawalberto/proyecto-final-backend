const app = require('express')()
const _ = require('underscore')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
const Concierto = require('../models/concierto')


app.get('/usuarios', (req, res) => {

    Usuario.find({estado: true}, (err, usuariosDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuarios: usuariosDB
        })
    
    })

})

app.post('/usuarios', (req, res) => {

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        sexo: body.sexo,
        nacionalidad: body.nacionalidad,
        biografia: body.biografia,
        fechaNac: body.fechaNac,
        guitarra: body.guitarra,
        nomUsuario: body.nomUsuario,
        img: body.img,
        webpage: body.webpage,
        redes: body.redes,
        conciertos: body.conciertos,
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

app.put('/usuarios/:id', (req, res) => {

    let id = req.params.id
    let body = _.pick( req.body, ['email', 'nomUsuario', 'rol', 'nombre', 'apellidos', 'img', 'webpage', 'nacionalidad', 'biografia', 'fechaNac', 'guitarra', 'redes', 'conciertos', 'sexo'])

    Usuario.updateOne({_id: id}, body, (err, updated) => {

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

app.delete('/usuarios/:id', (req, res) => {

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

            if (buesquedas.length === 0) {
                return res.status(400).json({
                    ok: false,
                    msg: `No se encontro ningún usuario con el nombre '${nombre}'`
                })
            }

            let recuento = buesquedas.length
            res.json({
                ok: true,
                total: recuento,
                usuarios: buesquedas
            })

        })

})


module.exports = app