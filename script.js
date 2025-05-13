// Datos de campamentos por año
const datosCampamentos = [
    { año: 2013, campamentos: 691, mensaje: "acá vivo y estos son mis vecinos" },
    { año: 2014, campamentos: 681, mensaje: ""},
    { año: 2015, campamentos: 693, mensaje: ""},
    { año: 2016, campamentos: 660, mensaje: "" },
    { año: 2017, campamentos: 702, mensaje: "" },
    { año: 2018, campamentos: 741, mensaje: "" },
    { año: 2019, campamentos: 802, mensaje: "" },
    { año: 2020, campamentos: 969, mensaje: "En este último tiempo ha llegado mucha gente nueva al campamento, esto está muy relacionado a que hay una pandemia y la tasa de desempleo ha aumetado" },
    { año: 2021, campamentos: 969, mensaje: "" },
    { año: 2022, campamentos: 1290, mensaje: "" },
    { año: 2023, campamentos: 1290, mensaje: "" },
    { año: 2024, campamentos: 1428, mensaje: "Actualmente han llegado nuevos vecinos y se han ido otros. Yo ya llevo mucho tiempo en este campamento y no sé cuanto timepo seguiré acá" }
];

// Función para generar puntos aleatorios dentro del cuadrado
function generarPuntos(cantidad) {
    const cuadrado = document.getElementById("cuadrado-campamentos");
    const ancho = cuadrado.offsetWidth;
    const alto = cuadrado.offsetHeight;

    cuadrado.innerHTML = ""; // Limpiar puntos previos

    // Generar los puntos aleatorios
    for (let i = 0; i < cantidad; i++) {
        const punto = document.createElement("div");
        punto.classList.add("punto");

        const x = Math.random() * (ancho - 10);
        const y = Math.random() * (alto - 10);

        punto.style.left = `${x}px`;
        punto.style.top = `${y}px`;

        cuadrado.appendChild(punto); // Añadir punto al contenedor
    }
}

// Función principal para iniciar la experiencia
function iniciarExperiencia() {
    document.querySelector('.pantalla-inicial').style.display = 'none';
    document.getElementById('cuadrado-campamentos').style.display = 'block';
    document.getElementById('texto-dinamico-globo').style.display = 'block';
    document.getElementById('controls-container').style.display = 'flex';
    document.getElementById('ano-label').style.display = 'block';
    document.getElementById('ano-value').style.display = 'block';
    actualizarAño(); // Llamar la función para cargar los puntos del primer año
}

// Función para actualizar los puntos según el año seleccionado
function actualizarAño() {
    const index = document.getElementById("ano-slider").value;
    const { año, campamentos, mensaje } = datosCampamentos[index];

    generarPuntos(campamentos);
    document.getElementById("ano-value").textContent = año;

    const textoGlobo = document.getElementById("texto-dinamico-globo");

    // Si hay un mensaje definido, lo mostramos. Si no, usamos mensaje por defecto.
    if (mensaje && mensaje.trim() !== "") {
        textoGlobo.innerHTML = mensaje;
    } else {
        textoGlobo.innerHTML = `Estamos en el año ${año}.`;
    }
}


// Inicialización
window.onload = () => {
    mostrarSiguienteTexto(); // Comienza el texto dinámico
    // Añadir el evento al slider para actualizar el año
    document.getElementById("ano-slider").addEventListener("input", actualizarAño);
};

// Textos para la experiencia interactiva
const textos = [
    "Hola, bienvenido a nuestro recorrido.",
    "Aquí aprenderás sobre los campamentos en Chile.",
    "Haz clic para comenzar la experiencia interactiva."
];

let indiceTexto = 0;
let indiceLetra = 0;
let intervalo;
const contenedorTexto = document.getElementById("texto-dinamico-globo");

// Función para escribir el texto dinámico
function escribirTexto() {
    const textoActual = textos[indiceTexto];
    if (indiceLetra < textoActual.length) {
        contenedorTexto.innerHTML += textoActual.charAt(indiceLetra);
        indiceLetra++;
    } else {
        clearInterval(intervalo); // Detenemos la escritura
        contenedorTexto.style.cursor = 'pointer'; // Cambiamos el cursor para indicar que se puede hacer clic
        contenedorTexto.addEventListener('click', avanzarTexto); // Escuchamos el clic para avanzar
    }
}

// Función para avanzar al siguiente texto
function avanzarTexto() {
    contenedorTexto.removeEventListener('click', avanzarTexto); // Quitamos el listener después del clic

    if (indiceTexto < textos.length - 1) {
        indiceTexto++;
        indiceLetra = 0;
        contenedorTexto.innerHTML = "";
        intervalo = setInterval(escribirTexto, 100); // Reanudar el intervalo para escribir el siguiente texto
    } else {
        iniciarExperiencia(); // Comienza la experiencia al terminar los textos
    }
}

// Inicializamos la escritura del primer texto
intervalo = setInterval(escribirTexto, 100);

// Función para iniciar el proceso de escritura del texto
function mostrarSiguienteTexto() {
    escribirTexto();
}
