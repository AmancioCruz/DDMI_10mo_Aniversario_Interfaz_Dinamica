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

// Controles de movimiento/estado
const estados = {
    arriba: false,
    abajo: false,
    derecha: false,
    izquierda: false,
    disparar: true
};

//variables principales
let jugador;
let enemigo1;
let enemigo2;
let enemigo3;
let balasJugador;
let balasEnemigo;
let juegoActivo;
let cuadroAnimacion;
let intervaloDisparoEnemigo;
let puntaje;
let invencible = false;

//funcion de Inicio/Reinicio del juego
function iniciarJuego() {
    cancelAnimationFrame(cuadroAnimacion);
    jugador = new TanqueJugador(canvas.width / 2, canvas.height - 120, 3, 1, 2.2, colores);
    enemigo1 = new TanqueEnemigo(canvas.width / 2, 120, 3, 1, 0.8, colores);
    enemigo2 = new TanqueEnemigo(250, 120, 3, 1, 0.7, colores);
    enemigo3 = new TanqueEnemigo(950, 120, 3, 1, 1, colores);
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

//funcion que dibuja el fondo de cuadricula
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

//funcion  que muestra de la pantalla de inicio
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

//funcion que muestra el mensaje de "GAME OVER" + la puntuacion cuando pierde el jugador
function dibujarMensaje(texto, color, mostrarPuntaje = false) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.72)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "64px PPNeueBit-Bold, monospace";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillText(texto, canvas.width / 2, canvas.height / 2 - 30);
    if (mostrarPuntaje) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = colores.blanco;
        ctx.font = "32px Denton Variable, monospace";
        ctx.fillText("Enemigos eliminados: " + puntaje, canvas.width / 2, canvas.height / 2 + 30);
    }

    ctx.restore();
}

//funcion principal que hace funcionar el juego
function animar() {
    dibujarFondo();

    if (!juegoActivo) return;

    //condicion de perder del jugador
    if (jugador.vida <= 0) {
        juegoActivo = false;
        clearInterval(intervaloDisparoEnemigo);
        dibujarMensaje("GAME OVER", colores.rosa, true);
        return;
    }

    //Aqui se dibuja el jugador y se activa su movimiento
    jugador.mover(canvas, estados);
    jugador.crear(ctx);

    //Aqui se dibuja los enemigos, se activa su movimiento y su colision
    if (enemigo1.vida > 0) {
        enemigo1.mover(canvas, jugador);
        enemigo1.crear(ctx);
        //ifs que le dan al jugador 1 seg de invincibilidad cuando choque con un enemigp
        if (!invencible && enemigo1.vida > 0 && jugador.detectarColision(enemigo1)) {
            jugador.recibirDanio(1);
            invencible = true;
            setTimeout(() => {invencible = false;}, 1000);
        }
    }
    if (enemigo2.vida > 0) {
        enemigo2.mover(canvas, jugador);
        enemigo2.crear(ctx);
        if (!invencible && enemigo2.vida > 0 && jugador.detectarColision(enemigo2)) {
            jugador.recibirDanio(1);
            invencible = true;
            setTimeout(() => {invencible = false;}, 1000);
        }
    }
    if (enemigo3.vida > 0) {
        enemigo3.mover(canvas, jugador);
        enemigo3.crear(ctx);
        if (!invencible && enemigo3.vida > 0 && jugador.detectarColision(enemigo3)) {
            jugador.recibirDanio(1);
            invencible = true;
            setTimeout(() => {invencible = false;}, 1000);
        }
    }


    actualizarBalas();

    vida.textContent = jugador.vida;
    cuadroAnimacion = requestAnimationFrame(animar);
}

//funcion que determina la velocidad y colision de las balas
function actualizarBalas() {
    for (let i = balasJugador.length - 1;i >= 0;i--) {
        const bala = balasJugador[i];
        bala.crear(ctx);
        bala.mover(canvas);
        //if que desactiva balas que salen del canvas
        if (!bala.activa) {
            balasJugador.splice(i, 1);
            continue;
        }
        //if que activa la colision y daño del enemigo contra la bala del jugador
        //si es eliminado un enemigo vuelve a spawnear en otro lugar random del canvas
        if (bala.detectarColision(enemigo1) && enemigo1.vida > 0) {
            enemigo1.recibirDanio(bala.danio);
            if (enemigo1.vida <= 0) {
                puntaje += 1;
                puntos.textContent = puntaje;
                enemigo1 = new TanqueEnemigo((Math.random() * (canvas.width)) + 50, 120, 3, 1, (Math.random() + .8), colores);
            }
            balasJugador.splice(i, 1);
            continue;
        }
        if (bala.detectarColision(enemigo2) && enemigo2.vida > 0) {
            enemigo2.recibirDanio(bala.danio);
            if (enemigo2.vida <= 0) {
                puntaje += 1;
                puntos.textContent = puntaje;
                enemigo2 = new TanqueEnemigo((Math.random() * (canvas.width)) + 50, 120, 3, 1, (Math.random() + .8), colores);
            }
            balasJugador.splice(i, 1);
            continue;
        }
        if (bala.detectarColision(enemigo3) && enemigo3.vida > 0) {
            enemigo3.recibirDanio(bala.danio);
            if (enemigo3.vida <= 0) {
                puntaje += 1;
                puntos.textContent = puntaje;
                enemigo3 = new TanqueEnemigo((Math.random() * (canvas.width)) + 50, 120, 3, 1, (Math.random() + .8), colores);
            }
            balasJugador.splice(i, 1);
            continue;
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

//funcion que controla el disparo del jugador
function dispararJugador() {
    if(!jugador) return;
    if (!estados.disparar || !juegoActivo) return;
    balasJugador.push(new Bala(jugador.x, jugador.y - 45, 0, -5, 1, colores.amarillo));
    estados.disparar = false;
}

//funcion que controla el disparo del enemigo. La velocidad de la bala
function disparoEnemigo() {

    if (!juegoActivo) return;

    if (enemigo1.vida > 0) {
        balasEnemigo.push(new Bala(enemigo1.x, enemigo1.y + 45, 0, Math.random() * 6, 1, colores.rosa));
    }
    if (enemigo2.vida > 0) {
        balasEnemigo.push(new Bala(enemigo2.x, enemigo2.y + 45, 0, Math.random() * 6, 1, colores.rosa));
    }
    if (enemigo3.vida > 0) {
        balasEnemigo.push(new Bala(enemigo3.x, enemigo3.y + 45, 0, Math.random() * 6, 1, colores.rosa));
    }
}

//eventos que determinan cuando una tecla es precionada/soltada y ejecuta la accion
window.addEventListener("keydown", (evento) => {
    evento.preventDefault();
    if (evento.code === "ArrowRight" || evento.code === "KeyD") estados.derecha = true;
    if (evento.code === "ArrowLeft" || evento.code === "KeyA") estados.izquierda = true;
    if (evento.code === "ArrowUp" || evento.code === "KeyW") estados.arriba = true;
    if (evento.code === "ArrowDown" || evento.code === "KeyS") estados.abajo = true;
    if (evento.code === "Space") dispararJugador();
    }
);

window.addEventListener("keyup",(evento) => {
    evento.preventDefault();
    if (evento.code === "ArrowRight" || evento.code === "KeyD") estados.derecha = false;
    if (evento.code === "ArrowLeft" || evento.code === "KeyA") estados.izquierda = false;
    if (evento.code === "ArrowUp" || evento.code === "KeyW") estados.arriba = false;
    if (evento.code === "ArrowDown" || evento.code === "KeyS") estados.abajo = false;
    if (evento.code === "Space") estados.disparar = true;
    }
);

//boton para reinicar el juego
botonReiniciar.addEventListener("click", iniciarJuego);
dibujarPantallaInicial();