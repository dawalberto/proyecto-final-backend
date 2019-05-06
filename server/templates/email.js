function bodyEmail(concierto, usuario) {
    let body = 
    `
    <!doctype html>
    <html ⚡4email>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
        <style amp4email-boilerplate>body{visibility:hidden}</style>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
    </head>
    <style amp-custom>
        .container {
            display: grid;
            grid-gap: 1.5rem;
        }
        .col1 {
            grid-column: 1;
        }
        .col2 {
            grid-column: 2;
        }
        .col1-2 {
            grid-column: 1 / 3;
        }
        .align-self-center {
            align-self: center;
        }
        .justify-self-start {
            justify-self: start;
        }
        .justify-self-center {
            justify-self: center;
        }
        .justify-self-end {
            justify-self: end;
        }
        .clasicaguitarra {
            letter-spacing: 0.4rem;
        }
        .mr-5 {
            margin-right: 0.5rem;
        }
        div.col1-2 {
            border: none;
            height: 1px;
            background-color: gray;
        }
        .pIcons {
            /* margin-left: 25%; */
            justify-self: start;
        }
        i {
            color: #37474F;
        }
    </style>
    <body>
        <div class="container">
            <img src="../assets/logo-proyecto.png" class="col1 justify-self-end" width="150" height="150" alt="logo clasicaguitarra.com">
            <h3 class="col2 align-self-center justify-self-start clasicaguitarra thin">clasicaguitarra.com</h3>
            <div class="col1-2"></div>
            <h4 class="col1-2 justify-self-center">${ concierto.titulo }</h4>
            <p class="col1-2 justify-self-center flow-text">${ usuario.nombre } ${ usuario.apellidos } tocará próximamente y estás inivitado!</p>
            <p class="col1-2 pIcons flow-text"><i class="mr-5 fas fa-calendar-day"></i>${ new Date(concierto.fecha).toLocaleDateString() }</p>
            <p class="col1-2 pIcons flow-text"><i class="mr-5 fas fa-clock"></i>${ concierto.hora }</p>
            <p class="col1-2 pIcons flow-text"><i class="mr-5 fas fa-map-marker-alt"></i>${ concierto.ubicacion }</p>
            <p class="col1-2 pIcons flow-text"><i class="mr-5 fas fa-money-bill"></i>${ concierto.precio } €</p>
        </div>
    </body>
    </html>
    `
    return body
}


module.exports = bodyEmail