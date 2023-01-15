const express = require("express");
const router = express.Router();
const multer = require("multer");
const shortid = require("shortid");

const homeController = require("../controllers/homeController");
const vacantesController = require("../controllers/vacantesController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");

const middlewares = require("../middlewares");

router.get("/", homeController.mostrarTrabajos);

// Crear Vacantes
router.get(
	"/vacantes/nueva",
	authController.verificarUsuario,
	vacantesController.formularioNuevaVacante
);
router.post(
	"/vacantes/nueva",
	authController.verificarUsuario,
	middlewares.validarVacantes,
	vacantesController.agregarVacante
);

// Mostrar Vacante (Singular)
router.get("/vacantes/:url", vacantesController.mostrarVacante);

// Editar Vacante
router.get(
	"/vacantes/editar/:url",
	authController.verificarUsuario,
	vacantesController.formEditarVacante
);
router.post(
	"/vacantes/editar/:url",
	authController.verificarUsuario,
	middlewares.validarVacantes,
	vacantesController.editarVacante
);

// Eliminar Vacante
router.delete(
	"/vacantes/eliminar/:id",
	authController.verificarUsuario,
	vacantesController.eliminarVacante
);

// Crear cuentas
router.get("/crear-cuenta", usuariosController.formCrearCuenta);
router.post(
	"/crear-cuenta",
	middlewares.validarUsuarios,
	usuariosController.crearUsuario
);

// Autenticar Usuarios
router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
router.post("/iniciar-sesion", authController.autenticarUsuario);
// Cerrar Sesion
router.get(
	"/cerrar-sesion",
	authController.verificarUsuario,
	authController.cerrarSesion
);

// Resetear Password (Email)
router.get("/reestablecer-password", authController.formReestablecerPassword);
router.post("/reestablecer-password", authController.enviarToken);

// Resetear Password (Almacenar en la DB)
router.get(
	"/reestablecer-password/:token",
	authController.reestablecerPassword
);
router.post("/reestablecer-password/:token", authController.guardarPassword);

// Panel de administracion
router.get(
	"/administracion",
	authController.verificarUsuario,
	authController.mostrarPanel
);

// Editar perfil
router.get(
	"/editar-perfil",
	authController.verificarUsuario,
	usuariosController.formEditarPerfil
);
router.post(
	"/editar-perfil",
	authController.verificarUsuario,
	middlewares.validarPerfil,
	middlewares.subirImagen,
	usuariosController.editarPerfil
);

// Recibir mensajes de candidatos
router.post(
	"/vacantes/:url",
	middlewares.subirCV,
	vacantesController.contactar
);

// Muestra los candidatos por vacante
router.get(
	"/candidatos/:id",
	authController.verificarUsuario,
	vacantesController.mostrarCandidatos
);

// Buscador de vacantes
router.post('/buscador', vacantesController.buscarVacantes)

module.exports = router;
