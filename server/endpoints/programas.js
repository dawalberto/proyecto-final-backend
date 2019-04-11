const app = require('express')()
const qs = require('qs')
const Programa = require('../models/programa')
const { verificarToken } = require('../middlewares/autenticacion')


app.get('/programas', (req, res) => {

    Programa.find({})
        .populate('usuario', 'nombre apellidos guitarra')
        .exec((err, programasDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            let recuento = programasDB.length

            res.json({
                ok: true,
                total: recuento,
                programas: programasDB
            })

        })

})

app.post('/programas', verificarToken, (req, res) => {

    let body = req.body
    let obras = body.obras

    console.log('body', body)

    try {
        let bodyParsed = qs.parse(body)
        obras = qs.parse(bodyParsed)
        obras = obras.obras
    }
    catch {
        return res.status(500).json({
            ok: false,
            msg: 'El formato de obras no es válido'
        })
    }

    let programa = new Programa({
        usuario: body.usuario,
        obras,
        nombre: body.nombre,
        duracion: body.duracion
    })

    programa.save((err, programaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            msg: 'Programa creado correctamente',
            programa: programaDB
        })

    })

})

app.get('/programas/:id', (req, res) => {

    let id = req.params.id

    Programa.findOne({ _id: id }, (err, programaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!programaDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró ningún programa'
            })
        }

        res.json({
            ok: true,
            programa: programaDB
        })

    })

})

app.put('/programas/:id', verificarToken, (req, res) => {

    let id = req.params.id
    let body = req.body
    let obras = body.obras

    try {
        obras = JSON.parse(obras)
    }
    catch {
        return res.status(500).json({
            ok: false,
            msg: 'El formato de obras no es válido'
        })
    }

    let updatedPrograma = {
        obras,
        nombre: body.nombre,
        duracion: body.duracion
    }

    Programa.findOne({ _id: id }, (err, programaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!programaDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Programa no encontrado'
            })
        }

        let idUsuarioprograma = String(programaDB.usuario._id)
        let idUsuarioLoged = req.usuario._id

        if (idUsuarioprograma !== idUsuarioLoged) {
            return res.status(401).json({
                ok: false,
                msg: 'Permiso denegado'
            })
        }

        Programa.updateOne({ _id: id }, updatedPrograma, (err, updated) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if (updated.nModified === 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Programa no encontrado o no actualizado'
                })
            }
    
            res.json({
                ok: true,
                msg: 'Programa actualizado correctamente',
                programa: updated
            })
    
        })

    })

})

app.delete('/programas/:id', verificarToken, (req, res) => {

    let id = req.params.id

    Programa.findOne({ _id: id }, (err, programaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!programaDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Programa no encontrado'
            })
        }

        let idUsuarioprograma = String(programaDB.usuario._id)
        let idUsuarioLoged = req.usuario._id

        if (idUsuarioprograma !== idUsuarioLoged) {
            return res.status(401).json({
                ok: false,
                msg: 'Permiso denegado'
            })
        }

        Programa.findOneAndDelete({ _id: id }, (err, programaDeleted) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if (!programaDeleted) {
                return res.status(500).json({
                    ok: false,
                    msg: 'No se encontró el programa'
                })
            }
    
            res.json({
                ok: true,
                msg: 'Programa eliminado correctamente',
                programa: programaDeleted
    
            })
    
        })

    })

})

app.get('/programas/usuarios/:id', (req, res) => {

    let id = req.params.id

    Programa.find({usuario: { _id: id }})
        .populate('usuario', 'nombre apellidos guitarra')
        .exec((err, programasDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        let recuento = programasDB.length

        if (recuento === 0) {
            return res.status(500).json({
                ok: false,
                msg: 'No se encontraron programas para este usuario o no existe el usuario'
            })
        }

        res.json({
            ok: true,
            total: recuento,
            programas: programasDB
        })

    })

})


module.exports = app