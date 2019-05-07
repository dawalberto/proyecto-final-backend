function bodyEmailHtml(concierto, usuario) {
    let body = `
    <div style="color: #263238; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;">
        <h1 style="color: #263238; letter-spacing: 0.4rem; text-align: center; font-weight: 200; font-size: 2rem; text-decoration: none;"><img src="https://res.cloudinary.com/clasicaguitarra/image/upload/v1557178902/logo-proyecto-grey-darken-3_syjuvu.png" align="middle" width="120" height="120">clasicaguitarra.com</h1>
        <h3 style="color: #263238; text-align: center; font-size: 1.80rem; font-weight: 200;">${ concierto.titulo }</h3>
        <div style="color: #263238; border: none; height: 1px; background-color: gray;"></div>
        <p style="color: #263238; text-align: center; font-size: 1.68rem;">${ usuario.nombre } ${ usuario.apellidos } tocará próximamente y estás invitado/a!</p>
        <p style="color: #263238; font-size: 1.68rem; justify-self: start">📅 ${ new Date(concierto.fecha).toLocaleDateString() }</p>
        <p style="color: #263238; font-size: 1.68rem; justify-self: start">🕒 ${ concierto.hora }</p>
        <p style="color: #263238; font-size: 1.68rem; justify-self: start">🌍 ${ concierto.ubicacion }</p>
        <p style="color: #263238; font-size: 1.68rem; justify-self: start">💵 ${ concierto.precio } €</p>
        <p style="color: #263238; font-size: 1.3rem; justify-self: start"> ${ concierto.descripcion }</p>
        <br>
        <a href="clasicaguitarra.com">clasicaguitarra.com</a>
    </div>
    `

    return body
}


module.exports = bodyEmailHtml