const { response, request } = require('express');
const bcrypt = require('bcryptjs');
// Esto me permitira crear instancias de mi modelo:
// La mayuscula es una convencion
const Usuario = require('../models/usuario');
const { validationResult } = require('express-validator');

usuariosGet = (req, res = response) => {

      const {q, nombre, apikey, page = 1} = req.query;

      res.json({
            msg: 'get API - controlador',
            q,
            nombre,
            apikey,
            page
      });
};

usuariosPut = (req, res = response) => {

      // const id = req.params.id;
      const {id} = req.params;

      res.json({
            msg: 'put API - controlador',
            id,
      });
};

usuariosPost = async(req, res = response) => {

      const errors = validationResult(req);
      // Si hay errores:
      if (!errors.isEmpty()) {
            return res.status(400).json(errors);
      }


      const {nombre, correo, password, rol} = req.body;
      const usuario = new Usuario({nombre, correo, password, rol});

      // Verificar si el correo existe:
      const existeEmail = await Usuario.findOne({correo});
      if (existeEmail) {
            return res.status(400).json({
                  msg: 'Este correo ya esta registrado'
            }) 
      }

      // Encriptar la contraseña:
      const salt =  bcrypt.genSaltSync(10);
      usuario.password =  bcrypt.hashSync(password, salt);

      //Guardar en base de datos
      // Para grabar el registro:
      await usuario.save();

      res.json({
            usuario
      });
};

usuariosDelete = (req, res = response) => {
      res.json({
            msg: 'delete API - controlador'
      });
};

usuariosPatch = (req, res = response) => {
      res.json({
            msg: 'patch API - controlador'
      });
};


module.exports = {
      usuariosPut,
      usuariosGet,
      usuariosDelete,
      usuariosPatch,
      usuariosPost
}