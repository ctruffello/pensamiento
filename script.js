const textos = [
    "Hola, bienvenido a nuestro recorrido.",
    "Aquí aprenderás sobre los campamentos en Chile.",
    "Haz clic para continuar con la experiencia interactiva."
];

let indiceTexto = 0;
let indiceLetra = 0;
let intervalo;
const contenedorTexto = document.getElementById("texto-dinamico");

function escribirTexto() {
    const textoActual = textos[indiceTexto];
    if (indiceLetra < textoActual.length) {
        contenedorTexto.innerHTML += textoActual.charAt(indiceLetra);
        indiceLetra++;
    } else {
        clearInterval(intervalo);
    }
}

function mostrarSiguienteTexto() {
    if (indiceTexto < textos.length) {
        contenedorTexto.innerHTML = "";
        indiceLetra = 0;
        intervalo = setInterval(escribirTexto, 40);
        indiceTexto++;
    }
}
  
// Iniciar automáticamente el primer texto al cargar
window.onload = () => {
    mostrarSiguienteTexto();
};
