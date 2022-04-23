// paquete de node
const path = require('path');

// generador de id universal
const { v4: uuidv4 } = require('uuid');



// Tambien se podria desestrucurar, en lugar de files se puede colocar:
// { archivo } ya que archivo viene en el cuerpo de la request

// carpeta = ' ' -> carpeta donde quiero colocar las imagenes
const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {


      // mucho codigo que se necesita poder determinar cuando sale bien y cuando sale mal
      return new Promise((resolve, reject) => {

            // No necesito colocar la req porque ya viene en los (files), primer argumento de cargarArchivo:
            // const { archivo } = req.files;
            
            const { archivo } = files;

            const nombreCortado = archivo.name.split('.');
            const extension = nombreCortado[nombreCortado.length - 1];

            // Validar las extensiones
            // Este codigo hace poco flexible a la aplicacion 
            // const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

            // if (!extensionesValidas.includes(extension)) {
            //       return res.status(400).json({
            //             msg: `${extension} no es permitida. Las validas son ${extensionesValidas}`
            //       })
            // }

            if (!extensionesValidas.includes(extension)) {
                  return reject(`${extension} no es permitida. Las validas son ${extensionesValidas}`)
            }


            const nombreTemporal = uuidv4() + '.' + extension;
            const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);

            // mv: mover (lugar donde quiero colocar)
            archivo.mv(uploadPath, (err) => {
                  // if (err) {
                  //       return res.status(500).json({ err });
                  // }
                  if (err) {
                        reject(err);
                  }
                  // res.json({ msg: 'File uploaded to ' + uploadPath });
                  resolve(nombreTemporal);
            });

      });

}


module.exports = {
      subirArchivo
}