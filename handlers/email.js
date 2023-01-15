const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const util = require("util");
require('dotenv').config({ path: '.env' });

const transport = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

// utilizar templates de handlebars
transport.use('compile', hbs({
	viewEngine: {
		extName: '.handlebars',
		// partialsDir: __dirname + '/../views/emails', 
		layoutsDir: __dirname + '/../views/layouts',
		defaultLayout: 'layout.handlebars',
	},
	viewPath: __dirname + '/../views/emails',
	extName: '.handlebars',
}));

exports.enviar = async (opciones) => {
	const opcionesEmail = {
		from: "devJobs <no-reply@devjobs.com>",
		to: opciones.usuario.email,
		subject: opciones.subject,
		template: opciones.archivo,
		context: {
			resetUrl: opciones.resetUrl
		}
	};

	const enviarEmail = util.promisify(transport.sendMail, transport);
	return enviarEmail.call(transport, opcionesEmail);
};
