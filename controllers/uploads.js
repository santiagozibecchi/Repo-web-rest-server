const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { subirArchivo } = require("../helpers");

// importo Usuario y Producto porque son las clases de la que partimos para guardar informacion

const { Usuario, Producto } = require('../models');


const cargarArchivo = async(req, res =response) => {

      // Este codigo viene del repositorio de express-fileupload

      // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      //       res.status(400).json({
      //             msg: 'No hay archivos que subir'
      //       });
      //       return;
      // }

      // if (!req.files.archivo) {
      //       res.status(400).json({
      //             msg: 'No hay archivos que subir'
      //       });
      //       return;
      // }

      // En este punto ya se que el archivo existe, por lo tanto:

      // Solo Imagenes porque asi esta por defecto en subir-archivos
      // const nombre = await subirArchivo(req.files);

      try {
            
            // admite txt - md
            const nombre = await subirArchivo(req.files, undefined, 'imgs');
            res.json({nombre})

      } catch (msg) {
            res.status(400).json({msg});
      }


} 

// En nuestro modelo de usuarios,  para grabarlo necesitamos unicamente mandarle el img
// img: nombre de la propiedad para grabar

const actualizarImagen = async(req, res = response) => {

      const { id, coleccion } = req.params;

      let modelo;

      switch (coleccion) {
            case 'usuarios':
                  // Encuentro el id del usuario
                  modelo = await Usuario.findById(id);    
                  if (!modelo) {
                        return res.status(400).json({
                              msg: `No existe un usuario con el id: ${ id }`
                        })
                  }
            break;

            case 'productos':
                  // Encuentro el id del producto
                  modelo = await Producto.findById(id);    
                  if (!modelo) {
                        return res.status(400).json({
                              msg: `No existe un producto con el id: ${ id }`
                        })
                  }
            break;
      
            default:
                  return res.status(500).json({msg: 'Falta validar ...'})
      }

      // Tanto el modelo de usuarios como el de productos tiene una propiedad llamada img

      // Limpiar imagenes previas
      if (modelo.img) {
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            // Preguntamos si existe el archivo
            if (fs.existsSync(pathImagen)) {
                  fs.unlinkSync(pathImagen);
            }
      }

      const nombre = await subirArchivo(req.files, undefined, coleccion);

      modelo.img = nombre;
      await modelo.save();

      res.json(modelo);

}

const mostrarImagen = async(req, res = response) => {

      const { id, coleccion } = req.params;


      let modelo;

      switch (coleccion) {
            case 'usuarios':
                  // Encuentro el id del usuario
                  modelo = await Usuario.findById(id);
                  if (!modelo) {
                        return res.status(400).json({
                              msg: `No existe un usuario con el id: ${id}`
                        })
                  }
                  break;

            case 'productos':
                  // Encuentro el id del producto
                  modelo = await Producto.findById(id);
                  if (!modelo) {
                        return res.status(400).json({
                              msg: `No existe un producto con el id: ${id}`
                        })
                  }
                  break;

            default:
                  return res.status(500).json({ msg: 'Falta validar ...' })
      }

      // Tanto el modelo de usuarios como el de productos tiene una propiedad llamada img

      if (modelo.img) {
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            // Preguntamos si existe el archivo
            if (fs.existsSync(pathImagen)) {
                  return res.sendFile(pathImagen)
                  // NO OLVIDAR EL RETURN !
            }
      }

      res.json({
            msg: ' Falta place holder'
      })


}



module.exports = {
      cargarArchivo,
      actualizarImagen,
      mostrarImagen
}