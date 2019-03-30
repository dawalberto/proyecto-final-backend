const jwt = require('jsonwebtoken')


// =======================
//  Verificar Token
// =======================
let verificarToken = ( req, res, next ) => {

    let token = req.get('token')

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario

        next()

    })

}

// =======================
//  Verificar Usuario
// =======================
let verificarUsuario = (req, res, next) => {

    let currentId = req.params.id
    let logedId = req.usuario._id

    if (currentId !== logedId) {
        return res.status(401).json({
            ok: false,
            msg: 'Permiso denegado'
        })
    }

    next()

}

module.exports = { verificarToken, verificarUsuario }