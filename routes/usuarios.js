// Paquete de EXPRESS
const { Router } = require('express');
const { check } = require('express-validator');

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const { usuariosPut, usuariosGet, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);


// Inicialmente: router.put('/:id', usuariosPut); => Es necesario actualizar con los middlewares necesarios.

router.put('/:id', [
      check('id', 'No es un ID valido').isMongoId(),
      check('id').custom(existeUsuarioPorId),
      check('rol').custom(esRolValido),

      validarCampos
] ,usuariosPut );

// Para definir un middleware: se coloca en el segundo argumento un arreglo
router.post('/', [
      // Check: revisa el campo del correo
      // isEmpty: significa que esta vacio
      // not() : negacion
      check('nombre', 'El nombre es obligatorio').not().isEmpty(),

      // isEmail: tiene que ser un correo
      check('correo', 'El correo no es valido').isEmail(),
      check('correo').custom(emailExiste),
      
      check('password', 'El password debe ser de mas de 6 letras').isLength({ min: 6 }),

      // check('rol', 'No es un rol permitido').isIn('ADMIN_ROL', 'USER_ROL'),
      // Es preferible validar el ROL contra una BASE DE DATOS

      // Custom recibe el valor de lo que estoy evaluando:
      // rol recibe un valor por defecto en caso de que no venga porque si no viniera va a ser un string vacio y va a chocar con la validacion siguiente..
      check('rol').custom( esRolValido ),
      validarCampos

],usuariosPost);

router.delete('/:id', usuariosDelete);


router.patch('/', usuariosPatch);







module.exports = router;