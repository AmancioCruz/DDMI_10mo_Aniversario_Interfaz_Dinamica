console.log("JUEGO OK");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// DIBUJAR
function dibujar(){
    requestAnimationFrame(dibujar);
    actualizarAnimaciones();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarNivelActual();
}

// MOUSE MOVE
canvas.addEventListener("mousemove", (evento) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = evento.clientX - rect.left;
    const mouseY = evento.clientY - rect.top;
    // NIVEL ACTUAL
    moverMouseNivelActual(mouseX, mouseY);
});

// INICIO
setTimeout(() => {
    dibujar();
}, 1000);

// MOUSE DOWN
canvas.addEventListener("mousedown", (evento) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = evento.clientX - rect.left;
    const mouseY = evento.clientY - rect.top;
    console.log(mouseX, mouseY);
    clickNivelActual(mouseX, mouseY);
});

// MOUSE UP
canvas.addEventListener("mouseup", () => {
    arrastrandoDiaNoche = false;
    if(scrollDiaNoche >= 239){
        nocheActiva = true;
    }
});