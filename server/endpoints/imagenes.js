const app = require('express')()
const fs = require('fs')
const path = require('path')


app.get('/imagenes/:tipo/:img', (req, res) => {

    let tipo = req.params.tipo
    let img = req.params.img

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`)
    let noImagePath = path.resolve(__dirname, '../assets/no-image.png')

    if (fs.existsSync( pathImagen )) {
        res.sendFile(pathImagen)
    } else {
        res.sendFile(noImagePath)
    }

})


module.exports = app;