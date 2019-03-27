const app = require('express')()
const Usuario = require('../models/usuario')


app.get('/usuarios', (req, res) => {

    Usuario.find({}, (err, usuariosDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            request: 'GET /usuarios',
            usuarios: usuariosDB
        })
    
    })

})

app.post('/usuarios', (req, res) => {

    let nombre = req.body.nombre
    let apellidos = req.body.apellidos

    let usuario = new Usuario({
        nombre,
        apellidos
    })

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            request: 'POST /usuarios',
            usuario: usuarioDB
        })

    })

})

app.get('/usuarios/:id', (req, res) => {

    let id = req.params.id

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado',
                err
            })
        }

        res.json({
            ok: true,
            request: 'GET /usuarios/' + id,
            usuario: usuarioDB
        })

    })


})

app.put('/usuarios/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        request: 'PUT /usuarios/' + id
    })

})

app.delete('/usuarios/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        request: 'DELETE /usuarios/' + id
    })

})


module.exports = app