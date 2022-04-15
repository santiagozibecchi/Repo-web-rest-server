const { request } = require('express');
const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

// El token de acceso se acostumbra a que vaya en los headers

const validarJWT = async(req=request, res = response, next) => {

      // Para leer los headers tengo que leer los request
      const token = req.header('x-token');

      if (!token) {
            return res.status(401).json({
                  msg: 'No hay token en la peticion'
            });
      }

      try {
            
            const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

            // Leer el usuario que corresponde al uid:
            const usuario = await Usuario.findById(uid);

            // Verificar si no encuentra a nadie por el uid 
            if (!usuario) {
                  return res.status(401).json({
                        msg: 'Token no valido - Usuario no existe en la DB'
                  })
            }

            // Verificar si el uid tiene estado true:
            if ( !usuario.estado) {
                  return res.status(401).json({
                        msg: 'Token no valido - Usuario con estado: false'
                  })
            }



            // Nueva propiedad nueva en el request
            req.usuario = usuario;
            next();


      } catch (error) {

            console.log(error);
            res.status(401).json({
                  msg: 'Token no valido'
            });
            
      }

      console.log(token);

}

module.exports = {
      validarJWT
}




