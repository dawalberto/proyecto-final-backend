const app = require('express')()


app.get('/usuarios', (req, res) => {

    res.json({
        ok: true,
        msg: 'GET /usuarios'
    })

})

app.post('/usuarios', (req, res) => {

    let nombre = req.body.nombre

    res.json({
        ok: true,
        msg: 'POST /usuarios',
        nom: nombre
    })

})

app.get('/usuarios/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        msg: 'GET /usuarios/' + id
    })

})

app.put('/usuarios/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        msg: 'PUT /usuarios/' + id
    })

})

app.delete('/usuarios/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        msg: 'DELETE /usuarios/' + id
    })

})


module.exports = app