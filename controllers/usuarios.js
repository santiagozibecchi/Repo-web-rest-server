const { response, request } = require('express');
const bcrypt = require('bcryptjs');
// Esto me permitira crear instancias de mi modelo:
// La mayuscula es una convencion
const Usuario = require('../models/usuario');

usuariosGet = async(req, res = response) => {

      // Para el limite desestructuro para obtener lo que viene en el body.query
      const { limite = 5, desde = 0 } = req.query;

      const query = { estado: true };

      // const {q, nombre, apikey, page = 1} = req.query;
/*
      const usuarios = await Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

      // Cantidad de registros:
      const total = await Usuario.countDocuments(query);
*/

      // Este codigo agiliza mucho la velocidad de respuesta ya que resuelve cada promesa al mismo tiempo
      const [ total, usuarios ] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query)
                  .skip(Number(desde))
                  .limit(Number(limite))
      ]);

      res.json({
            total,
            usuarios
      });
};

usuariosPut = async(req, res = response) => {

      // const id = req.params.id;
      const {id} = req.params;
      // Desestructuro todo lo que no necesito que se grabe:
      const { _id ,password, google, correo, ...resto} = req.body; 

      // Validar contra base de datos
      if (password) {

            // Encriptar la contraseña:
            const salt = bcrypt.genSaltSync(10);
            resto.password = bcrypt.hashSync(password, salt);
      }

      const usuarioDB = await Usuario.findByIdAndUpdate(id, resto);

      res.json(usuarioDB);
};

usuariosPost = async(req, res = response) => {


      const {nombre, correo, password, rol} = req.body;
      const usuario = new Usuario({nombre, correo, password, rol});

      // Verificar si el correo existe:
      // Se encuentra en db-validator

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

usuariosDelete = async(req, res = response) => {

      const { id } = req.params;

      // Borrando fisicamente de la DB
      // const usuario = await Usuario.findByIdAndDelete(id);

      const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

      res.json(usuario);
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