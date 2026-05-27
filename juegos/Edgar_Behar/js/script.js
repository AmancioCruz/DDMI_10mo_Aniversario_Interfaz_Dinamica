const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ANCHO_CANVAS = canvas.width;
const ALTO_CANVAS = canvas.height;

let ultimoTiempo = 0;

function buclePrincipal(tiempoActual = 0) {
    const deltaTiempo = (tiempoActual - ultimoTiempo) / 1000;
    ultimoTiempo = tiempoActual;

    if (typeof actualizarJuego === "function") {
        actualizarJuego(deltaTiempo);
    }

    if (typeof dibujarInterfaz === "function") {
        dibujarInterfaz(ctx);
    }

    requestAnimationFrame(buclePrincipal);
}

/*MANEJO DE CLICS*/
function manejarClick(evento) {
    // Posición del mouse segun el canvas
    const rect = canvas.getBoundingClientRect();

    const escalaX = canvas.width / rect.width;
    const escalaY = canvas.height / rect.height;

    // Coordenadas del canvas
    const x = (evento.clientX - rect.left) * escalaX;
    const y = (evento.clientY - rect.top) * escalaY;

    if (typeof procesarClick === "function") {
        procesarClick(x, y);
    }
}

/* Inicio */
function iniciarJuego() {
    if (typeof inicializarJuego === "function") {
        inicializarJuego();
    }

    canvas.addEventListener("click", manejarClick);

    requestAnimationFrame(buclePrincipal);
}

window.addEventListener("load", async () => {
    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }

    iniciarJuego();
});