const app = require('express')()
const Concierto = require('../models/concierto')


app.get('/conciertos', (req, res) => {

    Concierto.find({})
        .populate('usuario', 'nombre guitarra')
        .exec((err, conciertosDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                request: 'GET /conciertos',
                conciertos: conciertosDB
            })

        })


})

app.post('/conciertos', (req, res) => {

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
            return res.status(400).json({
                ok: false,
                err
            })
        }
        
        res.json({
            ok: true,
            request: 'POST /conciertos',
            concierto: conciertoDB
        })

    })

})

app.get('/conciertos/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        request: 'GET /conciertos/' + id
    })

})

app.put('/conciertos/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        request: 'PUT /conciertos/' + id
    })

})

app.delete('/conciertos/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        request: 'DELETE /conciertos/' + id
    })

})

app.get('/conciertos/usuarios/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        request: 'GET /conciertos/usuarios/' + id
    })

})


module.exports = app