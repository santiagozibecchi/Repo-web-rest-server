const { response } = require("express");
const { Categoria } = require('../models')

// obtenerCategorias - paginado - total: cuantas categorias tiene - populate: investigar
const categoriasGet = async (req, res = response) => {

      const { limite = 5, desde = 0 } = req.query;
      const query = { estado: true };

      const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                  // segundo argumento es lo que me interesa mostrar:
                  .populate('usuario', 'nombre')
                  .skip(Number(desde))
                  .limit(Number(limite))
      ]);

      res.json({
            total,
            categorias
      });
}

// obtenerCategoria - populate { obj de la categoria } - categoria por ID

const categoriaPorID = async (req, res = response) => {

      const { id } = req.params;

      const categoriaID = await Categoria.findById(id).populate('usuario', 'nombre');

      res.json({
            categoriaID
      })

}

const crearCategoria = async (req, res = response) => {

      // Almaceno las categorias en mayusculas
      const nombre = req.body.nombre.toUpperCase();

      // Revision de categoria previamente grabada:
      const categoriaDB = await Categoria.findOne({ nombre });

      // Si existe, es decir categoriaDB NO es nula
      if (categoriaDB) {
            return res.status(400).json({
                  msg: `La categoria ${categoriaDB.nombre}, ya existe`
            });
      }

      // Generar la data para guardar:
      const data = {
            nombre,
            // Forma predeterminada de grabar de mongo
            usuario: req.usuario._id,
      }

      const categoria = new Categoria(data);

      // Guardar en DB
      await categoria.save();

      // Mostrar en postman la respuesta
      // se manda el status 201 para decir que se creo..
      res.status(201).json(categoria);

}

//    actualizar categoria - nombre
const actualizarCategoria = async(req, res = response) =>{

      const { id } = req.params;

      // Desestructuro de tal forma que solo pueda extraer la propiedad "nombre" de mi modelo
      const { estado, usuario, ...data } = req.body;

      data.nombre =  data.nombre.toUpperCase();
      data.usuario = req.usuario._id;
      
      const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

      res.json(categoria);

};

// borrar categoria - estado: false
const borrarCategoria = async(req, res = response) =>{

      const { id } = req.params

      const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

      res.json(categoria);

}

module.exports = {
      crearCategoria,
      categoriasGet,
      categoriaPorID,
      actualizarCategoria,
      borrarCategoria
}