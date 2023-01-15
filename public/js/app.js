import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", function () {
	const skills = document.querySelector(".lista-conocimientos");

	// Limpiar las alertas
	const alertas = document.querySelector(".alertas");

	if (alertas) {
		limpiarAlertas(alertas);
	}

	if (skills) {
		skills.addEventListener("click", agregarSkills);

		// una vez que estamos en editar, llamar la función
		skillsSeleccionados();
	}

	const vacantesListado = document.querySelector(".panel-administracion");

	if (vacantesListado) {
		vacantesListado.addEventListener("click", accionesListado);
	}
});

const skills = new Set();

const agregarSkills = (e) => {
	e.preventDefault();

	if (e.target.tagName === "LI") {
		if (e.target.classList.contains("activo")) {
			skills.delete(e.target.textContent);
			e.target.classList.remove("activo");
		} else {
			skills.add(e.target.textContent);
			e.target.classList.add("activo");
		}
	}

	const skillArray = [...skills];
	document.querySelector("#skills").value = skillArray;
};

const skillsSeleccionados = () => {
	const seleccionadas = Array.from(
		document.querySelectorAll(".lista-conocimientos .activo")
	);

	seleccionadas.forEach((seleccionada) => {
		skills.add(seleccionada.textContent);
	});

	// Inyectarlo en el hidden
	const skillArray = [...skills];
	document.querySelector("#skills").value = skillArray;
};

const limpiarAlertas = (alertas) => {
	const interval = setInterval(() => {
		if (alertas.children.length > 0) {
			alertas.removeChild(alertas.children[0]);
		} else if (alertas.children.length === 0) {
			alertas.parentElement.removeChild(alertas);
			clearInterval(interval);
		}
	}, 2000);
};

// Eliminar Vacantes
const accionesListado = (e) => {
	e.preventDefault();

	if (e.target.dataset.eliminar) {
		Swal.fire({
			title: "¿Confirmar Eliminación?",
			text: "Una vez eliminada no se puede recuperar",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Borrar",
			cancelButtonText: "No, Cancelar",
		}).then((result) => {
			if (result.value) {
				const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

				// Axios para eliminar
				axios
					.delete(url, { params: { url } })
					.then(function (respuesta) {
						if (respuesta.status === 200) {
							Swal.fire("Eliminado", respuesta.data, "success");

							e.target.parentElement.parentElement.parentElement.removeChild(
								e.target.parentElement.parentElement
							);
						}
					})
					.catch(() => {
						Swal.fire({
							type: "error",
							title: "Hubo un error",
							text: "No se pudo eliminar",
						});
					});
			}
		});
	} else if (e.target.tagName === "A") {
		window.location.href = e.target.href;
	}
};
