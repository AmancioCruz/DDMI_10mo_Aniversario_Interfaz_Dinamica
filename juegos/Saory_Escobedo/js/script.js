const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const botonInicio = document.getElementById("reiniciar-juego");

const textoPuntaje = document.getElementById("valor-puntaje");
const textoVida = document.getElementById("vida-jugador");

const nombresCartas = [
    "arte",
    "audio",
    "creatividad",
    "expresion",
    "hipermedia",
    "interfaz",
    "multimedia",
    "narrativa",
    "programar",
    "ux",
    "videojuegos",
    "vr"
];

const niveles = [
    {
        filas: 3,
        columnas: 4,
        pares: 6,
        vidas: 12
    },
    {
        filas: 4,
        columnas: 4,
        pares: 8,
        vidas: 16
    },
    {
        filas: 4,
        columnas: 6,
        pares: 12,
        vidas: 24
    }
];

let nivelActual = 0;

let cartas = [];

let primeraCarta = null;
let segundaCarta = null;

let bloqueo = false;

let puntaje = 0;
let paresNivel = 0;

const imagenes = {};
const mensajes = {};

function cargarImagenes(callback) {

    const nombresMensajes = [
        "nivel2",
        "nivel3",
        "pierdes",
        "ganas"
    ];

    let total =
        nombresCartas.length +
        nombresMensajes.length +
        1;

    let cargadas = 0;

    function verificar() {

        cargadas++;

        if (cargadas === total) {

            callback();
        }
    }

    const atras = new Image();
    atras.src = "recursos/cartas/atras.png";
    atras.onload = verificar;
    imagenes["atras"] = atras;

    nombresCartas.forEach(nombre => {
        const img = new Image();
        img.src =
            `recursos/cartas/${nombre}.png`;
        img.onload = verificar;
        imagenes[nombre] = img;
    });

    nombresMensajes.forEach(nombre => {
        const img = new Image();
        img.src =
            `recursos/mensajes/${nombre}.png`;
        img.onload = verificar;
        mensajes[nombre] = img;
    });
}

function iniciarJuego() {
    const nivel = niveles[nivelActual];
    cartas = [];

    primeraCarta = null;
    segundaCarta = null;

    bloqueo = false;
    vidas = nivel.vidas;
    paresNivel = 0;
    
    actualizarHUD();

    const seleccionadas =
        nombresCartas.slice(0, nivel.pares);
    let pares = [...seleccionadas, ...seleccionadas];

    mezclar(pares);

    const espacio = 20;
    const proporcion = 697 / 463;
    const anchoDisponible =
        canvas.width -
        (nivel.columnas + 1) * espacio;

    const altoDisponible =
        canvas.height -
        (nivel.filas + 1) * espacio;

    const anchoPorColumnas =
        anchoDisponible / nivel.columnas;

    const anchoPorFilas =
        (altoDisponible / nivel.filas) / proporcion;

    const anchoFinal =
        Math.min(
            anchoPorColumnas,
            anchoPorFilas
        );

    const altoFinal =
        anchoFinal * proporcion;

    const totalAncho =
        nivel.columnas * anchoFinal +
        (nivel.columnas - 1) * espacio;

    const totalAlto =
        nivel.filas * altoFinal +
        (nivel.filas - 1) * espacio;

    const inicioX =
        (canvas.width - totalAncho) / 2;

    const inicioY =
        (canvas.height - totalAlto) / 2;

    let indice = 0;

    for (let fila = 0; fila < nivel.filas; fila++) {
        for (let columna = 0; columna < nivel.columnas; columna++) {
            cartas.push({
                x:
                    inicioX +
                    columna * (anchoFinal + espacio),
                y:
                    inicioY +
                    fila * (altoFinal + espacio),
                
                    ancho: anchoFinal,
                alto: altoFinal,

                nombre: pares[indice],
                revelada: false,
                encontrada: false,
                escalaX: 1,
                animando: false
            });
            indice++;
        }
    }

    dibujar();
}

function mezclar(arreglo) {
    for (let i = arreglo.length - 1; i > 0; i--) {
        let j =
            Math.floor(
                Math.random() * (i + 1)
            );
        [arreglo[i], arreglo[j]] =
        [arreglo[j], arreglo[i]];
    }
}

function dibujar() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    
    cartas.forEach(carta => {
        ctx.save();
        const centroX =
            carta.x + carta.ancho / 2;
        ctx.translate(centroX, carta.y);
        ctx.scale(carta.escalaX, 1);

        let imagen;

        if (
            carta.revelada ||
            carta.encontrada
        ) {
            imagen = imagenes[carta.nombre];
        } else {
            imagen = imagenes["atras"];
        }

        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(
            imagen,
            -carta.ancho / 2,
            0,
            carta.ancho,
            carta.alto
        );

        ctx.restore();
    });
}

function mostrarMensaje(nombre, callback = null) {
    bloqueo = true;
    dibujar();

    const imagen = mensajes[nombre];
    ctx.fillStyle =
        "rgba(0,0,0,0.7)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const ancho =
        canvas.width * 0.55;

    const alto =
        imagen.height *
        (ancho / imagen.width);

    const x =
        (canvas.width - ancho) / 2;

    const y =
        (canvas.height - alto) / 2;

    ctx.drawImage(
        imagen,
        x,
        y,
        ancho,
        alto
    );

    setTimeout(() => {
        bloqueo = false;
        if (callback) {
            callback();
        }
    }, 2200);
}

function animarFlip(carta, revelar = true) {
    carta.animando = true;
    let progreso = 0;
    const duracion = 550;
    const inicio = performance.now();

    function animar(tiempoActual) {
        const tiempoTranscurrido =
            tiempoActual - inicio;
        progreso =
            Math.min(
                tiempoTranscurrido / duracion,
                1
            );
        const easing =
            0.5 -
            Math.cos(progreso * Math.PI) / 2;
        carta.escalaX =
            Math.abs(
                Math.cos(easing * Math.PI)
            );

        if (progreso >= 0.5) {
            carta.revelada = revelar;
        }

        dibujar();

        if (progreso < 1) {
            requestAnimationFrame(animar);
        } else {
            carta.escalaX = 1;
            carta.animando = false;
            dibujar();
        }
    }
    requestAnimationFrame(animar);
}

canvas.addEventListener("click", evento => {
    if (bloqueo) return;

    const rect =
        canvas.getBoundingClientRect();

    const mouseX =
        (evento.clientX - rect.left) *
        (canvas.width / rect.width);

    const mouseY =
        (evento.clientY - rect.top) *
        (canvas.height / rect.height);

    cartas.forEach(carta => {

        if (
            mouseX >= carta.x &&
            mouseX <= carta.x + carta.ancho &&
            mouseY >= carta.y &&
            mouseY <= carta.y + carta.alto
        ) {

            if (
                carta.revelada ||
                carta.encontrada ||
                carta.animando
            ) return;

            animarFlip(carta, true);

            if (!primeraCarta) {

                primeraCarta = carta;

            } else {

                segundaCarta = carta;

                verificarPareja();
            }
        }
    });
});

function verificarPareja() {

    bloqueo = true;

    setTimeout(() => {

        if (
            primeraCarta.nombre ===
            segundaCarta.nombre
        ) {

            primeraCarta.encontrada = true;
            segundaCarta.encontrada = true;

            puntaje++;
            paresNivel++;

            actualizarHUD();

            primeraCarta = null;
            segundaCarta = null;

            bloqueo = false;

            verificarNivel();

        } else {
            vidas--;
            actualizarHUD();

            setTimeout(() => {
                animarFlip(
                    primeraCarta,
                    false
                );
                animarFlip(
                    segundaCarta,
                    false
                );
                primeraCarta = null;
                segundaCarta = null;
                bloqueo = false;
                verificarDerrota();
            }, 700);
        }
    }, 900);
}

function verificarNivel() {
    const nivel = niveles[nivelActual];
    if (paresNivel >= nivel.pares) {
        setTimeout(() => {
            if (nivelActual === 0) {
                mostrarMensaje(
                    "nivel2",
                    () => {
                        nivelActual++;
                        iniciarJuego();
                    }
                );

            } else if (nivelActual === 1) {
                mostrarMensaje(
                    "nivel3",
                    () => {
                        nivelActual++;
                        iniciarJuego();
                    }
                );

            } else {
                mostrarMensaje("ganas");
            }
        }, 400);
    }
}

function verificarDerrota() {
    if (vidas <= 0) {
        setTimeout(() => {
            mostrarMensaje(
                "pierdes",
                () => {
                    nivelActual = 0;
                    iniciarJuego();
                }
            );
        }, 300);
    }
}

function actualizarHUD() {
    textoPuntaje.textContent = puntaje;
    textoVida.textContent = vidas;
}

botonInicio.addEventListener("click", () => {
    nivelActual = 0;
    iniciarJuego();
});

cargarImagenes(() => {
    iniciarJuego();
});