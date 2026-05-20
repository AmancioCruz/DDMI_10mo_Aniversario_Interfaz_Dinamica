const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const btnStart = document.querySelector("#btnStart");
const textoVidas = document.querySelector("#vidas");

let juegoIniciado = false;
let vidas = 3;
let gameOver = false;


// imagen de la nave
const inputNave = document.querySelector("#inputNave");

const naveImg = new Image();

inputNave.addEventListener("change", (event) => {

    const archivo = event.target.files[0];

    if (archivo) {

        naveImg.src = URL.createObjectURL(archivo);
    }
});


// nave
const barra = {

    x: 540,
    y: 620,

    ancho: 180,
    alto: 80,

    velocidad: 12
};


// pelota
const pelota = {

    x: 640,
    y: 350,

    radio: 12,

    velocidadX: 6,
    velocidadY: 6,

    color: "white"
};


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


// boton start
btnStart.addEventListener("click", () => {

    if (!gameOver) {

        juegoIniciado = true;
    }
});


// mover nave
function moverBarra() {

    if (teclas.izquierda) {

        barra.x -= barra.velocidad;
    }

    if (teclas.derecha) {

        barra.x += barra.velocidad;
    }


    // limites pantalla
    if (barra.x < 0) {

        barra.x = 0;
    }

    if (barra.x + barra.ancho > canvas.width) {

        barra.x = canvas.width - barra.ancho;
    }
}


// mover pelota
function moverPelota() {

    pelota.x += pelota.velocidadX;
    pelota.y += pelota.velocidadY;


    // rebote izquierda y derecha
    if (

        pelota.x - pelota.radio < 0 ||
        pelota.x + pelota.radio > canvas.width

    ) {

        pelota.velocidadX *= -1;
    }


    // rebote arriba
    if (

        pelota.y - pelota.radio < 0

    ) {

        pelota.velocidadY *= -1;
    }


    // colision con nave
    if (

        pelota.y + pelota.radio > barra.y &&
        pelota.y - pelota.radio < barra.y + barra.alto &&

        pelota.x + pelota.radio > barra.x &&
        pelota.x - pelota.radio < barra.x + barra.ancho

    ) {

        pelota.velocidadY *= -1;

        // evitar atravesar nave
        pelota.y = barra.y - pelota.radio;
    }


    // perder pelota
    if (

        pelota.y - pelota.radio > canvas.height

    ) {

        vidas--;

        textoVidas.textContent = vidas;

        reiniciarPelota();


        // game over
        if (vidas <= 0) {

            gameOver = true;

            juegoIniciado = false;
        }
    }
}


// reiniciar pelota
function reiniciarPelota() {

    pelota.x = 640;
    pelota.y = 350;

    pelota.velocidadX = 6;
    pelota.velocidadY = 6;

    juegoIniciado = false;
}


// dibujar nave
function dibujarBarra() {

    ctx.drawImage(

        naveImg,

        barra.x,
        barra.y,

        barra.ancho,
        barra.alto
    );
}


// dibujar pelota
function dibujarPelota() {

    ctx.beginPath();

    ctx.fillStyle = pelota.color;

    ctx.arc(

        pelota.x,
        pelota.y,

        pelota.radio,

        0,
        Math.PI * 2
    );

    ctx.fill();
}


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


// loop principal
function actualizar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    moverBarra();


    if (juegoIniciado) {

        moverPelota();
    }


    dibujarBarra();

    dibujarPelota();


    if (gameOver) {

        dibujarGameOver();
    }


    requestAnimationFrame(actualizar);
}


// iniciar loop
actualizar();