const { response } = require('express');
const { Router } = require('express');
const { check } = require('express-validator');
const { 
      crearProducto, 
      productosGet, 
      productoPorID, 
      borrarProducto,
      actualizarProducto} = require('../controllers/productos');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

// Obtener productos
router.get('/', productosGet);

// Obtener producto por ID
router.get('/:id', [
      check('id', 'No es un ID valido').isMongoId(),
      check('id').custom(existeProductoPorId),
      validarCampos
], productoPorID);

// Crear producto
router.post('/', [
      validarJWT,
      check('nombre', 'El nombre es obligatorio').not().isEmpty(),
      check('categoria', 'No es un ID de mongo').isMongoId(),
      check('categoria').custom(existeCategoriaPorId),
      validarCampos
], crearProducto);

// Actualizar producto
router.put('/:id', [
      validarJWT,
      check('categoria', 'No es un ID de mongo').isMongoId(),
      check('categoria').custom(existeCategoriaPorId),
      check('id').custom(existeProductoPorId),
      validarCampos
], actualizarProducto);

// Borrar producto
router.delete('/:id',[
      validarJWT,
      esAdminRole,
      check('id', 'No es un ID valido de mongo').isMongoId(),
      // Middleware personalizado:
      check('id').custom(existeProductoPorId),
      validarCampos
], borrarProducto );

module.exports = router;