// importar objetos y funciones principales del juego
import {

    barra,
    pelota,
    ladrillos,

    moverBarra,
    moverPelota,

    dibujarBarra,
    dibujarPelota,
    dibujarLadrillos,

    reiniciarPelota

} from "./objetos.js";


// obtener canvas y contexto
const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");


// elementos de interfaz
const btnStart = document.querySelector("#btnStart");
const btnIzquierda = document.querySelector("#btnIzquierda");
const btnDerecha = document.querySelector("#btnDerecha");

const textoVidas = document.querySelector("#vidas");
const textoScore = document.querySelector("#score");


// estados del juego
let juegoIniciado = false;
let vidas = 3;
let gameOver = false;
let youWin = false;


// objeto compartido para score
const scoreData = {

    valor: 0
};


// cargar imagen personalizada de nave
const inputNave = document.querySelector("#inputNave");

inputNave.addEventListener("change", (event) => {

    const archivo = event.target.files[0];

    if (archivo) {

        barra.imagen.src = URL.createObjectURL(archivo);
    }
});


// control de movimiento
const teclas = {

    izquierda: false,
    derecha: false
};


// detectar teclas presionadas
window.addEventListener("keydown", (event) => {

    if (event.code === "ArrowLeft") {

        teclas.izquierda = true;
    }

    if (event.code === "ArrowRight") {

        teclas.derecha = true;
    }
});


// detectar teclas soltadas
window.addEventListener("keyup", (event) => {

    if (event.code === "ArrowLeft") {

        teclas.izquierda = false;
    }

    if (event.code === "ArrowRight") {

        teclas.derecha = false;
    }
});


// controles touch para celular
btnIzquierda.addEventListener("touchstart", () => {

    teclas.izquierda = true;
});

btnIzquierda.addEventListener("touchend", () => {

    teclas.izquierda = false;
});


btnDerecha.addEventListener("touchstart", () => {

    teclas.derecha = true;
});

btnDerecha.addEventListener("touchend", () => {

    teclas.derecha = false;
});


// iniciar o reiniciar juego
btnStart.addEventListener("click", () => {

    if (gameOver || youWin) {

        reiniciarJuego();
    }

    juegoIniciado = true;
});


// pantalla game over
function dibujarGameOver() {

    ctx.fillStyle = "white";

    ctx.font = "80px Arial";

    ctx.textAlign = "center";

    ctx.fillText(

        "GAME OVER",

        canvas.width / 2,
        canvas.height / 2
    );
}


// pantalla victoria
function dibujarYouWin() {

    ctx.fillStyle = "cyan";

    ctx.font = "80px Arial";

    ctx.textAlign = "center";

    ctx.fillText(

        "YOU WIN",

        canvas.width / 2,
        canvas.height / 2
    );
}


// reiniciar estados del juego
function reiniciarJuego() {

    vidas = 3;

    textoVidas.textContent = vidas;


    scoreData.valor = 0;

    textoScore.textContent = 0;


    gameOver = false;

    youWin = false;


    reiniciarPelota(pelota);


    // restaurar vidas de ladrillos
    for (

        let i = 0;
        i < ladrillos.length;
        i++

    ) {

        const ladrillo = ladrillos[i];


        const fila = Math.floor(i / 8);


        ladrillo.vidas = Math.max(1, 4 - fila);
    }
}


// loop principal
function actualizar() {

    // limpiar canvas
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // mover nave
    moverBarra(
        teclas,
        barra,
        canvas
    );


    // actualizar pelota
    if (juegoIniciado) {

        moverPelota(
            pelota,
            barra,
            canvas,

            textoScore,
            scoreData,

            textoVidas,
            vidas,
            gameOver,

            reiniciarPelota
        );


        // detectar caída de pelota
        if (

            pelota.y - pelota.radio > canvas.height

        ) {

            vidas--;

            textoVidas.textContent = vidas;


            reiniciarPelota(pelota);


            // detectar derrota
            if (vidas <= 0) {

                gameOver = true;

                juegoIniciado = false;
            }
        }
    }


    // dibujar elementos
    dibujarBarra(
        ctx,
        barra
    );

    dibujarPelota(
        ctx,
        pelota
    );

    dibujarLadrillos(ctx);


    // revisar victoria
    const ladrillosRestantes = ladrillos.filter(

        ladrillo => ladrillo.vidas > 0
    );


    if (ladrillosRestantes.length === 0) {

        youWin = true;

        juegoIniciado = false;

        gameOver = false;
    }


    // mostrar game over
    if (gameOver) {

        dibujarGameOver();
    }


    // mostrar victoria
    if (youWin) {

        dibujarYouWin();
    }


    // repetir loop
    requestAnimationFrame(actualizar);
}


// iniciar loop principal
actualizar();