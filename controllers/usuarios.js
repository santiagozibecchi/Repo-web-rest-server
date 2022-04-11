const { response, request } = require('express')

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

usuariosPost = (req, res = response) => {

      const {nombre, edad} = req.body;

      res.status(201).json({
            msg: 'post API - controlador',
            nombre,
            edad,
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