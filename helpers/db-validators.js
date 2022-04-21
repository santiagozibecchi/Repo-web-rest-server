// El objetivo de este codigo es simplificar parte de codigo que se reutiliza en /router/usuarios

const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');


const esRolValido = async (rol = ' ') => {
      const existeRol = await Role.findOne({ rol });
      // Si existe el rol siginfica que esta grabado en la coleccion de la DB, pero si no existe:
      if (!existeRol) {
            // Error personalizado
            throw new Error(`El rol ${rol} no esta registrado en la DB`);
      }
};

const emailExiste = async( correo = ' ') => {

      const existeEmail = await Usuario.findOne({ correo });
      // SI YA EXISTE EL CORREO NO DEBE FUNCIONAR!
      if (existeEmail) {
            // return res.status(400).json({
            //       msg: `El correo ${correo} ya existe`
            throw new Error(`El correo ${correo}, ya esta registrado`);
      }
};
const existeUsuarioPorId = async( id ) => {

      const existeUsuario = await Usuario.findById( id );
      //-- SI EL USUARIO EXISTE NO ENTRA EN LA CONDICION --
      // SI existeEmail ES NULL CAPTURO EL ERROR
      if (!existeUsuario) {
            // return res.status(400).json({
            //       msg: `El correo ${correo} ya existe`
            throw new Error(`El id ${id}, no existe`);
      }
};

const existeCategoriaPorId = async ( id ) => {

      const existeCategoria = await Categoria.findById(id);

      if (!existeCategoria) {
            throw new Error(`El id ${id} no existe`)
      }

};

const existeProductoPorId = async( id ) => {

      const existeProducto = await Producto.findById(id);

      if (!existeProducto) {
            throw new Error(`El id ${id} no existe`)
      }

};


module.exports = {
      esRolValido,
      emailExiste,
      existeUsuarioPorId,
      existeCategoriaPorId,
      existeProductoPorId,
}