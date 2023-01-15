const mongoose = require("mongoose");
require("./config/db");

const express = require("express");
const app = express();
const path = require("path");
const { engine } = require("express-handlebars");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const createError = require("http-errors");
const passport = require("./config/passport");

require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handlebars
app.engine(
	"handlebars",
	engine({
		defaultLayout: "layout",
		helpers: require("./helpers/handlebars"),
		runtimeOptions: {
			allowProtoPropertiesByDefault: true,
			allowProtoMethodsByDefault: true,
		},
	})
);
app.set("view engine", "handlebars");
app.set("views", "./views");

// Static folder
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(
	session({
		secret: process.env.SECRETO,
		key: process.env.KEY,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
	})
);

// inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Alertas y flash messages
app.use(flash());

// Crear nuestro middleware
app.use((req, res, next) => {
	res.locals.mensajes = req.flash();
	next();
});

app.use("/", router);

// 404 pagina no existente
app.use((req, res, next) => {
	next(createError(404, "No Encontrado"));
});

// Administracion de los errores
app.use((error, req, res) => {
	res.locals.mensaje = error.message;
	const status = error.status || 500;
	res.locals.status = status;
	res.status(status);
	res.render("error");
})

// Dejar que Heroku asigne el puerto
const host = '0.0.0.0';
const port = process.env.PORT;

app.listen(port, host, () => {
	console.log(
		`El servidor esta funcionando en el puerto ${process.env.PORT}`
	);
});
