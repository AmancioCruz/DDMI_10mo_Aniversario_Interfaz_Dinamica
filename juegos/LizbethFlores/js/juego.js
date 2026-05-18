import { RegalizJugador, DulceMenta, Moneda } from "./entidades.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const monedasHUD = document.querySelector("#valor-monedas");
const vidaHUD = document.querySelector("#vida-jugador");
const tiempoHUD = document.querySelector("#tiempo-restante");
const botonReiniciar = document.querySelector("#reiniciar-juego");

const colores = {
  rosa: "#ff80ab",
  menta: "#a8e6cf",
  amarillo: "#fff176",
  negro: "#000",
  gris: "#555"
};

const estados = { arriba: false, abajo: false, izquierda: false, derecha: false };

let regaliz;
let dulce;
let monedas;
let juegoActivo;
let tiempoRestante;
let cuadroAnimacion;

function iniciarJuego() {
  cancelAnimationFrame(cuadroAnimacion);

  regaliz = new RegalizJugador(200, 400, 80, 4, colores);
  dulce = new DulceMenta(400, 400, colores);
  monedas = [
    new Moneda(250, 250, colores),
    new Moneda(600, 300, colores),
    new Moneda(700, 500, colores)
  ];

  regaliz.monedas = 0;
  regaliz.vida = 3;
  tiempoRestante = 60;
  juegoActivo = true;

  monedasHUD.textContent = regaliz.monedas;
  vidaHUD.textContent = regaliz.vida;
  tiempoHUD.textContent = tiempoRestante;

  iniciarTemporizador();
  cuadroAnimacion = requestAnimationFrame(animar);
}

function iniciarTemporizador() {
  const intervalo = setInterval(() => {
    if (!juegoActivo) {
      clearInterval(intervalo);
      return;
    }
    tiempoRestante--;
    tiempoHUD.textContent = tiempoRestante;
    if (tiempoRestante <= 0) {
      juegoActivo = false;
      dibujarMensaje("¡Tiempo agotado!", colores.rosa);
      clearInterval(intervalo);
    }
  }, 1000);
}

function dibujarFondo() {
  ctx.fillStyle = colores.menta;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function dibujarMensaje(texto, color) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "48px sans-serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(texto, canvas.width / 2, canvas.height / 2);
  ctx.restore();
}

function animar() {
  dibujarFondo();

  if (!juegoActivo) {
    cuadroAnimacion = requestAnimationFrame(animar);
    return;
  }

  regaliz.mover(estados);
  regaliz.dibujar(ctx);

  if (regaliz.detectarColision(dulce)) {
    if (estados.derecha) dulce.mover(regaliz.velocidad, 0);
    if (estados.izquierda) dulce.mover(-regaliz.velocidad, 0);
    if (estados.arriba) dulce.mover(0, -regaliz.velocidad);
    if (estados.abajo) dulce.mover(0, regaliz.velocidad);
  }

  dulce.dibujar(ctx);

  monedas.forEach((moneda) => {
    moneda.dibujar(ctx);
    if (!moneda.recolectada && regaliz.detectarColision(moneda)) {
      moneda.recolectada = true;
      regaliz.monedas++;
      monedasHUD.textContent = regaliz.monedas;
    }
  });

  if (regaliz.monedas >= monedas.length) {
    juegoActivo = false;
    dibujarMensaje("¡Ganaste!", colores.amarillo);
  }

  cuadroAnimacion = requestAnimationFrame(animar);
}

window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp" || e.code === "KeyW") estados.arriba = true;
  if (e.code === "ArrowDown" || e.code === "KeyS") estados.abajo = true;
  if (e.code === "ArrowLeft" || e.code === "KeyA") estados.izquierda = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") estados.derecha = true;
  if (e.code === "Space") regaliz.estirando = true;
});

window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowUp" || e.code === "KeyW") estados.arriba = false;
  if (e.code === "ArrowDown" || e.code === "KeyS") estados.abajo = false;
  if (e.code === "ArrowLeft" || e.code === "KeyA") estados.izquierda = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") estados.derecha = false;
  if (e.code === "Space") regaliz.estirando = false;
});

botonReiniciar.addEventListener("click", iniciarJuego);

dibujarMensaje("Presiona Iniciar para comenzar", colores.amarillo);