// Middleware para bloquar para que solo usuarios con el rol de admin puedan borrar

const { response } = require("express");


const esAdminRole = (req, res=response, next) => {

      if (!req.usuario) {
            return res.status(500).json({
                  msg: 'Se quiere verificar el role sin validar el token primero'
            })
      }

      const {rol, nombre} = req.usuario;

      if(rol !== 'ADMIN_ROL') {
            return res.status(401).json({
                  msg: `${nombre}  no es administrador - No puede realizar dicha accion.`
            })
      }


      next();
}

const tieneRol = ( ... roles ) => {

      return (req, res = response, next) => {

            if (!req.usuario) {
                  return res.status(500).json({
                        msg: 'Se quiere verificar el role sin validar el token primero'
                  });
            };

            if (!roles.includes(req.usuario.rol)) {
                  return res.status(401).json({
                        msg: `El servicio requiere uno de estos roles ${roles}`
                  });
            };


            next();
      }

}




module.exports = {
      esAdminRole,
      tieneRol,
}