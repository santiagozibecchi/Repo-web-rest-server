const { response } = require("express");
const { Producto, Categoria } = require("../models");


// // Obtener productos
const productosGet = async (req, res = response) => {

      const { limite = 5, desde = 0 } = req.query;
      const query = { estado: true };

      const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                  // segundo argumento es lo que me interesa mostrar:
                  .populate('usuario', 'nombre')
                  .populate('categoria', 'nombre')
                  .skip(Number(desde))
                  .limit(Number(limite))
                  

      ]);

      console.log(Producto.find(query).populate('usuario', 'nombre'));

      res.json({
            total,
            productos
      });
}

// Obtener producto por ID
const productoPorID = async (req, res = response) => {

      const { id } = req.params;

      const productoID = await Producto.findById(id)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');

      res.json({
            productoID
      })

}


// Crear producto
const crearProducto = async (req, res = response) => {

      const { estado, usuario, ...body } = req.body

      const productoDB = await Producto.findOne({ nombre: body.nombre });

      if (productoDB) {
            return res.status(400).json({
                  msg: `El producto ${productoDB.nombre} ya existe`
            })
      }

      // Primero inicializo la info que quiero guardar
      const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id,
      }

      const producto = new Producto(data);

      await producto.save();

      res.status(201).json(producto);


}

// Actualizar producto
const actualizarProducto = async (req, res = response) => {

      const { id } = req.params

      const { estado, usuario, ...data } = req.body

      if (data.nombre) {
            data.nombre = data.nombre.toUpperCase();
      }
      // usuario que esta actualizando
      data.usuario = req.usuario._id;

      const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

      res.json(producto)

}

// Borrar producto
const borrarProducto = async (req, res = response) => {
      const { id } = req.params

      const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

      res.json(productoBorrado);
}

module.exports = {
      crearProducto,
      productosGet,
      productoPorID,
      actualizarProducto,
      borrarProducto

}