const Usuarios = require("../models/Usuarios");

exports.formCrearCuenta = (req, res) => {
	res.render("crear-cuenta", {
		nombrePagina: "Crea tu cuenta en DevJobs",
		tagline:
			"Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
	});
};

exports.crearUsuario = async (req, res, next) => {
	try {
		// crear el usuario
		await Usuarios.create(req.body);
		res.redirect("/iniciar-sesion");
	} catch (error) {
		req.flash("error", error);
		res.redirect("/crear-cuenta");
	}
};

// formulario para iniciar sesion
exports.formIniciarSesion = (req, res) => {
	res.render("iniciar-sesion", {
		nombrePagina: "Iniciar Sesión DevJobs",
	});
};

// form Editar el Perfil
exports.formEditarPerfil = (req, res) => {
	res.render("editar-perfil", {
		nombrePagina: "Edita tu Perfil en DevJobs",
		usuario: req.user,
		cerrarSesion: true,
		nombre: req.user.nombre,
		imagen: req.user.imagen,
	});
};

// Guardar cambios editar Perfil
exports.editarPerfil = async (req, res) => {
	const usuario = await Usuarios.findById(req.user.id);

	// leer los datos
	const { nombre, email, password } = req.body;

	// asignar valores
	usuario.nombre = nombre;
	usuario.email = email;
	if (password) {
		usuario.password = password;
	}

	if (req.file) {
		usuario.imagen = req.file.filename;
	}

	// guardar en la base de datos
	await usuario.save();

	req.flash("correcto", "Cambios Guardados Correctamente");

	res.redirect("/administracion");
};


