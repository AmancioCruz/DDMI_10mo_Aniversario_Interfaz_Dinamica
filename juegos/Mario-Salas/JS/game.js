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

} from "./entidades.js";


const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const btnStart = document.querySelector("#btnStart");
const btnIzquierda = document.querySelector("#btnIzquierda");
const btnDerecha = document.querySelector("#btnDerecha");
const textoVidas = document.querySelector("#vidas");
const textoScore = document.querySelector("#score");

let juegoIniciado = false;
let vidas = 3;
let gameOver = false;
let youWin = false;
let score = 0;
const scoreData = {

    valor: 0
};
// imagen de la nave
const inputNave = document.querySelector("#inputNave");

inputNave.addEventListener("change", (event) => {

    const archivo = event.target.files[0];

    if (archivo) {

        barra.imagen.src = URL.createObjectURL(archivo);
    }
});


// teclado
const teclas = {

    izquierda: false,
    derecha: false
};


// detectar teclas
window.addEventListener("keydown", (event) => {

    if (event.code === "ArrowLeft") {

        teclas.izquierda = true;
    }

    if (event.code === "ArrowRight") {

        teclas.derecha = true;
    }
    
});


window.addEventListener("keyup", (event) => {

    if (event.code === "ArrowLeft") {

        teclas.izquierda = false;
    }

    if (event.code === "ArrowRight") {

        teclas.derecha = false;
    }
});
// mover izquierda touch
btnIzquierda.addEventListener("touchstart", () => {

    teclas.izquierda = true;
});

btnIzquierda.addEventListener("touchend", () => {

    teclas.izquierda = false;
});


// mover derecha touch
btnDerecha.addEventListener("touchstart", () => {

    teclas.derecha = true;
});

btnDerecha.addEventListener("touchend", () => {

    teclas.derecha = false;
});


btnStart.addEventListener("click", () => {

    if (gameOver || youWin) {

        reiniciarJuego();
    }


    juegoIniciado = true;
});


// dibujar game over
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
function reiniciarJuego() {

    vidas = 3;

    textoVidas.textContent = vidas;


    scoreData.valor = 0;

    textoScore.textContent = 0;


    gameOver = false;

    youWin = false;


    reiniciarPelota(pelota);


    // reiniciar ladrillos
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

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    moverBarra(
        teclas,
        barra,
        canvas
    );


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


        if (

            pelota.y - pelota.radio > canvas.height

        ) {

            vidas--;

            textoVidas.textContent = vidas;

            reiniciarPelota(pelota);

            if (vidas <= 0) {

                gameOver = true;

                juegoIniciado = false;
            }
        }
    }


    dibujarBarra(
        ctx,
        barra
    );

    dibujarPelota(
        ctx,
        pelota
    );
    dibujarLadrillos(ctx);
    const ladrillosRestantes = ladrillos.filter(

    ladrillo => ladrillo.vidas > 0
);


if (ladrillosRestantes.length === 0) {

    youWin = true;

    juegoIniciado = false;
    gameOver = false;
}


    if (gameOver) {

        dibujarGameOver();
    }
    if (youWin) {

    dibujarYouWin();
}


    requestAnimationFrame(actualizar);
}


// iniciar loop
actualizar();