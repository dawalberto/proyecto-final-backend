const app = require('express')()
const fileUpload = require('express-fileupload')
const fs = require('fs')
const path = require('path')
const Usuario = require('../models/usuario')
const { verificarToken, verificarUsuario } = require('../middlewares/autenticacion')


app.use(fileUpload())


app.put('/uploads/:tipo/:id', [verificarToken, verificarUsuario], (req, res) => {

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    let tipo = req.params.tipo
    let id = req.params.id

    // Tipos validos
    let tiposValidos = ['imgusuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                tipo,
                message: 'Los tipos permitidos son ' + tiposValidos.toString(),
            }
        })
    }

    let archivo = req.files.archivo
    let nombreDividido = archivo.name.split('.')
    let extension = nombreDividido[nombreDividido.length - 1]

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                extension,
                message: 'Las extensiones permitidas son ' + extensionesValidas.toString(),
            }
        })
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }${ new Date().getDate() }.${ extension }`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err)
          return res.status(500).json({
              ok: false,
              err
          });
    
        // Aqui, imagen cargada
        if (tipo === 'imgusuarios') {
            imagenUsuario(id, res, nombreArchivo);
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

        usuarioDB.img = nombreArchivo

        usuarioDB.save( (err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })

        })

    })
}
 
function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`)
    if ( fs.existsSync(pathImagen) ) {
        fs.unlinkSync(pathImagen)
    }

}


module.exports = app