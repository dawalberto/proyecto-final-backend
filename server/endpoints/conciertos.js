const app = require('express')()


app.get('/conciertos', (req, res) => {

    res.json({
        ok: true,
        msg: 'GET /conciertos'
    })

})

app.post('/conciertos', (req, res) => {

    res.json({
        ok: true,
        msg: 'POST /conciertos'
    })

})

app.get('/conciertos/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        msg: 'GET /conciertos/' + id
    })

})

app.put('/conciertos/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        msg: 'PUT /conciertos/' + id
    })

})

app.delete('/conciertos/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        msg: 'DELETE /conciertos/' + id
    })

})

app.get('/conciertos/usuarios/:id', (req, res) => {

    let id = req.params.id

    res.json({
        ok: true,
        msg: 'GET /conciertos/usuarios/' + id
    })

})


module.exports = app