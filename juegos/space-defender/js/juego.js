import { Bala, NaveEnemigo, NaveJugador } from "./entidades.js";

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

// Estado de teclado. Tambien acepta WASD para que el juego sea comodo en laptop.
const estados = {
    arriba: false,
    abajo: false,
    derecha: false,
    izquierda: false,
    disparar: true
};

let nave;
let puntaje;
let balas;
let enemigos;
let juegoActivo;
let intervaloEnemigos;
let cuadroAnimacion;

function iniciarJuego() {
    cancelAnimationFrame(cuadroAnimacion);
    nave = new NaveJugador(canvas.width / 2, canvas.height - 90, 10, 1, 6, colores);
    puntaje = 0;
    balas = [];
    enemigos = [];
    juegoActivo = true;
    puntos.textContent = puntaje;
    vida.textContent = nave.vida;
    iconoBoton.classList.remove("fa-play");
    iconoBoton.classList.add("fa-rotate-right");
    textoBoton.textContent = "Reiniciar";

    clearInterval(intervaloEnemigos);
    intervaloEnemigos = setInterval(agregarEnemigo, 1300);
    cuadroAnimacion = requestAnimationFrame(animar);
}

// El fondo se dibuja en canvas para mantener la misma reticula HUD del sitio.
function dibujarFondo() {
    ctx.fillStyle = colores.negro;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = "rgba(255, 234, 0, .12)";
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
    ctx.shadowColor = colores.amarillo;
    ctx.shadowBlur = 16;
    ctx.font = "64px PPNeueBit-Bold, monospace";
    ctx.fillStyle = colores.amarillo;
    ctx.fillText("INICIAR MISION", canvas.width / 2, canvas.height / 2 - 30);
    ctx.shadowBlur = 0;
    ctx.font = "24px Denton Variable, monospace";
    ctx.fillStyle = colores.gris;
    ctx.fillText("Presiona iniciar para comenzar", canvas.width / 2, canvas.height / 2 + 34);
    ctx.restore();
}

function dibujarMensaje(texto, color) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, .72)";
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

    if (nave.vida <= 0) {
        juegoActivo = false;
        clearInterval(intervaloEnemigos);
        dibujarMensaje("PERDISTE", colores.rosa);
        return;
    }

    if (puntaje >= 10) {
        juegoActivo = false;
        clearInterval(intervaloEnemigos);
        dibujarMensaje("GANASTE", colores.verde);
        return;
    }

    nave.mover(canvas, estados);
    nave.crear(ctx);

    actualizarBalas();
    actualizarEnemigos();

    puntos.textContent = puntaje;
    vida.textContent = nave.vida;

    cuadroAnimacion = requestAnimationFrame(animar);
}

// Recorremos de atras hacia adelante para poder eliminar balas sin saltarnos indices.
function actualizarBalas() {
    for (let i = balas.length - 1; i >= 0; i--) {
        const bala = balas[i];
        bala.crear(ctx);
        bala.mover();

        if (!bala.activa) {
            balas.splice(i, 1);
            continue;
        }

        for (let j = enemigos.length - 1; j >= 0; j--) {
            const enemigo = enemigos[j];

            if (bala.detectarColision(enemigo)) {
                enemigo.recibirDanio(bala.danio);
                balas.splice(i, 1);

                if (enemigo.vida <= 0) {
                    enemigos.splice(j, 1);
                    puntaje += 1;
                }

                break;
            }
        }
    }
}

function actualizarEnemigos() {
    for (let i = enemigos.length - 1; i >= 0; i--) {
        const enemigo = enemigos[i];
        enemigo.crear(ctx);
        enemigo.mover(canvas, nave);

        if (nave.detectarColision(enemigo)) {
            nave.recibirDanio(1);
            enemigos.splice(i, 1);
        }
    }
}

function agregarEnemigo() {
    if (!juegoActivo) return;

    const margen = 60;
    const x = margen + Math.random() * (canvas.width - margen * 2);
    enemigos.push(new NaveEnemigo(x, margen, 10, 1, 1.35, colores));
}

function disparar() {
    if (!estados.disparar || !juegoActivo) return;

    balas.push(new Bala(nave.x, nave.y - 36, 8, 5, colores.amarillo));
    estados.disparar = false;
}

window.addEventListener("keydown", (evento) => {
    if (evento.code === "ArrowRight" || evento.code === "KeyD") estados.derecha = true;
    if (evento.code === "ArrowLeft" || evento.code === "KeyA") estados.izquierda = true;
    if (evento.code === "ArrowUp" || evento.code === "KeyW") estados.arriba = true;
    if (evento.code === "ArrowDown" || evento.code === "KeyS") estados.abajo = true;
    if (evento.code === "Space") disparar();
});

window.addEventListener("keyup", (evento) => {
    if (evento.code === "ArrowRight" || evento.code === "KeyD") estados.derecha = false;
    if (evento.code === "ArrowLeft" || evento.code === "KeyA") estados.izquierda = false;
    if (evento.code === "ArrowUp" || evento.code === "KeyW") estados.arriba = false;
    if (evento.code === "ArrowDown" || evento.code === "KeyS") estados.abajo = false;
    if (evento.code === "Space") estados.disparar = true;
});

botonReiniciar.addEventListener("click", iniciarJuego);
dibujarPantallaInicial();
