const app = require('express')()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')


app.post('/login', (req, res) => {

    let body = req.body

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos'
            })
        }

        if ( !bcrypt.compareSync(body.password, usuarioDB.password) ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos'
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.EXPIRACION_TOKEN })

        res.json({
            ok: true,
            msg: 'Usuario logeado correctamente',
            usuario: usuarioDB,
            token
        })

    })

})

app.post('/google', (req, res) => {

    res.json({
        ok: true,
        msg: 'POST /google'
    })

})


module.exports = app