import { Jugador, Enemigo } from "./figuras.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// JUGADOR
let spawnX = 70;
let spawnY = 230;

const jugador = new Jugador(spawnX, spawnY);

// VARIABLES DEL JUEGO
let habitacionActual = 0;
let estadoJuego = "menu";

let vidas = 3;

let checkpointX = spawnX;
let checkpointY = spawnY;

let enZonaSegura = false;

let tiempoInicio = Date.now();

// META
let metaX = 820;
let metaY = 200;

let metaWidth = 40;
let metaHeight = 100;

// HABITACIONES
const habitaciones = [
    {
        enemigos: 4,
        color: "#fae392"
    },

    {
        enemigos: 7,
        color: "#c093fb"
    },

    {
        enemigos: 10,
        color: "#f56666"
    }

];

// ARREGLOS
let enemigos = [];

let particulas = [];

// GENERAR ENEMIGOS
function generarEnemigos() {
    enemigos = [];

    let cantidad = habitaciones[habitacionActual].enemigos;

    for (let i = 0; i < cantidad; i++) {
        let x;
        let y;
        do{
            x = Math.random() * 500 + 250;
            y = Math.random() * 300 + 100;
        }
        while((x > 430 && x < 570 && y > 230 && y < 370) ||
            (habitacionActual === 1 && x > 300 && x < 380 && y > 220 && y < 320)
        );
        let dificultad = habitacionActual + 1;
        let speed = Math.random() * 3 + dificultad;

        enemigos.push(
            new Enemigo(
                x,
                y,
                15,
                speed
            )
        );
    }
}

// CONTROLES
const keys = {};
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    // INICIAR JUEGO
    if (e.key === "Enter" && estadoJuego === "menu") {
        vidas = 3;
        habitacionActual = 0;

        spawnX = 70;
        spawnY = 230;

        jugador.x = spawnX;
        jugador.y = spawnY;

        checkpointX = spawnX;
        checkpointY = spawnY;

        tiempoInicio = Date.now();

        generarEnemigos();

        estadoJuego = "jugando";
    }

    // REINICIAR DESDE GAME OVER O VICTORIA
    if (
        e.key.toLowerCase() === "r" &&
        (estadoJuego === "gameover" || estadoJuego === "victoria")
    ) {

        estadoJuego = "menu";

    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// MOVIMIENTO JUGADOR
function moverJugador() {
    if (keys["ArrowUp"]) {
        jugador.y -= jugador.speed;
    }

    if (keys["ArrowDown"]) {
        jugador.y += jugador.speed;
    }

    if (keys["ArrowLeft"]) {
        jugador.x -= jugador.speed;
    }

    if (keys["ArrowRight"]) {
        jugador.x += jugador.speed;
    }

    // LIMITES GENERALES
    if (jugador.x < 50) {
        jugador.x = 50;
    }

    if (jugador.x + jugador.width > 950) {
        jugador.x = 950 - jugador.width;
    }

    if (jugador.y < 50) {
        jugador.y = 50;
    }

    if (jugador.y + jugador.height > 550) {
        jugador.y = 550 - jugador.height;
    }

    // HABITACION 2
    if (habitacionActual === 1) {
        if (jugador.x < 250) {
            jugador.x = 250;
        }

        if (jugador.x + jugador.width > 750) {
            jugador.x = 750 - jugador.width;
        }
    }

    // HABITACION 3
    if (habitacionActual === 2) {
        if (jugador.y < 180) {
            jugador.y = 180;
        }

        if (jugador.y + jugador.height > 360) {
            jugador.y = 360 - jugador.height;
        }
    }
}

// MAPA
function dibujarMapa() {
    // FONDO
    ctx.fillStyle = habitaciones[habitacionActual].color;
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // CAMINOS
    ctx.fillStyle = "white";
    if (habitacionActual === 0) {
        ctx.fillRect(50, 50, 900, 500);
        metaX = 820;
        metaY = 200;
    }

    if (habitacionActual === 1) {
        ctx.fillRect(250, 50, 500, 500);
        metaX = 650;
        metaY = 220;
    }

    if (habitacionActual === 2) {
        ctx.fillRect(50, 180, 900, 180);
        metaX = 820;
        metaY = 220;
    }

    let inicioX = 50;
    let inicioY = 200;

    // NIVEL 2
    if (habitacionActual === 1) {
        inicioX = 300;
        inicioY = 220;
    }

    // NIVEL 3
    if (habitacionActual === 2) {
        inicioX = 70;
        inicioY = 220;
    }

    ctx.fillStyle = "yellow";
    ctx.fillRect(
        inicioX,
        inicioY,
        80,
        100
    );
    // META
    ctx.fillStyle = "green";
    ctx.fillRect(
        metaX,
        metaY,
        metaWidth,
        metaHeight
    );

    // CHECKPOINT
    ctx.fillStyle = "yellow";
    ctx.fillRect(
        450,
        250,
        100,
        100
    );

    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.fillText(
        "SAFE",
        470,
        305
    );
}

// COLISIONES
function verificarColision() {
    enemigos.forEach((enemigo) => {

        let dx =
            jugador.x + jugador.width / 2 - enemigo.x;
        let dy =
            jugador.y + jugador.height / 2 - enemigo.y;
        let distancia = Math.sqrt(dx * dx + dy * dy);

        if (
            distancia < enemigo.radius + jugador.width / 2 &&
            !enZonaSegura
        ) {

            // PARTICULAS
            for (let i = 0; i < 20; i++) {
                particulas.push({
                    x: jugador.x,
                    y: jugador.y,

                    size: Math.random() * 5,
                    speedX: Math.random() * 6 - 3,
                    speedY: Math.random() * 6 - 3
                });
            }

            vidas--;

            jugador.x = checkpointX;
            jugador.y = checkpointY;

            if (vidas <= 0) {
                estadoJuego = "gameover";
            }
        }
    });
}

// CHECKPOINT
function verificarCheckpoint() {

    enZonaSegura = false;

    // SAFE CENTRAL
    let safeX = 450;
    let safeY = 250;

    let safeWidth = 100;
    let safeHeight = 100;

    if (
        jugador.x < safeX + safeWidth &&
        jugador.x + jugador.width > safeX &&
        jugador.y < safeY + safeHeight &&
        jugador.y + jugador.height > safeY
    ) {
        checkpointX = safeX;
        checkpointY = safeY;

        enZonaSegura = true;
    }

    // ZONA SEGURA INICIAL NIVEL 2
    if (habitacionActual === 1) {

        let inicioX = 300;
        let inicioY = 220;
        let inicioWidth = 80;
        let inicioHeight = 100;

        if (
            jugador.x < inicioX + inicioWidth &&
            jugador.x + jugador.width > inicioX &&
            jugador.y < inicioY + inicioHeight &&
            jugador.y + jugador.height > inicioY
        ) {
            enZonaSegura = true;
        }
    }
}

// META
function verificarMeta() {
    if (
        jugador.x < metaX + metaWidth &&
        jugador.x + jugador.width > metaX &&
        jugador.y < metaY + metaHeight &&
        jugador.y + jugador.height > metaY
    ) {
        habitacionActual++;

        // VICTORIA
        if (habitacionActual >= habitaciones.length) {
            estadoJuego = "victoria";
            return;
        }

        // SPAWNS SEGUN NIVEL
        if (habitacionActual === 1) {
            spawnX = 300;
            spawnY = 250;
        }

        if (habitacionActual === 2) {
            spawnX = 70;
            spawnY = 240;
        }

        jugador.x = spawnX;
        jugador.y = spawnY;

        checkpointX = spawnX;
        checkpointY = spawnY;

        generarEnemigos();
    }
}

// GAME LOOP
function actualizar() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let tiempoActual =
        Math.floor((Date.now() - tiempoInicio) / 1000);

    // MENU
    if (estadoJuego === "menu") {
        ctx.fillStyle = "black";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "white";
        ctx.font = "60px Arial";
        ctx.fillText(
            "PIXELES PELIGROSOS",
            220,
            200
        );

        ctx.font = "40px Arial";
        ctx.fillText(
            "Este juego esta diseñado para que pierdas",
            150,
            250
        );

        ctx.font = "35px Arial";
        ctx.fillText(
            "PRESIONA ENTER",
            300,
            320
        );

        requestAnimationFrame(actualizar);
        return;
    }

    // GAME OVER
    if (estadoJuego === "gameover") {
        ctx.fillStyle = "black";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "red";
        ctx.font = "80px Arial";
        ctx.fillText(
            "GAME OVER",
            230,
            250
        );

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(
            "Presiona R para volver",
            280,
            350
        );

        requestAnimationFrame(actualizar);
        return;
    }

    // VICTORIA
    if (estadoJuego === "victoria") {
        ctx.fillStyle = "black";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "lime";
        ctx.font = "70px Arial";
        ctx.fillText(
            "GANASTE",
            320,
            220
        );

        ctx.font = "35px Arial";
        ctx.fillText(
            "Tiempo Final: " + tiempoActual + " segundos",
            220,
            320
        );

        ctx.fillStyle = "white";
        ctx.fillText(
            "Presiona R para volver",
            260,
            400
        );

        requestAnimationFrame(actualizar);
        return;
    }

    // GAMEPLAY
    dibujarMapa();
    moverJugador();
    jugador.dibujar(ctx);

    enemigos.forEach((enemigo) => {
        enemigo.mover();
        enemigo.dibujar(ctx);
    });

    // PARTICULAS
    particulas.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.size *= 0.95;

        ctx.fillStyle = "red";
        ctx.fillRect(
            p.x,
            p.y,
            p.size,
            p.size
        );
    });

    particulas = particulas.filter((p) => {
        return p.size > 0.2;
    });

    verificarCheckpoint();
    verificarColision();
    verificarMeta();

    // UI
    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    ctx.fillText(
        "Vidas: " + vidas,
        20,
        40
    );

    ctx.fillText(
        "Tiempo: " + tiempoActual,
        20,
        80
    );

    requestAnimationFrame(actualizar);
}
generarEnemigos();
actualizar();