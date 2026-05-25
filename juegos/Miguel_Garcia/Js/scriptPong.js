//Seccion 1: Variables y objetos del juego
const canvas = document.querySelector("#lienzoPong");
const ctx = canvas.getContext("2d");
const btnIniciar = document.querySelector("#iniciar-juego");
const pantallaInicio = document.querySelector("#pantallaInicio");
const btn1P = document.querySelector("#btn-1p");
const btn2P = document.querySelector("#btn-2p");

const sonidoRebote = new Audio("Recursos/Audio/Rebote.mp3");
const sonidoVictoria = new Audio("Recursos/Audio/Ganador.mp3");

const musicaFondo = new Audio("Recursos/Audio/MusicaFondo.mp3");
musicaFondo.loop = true;
musicaFondo.volume = 0.3; // Volumen al 30% para no ser molesto

const marcadorP1 = document.querySelector("#score-p1");
const marcadorP2 = document.querySelector("#score-p2");

// Variable para saber si la IA está activa
let modoUnJugador = false;
let juegoEnMarcha = false; // Nos dirá si el juego está activo
let juegoPausado = false;  // Nos dirá si pausaron el juego

// Objetos del juego
const anchoRaqueta = 15;
const altoRaqueta = 100;

// Jugador 1 (Izquierda) 
const jugador1 = {
    x: 30,
    y: canvas.height / 2 - altoRaqueta / 2,
    ancho: anchoRaqueta,
    alto: altoRaqueta,
    color: "#2966ff", // Azul Eléctrico
    score: 0,
    dy: 5 //Velocidad de movimiento vertical de la raqueta
};

// Jugador 2 (Derecha) 
const jugador2 = {
    x: canvas.width - 30 - anchoRaqueta,
    y: canvas.height / 2 - altoRaqueta / 2,
    ancho: anchoRaqueta,
    alto: altoRaqueta,
    color: "#ee8efa", // Rosa Eléctrico
    score: 0,
    dy: 5
};

// Pelota y su velocidad
const pelota = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radio: 10,
    dx: 3, // Dirección y velocidad en X
    dy: 3, // Dirección y velocidad en Y
    color: "#ffea00"
};

// Funciones
// Función para dibujar rectángulos (raquetas)
function dibujarRectangulo(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Función para dibujar círculos (pelota)
function dibujarCirculo(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Función para dibujar la línea punteada del centro
function dibujarRed() {
    for (let i = 0; i <= canvas.height; i += 30) {
        dibujarRectangulo(canvas.width / 2 - 1, i, 2, 15, "rgba(255, 255, 255, 0.5)");
    }
}

// Función principal que pinta todo en cada frame
function renderizar() {
    // 1. Limpiamos el canvas por completo (Fondo negro)
    dibujarRectangulo(0, 0, canvas.width, canvas.height, "#000000");

    // 2. Dibujamos los elementos
    dibujarRed();
    dibujarRectangulo(jugador1.x, jugador1.y, jugador1.ancho, jugador1.alto, jugador1.color);
    dibujarRectangulo(jugador2.x, jugador2.y, jugador2.ancho, jugador2.alto, jugador2.color);
    dibujarCirculo(pelota.x, pelota.y, pelota.radio, pelota.color);
}

// Función para el Jugador 2 de IA
function moverIA() {
    if (modoUnJugador) {
        // Calculamos dónde está el centro de la raqueta de la IA
        const centroRaqueta = jugador2.y + jugador2.alto / 2;

        // Si la pelota está por debajo del centro, la raqueta baja
        if (centroRaqueta < pelota.y - 10) {
            // Multiplicamos por 0.85 para que la IA sea un poco más lenta que el jugador y se le pueda ganar
            jugador2.y += jugador2.dy * 0.85;
        }
        // Si la pelota está por encima, la raqueta sube
        else if (centroRaqueta > pelota.y + 10) {
            jugador2.y -= jugador2.dy * 0.85;
        }
        // Evita que la IA se salga del canvas
        if (jugador2.y < 0) jugador2.y = 0;
        if (jugador2.y + jugador2.alto > canvas.height) jugador2.y = canvas.height - jugador2.alto;
    }
}

// Función para arrancar el juego
function iniciarPartida(esIA) {
    modoUnJugador = esIA; // Guardamos la decisión del jugador
    pantallaInicio.classList.add("oculto"); // Escondemos el menú

    // Si el juego no esta en marcha, lo iniciamos
    if (!juegoEnMarcha) {
        juegoEnMarcha = true;
        juegoPausado = false;

        musicaFondo.play(); // Iniciamos la música de fondo
        resetearPelota(); // Mandamos la pelota al centro
        gameLoop();       // iniciamos el loop del juego
    }
}

btn1P.addEventListener("click", () => iniciarPartida(true));
btn2P.addEventListener("click", () => iniciarPartida(false));

//Controles
const teclas = { w: false, s: false, ArrowUp: false, ArrowDown: false };

document.addEventListener("keydown", (evento) => {
    if (teclas.hasOwnProperty(evento.key)) teclas[evento.key] = true;
    
    // Si presionan Espacio y el juego ya empezó, pausamos/reanudamos
    if (evento.code === "Space" && juegoEnMarcha) {
        juegoPausado = !juegoPausado;
        if (!juegoPausado) gameLoop(); // Si quitamos la pausa, vuelve a girar el ciclo
    }
});

document.addEventListener("keyup", (evento) => {
    if (teclas.hasOwnProperty(evento.key)) teclas[evento.key] = false;
});

// FÍSICAS Y REGLAS (COLISIONES)
function actualizarFisicas() {
    // Mover Jugador 1 (W/S) asegurando que no se salga del lienzo
    if (teclas.w && jugador1.y > 0) jugador1.y -= jugador1.dy;
    if (teclas.s && (jugador1.y + jugador1.alto) < canvas.height) jugador1.y += jugador1.dy;

    // Mover Jugador 2 (IA o Flechas)
    if (modoUnJugador) {
        moverIA();
    } else {
        if (teclas.ArrowUp && jugador2.y > 0) jugador2.y -= jugador2.dy;
        if (teclas.ArrowDown && (jugador2.y + jugador2.alto) < canvas.height) jugador2.y += jugador2.dy;
    }

    // Mover la pelota
    pelota.x += pelota.dx;
    pelota.y += pelota.dy;

    // Rebote en Techo y Suelo
    if (pelota.y + pelota.radio > canvas.height || pelota.y - pelota.radio < 0) {
        pelota.dy *= -1; 
    }

    // Rebote con las Raquetas (Detectamos en qué mitad de la cancha está)
    let jugadorActual = (pelota.x < canvas.width / 2) ? jugador1 : jugador2;

    if (pelota.x - pelota.radio < jugadorActual.x + jugadorActual.ancho &&
        pelota.x + pelota.radio > jugadorActual.x &&
        pelota.y + pelota.radio > jugadorActual.y &&
        pelota.y - pelota.radio < jugadorActual.y + jugadorActual.alto) {
        
        sonidoRebote.currentTime = 0; // Reinicia el sonido por si hay muchos rebotes
        sonidoRebote.play(); // Reproduce el sonido de rebote
        // Invertimos la dirección de la pelota y la aceleramos un 5% para hacerlo más difícil
        pelota.dx *= -1.05;
        
        // Empujamos la pelota un pixel fuera de la raqueta para evitar que se quede atorada dentro
        pelota.x = (pelota.x < canvas.width / 2) ? jugador1.x + jugador1.ancho + pelota.radio : jugador2.x - pelota.radio;
    }

    // Puntos (Si se sale por izquierda o derecha)
    if (pelota.x - pelota.radio < 0) {
        jugador2.score++; // Punto para el de la derecha
        actualizarMarcador();
    } else if (pelota.x + pelota.radio > canvas.width) {
        jugador1.score++; // Punto para el de la izquierda
        actualizarMarcador();
    }
}

function resetearPelota() {
    //Mueve la pelota al centro
    pelota.x = canvas.width / 2;
    pelota.y = canvas.height / 2;
    
    // Detenemos la pelota momentáneamente para el saque
    pelota.dx = 0;
    pelota.dy = 0;

    // Verificamos que nadie haya ganado aún para hacer el saque
    if (jugador1.score < 5 && jugador2.score < 5) {
        // Usamos setTimeout para esperar 
        setTimeout(() => {
            pelota.dx = (Math.random() > 0.5 ? 3 : -3);
            pelota.dy = (Math.random() > 0.5 ? 3 : -3);
        }, 300); 
    }
}

function actualizarMarcador() {
    marcadorP1.textContent = jugador1.score;
    marcadorP2.textContent = jugador2.score;
    resetearPelota();

    // Condición de victoria
    if (jugador1.score >= 5 || jugador2.score >= 5) {
        juegoEnMarcha = false; // Apagamos el motor
        
        musicaFondo.pause(); // Pausamos la música de fondo
        musicaFondo.currentTime = 0; // Reiniciamos la música para la próxima partida
        sonidoVictoria.currentTime = 0; 
        sonidoVictoria.play(); 

        // Un pequeño retraso para que alcance a pintar el último punto en pantalla
        setTimeout(() => {
            let ganador = jugador1.score >= 5 ? "JUGADOR 1" : (modoUnJugador ? "LA IA" : "JUGADOR 2");
            alert("¡PARTIDA TERMINADA! Ganador: " + ganador);
            
            // Reiniciamos todo para una nueva partida
            jugador1.score = 0;
            jugador2.score = 0;
            jugador1.y = canvas.height / 2 - jugador1.alto / 2;
            jugador2.y = canvas.height / 2 - jugador2.alto / 2;
            marcadorP1.textContent = "0";
            marcadorP2.textContent = "0";
            pantallaInicio.classList.remove("oculto"); // Volvemos a mostrar el menú neón
        }, 50); 
    }
}

function gameLoop() {
    // Si pausaron el juego o ya terminó, cancelamos la animación
    if (!juegoEnMarcha || juegoPausado) return;

    actualizarFisicas(); // Calculamos matemáticas
    renderizar();        // Dibujamos el nuevo fotograma

    // Le pedimos al navegador que vuelva a ejecutar esta función 60 veces por segundo
    requestAnimationFrame(gameLoop);
}

// Si le dan clic al botón del panel lateral, por defecto ponemos el modo de 1 Jugador
btnIniciar.addEventListener("click", () => iniciarPartida(true));

renderizar();