/* agarrar elementos del html */

const canvas =
    document.getElementById(
        "nonogramaCanvas"
    );

const ctx =
    canvas.getContext("2d");

const menuPrincipal =
    document.getElementById(
        "menu-principal"
    );

const pantallaJuego =
    document.getElementById(
        "pantalla-juego"
    );

const pantallaReglas =
    document.getElementById(
        "pantalla-reglas"
    );

const textoHighscore =
    document.getElementById(
        "highscore"
    );

const textoHighscoreFacil =
    document.getElementById(
        "highscore-facil"
    );

const textoHighscoreIntermedio =
    document.getElementById(
        "highscore-intermedio"
    );

const textoHighscoreDificil =
    document.getElementById(
        "highscore-dificil"
    );

const textoTamanio =
    document.getElementById(
        "tamanio-tablero"
    );

/* variables principales del juego */

let filas = 15;
let columnas = 15;

let solucion = [];
let tablero = [];

let pistasFilas = [];
let pistasColumnas = [];

let juegoIniciado = false;
let juegoTerminado = false;

let dificultadActual = "facil";

let mouseDown = false;
let modo = "rellenar";

let tiempoInicio = Date.now();

let ultimaFila = -1;
let ultimaColumna = -1;

let celda = 20;

const paddingCanvas = 30;

const margenIzq = 130;
const margenTop = 130;

/* aqui van todos los niveles */

const niveles = {

    facil: {
        filas: 13,
        columnas: 14,
        solucion: [

            [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
            [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0]

        ]
    },

    intermedio: {
        filas: 28,
        columnas: 20,
        solucion: [

            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]

        ]
    },

    dificil: {
        filas: 33,
        columnas: 33,
        solucion: [

            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
            [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0],
            [0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0]

        ]
    }


};

/* iniciar partida y cargar dificultad */

function iniciarJuego(dificultad) {

    dificultadActual = dificultad;

    juegoIniciado = true;
    juegoTerminado = false;

    menuPrincipal.style.display = "none";
    pantallaReglas.style.display = "none";
    pantallaJuego.style.display = "flex";

    const nivel = niveles[dificultad];

    filas = nivel.filas;
    columnas = nivel.columnas;

    solucion = nivel.solucion;

    tablero = Array.from(
        { length: filas },
        () => Array(columnas).fill(0)
    );

    pistasFilas =
        solucion.map(
            fila => generarPistas(fila)
        );

    pistasColumnas =
        Array.from(
            { length: columnas },
            (_, c) =>
                generarPistas(
                    solucion.map(
                        fila => fila[c]
                    )
                )
        );

    /* ajustar tamaño dependiendo del tablero */

    if (columnas >= 30) {

        celda = 18;

    } else if (columnas >= 20) {

        celda = 24;

    } else {

        celda = 32;
    }

    canvas.width =
        margenIzq +
        columnas * celda +
        paddingCanvas;

    canvas.height =
        margenTop +
        filas * celda +
        paddingCanvas;

    tiempoInicio = Date.now();

    textoTamanio.textContent =
        `Tamaño: ${filas} x ${columnas}`;

    mostrarHighscore();

    dibujar();
}

/* mostrar pantalla de reglas */

function mostrarReglas() {

    menuPrincipal.style.display = "none";
    pantallaReglas.style.display = "flex";
}

/* regresar al menu principal */

function volverMenu() {

    pantallaJuego.style.display = "none";
    pantallaReglas.style.display = "none";
    menuPrincipal.style.display = "flex";

    juegoIniciado = false;
}

/* generar pistas de filas y columnas */

function generarPistas(linea) {

    let grupos = [];
    let contador = 0;

    for (let valor of linea) {

        if (valor === 1) {

            contador++;

        } else {

            if (contador > 0) {

                grupos.push(contador);
                contador = 0;
            }
        }
    }

    if (contador > 0) {

        grupos.push(contador);
    }

    return grupos.length
        ? grupos
        : [0];
}

/* sacar pistas que lleva el jugador */

function obtenerPistasJugador(linea) {

    let grupos = [];
    let contador = 0;

    for (let valor of linea) {

        if (valor === 1) {

            contador++;

        } else {

            if (contador > 0) {

                grupos.push(contador);
                contador = 0;
            }
        }
    }

    if (contador > 0) {

        grupos.push(contador);
    }

    return grupos.length > 0
        ? grupos
        : [0];
}

/* poner x automaticas cuando una linea ya esta bien */

function completarLineasTerminadas() {

    for (let f = 0; f < filas; f++) {

        for (let c = 0; c < columnas; c++) {

            if (tablero[f][c] === 4) {

                tablero[f][c] = 0;
            }
        }
    }

    /* revisar filas */

    for (let f = 0; f < filas; f++) {

        let correcta = true;

        for (let c = 0; c < columnas; c++) {

            if (
                solucion[f][c] === 1 &&
                tablero[f][c] !== 1
            ) {

                correcta = false;
            }

            if (
                solucion[f][c] === 0 &&
                tablero[f][c] === 1
            ) {

                correcta = false;
            }
        }

        if (correcta) {

            for (let c = 0; c < columnas; c++) {

                if (tablero[f][c] === 0) {

                    tablero[f][c] = 4;
                }
            }
        }
    }

    /* revisar columnas */

    for (let c = 0; c < columnas; c++) {

        let correcta = true;

        for (let f = 0; f < filas; f++) {

            if (
                solucion[f][c] === 1 &&
                tablero[f][c] !== 1
            ) {

                correcta = false;
            }

            if (
                solucion[f][c] === 0 &&
                tablero[f][c] === 1
            ) {

                correcta = false;
            }
        }

        if (correcta) {

            for (let f = 0; f < filas; f++) {

                if (tablero[f][c] === 0) {

                    tablero[f][c] = 4;
                }
            }
        }
    }
}

/* dibujar tablero completo */

function dibujar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (let f = 0; f < filas; f++) {

        for (let c = 0; c < columnas; c++) {

            const x =
                margenIzq + c * celda;

            const y =
                margenTop + f * celda;

            ctx.fillStyle = "#111";

            ctx.fillRect(
                x,
                y,
                celda,
                celda
            );

            /* cuadros rellenos */

            if (tablero[f][c] === 1) {

                ctx.fillStyle = "white";

                ctx.fillRect(
                    x + 2,
                    y + 2,
                    celda - 4,
                    celda - 4
                );
            }

            /* dibujar x */

            if (
                tablero[f][c] === 2 ||
                tablero[f][c] === 4
            ) {

                ctx.strokeStyle =
                    tablero[f][c] === 4
                        ? "#666"
                        : "#999";

                ctx.lineWidth = 2;

                ctx.beginPath();

                ctx.moveTo(
                    x + 4,
                    y + 4
                );

                ctx.lineTo(
                    x + celda - 4,
                    y + celda - 4
                );

                ctx.moveTo(
                    x + celda - 4,
                    y + 4
                );

                ctx.lineTo(
                    x + 4,
                    y + celda - 4
                );

                ctx.stroke();

                ctx.lineWidth = 1;
            }

            /* errores en rojo */

            if (tablero[f][c] === 3) {

                ctx.fillStyle =
                    "rgba(255,0,0,.5)";

                ctx.fillRect(
                    x,
                    y,
                    celda,
                    celda
                );
            }

            ctx.strokeStyle = "#444";

            ctx.strokeRect(
                x,
                y,
                celda,
                celda
            );
        }
    }

    dibujarPistas();
}

/* dibujar numeros de pistas */

function dibujarPistas() {

    ctx.font = "14px Arial";

    /* detectar cuales pistas ya estan completas */

    function obtenerEstadosPistas(
        lineaJugador,
        pistas
    ) {

        let estados =
            Array(pistas.length).fill(false);

        let grupos = [];

        let inicio = -1;
        let longitud = 0;

        for (let i = 0; i <= lineaJugador.length; i++) {

            if (lineaJugador[i] === 1) {

                if (inicio === -1) {

                    inicio = i;
                }

                longitud++;

            } else {

                if (longitud > 0) {

                    grupos.push({
                        inicio,
                        fin: i - 1,
                        longitud
                    });

                    inicio = -1;
                    longitud = 0;
                }
            }
        }

        for (let g = 0; g < grupos.length; g++) {

            const grupo = grupos[g];

            const izquierda =
                grupo.inicio === 0
                    ? "BORDE"
                    : lineaJugador[grupo.inicio - 1];

            const derecha =
                grupo.fin === lineaJugador.length - 1
                    ? "BORDE"
                    : lineaJugador[grupo.fin + 1];

            const delimitadoIzq =
                izquierda === "BORDE" ||
                izquierda === 2 ||
                izquierda === 4;

            const delimitadoDer =
                derecha === "BORDE" ||
                derecha === 2 ||
                derecha === 4;

            if (
                !delimitadoIzq ||
                !delimitadoDer
            ) {
                continue;
            }

            const conectadoABorde =

                grupo.inicio === 0 ||
                grupo.fin === lineaJugador.length - 1;

            const conectadoAX =

                izquierda === 2 ||
                izquierda === 4 ||
                derecha === 2 ||
                derecha === 4;

            if (
                !conectadoABorde &&
                !conectadoAX
            ) {
                continue;
            }

            for (let p = 0; p < pistas.length; p++) {

                if (
                    !estados[p] &&
                    pistas[p] === grupo.longitud
                ) {

                    estados[p] = true;
                    break;
                }
            }
        }

        return estados;
    }

    /* dibujar pistas de filas */

    pistasFilas.forEach(
        (pistas, fila) => {

            const lineaJugador =
                tablero[fila];

            const estados =
                obtenerEstadosPistas(
                    lineaJugador,
                    pistas
                );

            pistas.forEach(
                (num, i) => {

                    const x =
                        margenIzq -
                        ((pistas.length - i) * 20);

                    const y =
                        margenTop +
                        fila * celda +
                        celda / 2;

                    ctx.fillStyle =
                        estados[i]
                            ? "#777"
                            : "white";

                    ctx.fillText(
                        num,
                        x,
                        y
                    );

                    /* tachar pista completa */

                    if (estados[i]) {

                        ctx.strokeStyle = "#777";

                        ctx.lineWidth = 2;

                        ctx.beginPath();

                        ctx.moveTo(
                            x - 2,
                            y - 6
                        );

                        ctx.lineTo(
                            x + 12,
                            y - 6
                        );

                        ctx.stroke();
                    }
                });
        });

    /* dibujar pistas de columnas */

    pistasColumnas.forEach(
        (pistas, col) => {

            const lineaJugador =
                tablero.map(
                    fila => fila[col]
                );

            const estados =
                obtenerEstadosPistas(
                    lineaJugador,
                    pistas
                );

            pistas.forEach(
                (num, i) => {

                    const x =
                        margenIzq +
                        col * celda +
                        5;

                    const y =
                        margenTop -
                        ((pistas.length - i) * 18);

                    ctx.fillStyle =
                        estados[i]
                            ? "#777"
                            : "white";

                    ctx.fillText(
                        num,
                        x,
                        y
                    );

                    if (estados[i]) {

                        ctx.strokeStyle = "#777";

                        ctx.lineWidth = 2;

                        ctx.beginPath();

                        ctx.moveTo(
                            x - 2,
                            y - 6
                        );

                        ctx.lineTo(
                            x + 12,
                            y - 6
                        );

                        ctx.stroke();
                    }
                });
        });
}

/* sacar fila y columna del mouse */

function obtenerCelda(e) {

    const rect =
        canvas.getBoundingClientRect();

    const escalaX =
        canvas.width / rect.width;

    const escalaY =
        canvas.height / rect.height;

    const mouseX =
        (e.clientX - rect.left) * escalaX;

    const mouseY =
        (e.clientY - rect.top) * escalaY;

    return {

        fila: Math.floor(
            (mouseY - margenTop)
            / celda
        ),

        columna: Math.floor(
            (mouseX - margenIzq)
            / celda
        )
    };
}

/* pintar o poner x */

function pintarCelda(f, c) {

    if (
        juegoTerminado ||
        f < 0 ||
        c < 0 ||
        f >= filas ||
        c >= columnas
    ) {
        return;
    }

    /* click izquierdo */

    if (modo === "rellenar") {

        if (
            tablero[f][c] === 1
        ) {

            tablero[f][c] = 0;

        } else {

            tablero[f][c] = 1;
        }
    }

    /* click derecho */

    if (modo === "x") {

        if (
            tablero[f][c] === 2
        ) {

            tablero[f][c] = 0;

        } else {

            tablero[f][c] = 2;
        }
    }

    /* quitar rojo despues de corregir */

    if (
        tablero[f][c] === 3
    ) {

        tablero[f][c] =
            modo === "x"
                ? 2
                : 1;
    }

    completarLineasTerminadas();

    dibujar();

    verificarVictoria();
}

/* revisar errores manualmente */

function verificarTablero() {

    let errores = false;

    for (let f = 0; f < filas; f++) {

        for (let c = 0; c < columnas; c++) {

            if (
                tablero[f][c] === 1 &&
                solucion[f][c] === 0
            ) {

                tablero[f][c] = 3;
                errores = true;
            }

            if (
                tablero[f][c] === 2 &&
                solucion[f][c] === 1
            ) {

                tablero[f][c] = 3;
                errores = true;
            }
        }
    }

    dibujar();

    if (errores) {

        alert(
            "Hay errores marcados en rojo"
        );

    } else {

        alert(
            "No se encontraron errores"
        );
    }
}

/* revisar si ya gano */

function verificarVictoria() {

    for (let f = 0; f < filas; f++) {

        for (let c = 0; c < columnas; c++) {

            if (
                solucion[f][c] === 1 &&
                tablero[f][c] !== 1
            ) {
                return;
            }

            if (
                solucion[f][c] === 0 &&
                tablero[f][c] === 1
            ) {
                return;
            }
        }
    }

    juegoTerminado = true;

    const tiempo =
        Math.floor(
            (Date.now() - tiempoInicio) / 1000
        );

    guardarHighscore(tiempo);

    alert(`¡Ganaste en ${tiempo} segundos!`);
}

/* guardar mejor tiempo */

function guardarHighscore(tiempo) {

    const key =
        `highscore-${dificultadActual}`;

    const anterior =
        localStorage.getItem(key);

    if (
        !anterior ||
        tiempo < Number(anterior)
    ) {

        localStorage.setItem(
            key,
            tiempo
        );
    }

    mostrarHighscore();
}

/* mostrar scores */

function mostrarHighscore() {

    const keyActual =
        `highscore-${dificultadActual}`;

    const scoreActual =
        localStorage.getItem(
            keyActual
        );

    textoHighscore.textContent =
        scoreActual
            ? `High Score: ${scoreActual}s`
            : "High Score: --";

    const facil =
        localStorage.getItem(
            "highscore-facil"
        );

    const intermedio =
        localStorage.getItem(
            "highscore-intermedio"
        );

    const dificil =
        localStorage.getItem(
            "highscore-dificil"
        );

    textoHighscoreFacil.textContent =
        facil
            ? `Fácil: ${facil}s`
            : "Fácil: --";

    textoHighscoreIntermedio.textContent =
        intermedio
            ? `Intermedio: ${intermedio}s`
            : "Intermedio: --";

    textoHighscoreDificil.textContent =
        dificil
            ? `Difícil: ${dificil}s`
            : "Difícil: --";
}

/* eventos del mouse y botones */

canvas.addEventListener(
    "mousedown",
    (e) => {

        if (juegoTerminado) {
            return;
        }

        mouseDown = true;

        if (window.innerWidth > 768) {

            modo =
                e.button === 2
                    ? "x"
                    : "rellenar";
        }

        const {
            fila,
            columna
        } = obtenerCelda(e);

        ultimaFila = fila;
        ultimaColumna = columna;

        pintarCelda(
            fila,
            columna
        );
    });

canvas.addEventListener(
    "mousemove",
    (e) => {

        if (!mouseDown || juegoTerminado) {
            return;
        }

        const {
            fila,
            columna
        } = obtenerCelda(e);

        if (
            fila === ultimaFila &&
            columna === ultimaColumna
        ) {
            return;
        }

        ultimaFila = fila;
        ultimaColumna = columna;

        pintarCelda(
            fila,
            columna
        );
    });

window.addEventListener(
    "mouseup",
    () => {

        mouseDown = false;

        ultimaFila = -1;
        ultimaColumna = -1;
    });

const botonRellenar =
    document.getElementById(
        "modo-rellenar"
    );

const botonX =
    document.getElementById(
        "modo-x"
    );

botonRellenar.addEventListener(
    "click",
    () => {

        modo = "rellenar";

        botonRellenar.classList.add(
            "activo"
        );

        botonX.classList.remove(
            "activo"
        );
    }
);

botonX.addEventListener(
    "click",
    () => {

        modo = "x";

        botonX.classList.add(
            "activo"
        );

        botonRellenar.classList.remove(
            "activo"
        );
    }
);

/* quitar menu del click derecho */

canvas.addEventListener(
    "contextmenu",
    (e) => {

        e.preventDefault();
    });

document
    .getElementById("verificar")
    .addEventListener(
        "click",
        verificarTablero
    );

document
    .getElementById("reiniciar")
    .addEventListener(
        "click",
        () => iniciarJuego(
            dificultadActual
        )
    );

/* confirmar antes de volver al menu */

document
    .getElementById("volver-menu")
    .addEventListener(
        "click",
        () => {

            const seguro =
                confirm(
                    "¿Seguro que quieres volver al menú? Se perderá el progreso actual."
                );

            if (seguro) {

                volverMenu();
            }
        }
    );

mostrarHighscore();