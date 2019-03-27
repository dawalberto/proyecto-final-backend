const app = require('express')()
const Usuario = require('../models/usuario')


app.get('/usuarios', (req, res) => {

    Usuario.find({estado: true}, (err, usuariosDB) => {

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

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: body.password,
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