// porque es una funcion para generar un json web token

const jwt = require('jsonwebtoken')

// En base a promesas porque es un callback
// uid: identificador unico de usuario

// primero verifico el uid del usuario para tomar cualquier decision
const generarJWT = ( uid = ' ') => {

      return new Promise( (resolve, reject) => {

            const payload = { uid };
            // para firmar un nuevo token
            jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
                  expiresIn: '4h'
            }, (err, token) => {

                  if (err) {
                        console.log(err);
                        reject('No se pudo generar el token');
                  } else {
                        resolve(token);
                  }

            })

      })

}

module.exports = {

      generarJWT,

}