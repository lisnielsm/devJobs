module.exports = {
	seleccionarSkills: (seleccionadas = [], opciones) => {
		const skills = [
			"HTML5",
			"CSS3",
			"CSSGrid",
			"Flexbox",
			"JavaScript",
			"JQuery",
			"Node",
			"Angular",
			"VueJS",
			"ReactJS",
			"React Hooks",
			"Redux",
			"Apollo",
			"GraphQL",
			"TypeScript",
			"PHP",
			"Laravel",
			"Symfony",
			"Python",
			"Django",
			"ORM",
			"Sequealize",
			"Mongoose",
			"MVC",
			"SAAS",
			"WordPress",
		];

		let html = "";

		skills.forEach((skill) => {
			html += `
                <li ${
					seleccionadas.includes(skill) ? ' class="activo"' : ""
				}>${skill}</li>
            `;
		});

		return (opciones.fn().html = html);
	},
  tipoContrato: (seleccionado, opciones) => {
    return (opciones.fn(this).replace(
      new RegExp(` value="${seleccionado}"`),
      '$& selected="selected"'
    ));
  },
  mostrarAlertas: (errores = {}, alertas) => {
	const categoria = Object.keys(errores);
	let html = "";

	if (categoria.length > 0) {
	  errores[categoria].forEach((error) => {
		html += `
		  <div class="${categoria} alerta">
			${error}
		  </div>
		`;
	  });
	}

	return alertas.fn().html = html;
  }
};
