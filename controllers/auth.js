const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');



const login = async (req, res = response) => {

      const { correo, password } = req.body;

      try {

            // Verificar si el email existe
            const usuario = await Usuario.findOne({ correo });
            // Si el usuario no existe retorna lo siguiente..
            if (!usuario) {
                  return res.status(400).json({
                        msg: 'Usuario / Password no son correctos - correo'
                  })
            }

            // SI el usuario esta activo en la DB
            // si el estado del usuario es false..
            if (!usuario.estado) {
                  return res.status(400).json({
                        msg: 'Usuario / Password no son correctos - Estado: false'
                  })
            }
            // Verificar la contraseña
            // siendo el segundo arguento en de la DB
            const validPassword = bcryptjs.compareSync(password, usuario.password);
            if (!validPassword) {
                  return res.status(400).json({
                        msg: 'Usuario / Password no son correctos - Password'
                  })
            }

            // generar el JWT

            const token = await generarJWT(usuario.id)

            res.json({

                  usuario,
                  token

            })

      } catch (error) {
            return res.json.status(500)({
                  msg: 'Hable con el administrador'
            })
      }

}

const googleSignIn = async (req, res = response) => {

      const { id_token } = req.body

      try {

            const { correo, nombre, img } = await googleVerify(id_token);

            // Verificar si el correo ya existe en la base de datos

            let usuario = await Usuario.findOne({ correo });

            if (!usuario) {
                  // Tengo que crearlo
                  const data = {
                        nombre,
                        correo,
                        password: ' ',
                        img,
                        rol: "USER_ROL",
                        google: true
                  };

                  usuario = new Usuario(data);
                  await usuario.save();

            }

            // Si el usuario en DB, tiene el estado en false
            if (!usuario.estado) {
                  return res.status(401).json({
                        msg: 'Hable con el administrador - Usuario bloqueado'
                  })
            }

            // Generar el JWT
            const token = await generarJWT(usuario.id)

            res.json({
                  usuario,
                  token
            })

      } catch (error) {
            res.status(400).json({
                  ok: false,
                  msg: 'El token no se pudo verificar'
            })
      }

}

module.exports = {
      login,
      googleSignIn
}