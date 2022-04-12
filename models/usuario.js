

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

module.exports = model('Usuario', UsuarioSchema);