const { Router } = require('express');
const { check } = require('express-validator');

const { 
      crearCategoria,
      categoriasGet, 
      categoriaPorID, 
      actualizarCategoria, 
      borrarCategoria} = require('../controllers/categorias');

const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRol, esAdminRole } = require('../middlewares');


const router = Router();

// Obtener todas las categorias
router.get('/', categoriasGet);

// Obtener una categorias por id - publico
router.get('/:id', [
      check('id', 'No es un ID valido').isMongoId(),
      // middleware personalizado:
      check('id').custom(existeCategoriaPorId),
      validarCampos,
], categoriaPorID);

// Crear categoria - privado con cualquier personsa con token valido
router.post('/', [
      validarJWT,
      check('nombre', 'El nombre es obligatorio').not().isEmpty(),
      validarCampos
], crearCategoria);

// Para actualizar un registro con validaciones - Privado con token valido
router.put('/:id', [
      validarJWT,
      check('nombre', 'El nombre es obligatorio').not().isEmpty(),
      // Middleware personalizado:
      check('id').custom(existeCategoriaPorId),
      validarCampos
], actualizarCategoria);

// Delete: borrar una categoria - ADMIN
router.delete('/:id', [
      validarJWT,
      esAdminRole,
      check('id', 'No es un ID valido').isMongoId(),
      // Middleware personalizado:
      check('id').custom(existeCategoriaPorId),
      validarCampos
], borrarCategoria);




module.exports = router;
