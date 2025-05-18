///////////////////////////////////////////////// Datos de campamentos por año
const datosCampamentos = [
    { año: 2013, familias: 691, mensaje: "acá vivo y estos son mis vecinos" },
    { año: 2014, familias: 681, mensaje: "" },
    { año: 2015, familias: 693, mensaje: "" },
    { año: 2016, familias: 660, mensaje: "" },
    { año: 2017, familias: 702, mensaje: "" },
    { año: 2018, familias: 741, mensaje: "" },
    { año: 2019, familias: 802, mensaje: "" },
    {
        año: 2020,
        familias: 969,
        mensaje: `En este último tiempo ha llegado mucha gente nueva al campamento, esto está muy relacionado a que hay una pandemia y la <span class="tooltip">tasa de desempleo<span class="tooltiptext">1000 personas sin empleo</span></span> ha aumentado`
    },
    { año: 2021, familias: 969, mensaje: "" },
    { año: 2022, familias: 1290, mensaje: "" },
    { año: 2023, familias: 1290, mensaje: "" },
    { año: 2024, familias: 1428, mensaje: "Actualmente han llegado nuevos vecinos y se han ido otros. Yo ya llevo mucho tiempo en este campamento y no sé cuanto tiempo seguiré acá" }
];

posCasas = []; // Posiciones de las casas por año

///////////////////////////////////////////////////// Datos de familias por año
const familiasPorAnyo = [
    30353, 29693, 36023, 38770, 40541, 43003, 47050,
    81643, 81643, 113887, 113887, 142482 // se añadió 2024
];

//////////////////////////////// Promedio de años de espera (en años)
const promedioAnosEspera = 11;

/////////////////////////////////////////////////////////////// Valor base inicial
const valorBaseInicial = 72.576; // Inicia años acumulados en 2013

//////////////////// Genera el número al azar (lo hice porque estaba muy repetido)
function azarPosicion(rango, espaciado) {
    return Math.floor(Math.random() * (rango - 30) / espaciado) * espaciado;
}

///////////////////////////////////// Genera las coordenadas de todas las casas
function generarPosCasas() {
    const cuadrado = document.getElementById("cuadrado-campamentos");
    const ancho = cuadrado.offsetWidth;
    const alto = cuadrado.offsetHeight;
    const area1 = document.getElementById("espera-acumulada").getBoundingClientRect();
    const area2 = document.getElementById("controls-container").getBoundingClientRect();
    let coords = [];
    const divisor = 100;
    const espaciador = 20;
    for (let i = 0; i<(familiasPorAnyo[1]/divisor);i++){
        const x = azarPosicion(ancho, espaciador); // Restar el ancho aproximado de la imagen
        const y = azarPosicion(alto, espaciador);
        coords.push([x,y])
    }
    posCasas.push(coords.map(x=>x));
    for (let i = coords.length; i<familiasPorAnyo[0]/divisor;i++){
        const x = azarPosicion(ancho, espaciador); // Restar el ancho aproximado de la imagen
        const y = azarPosicion(alto, espaciador);
        coords.push([x,y])
    }
    posCasas.unshift(coords.map(x=>x));
    for (let ind = 2; ind<familiasPorAnyo.length;ind++){
        for (let i = coords.length; i<familiasPorAnyo[ind]/divisor;i++){
            const x = azarPosicion(ancho, espaciador); // Restar el ancho aproximado de la imagen
            const y = azarPosicion(alto, espaciador);
            coords.push([x,y])
        }
        posCasas.push(coords.map(x=>x));
    }
    for (let i = 0; i < posCasas[posCasas.length-1].length; i++) {
        const element = posCasas[posCasas.length-1][i];
        while ((area1.left+15)<element[0] && element[0]<(area1.right-15) && area1.bottom+15>element[1]) {
            element[0] = azarPosicion(ancho, espaciador); // Restar el ancho aproximado de la imagen
            element[1] = azarPosicion(alto, espaciador);
        }
        while ((area2.left+15)<element[0] && element[0]<(area2.right-15) && area2.top-40<element[1]) {
            element[0] = azarPosicion(ancho, espaciador); // Restar el ancho aproximado de la imagen
            element[1] = azarPosicion(alto, espaciador);
        }
    }
    console.log(area1.bottom,area1.left,area1.right);
}

//////////////////////////// Función para actualizar el contador de espera
function actualizarContador() {
    const slider = document.getElementById("ano-slider");
    const ano = parseInt(slider.value);

    let totalAnos = valorBaseInicial;

    for (let i = 0; i <= ano; i++) {
        totalAnos += familiasPorAnyo[i] * promedioAnosEspera;
    }

    document.getElementById("contador-espera").textContent = totalAnos.toLocaleString();
}


///////////////////////// Función para generar puntos aleatorios
function generarPuntos(ind) {
    const cuadrado = document.getElementById("cuadrado-campamentos");
    const ancho = cuadrado.offsetWidth;
    const alto = cuadrado.offsetHeight;
    let indexArray = posCasas[ind];

    cuadrado.innerHTML = ""; // Limpiar
    for (let i = 0; i < indexArray.length; i++) {
        const contenedor = document.createElement("div");
        contenedor.classList.add("punto-contenedor");
        
        const img = document.createElement("img");
        img.src = "img/casita.png";
        img.classList.add("imagen-punto");

        // Posicionamiento aleatorio
        const x = indexArray[i][0]; // Restar el ancho aproximado de la imagen
        const y = indexArray[i][1]; // Restar el alto aproximado de la imagen

        contenedor.style.position = "absolute";
        contenedor.style.left = `${x}px`;
        contenedor.style.top = `${y}px`;
        contenedor.style.width = "30px"; // Ajustar según tamaño de tu imagen
        contenedor.style.height = "30px"; // Ajustar según tamaño de tu imagen

        contenedor.appendChild(img);
        cuadrado.appendChild(contenedor);
    }
}

function moverNiño() {
    const niñoContainer = document.getElementById('niño-container');
    
    // Primero hace fade out
    niñoContainer.classList.add('hidden');
    
    // Después de la animación, lo mueve y hace fade in
    setTimeout(() => {
        niñoContainer.style.left = "80%";
        niñoContainer.style.top = "50%";
        niñoContainer.style.transform = "translateY(-50%)";
        niñoContainer.classList.remove('hidden');
    }, 500);
}

//////////////////////// Función para actualizar el año y mensaje
function actualizarAño() {
    const index = parseInt(document.getElementById("ano-slider").value);
    const { año, familias, mensaje } = datosCampamentos[index];

   // generarPuntos(Math.round(familias / 1.5));
    generarPuntos(index);
    document.getElementById("ano-value").textContent = año;

    const textoGlobo = document.getElementById("texto-dinamico-globo");

    if (mensaje && mensaje.trim() !== "") {
        textoGlobo.innerHTML = mensaje;
    } else {
        textoGlobo.innerHTML = `Estamos en el año ${año}.`;
    }

    actualizarContador(); // también actualizar contador al mover el año
}

//////////////////////// Función para mostrar el valor del año en el slider
function actualizarValorSlider() {
    const slider = document.getElementById("ano-slider");
    document.getElementById("ano-value").textContent = 2013 + parseInt(slider.value);
}

//////////////////////// Función para iniciar la experiencia
function iniciarExperiencia() {
    //document.getElementById('niño-container').style.display = 'none'; //oculta al niño
    //document.querySelector('.pantalla-inicial').style.display = 'none';
    document.getElementById('cuadrado-campamentos').style.display = 'block';
    document.getElementById('texto-dinamico-globo').style.display = 'block';
    document.getElementById('controls-container').style.display = 'block';
    document.getElementById('ano-label').style.display = 'block';
    document.getElementById('ano-value').style.display = 'block';
    document.getElementById("espera-acumulada").style.display = "block";
    generarPosCasas();
    moverNiño();
    actualizarAño();
}

/////////////////////////// Textos de bienvenida
const textos = [
    "Hola, bienvenido a nuestro recorrido.",
    "Aquí aprenderás sobre los campamentos en Chile.",
    "Haz clic para comenzar la experiencia interactiva."
];

let indiceTexto = 0;
let indiceLetra = 0;
let intervalo;
const contenedorTexto = document.getElementById("texto-dinamico-globo");


function escribirTexto() {
    const textoActual = textos[indiceTexto];
    contenedorTexto.innerHTML = "";
    indiceLetra = 0;

    intervalo = setInterval(() => {
        contenedorTexto.innerHTML += textoActual.charAt(indiceLetra);
        indiceLetra++;
        if (indiceLetra >= textoActual.length) {
            clearInterval(intervalo);
        }
    }, 50);
}


function avanzarTexto() {
    clearInterval(intervalo); // ⛔ Detiene la escritura actual

    if (indiceLetra < textos[indiceTexto].length) {
        // 🟡 Si el texto aún no estaba completo, lo completa inmediatamente
        contenedorTexto.innerHTML = textos[indiceTexto];
        indiceLetra = textos[indiceTexto].length;
    } else if (indiceTexto < textos.length - 1) {
        // ✅ Pasa al siguiente texto
        indiceTexto++;
        escribirTexto();
    } else {
        // ✅ Comienza la experiencia si era el último texto
        iniciarExperiencia();
        moverNiño(); // <-- Añade esta línea
    }
}



////////////////////// Inicialización
window.onload = () => {
    escribirTexto();
    const slider = document.getElementById("ano-slider");
    slider.addEventListener("input", actualizarAño); // esta línea es clave
    contenedorTexto.addEventListener("click", avanzarTexto);
};
