const app = require('express')()
const Suscriptor = require('../models/suscriptor')


app.get('/suscriptores', (req, res) => {

    Suscriptor.find({}, (err, suscriptoresDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        let recuento = suscriptoresDB.length

        res.json({
            ok: true,
            total: recuento,
            suscriptores: suscriptoresDB
        })

    })

})

app.post('/suscriptores', (req, res) => {

    let suscriptor = req.body.suscriptor

    let newSuscriptor = new Suscriptor({
        email: suscriptor
    })

    newSuscriptor.save((err, suscriptorDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            msg: 'Suscriptor agregado correctamente',
            suscriptor: suscriptorDB
        })

    })

})


app.delete('/suscriptores/:email', (req, res) => {

    let email = req.params.email

    Suscriptor.deleteOne({ email }, (err, deleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (deleted.deletedCount === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'Suscriptor no encontrado o no eliminado'
            })
        }

        res.json({
            ok: true,
            msg: 'Suscriptor eliminado correctamente'
        })

    })

})


module.exports = app