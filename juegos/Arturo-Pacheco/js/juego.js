import { Bala, TanqueEnemigo, TanqueJugador} from "./entidades.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const puntos = document.querySelector("#valor-puntaje");
const vida = document.querySelector("#vida-jugador");
const botonReiniciar = document.querySelector("#reiniciar-juego");
const iconoBoton = botonReiniciar.querySelector("i");
const textoBoton = botonReiniciar.querySelector("span");
const estilos = getComputedStyle(document.documentElement);

const colores = {
    verde: estilos.getPropertyValue("--verde-codigo").trim(),
    azul: estilos.getPropertyValue("--azul-vr").trim(),
    rosa: estilos.getPropertyValue("--rosa-mictlan").trim(),
    amarillo: estilos.getPropertyValue("--amarillo-electrico").trim(),
    blanco: estilos.getPropertyValue("--blanco").trim(),
    gris: estilos.getPropertyValue("--gris").trim(),
    negro: estilos.getPropertyValue("--negro").trim()
};

const estados = {
    arriba: false,
    abajo: false,
    derecha: false,
    izquierda: false,
    disparar: true
};

let jugador;
let enemigo;
let balasJugador;
let balasEnemigo;
let juegoActivo;
let cuadroAnimacion;
let intervaloDisparoEnemigo;
let puntaje;

function iniciarJuego() {
    cancelAnimationFrame(cuadroAnimacion);
    jugador = new TanqueJugador(canvas.width / 2, canvas.height - 120, 3, 1, 2.2, colores);
    enemigo = new TanqueEnemigo(canvas.width / 2, 120, 3, 1, 0.8, colores);
    balasJugador = [];
    balasEnemigo = [];
    juegoActivo = true;
    puntaje = 0;
    puntos.textContent = puntaje;
    vida.textContent = jugador.vida;
    iconoBoton.classList.remove("fa-play");
    iconoBoton.classList.add("fa-rotate-right");
    textoBoton.textContent = "Reiniciar";

    clearInterval(intervaloDisparoEnemigo);
    intervaloDisparoEnemigo = setInterval(disparoEnemigo, 1800);
    cuadroAnimacion = requestAnimationFrame(animar)
}

function dibujarFondo() {
    ctx.fillStyle = colores.negro;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.strokeStyle = "rgba(255, 234, 0, .10)";
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    ctx.restore();
}


function dibujarPantallaInicial() {
    dibujarFondo();

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, .45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = colores.azul;
    ctx.shadowBlur = 16;
    ctx.font = "64px PPNeueBit-Bold, monospace";
    ctx.fillStyle = colores.azul;
    ctx.fillText("Tank Attack", canvas.width / 2, canvas.height / 2 - 40);
    ctx.shadowBlur = 0;
    ctx.font = "24px Denton Variable, monospace";
    ctx.fillStyle = colores.gris;
    ctx.fillText("Presiona iniciar para comenzar", canvas.width / 2, canvas.height / 2 + 35);
    ctx.restore();
}

function dibujarMensaje(texto, color) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.72)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "64px PPNeueBit-Bold, monospace";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillText(texto, canvas.width / 2, canvas.height / 2);
    ctx.restore();
}

function animar() {
    dibujarFondo();

    if (!juegoActivo) return;

    if (jugador.vida <= 0) {
        juegoActivo = false;
        clearInterval(intervaloDisparoEnemigo);
        dibujarMensaje("PERDISTE", colores.rosa);
        return;
    }

    if (enemigo.vida <= 0) {
        juegoActivo = false;
        clearInterval(intervaloDisparoEnemigo);
        puntaje = 1;
        puntos.textContent = puntaje;
        dibujarMensaje("GANASTE", colores.verde);
        return;
    }

    jugador.mover(canvas, estados);
    jugador.crear(ctx);
    enemigo.mover(canvas, jugador);
    enemigo.crear(ctx);

    actualizarBalas();

    vida.textContent = jugador.vida;
    cuadroAnimacion = requestAnimationFrame(animar);
}

function actualizarBalas() {
    for (let i = balasJugador.length - 1;i >= 0;i--) {
        const bala = balasJugador[i];
        bala.crear(ctx);
        bala.mover(canvas);
        if (!bala.activa) {
            balasJugador.splice(i, 1);
            continue;
        }
        if (bala.detectarColision(enemigo)) {
            enemigo.recibirDanio(
                bala.danio
            );
            balasJugador.splice(i, 1);
        }
    }

    for (let i = balasEnemigo.length - 1; i >= 0; i--) {
        const bala = balasEnemigo[i];
        bala.crear(ctx);
        bala.mover(canvas);
        if (!bala.activa) {
            balasEnemigo.splice(i, 1);
            continue;
        }
        if (bala.detectarColision(jugador)) {
            jugador.recibirDanio(
                bala.danio
            );
            balasEnemigo.splice(i, 1);
        }
    }
}

function dispararJugador() {

    if (!estados.disparar || !juegoActivo) return;
    balasJugador.push(new Bala(jugador.x, jugador.y - 45, 0, -5, 1, colores.amarillo));
    estados.disparar = false;
}

function disparoEnemigo() {

    if (!juegoActivo) return;

    balasEnemigo.push(new Bala(enemigo.x, enemigo.y + 45, 0, 4, 1, colores.rosa));
}

window.addEventListener("keydown", (evento) => {
    if (evento.code === "ArrowRight" || evento.code === "KeyD") estados.derecha = true;
    if (evento.code === "ArrowLeft" || evento.code === "KeyA") estados.izquierda = true;
    if (evento.code === "ArrowUp" || evento.code === "KeyW") estados.arriba = true;
    if (evento.code === "ArrowDown" || evento.code === "KeyS") estados.abajo = true;
    if (evento.code === "Space") dispararJugador();
    }
);

window.addEventListener("keyup",(evento) => {
    if (evento.code === "ArrowRight" || evento.code === "KeyD") estados.derecha = false;
    if (evento.code === "ArrowLeft" || evento.code === "KeyA") estados.izquierda = false;
    if (evento.code === "ArrowUp" || evento.code === "KeyW") estados.arriba = false;
    if (evento.code === "ArrowDown" || evento.code === "KeyS") estados.abajo = false;
    if (evento.code === "Space") estados.disparar = true;
    }
);

botonReiniciar.addEventListener("click", iniciarJuego);
dibujarPantallaInicial();