const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuarios = require("../models/Usuarios");

passport.use(
	new LocalStrategy(
		// por default passport espera un usuario y password
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email, password, done) => {
			const usuario = await Usuarios.findOne({ email });
			if (!usuario)
				return done(null, false, {
					message: "Usuario no existente",
				});

			// El usuario existe, verificar password
			const verificarPassword = usuario.compararPassword(password);
			if (!verificarPassword) {
				return done(null, false, {
					message: "Password incorrecto",
				});
			}

			// usuario existe y el password es correcto
			return done(null, usuario);
		}
	)
);

passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {
	const usuario = await Usuarios.findById(id);
	return done(null, usuario);
});

module.exports = passport;
