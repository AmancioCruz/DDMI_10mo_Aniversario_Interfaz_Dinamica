// Obtiene el canvas del HTML
const canvas = document.getElementById("canvas");
//dibujar en el canvas
const ctx = canvas.getContext("2d");

// Elementos del HTML para mostrar tiempo, movimientos y mensajes
const tiempoTexto = document.getElementById("vida-jugador");
const movimientosTexto = document.getElementById("valor-puntaje");
const mensaje = document.getElementById("mensaje");
const btnReiniciar = document.getElementById("reiniciar-juego");

const mapa = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
  [1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,1],
  [1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
  [1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1],
  [1,1,1,1,1,0,1,1,1,0,1,1,1,1,0,0,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Cantidad de filas y columnas del mapa
const filas = mapa.length;
const columnas = mapa[0].length;

// Tamaño de cada celda dentro del canvas
const anchoCelda = canvas.width / columnas;
const altoCelda = canvas.height / filas;

// Variables del juego
let jugador;
let movimientos = 0;
let juegoTerminado = false;
let tiempoIniciado = false;
let tiempoInicio = 0;
let animacionTiempo = null;

// Posición inicial del jugador
function iniciarJuego() {
  jugador = {
    fila: 1,
    columna: 1
  };

  movimientos = 0;
  juegoTerminado = false;
  tiempoIniciado = false;
  tiempoInicio = 0;

  // Detener animación del tiempo si existe
  if (animacionTiempo !== null) {
    cancelAnimationFrame(animacionTiempo);
    animacionTiempo = null;
  }

  // Reiniciar textos
  mensaje.textContent = "Activo";
  tiempoTexto.textContent = "0";
  movimientosTexto.textContent = "0";

  dibujarJuego();
}

//Iniciar temporizador
function iniciarTiempo() {
  if (tiempoIniciado) return;

  tiempoIniciado = true;
  tiempoInicio = Date.now();
  actualizarTiempo();
}

function actualizarTiempo() {
  if (juegoTerminado) return;

  const tiempoActual = Math.floor((Date.now() - tiempoInicio) / 1000);
  tiempoTexto.textContent = tiempoActual;

  animacionTiempo = requestAnimationFrame(actualizarTiempo);
}

function dibujarJuego() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

// Recorre todas las filas y columnas
  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      // Posición en pantalla
      const x = columna * anchoCelda;
      const y = fila * altoCelda;

      // Dibujar paredes
      if (mapa[fila][columna] === 1) {
        ctx.fillStyle = "rgba(0, 200, 255, 0.84)";
        // Dibujar meta
      } else if (mapa[fila][columna] === 2) {
        ctx.fillStyle = "#00ff88";
      } else {
        ctx.fillStyle = "#050505";
      }

       // Dibujar celda
      ctx.fillRect(x, y, anchoCelda, altoCelda);

      ctx.strokeStyle = "rgba(0, 200, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, anchoCelda, altoCelda);
    }
  }

  dibujarJugador();
}

function dibujarJugador() {
  // Centro del jugador
  const x = jugador.columna * anchoCelda + anchoCelda / 2;
  const y = jugador.fila * altoCelda + altoCelda / 2;
  // Tamaño del jugador
  const radio = Math.min(anchoCelda, altoCelda) * 0.32;

  ctx.beginPath();
  ctx.arc(x, y, radio, 0, Math.PI * 2);
  ctx.fillStyle = "#ffea00";
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.stroke();
}

//Si terminó el juego, no mover
function moverJugador(direccion) {
  //Si terminó el juego, no mover
  if (juegoTerminado) return;

  let nuevaFila = jugador.fila;
  let nuevaColumna = jugador.columna;

  if (direccion === "arriba") nuevaFila--;
  if (direccion === "abajo") nuevaFila++;
  if (direccion === "izquierda") nuevaColumna--;
  if (direccion === "derecha") nuevaColumna++;

  if (!esMovimientoValido(nuevaFila, nuevaColumna)) return;

   // Iniciar tiempo al primer movimiento
  iniciarTiempo();


  // Actualizar posición
  jugador.fila = nuevaFila;
  jugador.columna = nuevaColumna;

  movimientos++;
  movimientosTexto.textContent = movimientos;

  dibujarJuego();
  verificarMeta();
}

function esMovimientoValido(fila, columna) {
  if (fila < 0 || fila >= filas || columna < 0 || columna >= columnas) {
    return false;
  }

  if (mapa[fila][columna] === 1) {
    return false;
  }

  return true;
}

function verificarMeta() {
    // Si llega a la meta
  if (mapa[jugador.fila][jugador.columna] === 2) {
    juegoTerminado = true;

     // Detener contador de tiempo
    if (animacionTiempo !== null) {
      cancelAnimationFrame(animacionTiempo);
      animacionTiempo = null;
    }

    mensaje.textContent = "Ganaste";
  }
}

document.addEventListener("keydown", function(e) {
  const tecla = e.key.toLowerCase();

  if (
    // Evita que las flechas muevan la página
    tecla === "arrowup" ||
    tecla === "arrowdown" ||
    tecla === "arrowleft" ||
    tecla === "arrowright" ||
    tecla === "w" ||
    tecla === "a" ||
    tecla === "s" ||
    tecla === "d"
  ) {
    e.preventDefault();
  }

   // Movimiento con flechas o WASD
  if (tecla === "arrowup" || tecla === "w") moverJugador("arriba");
  if (tecla === "arrowdown" || tecla === "s") moverJugador("abajo");
  if (tecla === "arrowleft" || tecla === "a") moverJugador("izquierda");
  if (tecla === "arrowright" || tecla === "d") moverJugador("derecha");
});

btnReiniciar.addEventListener("click", iniciarJuego);

iniciarJuego();