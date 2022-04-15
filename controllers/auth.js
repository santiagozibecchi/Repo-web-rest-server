const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');



const login = async(req, res = response) => {

      const { correo, password } = req.body;

      try {
            
            // Verificar si el email existe
            const usuario = await Usuario.findOne({correo});
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

module.exports = {
      login,
}