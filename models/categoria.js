// Mismo nombre de la coleccion pero sin las S

const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
      nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            // Para que no sea duplicado:
            unique: true
      },
      estado: {
            type: Boolean,
            default: true,
            required: true,
      },
      usuario: {
            // Necesita saber que usuario fue el que creo esta categoria:
            type: Schema.Types.ObjectId,
            // referencia de donde apunta el Object.Id:
            ref: 'Usuario',
            // true: porque todas las categorias tienen que tener un usuario
            // Si intento grabar algo y no le estoy mandando el usuario
            // tiene que mandar un error
            required: true
      }
});

CategoriaSchema.methods.toJSON = function () {
      // { ... } el resto de argumentos que se encuentra en toObject() -> utilizo el operador REST (...) para unificarlos en uno solo -> ...usuario;
      const { __v, estado, ...data } = this.toObject();

      return data;
}
module.exports = model('Categoria', CategoriaSchema)
