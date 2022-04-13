// MIDLEWARES PERSONALIZADOS
// El objetivo de esto es reducir la cantidad de codigos para que sea mas lejible y limpio
// Deben ir las importaciones de las funciones en este codigo:
const { validationResult } = require('express-validator');

// Como es un middleware va a tener un tercer argumento que se llama next
// Es lo que tengo que llamar si un middleware pasa..

const validarCampos = (req, res, next) => {

      const errors = validationResult(req);
      // Si hay errores:
      if (!errors.isEmpty()) {
            return res.status(400).json(errors);
      }

      // Si llega hasta este punto porfavor sigue con el siguiente middleware..
      next();
};

module.exports = {
      validarCampos,

}