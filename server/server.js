const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./config/config')


app.use( bodyParser.urlencoded({extended: false}) )
app.use( require('./endpoints/endpoints') )


mongoose.connect(process.env.URLDB,{ useCreateIndex: true, useNewUrlParser: true }, (err, res) => {
    if (err) throw err

    console.log('Base de datos ONLINE')
})


app.listen(process.env.PORT, () => {
    console.log('Escuchando por el puerto:', process.env.PORT)
})