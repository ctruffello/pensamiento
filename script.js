import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

///////////////////////////////////////////////// Datos de campamentos por año, cantidad de familias
const datosCampamentos = [
    { año: 2013, familias: 691, espera: 17330},
    { año: 2014, familias: 681, espera: 16953},
    { año: 2015, familias: 693, espera: 20567},
    { año: 2016, familias: 660, espera: 22135},
    { año: 2017, familias: 702, espera: 23146},
    { año: 2018, familias: 741, espera: 24552},
    { año: 2019, familias: 802, espera: 26862},
    { año: 2020, familias: 969, espera: 46613},
    { año: 2021, familias: 969, espera: 55817},
    { año: 2022, familias: 1290, espera: 65022},
    { año: 2023, familias: 1290, espera: 66933},
    { año: 2024, familias: 1428, espera: 68845}
];

///////////////////////////////////////////////////// Datos de familias por año
const familiasPorAño = [
    30353, 29693, 36023, 38770, 40541, 43003, 47050, 81643, 97765, 113887, 117235, 120584
];


const divisor = 70;
const espaciador = 20;
const anchoPantalla = window.innerWidth;
const altoPantalla = window.innerHeight+25; //revisar bien
///////////////////////////////////// Posiciones de las casas por año
let posCasas = [];
            
const slider = document.getElementById("ano-slider");
const flechaIzquierda = document.getElementById("flecha-izquierda");
const flechaDerecha = document.getElementById("flecha-derecha");
let añoPrev = 0;
let añoAct = 0;
let indiceLetra = 0;



//////////////////////////////// Promedio de años de espera (en años)
const promedioAnosEspera = 11;

function permutar(array) {
    var i = array.length,
        j = 0,
        temp;
    while (i--) {
        j = Math.floor(Math.random() * (i+1));

        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

//////////////////// Genera el número al azar (lo hice porque estaba muy repetido)
function azarPosicion(rango, espaciado) {
    return Math.floor(Math.random() * (rango + 1) / espaciado);
}


///////////////////////////////////// Genera las coordenadas de todas las casas
function generaPosCasas() {
    const area1 = document.getElementById("espera-acumulada").getBoundingClientRect();
   // const area2 = document.getElementById("controls-container").getBoundingClientRect();


    let coords = [];
    for (let i = 0; i<(familiasPorAño[1]/divisor);i++){
        const x = azarPosicion(anchoPantalla, espaciador); // Restar el ancho aproximado de la imagen
        const y = azarPosicion(altoPantalla, espaciador);
        coords.push([x,y])
    }
    posCasas.push(coords.map(x=>x));
    for (let i = coords.length; i<familiasPorAño[0]/divisor;i++){
        const x = azarPosicion(anchoPantalla, espaciador); // Restar el ancho aproximado de la imagen
        const y = azarPosicion(altoPantalla, espaciador);
        coords.push([x,y])
    }
    posCasas.unshift(coords.map(x=>x));
    for (let ind = 2; ind<familiasPorAño.length;ind++){
        for (let i = coords.length; i<familiasPorAño[ind]/divisor;i++){
            const x = azarPosicion(anchoPantalla, espaciador); // Restar el ancho aproximado de la imagen
            const y = azarPosicion(altoPantalla, espaciador);
            coords.push([x,y])
        }
        posCasas.push(coords.map(x=>x));
    }
    for (let i = 0; i < posCasas[posCasas.length-1].length; i++) {
        const element = posCasas[posCasas.length-1][i];
        while ((area1.left+15)<element[0] && element[0]<(area1.right-15) && area1.bottom+15>element[1]) {
            element[0] = azarPosicion(anchoPantalla, espaciador); // Restar el ancho aproximado de la imagen
            element[1] = azarPosicion(altoPantalla, espaciador);
        }
    //LO COMENTE pq falta agergar el grafico, cuando añadamos el grafico habria que hacer una area 2 del grafico
      //  while ((area2.left+15)<element[0] && element[0]<(area2.right-15) && area2.top-40<element[1]) {
        //    element[0] = azarPosicion(ancho, espaciador); // Restar el ancho aproximado de la imagen
          //  element[1] = azarPosicion(alto, espaciador);
        //}
    }
}
function generarPosCasas() {
    for (let i = 0; i < Math.floor(altoPantalla/espaciador); i++) {
        for (let j = 0; j < Math.floor(anchoPantalla/espaciador); j++) {
            posCasas.push([j * espaciador, i * espaciador]);
        }    
    }
    posCasas = permutar(posCasas);
    let i = 0;
    for (let espera = Math.floor(datosCampamentos[1]["espera"]/divisor); espera >= 0; espera--) {
            const element = posCasas[i];
            element.push(0);
            i++;
    }
    while (i < Math.floor(familiasPorAño[0]/divisor)) {
        const element = posCasas[i];
        element.push(100);
        i++;
    }
    for (let ind = 2; ind < familiasPorAño.length; ind++) {
        for (let espera = Math.floor((datosCampamentos[ind]["espera"]-datosCampamentos[ind-1]["espera"])/divisor); espera >= 0; espera--) {
            console.log(i,Math.floor(familiasPorAño[ind]/divisor),posCasas);
            const element = posCasas[i];
            element.push(ind);
            i++;
        }
        console.log(i,Math.floor(familiasPorAño[ind]/divisor));
        while (i < Math.floor(familiasPorAño[ind]/divisor)) {
            const element = posCasas[i];
            element.push(100);
            i++;
        }
        console.log(i,Math.floor(familiasPorAño[ind]/divisor));
    }
}


flechaIzquierda.addEventListener("click", () => {
    if (parseInt(slider.value) > parseInt(slider.min)) {
        slider.value = parseInt(slider.value) - 1;
        actualizarAño(); // misma función que el slider usa
    }
});

flechaDerecha.addEventListener("click", () => {
    if (parseInt(slider.value) < parseInt(slider.max)) {
        slider.value = parseInt(slider.value) + 1;
        actualizarAño(); // igual
    }
});


//////////////////////////// Función para actualizar el contador de espera
function actualizarContador() {
    const slider = document.getElementById("ano-slider");
    const ano = parseInt(slider.value);
    
    // Busca el año correspondiente en datosCampamentos
    const datos = datosCampamentos.find(d => d.año === 2013 + ano);

    // Si se encuentra, se actualiza el texto con el valor de espera
    if (datos) {
        document.getElementById("contador-espera").textContent = datos.espera.toLocaleString();
    } else {
        document.getElementById("contador-espera").textContent = "No disponible";
    }
}


///////////////////////// Función para generar puntos aleatorios
function generarPuntos(ind) {
    const cuadrado = document.getElementById("cuadrado-campamentos");
    const ancho = cuadrado.offsetWidth;
    const alto = cuadrado.offsetHeight;
    cuadrado.replaceChildren(); // Limpiar
    for (let i = 0; i < familiasPorAño[ind]/divisor; i++) {
        const element = posCasas[i];
        const contenedor = document.createElement("div");
        contenedor.classList.add("punto-contenedor");

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "50");
        svg.setAttribute("height", "50");
        svg.classList.add("imagen-punto", `color-${(ind - element[2]) * (element[2] != 100) + 100 * (element[2] == 100)}`)

        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttribute("href", "#casa");

        svg.appendChild(use);


        //const img = document.createElement("img");
        //img.src = "img/casita.png";
        //img.classList.add("imagen-punto");
        //img.classList.add(`color-${(ind - element[2]) * (element[2] != 100) + 100 * (element[2] == 100)}`);

            // Posicionamiento aleatorio
        const x = element[0]; // Restar el ancho aproximado de la imagen
        const y = element[1]; // Restar el alto aproximado de la imagen

        contenedor.style.position = "absolute";
        contenedor.style.left = `${x}px`;
        contenedor.style.top = `${y}px`;
        contenedor.style.width = "80px"; // Ajustar según tamaño de tu imagen
        contenedor.style.height = "80px"; // Ajustar según tamaño de tu imagen

        contenedor.appendChild(svg);
        cuadrado.appendChild(contenedor);
        
    }   
    console.log(document.getElementById("cuadrado-campamentos").innerHTML);
}


//////////////////////// Función para actualizar el año y mensaje
function actualizarAño() {
    const index = parseInt(document.getElementById("ano-slider").value);
    const { año, familias } = datosCampamentos[index];
    const familias_situacion_campamento = familiasPorAño[index];
    añoPrev = añoAct;
    añoAct = index;
    document.getElementById("ano-value").innerHTML = `
        <div class="valor-ano"> ${año} </div> 
        <span class="texto-ano">Cantidad de familias en situación de campamento: ${familias_situacion_campamento} </span><br>
        <div class="equivalencia">
            <img src="img/casa.svg" class="icono-equivalencia">

            <span> = ${divisor} familias</span>
        </div>
        `;
   // generarPuntos(Math.round(familias / 1.5));
    generarPuntos(index);
    //document.getElementById("ano-value").textContent = año;


    actualizarContador(); // también actualizar contador al mover el año
}

//////////////////////// Función para mostrar el valor del año en el slider
function actualizarValorSlider() {
    const slider = document.getElementById("ano-slider");
    document.getElementById("ano-value").textContent = 2013 + parseInt(slider.value);
}

//////////////////////// Función para iniciar la experiencia
function iniciarExperiencia() {
    // Ocultar el texto introductorio
    document.getElementById('seccion-inicial').style.display = 'none';
    
    // Mostrar elementos necesarios  CAMBIARRRR
    document.getElementById('cuadrado-campamentos').style.display = 'block';
    document.getElementById('flecha-izquierda').style.display = 'flex';
    document.getElementById('flecha-derecha').style.display = 'flex';
    document.getElementById('ano-value').style.display = 'block';
    document.getElementById("espera-acumulada").style.display = "block";
    
    // Asegurar dimensiones del contenedor
    const cuadrado = document.getElementById("cuadrado-campamentos");
    cuadrado.style.width = "100%";
    cuadrado.style.height = "100vh";
    cuadrado.style.position = "absolute";
    cuadrado.style.top = "0";
    cuadrado.style.left = "0";
    
    
    actualizarAño();
}
/////////////////////////// Textos de bienvenida
const textos = [
    "Entre los años 2017 y 2024, según el Censo, la población nacional aumentó en un 5,2%",
    "Sin embargo, el número de familias en campamentos creció un 196% durante el mismo periodo",
    "Mientras tanto, estas familias esperan para obtener una solución habitacional definitiva en promedio 10, 15 o 17 años."
];

let indiceTexto = 0;
let intervalo;
let pulsar = false;
const textoIntro = document.getElementById("intro-texto");
// Textos de introducción por pasos



function escribirTexto() {
    const textoActual = textos[indiceTexto];
    textoIntro.innerHTML = "";
    indiceLetra = 0;
    let intervalo = setInterval(() => {
        textoIntro.innerHTML += textoActual.charAt(indiceLetra);
        indiceLetra++;
        if (indiceLetra >= textoActual.length) {
            pulsar = true;
            aparecerContinuar();
            clearInterval(intervalo);
        }
    }, 50);

}

function aparecerContinuar() {
    let i = 1;
    let avanzar = document.getElementById("avanzar-texto");
    document.getElementById("avanzar-texto").style.transition = "opacity 850ms";
    let pulsacion = setInterval(() => {
        avanzar.style.opacity = Math.floor(i / 26) % 2;
        if (!pulsar) {
            avanzar.style.opacity = 0;
            clearInterval(pulsacion);
        }
        i++;
    }, 50);
}

function avanzarTexto() {
    clearInterval(intervalo); // ⛔ Detiene la escritura actual

    if (indiceLetra < textos[indiceTexto].length) {
        // 🟡 Si el texto aún no estaba completo, lo completa inmediatamente
        textoIntro.innerHTML = textos[indiceTexto];
        indiceLetra = textos[indiceTexto].length;
        pulsar = true;
        aparecerContinuar();
        
    } else if (indiceTexto < textos.length - 1) {
        // ✅ Pasa al siguiente texto
        document.getElementById("avanzar-texto").style.transition = "none";
        pulsar = false
        indiceTexto++;
        escribirTexto();
    } else {
        // ✅ Comienza la experiencia si era el último texto
        document.getElementById("avanzar-texto").style.transition = "none";
        pulsar = false
        iniciarExperiencia();
    }
}



////////////////////// Inicialización
window.onload = () => {
    escribirTexto();
    generarPosCasas();
    const slider = document.getElementById("ano-slider");
    slider.addEventListener("input", actualizarAño); // esta línea es clave
    textoIntro.addEventListener("click", avanzarTexto);
};
