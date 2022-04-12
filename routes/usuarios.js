// Paquete de EXPRESS
const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosPut, usuariosGet, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', usuariosPut );

// Para definir un middleware: se coloca en el segundo argumento un arreglo
router.post('/', [
      // Check: revisa el campo del correo
      // isEmail: tiene que ser un correo
      check('correo', 'El correo no es valido').isEmail(),

],usuariosPost);

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);







module.exports = router;