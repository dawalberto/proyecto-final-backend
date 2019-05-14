const app = require('express')()
const Suscriptor = require('../models/suscriptor')
const transporter = require('../config/email')
const moduleTemplateEmails = require('../templates/email')
const bodyEmailHtmlConfirmSuscribeNewsletter = moduleTemplateEmails.bodyEmailHtmlConfirmSuscribeNewsletter


function sendEmail(to) {

    let html = bodyEmailHtmlConfirmSuscribeNewsletter(to)
    
    const mailOptions = {
        from: 'clasicaguitarra.com.email@gmail.com',
        to,
        subject: 'Confirmación suscripción Newsletter',
        html
    }

    transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
            console.log('err', err)
        }
    })

}


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

app.post('/suscriptores/:suscriptor', (req, res) => {

    let suscriptor = req.params.suscriptor

    if (suscriptor === null || suscriptor === undefined || suscriptor === '') {
        return res.status(400).json({
            ok: false,
            msg: 'El email es obligatorio'
        })
    }

    sendEmail(suscriptor)

    res.json({
        ok: true,
        msg: 'Email de confirmación enviado correctamente'
    })

})

// post suscriptor, método GET para que se pueda lanzar desde <a></a>
app.get('/suscriptores/:suscriptor/confirm', (req, res) => {

    let suscriptor = req.params.suscriptor

    if (suscriptor === null || suscriptor === undefined || suscriptor === '') {
        return res.status(400).json({
            ok: false,
            msg: 'El email es obligatorio'
        })
    }
    
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

        // res.json({
        //     ok: true,
        //     msg: 'Suscriptor agregado correctamente',
        //     suscriptor: suscriptorDB
        // })

        res.redirect('https://clasicaguitarra.com/#/thank-suscribe')

    })

})

// delete suscriptor, método GET para que se pueda lanzar desde <a></a>
app.get('/suscriptores/:email', (req, res) => {

    let email = req.params.email

    Suscriptor.deleteOne({ email }, (err, deleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // if (deleted.deletedCount === 0) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'Suscriptor no encontrado o no eliminado'
        //     })
        // }

        // res.json({
        //     ok: true,
        //     msg: 'Suscriptor eliminado correctamente'
        // })

        res.redirect('https://clasicaguitarra.com/#/unsuscribe')

    })

})


module.exports = app