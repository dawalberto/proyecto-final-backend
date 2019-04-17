const app = require('express')()
const Concierto = require('../models/concierto')
const { verificarToken } = require('../middlewares/autenticacion')


app.get('/conciertos', (req, res) => {

    Concierto.find({})
        .sort({ fecha: 1 })
        .populate('usuario', 'nombre apellidos img')
        .populate('programa', 'nombre obras')
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

    let fecha = new Date(body.fecha)

    let concierto = new Concierto({
        titulo: body.titulo,
        programa: body.programa,
        descripcion: body.descripcion,
        precio: body.precio,
        usuario: body.usuario,
        fecha,
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
        .sort({ fecha: 1 })
        .populate('usuario', 'nombre apellidos img')
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
    let reqBody = req.body
    let body = {}

    if (reqBody.fecha) {

        try {

            body.fecha = new Date(reqBody.fecha)
    
            if (body.fecha == 'Invalid Date') {
                return res.status(400).json({
                    ok: false,
                    msg: 'El formato de la fecha no es correcto'
                })
            }
    
        } catch {
            return res.status(400).json({
                ok: false,
                msg: 'El formato de la fecha no es correcto'
            })
        }

    }

    reqBody.titulo ? body.titulo = reqBody.titulo : ''
    reqBody.programa ? body.programa = reqBody.programa : ''
    reqBody.descripcion ? body.descripcion = reqBody.descripcion : ''
    reqBody.precio ? body.precio = reqBody.precio : ''
    reqBody.ubicacion ? body.ubicacion = reqBody.ubicacion : ''
    reqBody.hora ? body.hora = reqBody.hora : ''
    reqBody.terminado ? body.terminado = reqBody.terminado : ''


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
        .sort({ fecha: 1 })
        .populate('usuario', 'nombre apellidos img')
        .populate('programa', 'nombre obras')        
        .exec((err, conciertosDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        let recuento = conciertosDB.length

        if (recuento === 0) {
            return res.json({
                ok: false,
                msg: 'No se encontraron conciertos para este usuario o no existe el usuario'
            })
        }

        res.json({
            ok: true,
            total: recuento,
            conciertos: conciertosDB
        })

    })

})

app.get('/conciertos/this/week', (req, res) => {

    let today = new Date()
    let firstDayWeek = new Date()
    let lastDayWeek = new Date()

    switch (today.getDay()) {
        case 1:
            lastDayWeek.setDate(lastDayWeek.getDate() + 6)
        break;
        case 2:
            firstDayWeek.setDate(firstDayWeek.getDate() - 2)
            lastDayWeek.setDate(lastDayWeek.getDate() + 5)
        break;
        case 3:
            firstDayWeek.setDate(firstDayWeek.getDate() - 3)
            lastDayWeek.setDate(lastDayWeek.getDate() + 4)
        break;
        case 4:
            firstDayWeek.setDate(firstDayWeek.getDate() - 4)
            lastDayWeek.setDate(lastDayWeek.getDate() + 3)
        break;
        case 5:
            firstDayWeek.setDate(firstDayWeek.getDate() - 5)
            lastDayWeek.setDate(lastDayWeek.getDate() + 2)
        break;
        case 6:
            firstDayWeek.setDate(firstDayWeek.getDate() - 6)
            lastDayWeek.setDate(lastDayWeek.getDate() + 1)
        break;
        case 0:
            firstDayWeek.setDate(firstDayWeek.getDate() - 7)
        break;
    }
    

    Concierto.find({ fecha: { $gte:firstDayWeek, $lt: lastDayWeek } })
        .sort({ fecha: 1 })
        .populate('usuario', 'nombre apellidos img')
        .populate('programa', 'nombre obras')
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

module.exports = app