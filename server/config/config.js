// =======================
//  Puerto
// =======================
process.env.PORT = process.env.PORT || 3000


// =======================
//  Entorno
// =======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


// =======================
//  Expiración del Token
// =======================
process.env.EXPIRACION_TOKEN = '20 days'


// =======================
//  SEED de autenticación para el Token
// =======================
process.env.SEED = process.env.SEED || 'secret-seed-desarrollo'


// =======================
//  Base de datos
// =======================
let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/localDB'
} else {
    urlDB = ''
    // urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB