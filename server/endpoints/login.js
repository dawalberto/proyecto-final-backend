const app = require('express')()


app.post('/login', (req, res) => {

    res.json({
        ok: true,
        msg: 'POST /login'
    })

})

app.post('/google', (req, res) => {

    res.json({
        ok: true,
        msg: 'POST /google'
    })

})


module.exports = app