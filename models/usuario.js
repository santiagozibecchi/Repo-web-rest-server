

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
      nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio']
      },
      correo: {
            type: String,
            required: [true, 'El correo es obligatorio'],
            // No permitir duplicar correos electronicos
            unique: true,
      },
      password: {
            type: String,
            required: [true, 'La contraseña es obligatorio'],
      },
      img: {
            type: String,
      },
      rol: {
            type: String,
            required: true,
            emun: ['ADMIN_ROL', 'USER_ROL']
      },
      estado: {
            type: Boolean,
            default: true,
      },
      google: {
            type: Boolean,
            default: false
      },
});

// Sobre escribir informacion con tojSON
// Tiene que ser una funcion normal porque voy a utilizar el objeto _this_ . Cosa que una funcion de flecha apunta afuera de la misma   
// Necesito el this_ porque hace referencia a la instancia creada que viene de la clase
// Cuando se llame el toJSON se va a ejecutar esta funcion
UsuarioSchema.methods.toJSON = function () {
      // { ... } el resto de argumentos que se encuentra en toObject() -> utilizo el operador REST (...) para unificarlos en uno solo -> ...usuario;
      const { __v, password, _id, ...usuario  } = this.toObject();
      usuario.uid = _id;

      return usuario;
}


module.exports = model('Usuario', UsuarioSchema);