const app = require('express')()


app.use( require('./usuarios') )
app.use( require('./conciertos') )
app.use( require('./programas') )
app.use( require('./login') )


module.exports = app