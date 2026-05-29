import { RegalizJugador, DulceMenta, Moneda } from "./entidades.js";
import { dibujarEscenario, obtenerBloques } from "./escenario.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const monedasHUD = document.querySelector("#valor-monedas");
const vidaHUD = document.querySelector("#vida-jugador");
const tiempoHUD = document.querySelector("#tiempo-restante");
const botonReiniciar = document.querySelector("#reiniciar-juego");

const colores = {
  cafe: "#683731",
  rosa: "#FAA395",
  crema: "#F2E9CD",
  menta: "#57B6AF",
  amarillo: "#F6C776"
};

const imagenFondo = new Image();
imagenFondo.src = "recursos/img/fondo.png";

export const estados = { arriba: false, abajo: false, izquierda: false, derecha: false };

let regaliz, dulce, monedas;
let juegoActivo = false;
let tiempoRestante = 60;
let cuadroAnimacion, intervaloTiempo;

let saltando = false;
let velocidadSalto = 0;
const fuerzaSalto = 15;
const gravedad = 2;

let invulnerable = false;
let tiempoInvulnerable = 2000;
let mensajeActivo = null;
let mensajeColor = null;
let mensajeTiempo = 0;

function iniciarJuego() {
  cancelAnimationFrame(cuadroAnimacion);
  clearInterval(intervaloTiempo);

  regaliz = new RegalizJugador(100, canvas.height - 120, 40, 4, colores);
  dulce = new DulceMenta(500, canvas.height - 80, colores);
  monedas = [
    new Moneda(300, canvas.height - 150, colores),
    new Moneda(550, canvas.height - 230, colores),
    new Moneda(780, canvas.height - 310, colores)
  ];

  regaliz.monedas = 0;
  regaliz.vida = 3;
  tiempoRestante = 60;
  saltando = false;
  velocidadSalto = 0;
  invulnerable = false;
  mensajeActivo = null;
  mensajeColor = null;
  mensajeTiempo = 0;

  monedasHUD.textContent = regaliz.monedas;
  vidaHUD.textContent = regaliz.vida;
  tiempoHUD.textContent = tiempoRestante;

  juegoActivo = true;
  iniciarTemporizador();
  animar();
}

function iniciarTemporizador() {
  intervaloTiempo = setInterval(() => {
    if (!juegoActivo) {
      clearInterval(intervaloTiempo);
      return;
    }
    tiempoRestante--;
    tiempoHUD.textContent = tiempoRestante;
    if (tiempoRestante <= 0) {
      juegoActivo = false;
      dibujarMensaje("¡Tiempo agotado!", colores.rosa);
      clearInterval(intervaloTiempo);
    }
  }, 1000);
}

function dibujarFondo() {
  if (imagenFondo.complete) {
    ctx.drawImage(imagenFondo, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = colores.crema;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
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

function mostrarMensajeTemporal(texto, color, duracion) {
  mensajeActivo = texto;
  mensajeColor = color;
  mensajeTiempo = Date.now() + duracion;
}

function dibujarMensajes() {
  if (mensajeActivo && Date.now() < mensajeTiempo) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.4)";
    ctx.fillRect(0, 0, canvas.width, 60);
    ctx.font = "24px sans-serif";
    ctx.fillStyle = mensajeColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(mensajeActivo, canvas.width / 2, 30);
    ctx.restore();
  }
}

function aplicarGravedad(entidad, bloques) {
  if (saltando && entidad === regaliz) {
    entidad.y -= velocidadSalto;
    velocidadSalto -= 1;
    if (velocidadSalto <= 0) saltando = false;
  } else {
    entidad.y += gravedad;
  }

  bloques.forEach(b => {
    if (entidad.detectarColision(b)) {
      if (!b.peligro) {
        if (entidad.y + entidad.alto > b.y && entidad.y < b.y) {
          entidad.y = b.y - entidad.alto;
          if (entidad === regaliz) {
            velocidadSalto = 0;
            saltando = false;
          }
        }
      }
    }
  });

  entidad.actualizarAreaColision();
}

function manejarColisiones() {
  const bloques = obtenerBloques(ctx);

  aplicarGravedad(regaliz, bloques);
  aplicarGravedad(dulce, bloques);

  bloques.forEach((b) => {
    if (regaliz.detectarColision(b)) {
      if (b.peligro && !invulnerable) {
        regaliz.vida--;
        vidaHUD.textContent = regaliz.vida;

        mostrarMensajeTemporal("¡Cuidado! Perdiste una vida 💔", colores.rosa, 2000);

        invulnerable = true;
        setTimeout(() => invulnerable = false, tiempoInvulnerable);

        if (regaliz.vida <= 0) {
          juegoActivo = false;
          clearInterval(intervaloTiempo);
          dibujarMensaje("¡Perdiste!", colores.rosa);
        }
      }
    }
  });

  if (regaliz.detectarColision(dulce)) {
    if (estados.derecha) dulce.mover(regaliz.velocidad, 0);
    if (estados.izquierda) dulce.mover(-regaliz.velocidad, 0);

    if (regaliz.y + regaliz.alto > dulce.y && regaliz.y < dulce.y) {
      regaliz.y = dulce.y - regaliz.alto;
      velocidadSalto = 0;
      saltando = false;
    }
  }
}

function revisarMonedas() {
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
    clearInterval(intervaloTiempo);
    dibujarMensaje("¡Ganaste!", colores.amarillo);
    return;
  }
}

function animar() {
  dibujarFondo();
  dibujarEscenario(ctx, colores);

  if (!juegoActivo) return;

  regaliz.mover(estados, canvas);
  manejarColisiones();

  regaliz.dibujar(ctx);
  dulce.dibujar(ctx);

  revisarMonedas();
  if (!juegoActivo) return;

  dibujarMensajes();

  cuadroAnimacion = requestAnimationFrame(animar);
}

window.addEventListener("keydown", (e) => {
  const teclasJuego = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];

  if (teclasJuego.includes(e.code)) {
    e.preventDefault();
  }

  if (e.code === "ArrowUp" || e.code === "KeyW") estados.arriba = true;
  if (e.code === "ArrowDown" || e.code === "KeyS") estados.abajo = true;
  if (e.code === "ArrowLeft" || e.code === "KeyA") estados.izquierda = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") estados.derecha = true;

  if (e.code === "Space") {
    if (juegoActivo && !saltando) {
      saltando = true;
      velocidadSalto = fuerzaSalto;
    }
  }
});

window.addEventListener("keyup", (e) => {
  const teclasJuego = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];

  if (teclasJuego.includes(e.code)) {
    e.preventDefault();
  }

  if (e.code === "ArrowUp" || e.code === "KeyW") estados.arriba = false;
  if (e.code === "ArrowDown" || e.code === "KeyS") estados.abajo = false;
  if (e.code === "ArrowLeft" || e.code === "KeyA") estados.izquierda = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") estados.derecha = false;
});

botonReiniciar.addEventListener("click", iniciarJuego);

dibujarMensaje("Presiona Reiniciar para comenzar", colores.amarillo);
