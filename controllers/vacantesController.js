const mongoose = require("mongoose");
const Vacante = mongoose.model("Vacante");

exports.formularioNuevaVacante = (req, res) => {
	res.render("nueva-vacante", {
		nombrePagina: "Nueva Vacante",
		tagline: "Llena el formulario y publica tu vacante",
		cerrarSesion: true,
		nombre: req.user.nombre,
		imagen: req.user.imagen,
	});
};

exports.agregarVacante = async (req, res) => {
	const vacante = new Vacante(req.body);
	// Usuario Autor de la vacante
	vacante.autor = req.user._id;
	// Crear arreglo de habilidades (skills)
	vacante.skills = req.body.skills.split(",");
	// Almacenar en la BD
	const nuevaVacante = await vacante.save();
	res.redirect(`/vacantes/${nuevaVacante.url}`);
};

exports.mostrarVacante = async (req, res, next) => {
	const vacante = await Vacante.findOne({ url: req.params.url }).populate('autor');
	// Si no hay resultados
	if (!vacante) return next();
	res.render("vacante", {
		vacante,
		nombrePagina: vacante.titulo,
		barra: true,
	});
};

exports.formEditarVacante = async (req, res, next) => {
	const vacante = await Vacante.findOne({ url: req.params.url });
	// Si no existe la vacante
	if (!vacante) return next();
	res.render("editar-vacante", {
		vacante,
		nombrePagina: `Editar - ${vacante.titulo}`,
		tagline: "Edita tu vacante",
		cerrarSesion: true,
		nombre: req.user.nombre,
		imagen: req.user.imagen,
	});
};

exports.editarVacante = async (req, res) => {
	const vacanteActualizada = req.body;
	vacanteActualizada.skills = req.body.skills.split(",");
	const vacante = await Vacante.findOneAndUpdate(
		{ url: req.params.url },
		vacanteActualizada,
		{
			new: true,
			runValidators: true,
		}
	);
	res.redirect(`/vacantes/${vacante.url}`);
};

exports.eliminarVacante = async (req, res) => {
	const { id } = req.params;
	const vacante = await Vacante.findById(id);

	if(verificarAutor(vacante, req.user)) {
		// Todo bien, si es el usuario
		vacante.remove();
		res.status(200).send("Vacante Eliminada Correctamente");
	} else {
		// No permitido
		res.status(403).send("Error");
	}
};

const verificarAutor = (vacante = {}, usuario = {}) => {
	if(!vacante.autor.equals(usuario._id)) {
		return false;
	}
	return true;
}

exports.contactar = async (req, res, next) => {
	const vacante = await Vacante.findOne({ url: req.params.url });
	// Si no existe la vacante
	if (!vacante) return next();
	// Todo bien, construir el nuevo objeto
	const nuevoCandidato = {
		nombre: req.body.nombre,
		email: req.body.email,
		cv: req.file.filename,
	};
	// Almacenar la vacante
	vacante.candidatos.push(nuevoCandidato);
	await vacante.save();
	// Mensaje flash y redireccionar
	req.flash("correcto", "Se envió tu Curriculum Correctamente");
	res.redirect("/");
}

exports.mostrarCandidatos = async (req, res, next) => {
	const vacante = await Vacante.findById(req.params.id);
	if(vacante.autor != req.user._id.toString()) {
		return next();
	}
	if(!vacante) return next();
	
	res.render("candidatos", {
		nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
		cerrarSesion: true,
		nombre: req.user.nombre,
		imagen: req.user.imagen,
		candidatos: vacante.candidatos
	});
}

// Bucador de Vacantes
exports.buscarVacantes = async (req, res) => {
	const vacantes = await Vacante.find({
		$text: {
			$search: req.body.q
		}
	});

	// mostrar las vacantes
	res.render('home', {
		nombrePagina: `Resultados para la busqueda: ${req.body.q}`,
		barra: true,
		vacantes
	})
}
