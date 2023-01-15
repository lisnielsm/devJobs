const { body, validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");

exports.validarVacantes = [
	body("titulo", "Agrega un Titulo a la Vacante").notEmpty().escape(),
	body("empresa", "Agrega una Empresa a la Vacante").notEmpty().escape(),
	body("ubicacion", "Agrega una Ubicacion a la Vacante").notEmpty().escape(),
	body("contrato", "Selecciona el tipo de Contrato").notEmpty().escape(),
	body("skills", "Agrega al menos una Habilidad").notEmpty().escape(),
	function (req, res, next) {
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			// Recargar la vista con los errores
			req.flash(
				"error",
				errores.errors.map((error) => error.msg)
			);

			return res.render("nueva-vacante", {
				nombrePagina: "Nueva Vacante",
				tagline: "Llena el formulario y publica tu vacante",
				cerrarSesion: true,
				nombre: req.user.nombre,
				mensajes: req.flash(),
			});
		}

		next();
	},
];

exports.validarUsuarios = [
	body("nombre", "El nombre es obligatorio").notEmpty().trim().escape(),
	body("email")
		.notEmpty()
		.withMessage("El email es obligatorio")
		.normalizeEmail()
		.isEmail()
		.withMessage("No es un email válido"),
	body("email").custom(async (value) => {
		const usuario = await Usuarios.findOne({ email: value });
		if (usuario) {
			return Promise.reject("Ese correo ya esta registrado");
		}
	}),
	body("password", "El password es obligatorio").notEmpty(),
	body("confirmar", "Confirmar password es obligatorio").notEmpty(),
	body("confirmar").custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("El password de confirmacion es diferente");
		}

		// Indicates the success of this synchronous custom validator
		return true;
	}),
	function (req, res, next) {
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			// Recargar la vista con los errores
			req.flash(
				"error",
				errores.errors.map((error) => error.msg)
			);

			return res.render("crear-cuenta", {
				nombrePagina: "Crea tu cuenta en DevJobs",
				tagline:
					"Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
				mensajes: req.flash(),
			});
		}

		next();
	},
];

exports.validarPerfil = [
	body("nombre", "El nombre no puede ir vacío").notEmpty().trim().escape(),
	body("email")
		.notEmpty()
		.withMessage("El email no puede ir vacío")
		.normalizeEmail()
		.isEmail()
		.withMessage("No es un email válido"),
	body("password").optional().escape(),
	function (req, res, next) {
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			// Recargar la vista con los errores
			req.flash(
				"error",
				errores.errors.map((error) => error.msg)
			);

			return res.render("editar-perfil", {
				nombrePagina: "Edita tu Perfil en DevJobs",
				usuario: req.user,
				cerrarSesion: true,
				nombre: req.user.nombre,
				imagen: req.user.imagen,
				mensajes: req.flash(),
			});
		}

		next();
	},
];

// Opciones de Multer
const configuracionMulterPerfiles = {
	limits: { fileSize: 100000 },
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, __dirname + "../../public/uploads/perfiles");
		},
		filename: (req, file, cb) => {
			const extension = file.mimetype.split("/")[1];
			cb(null, `${shortid.generate()}.${extension}`);
		},
	}),
	fileFilter(req, file, cb) {
		if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
			// El callback se ejecuta como true o false: true cuando la imagen se acepta
			cb(null, true);
		} else {
			cb(new Error("Formato no válido"), false);
		}
	},
};

const upload = multer(configuracionMulterPerfiles).single("imagen");

exports.subirImagen = (req, res, next) => {
	upload(req, res, function (error) {
		if (error) {
			if (error instanceof multer.MulterError) {
				if (error.code === "LIMIT_FILE_SIZE") {
					req.flash("error", "El archivo es muy grande: Máximo 100Kb");
				} else {
					req.flash("error", error.message);
				}
			} else {
				req.flash("error", error.message);
			}
			return res.redirect("/administracion");
		} else {
			return next();
		}
	});
};

const configuracionMulterCV = {
	limits: { fileSize: 1000000 },
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, __dirname + "../../public/uploads/cv");
		},
		filename: (req, file, cb) => {
			const extension = file.mimetype.split("/")[1];
			cb(null, `${shortid.generate()}.${extension}`);
		},
	}),
	fileFilter(req, file, cb) {
		if (file.mimetype === "application/pdf") {
			// El callback se ejecuta como true o false: true cuando la imagen se acepta
			cb(null, true);
		} else {
			cb(new Error("Formato no válido"), false);
		}
	},
};

const uploadCV = multer(configuracionMulterCV).single("cv");

exports.subirCV = (req, res, next) => {
	uploadCV(req, res, function (error) {
		if (error) {
			if (error instanceof multer.MulterError) {
				if (error.code === "LIMIT_FILE_SIZE") {
					req.flash("error", "El archivo es muy grande: Máximo 1Mb");
				} else {
					req.flash("error", error.message);
				}
			} else {
				req.flash("error", error.message);
			}
			return res.redirect("back");
		} else {
			return next();
		}
	});
}
