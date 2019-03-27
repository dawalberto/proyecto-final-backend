const app = require('express')()
const bodyParser = require('body-parser')
require('./config/config')


app.use( bodyParser.urlencoded({extended: false}) )
app.use( require('./endpoints/endpoints') )


app.listen(process.env.PORT, () => {
    console.log('Escuchando por el puerto:', process.env.PORT)
})