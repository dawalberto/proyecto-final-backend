const app = require('express')()
const _ = require('underscore')
const Concierto = require('../models/concierto')
const { verificarToken } = require('../middlewares/autenticacion')


app.get('/conciertos', (req, res) => {

    Concierto.find({})
        .populate('usuario', 'nombre apellidos guitarra')
        .exec((err, conciertosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            let recuento = conciertosDB.length

            res.json({
                ok: true,
                total: recuento,
                conciertos: conciertosDB
            })

        })


})

app.post('/conciertos', verificarToken, (req, res) => {

    let body = req.body

    let concierto = new Concierto({
        titulo: body.titulo,
        descripcion: body.descripcion,
        precio: body.precio,
        usuario: body.usuario,
        fecha: body.fecha,
        ubicacion: body.ubicacion,
        hora: body.hora
    })

    concierto.save((err, conciertoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        
        res.json({
            ok: true,
            msg: 'Concierto creado correctamente',
            concierto: conciertoDB
        })

    })

})

app.get('/conciertos/:id', (req, res) => {

    let id = req.params.id

    Concierto.findOne({ _id: id })
        .populate('usuario', 'nombre apellidos guitarra')
        .exec((err, conciertoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!conciertoDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Concierto no encontrado'
                })
            }

            res.json({
                ok: true,
                concierto: conciertoDB
            })

        })

})

app.put('/conciertos/:id', verificarToken, (req, res) => {

    let id = req.params.id
    let body = _.pick(req.body, ['titulo', 'descripcion', 'fecha', 'precio', 'ubicacion', 'hora', 'terminado'])

    Concierto.findOne({ _id: id }, (err, conciertoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!conciertoDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Concierto no encontrado'
            })
        }

        let idUsuarioConcierto = String(conciertoDB.usuario._id)
        let idUsuarioLoged = req.usuario._id

        if (idUsuarioConcierto !== idUsuarioLoged) {
            return res.status(401).json({
                ok: false,
                msg: 'Permiso denegado'
            })
        }

        Concierto.updateOne({_id: id}, body, (err, updated) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if (updated.nModified === 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Concierto no encontrado o no actualizado'
                })
            }
    
            res.json({
                ok: true,
                msg: 'Concierto actualizado correctamente',
                update: updated
            })
    
        })

    })

})

app.delete('/conciertos/:id', verificarToken, (req, res) => {

    let id = req.params.id

    Concierto.findOne({ _id: id }, (err, conciertoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!conciertoDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Concierto no encontrado'
            })
        }

        let idUsuarioConcierto = String(conciertoDB.usuario._id)
        let idUsuarioLoged = req.usuario._id

        if (idUsuarioConcierto !== idUsuarioLoged) {
            return res.status(401).json({
                ok: false,
                msg: 'Permiso denegado'
            })
        }

        Concierto.deleteOne({_id: id}, (err, conciertoDeleted) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if (conciertoDeleted.deletedCount === 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Concierto no encontrado o no eliminado'
                })
            }
    
            res.json({
                ok: true,
                msg: 'Concierto eliminado correctamente',
                conciertoDeleted
            })
    
        })

    })

})

app.get('/conciertos/usuarios/:id', (req, res) => {

    let id = req.params.id

    Concierto.find({usuario: {_id: id}})
        .populate('usuario', 'nombre apellidos guitarra')
        .exec((err, conciertosDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (conciertosDB.length === 0) {
            return res.status(500).json({
                ok: false,
                msg: 'No se encontraron conciertos para este usuario o no existe el usuario'
            })
        }

        res.json({
            ok: true,
            conciertos: conciertosDB
        })

    })

})


module.exports = app