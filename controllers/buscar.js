const { response } = require('express');
const { isValidObjectId } = require('mongoose');

const { Usuario, Categoria, Producto } = require('../models');


const coleccionesPermitidas = [
      'usuarios',
      'categoria',
      'productos',
      'roles',
];

const buscarUsuarios = async (termino = ' ', res = response) => {

      // validar si se trata de un ID de mongo
      const esMongoID = isValidObjectId(termino);

      if (esMongoID) {
            const usuario = await Usuario.findById(termino);
            return res.json({
                  results: (usuario) ? [usuario] : []
            })
      }
      //busqueda insensible a mayusculas y minisculas - expresiones regulares
      const regex = new RegExp(termino, 'i');

      const usuarios = await Usuario.find({
            $or: [{ nombre: regex }, { correo: regex }],
            $and: [{ estado: true }]
      });

      res.json({
            results: usuarios
      })
}

const buscarcategoria = async (termino = ' ', res = response) => {

      const esMongoID = isValidObjectId(termino);

      // Busqueda por ID:
      // primero verifico si se trata de un mongoID
      if (esMongoID) {
            const categoria = await Categoria.findById(termino)

            return res.json({
                  results: (categoria) ? [categoria] : []
            })
      }

      const regex = new RegExp(termino, 'i');

      const categorias = await Categoria.find({ nombre: regex, estado: true }) // como si fuera $and

      res.json({
            results: categorias
      })
}

const productos = async (termino = ' ', res = response) => {

      const esMongoID = isValidObjectId(termino);

      if (esMongoID) {
            const producto = await Producto.findById(termino)
                  .populate('categoria', 'nombre');
            return res.json({
                  results: (producto) ? [producto] : []
            })
      }

      const regrex = new RegExp(termino, 'i');

      const productos = await Producto.find({
            $or: [{ nombre: regrex }],
            $and: [{ estado: true }]
      })
            .populate('categoria', 'nombre');

      res.json({
            results: [productos]
      })
}

const buscar = (req, res = response) => {

      const { coleccion, termino } = req.params

      if (!coleccionesPermitidas.includes(coleccion)) {

            return res.status(400).json({
                  msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
            })
      }

      switch (coleccion) {
            case 'usuarios':
                  buscarUsuarios(termino, res);
                  break;
            case 'categoria':
                  buscarcategoria(termino, res);
                  break;
            case 'productos':
                  productos(termino, res);
                  break;

            default:
                  // Problema del servidor - backend - no se implemento la busqueda
                  res.status(500).json({
                        msg: 'Se le olvido hacer esta busqueda'
                  })
      }

}





module.exports = {
      buscar
}