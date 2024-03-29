const app = require('express')()
const fileUpload = require('express-fileupload')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')
const path = require('path')
const Usuario = require('../models/usuario')
const Concierto = require('../models/concierto')
const { verificarToken, verificarUsuario } = require('../middlewares/autenticacion')

app.use( fileUpload({ useTempFiles: true }) )


app.put('/uploads/imgusuarios/:id', [verificarToken, verificarUsuario], (req, res) => {

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    let tipo = 'imgusuarios'
    let id = req.params.id


    let archivo = req.files.archivo
    let nombreDividido = archivo.name.split('.')
    let extension = nombreDividido[nombreDividido.length - 1]

    // Extensiones permitidas
    // let extensionesValidas = ['png', 'jpg', 'jpeg']

    // Ahora me pueden colar cualquier extension
    // if (extensionesValidas.indexOf(extension) < 0) {
    //     return res.status(403).json({
    //         ok: false,
    //         err: {
    //             extension,
    //             message: 'Las extensiones permitidas son ' + extensionesValidas.toString(),
    //         }
    //     })
    // }

    // Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }${ new Date().getDate() }.png`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
    
        // Aqui, imagen cargada
        if (tipo === 'imgusuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } 

      })

})

app.put('/uploads/imgconciertos/:id', verificarToken, (req, res) => {

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    let tipo = 'imgconciertos'
    let id = req.params.id


    let archivo = req.files.archivo
    let nombreDividido = archivo.name.split('.')
    let extension = nombreDividido[nombreDividido.length - 1]


    // Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }${ new Date().getDate() }.png`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
    
        // Aqui, imagen cargada
        if (tipo === 'imgconciertos') {
            imagenConcierto(id, res, nombreArchivo);
        } 

      })

})

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'imgusuarios')

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !usuarioDB ) {
            borraArchivo(nombreArchivo, 'imgusuarios')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'imgusuarios')

        // Aquí va lo de cloudinary
        cloudinary.uploader.upload(`uploads/imgusuarios/${ nombreArchivo }`, { public_id: `imgusuarios/${ nombreArchivo }` }, (err, imageUpload) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Usuario.updateOne({ _id: id }, { img: imageUpload.secure_url }, (err, updated) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                if (updated.nModified === 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Usuario no encontrado o no actualizado'
                    })
                }

                res.json({
                    ok: true,
                    img: imageUpload.secure_url,
                    msg: 'Imagen subida correctamente',
                    updated
                })

            })
        })


    })
    
}

function imagenConcierto(id, res, nombreArchivo) {
    Concierto.findById(id, (err, conciertoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'imgconciertos')

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !conciertoDB ) {
            borraArchivo(nombreArchivo, 'imgconciertos')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El concierto no existe'
                }
            })
        }

        borraArchivo(conciertoDB.img, 'imgconciertos')

        // Aquí va lo de cloudinary
        cloudinary.uploader.upload(`uploads/imgconciertos/${ nombreArchivo }`, { public_id: `imgconciertos/${ nombreArchivo }` }, (err, imageUpload) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Concierto.updateOne({ _id: id }, { img: imageUpload.secure_url }, (err, updated) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                if (updated.nModified === 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Concierto no encontrado o no actualizado'
                    })
                }

                res.json({
                    ok: true,
                    img: imageUpload.secure_url,
                    msg: 'Imagen subida correctamente',
                    updated
                })

            })
        })


    })
    
}
 
function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`)
    if ( fs.existsSync(pathImagen) ) {
        fs.unlinkSync(pathImagen)
    }

    if (nombreImagen !== undefined) {
        let image = nombreImagen.split('/')
        image = image[image.length - 1]
        image = image.split('.')
        image.splice(image.length - 1)
        image = image.join().replace(/(,)/g, '.')
    
        cloudinary.api.delete_resources(`${ tipo }/${ image }`, (err, res) => {
            if (err) {
                console.log('err', err)
            } else {
                console.log('res', res)
            }
        })
    }

}


module.exports = app