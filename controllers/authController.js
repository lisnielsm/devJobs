const passport = require("passport");
const Vacantes = require("../models/Vacantes");
const Usuarios = require("../models/Usuarios");
const crypto = require("crypto");
const enviarEmail = require("../handlers/email");

exports.autenticarUsuario = passport.authenticate("local", {
	successRedirect: "/administracion",
	failureRedirect: "/iniciar-sesion",
	failureFlash: true,
	badrequestMessage: "Ambos campos son obligatorios",
});

// revisar si el usuario esta autenticado o no
exports.verificarUsuario = (req, res, next) => {
	// revisar el usuario
	if (req.isAuthenticated()) {
		return next(); // el usuario esta autenticado
	}

	// si no esta autenticado redirigir al formulario
	res.redirect("/iniciar-sesion");
};

exports.mostrarPanel = async (req, res) => {
	//consultar el usuario autenticado
	const vacantes = await Vacantes.find({ autor: req.user._id });

	res.render("administracion", {
		nombrePagina: "Panel de Administracion",
		tagline: "Crea y administra tus vacantes desde aqui",
		cerrarSesion: true,
		nombre: req.user.nombre,
		imagen: req.user.imagen,
		vacantes,
	});
};

exports.cerrarSesion = (req, res) => {
	req.logout(req.user, (err) => {
		if (err) return next(err);
		req.flash("correcto", "Cerraste sesion correctamente");
		res.redirect("/iniciar-sesion");
	});
};

exports.formReestablecerPassword = (req, res) => {
	res.render("reestablecer-password", {
		nombrePagina: "Reestablece tu Contraseña",
		tagline:
			"Si ya tienes una cuenta pero olvidaste tu password, coloca tu email",
	});
};

// Genera el token en la tabla del usuario
exports.enviarToken = async (req, res) => {
	const usuario = await Usuarios.findOne({ email: req.body.email });

	if (!usuario) {
		req.flash("error", "No existe esa cuenta");
		return res.redirect("/reestablecer-password");
	}

	// el usuario existe
	usuario.token = crypto.randomBytes(20).toString("hex");
	usuario.expira = Date.now() + 3600000;

	// guardarlos en la base de datos
	await usuario.save();
	const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

	try {
		// Enviar el correo con el token
		await enviarEmail.enviar({
			usuario,
			subject: "Password Reset",
			resetUrl,
			archivo: "reset",
		});

		// terminar
		req.flash("correcto", "Se envio un mensaje a tu correo");
		return res.redirect("/iniciar-sesion");
	} catch (error) {
		console.log(error);
		req.flash("error", "Ocurrio un error al enviar el correo");
		return res.redirect("/iniciar-sesion");
	}
};

exports.reestablecerPassword = async (req, res) => {
	const usuario = await Usuarios.findOne({
		token: req.params.token,
		expira: {
			$gt: Date.now(),
		},
	});

	if (!usuario) {
		req.flash("error", "El formulario ya no es valido, intente de nuevo");
		return res.redirect("/reestablecer-password");
	}

	// Todo bien, modifica tu password
	res.render("nuevo-password", {
		nombrePagina: "Nuevo Password",
	});
};

// almacena el nuevo password en la base de datos
exports.guardarPassword = async (req, res) => {
	const usuario = await Usuarios.findOne({
		token: req.params.token,
		expira: {
			$gt: Date.now(),
		},
	});

	// no existe el usuario o el token es invalido
	if (!usuario) {
		req.flash("error", "El formulario ya no es valido, intente de nuevo");
		return res.redirect("/reestablecer-password");
	}

	// asignar nuevo password, limpiar valores previos
	usuario.password = req.body.password;
	usuario.token = undefined;
	usuario.expira = undefined;

	// guardar en la base de datos
	await usuario.save();

	// redirigir
	req.flash("correcto", "Password modificado correctamente");
	return res.redirect("/iniciar-sesion");
};
