module.exports = {
    bodyEmailHtmlConcierto: function(concierto, usuario, suscriptor) {
        let body = `
        <div style="color: #263238; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;">
            <h1 style="color: #263238; letter-spacing: 0.4rem; text-align: center; font-weight: 200; font-size: 2rem; text-decoration: none;"><img src="https://res.cloudinary.com/clasicaguitarra/image/upload/v1557178902/logo-proyecto-grey-darken-3_syjuvu.png" align="middle" width="120" height="120">clasicaguitarra.com</h1>
            <h3 style="color: #263238; text-align: center; font-size: 1.80rem; font-weight: 200;">${ concierto.titulo }</h3>
            <div style="color: #263238; border: none; height: 1px; background-color: gray;"></div>
            <p style="color: #263238; text-align: center; font-size: 1.68rem;">${ usuario.nombre } ${ usuario.apellidos } tocará próximamente y estás invitado/a!</p>
            <p style="color: #263238; font-size: 1.68rem; justify-self: start">📅 ${ new Date(concierto.fecha).toLocaleDateString() } (MM/DD/AAAA)</p>
            <p style="color: #263238; font-size: 1.68rem; justify-self: start">🕒 ${ concierto.hora }</p>
            <p style="color: #263238; font-size: 1.68rem; justify-self: start">🌍 ${ concierto.ubicacion }</p>
            <p style="color: #263238; font-size: 1.68rem; justify-self: start">💵 ${ concierto.precio } €</p>
            <p style="color: #263238; font-size: 1.3rem; justify-self: start"> ${ concierto.descripcion }</p>
            <br>
            <a href="clasicaguitarra.com">clasicaguitarra.com</a>
            <p>Si estás suscrito a este guitarrista y no quieres recibir más avisos de sus conciertos haga clic <a href="https://clasicaguitarra-backend.herokuapp.com/usuarios/${ usuario._id }/unsuscribe/${ suscriptor }">aquí</a>.</p>
            <p>Si estás suscrito a las newsletter y no quieres recibir más correos haga clic <a href="https://clasicaguitarra-backend.herokuapp.com/suscriptores/${ suscriptor }">aquí</a>.</p>
        </div>
        `
    
        return body
    },
    bodyEmailHtmlConfirmSuscribe: function(usuario, enlace) {
        let body = `
        <div style="color: #263238; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;">
            <h1 style="color: #263238; letter-spacing: 0.4rem; text-align: center; font-weight: 200; font-size: 2rem; text-decoration: none;"><img src="https://res.cloudinary.com/clasicaguitarra/image/upload/v1557178902/logo-proyecto-grey-darken-3_syjuvu.png" align="middle" width="100" height="100">clasicaguitarra.com</h1>
            <h3 style="color: #263238; text-align: center; font-size: 1.30rem; font-weight: 200;">Email de confirmación</h3>
            <div style="color: #263238; border: none; height: 1px; background-color: gray;"></div>
            <p style="color: #263238; text-align: left; font-size: 1.1rem;">Por favor acceda a este <a href='${ enlace }'>enlace</a> para confirmar que desea suscribirse al/a la guitarrista ${ usuario.nombre } ${ usuario.apellidos }.</p>
            <br>
            <a href="clasicaguitarra.com">clasicaguitarra.com</a>
        </div>
        `
    
        return body
    },
    bodyEmailHtmlConfirmSuscribeNewsletter: function(suscriptor) {

        let body = `
        <div style="color: #263238; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;">
            <h1 style="color: #263238; letter-spacing: 0.4rem; text-align: center; font-weight: 200; font-size: 2rem; text-decoration: none;"><img src="https://res.cloudinary.com/clasicaguitarra/image/upload/v1557178902/logo-proyecto-grey-darken-3_syjuvu.png" align="middle" width="100" height="100">clasicaguitarra.com</h1>
            <h3 style="color: #263238; text-align: center; font-size: 1.30rem; font-weight: 200;">Email de confirmación</h3>
            <div style="color: #263238; border: none; height: 1px; background-color: gray;"></div>
            <p style="color: #263238; text-align: left; font-size: 1.1rem;">Por favor acceda a este <a href='https://clasicaguitarra-backend.herokuapp.com/suscriptores/${ suscriptor }/confirm'>enlace</a> para confirmar que desea suscribirse a las Newsletter.</p>
            <br>
            <a href="clasicaguitarra.com">clasicaguitarra.com</a>
        </div>
        `
    
        return body

    }
}

