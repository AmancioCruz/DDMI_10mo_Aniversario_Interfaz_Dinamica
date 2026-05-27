//sonidos
const sonidoBloque = new Audio("rec/r0t0r-8-bit-laser-151672.mp3");
const sonidoPlataforma = new Audio("rec/freesound_community-one_beep-99630.mp3");

//Puntaje
let puntaje = 0
const scoreElemento = document.getElementById("valor-puntaje");

// Estado del juego
let juegoIniciado = false;
let juegoTerminado = false;

// Pantalla overlay
function dibujarPantalla(mensaje, textoBoton){

    context.fillStyle = "rgba(82, 101, 106, 0.7)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "Black";
    context.font = "48px Arial";
    context.textAlign = "center";

    context.fillText(
        mensaje,
        canvas.width / 2,
        canvas.height / 2 - 20
    );

    context.font = "24px Arial";

    context.fillText(
        textoBoton,
        canvas.width / 2,
        canvas.height / 2 + 40
    );
}

// Botón iniciar/reiniciar
const botonInicio = document.getElementById("reiniciar-juego");

botonInicio.addEventListener("click", () => {

    if(!juegoIniciado || juegoTerminado){

        juegoIniciado = true;
        juegoTerminado = false;

        resetearJuego();

        gameLoop();
    }
});

//Bola
class Bola {
    constructor(x, y, radio, velocidadX, velocidadY){
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.velocidadX = velocidadX;
        this.velocidadY = velocidadY;
    }
    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radio, 0, Math.PI*2);
        context.fillStyle ="red"
        context.fill();
        context.closePath();
    }
    update() {
        this.x += this.velocidadX;
        this.y += this.velocidadY
    }
}

//Plataforma
class Plataforma {
    constructor(x, y, ancho, alto, velocidad){
        this.x = x
        this.y = y
        this.ancho = ancho
        this.alto = alto
        this.velocidad = velocidad
    }
    draw(context){
        context.fillStyle = "blue";
        context.fillRect(this.x, this.y, this.ancho, this.alto);
    }
    mover(direcccion){
        this.x += this.velocidad * direcccion;
    }
}

//Bloques
class Bloque {
    constructor(x, y, ancho, alto){
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.status = 1;
    }

    draw(context){
        if(this.status === 1){
            context.fillStyle = "orange";
            context.fillRect(this.x, this.y, this.ancho, this.alto);
        }
    }
}

//Juego
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const bola = new Bola(canvas.width/2, canvas.height/2, 15, -2, -2);
const plataforma = new Plataforma(
    canvas.width / 2 - 50,
    canvas.height - 20,
    150,
    10,
    20
);

// Mostrar pantalla inicial
dibujarFondo();

dibujarPantalla(
    "BREAK THROUGH",
    "Presiona el botón Iniciar"
);


//Fondo
function dibujarFondo(){

    //Fondo blanco
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //Cuadrícula
    context.strokeStyle = "#adadad";
    context.lineWidth = 1;

    const tamañoCuadricula = 50;

    //Líneas verticales
    for(let x = 0; x <= canvas.width; x += tamañoCuadricula){
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    //Líneas horizontales
    for(let y = 0; y <= canvas.height; y += tamañoCuadricula){
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }
}

//Ladrillos
const bloques = []

function crearPared(){

    bloques.length = 0;

    const bloqueLineas = 6;
    const bloqueColumnas = 12;

    const margenHorizontal = 20;
    const margenSuperior = 20;
    const espacio = 5;

    const bloqueAncho =
        (canvas.width - margenHorizontal * 2 - (bloqueColumnas - 1) * espacio)
        / bloqueColumnas;

    const bloqueAlto = 30;

    for(let r = 0; r < bloqueLineas; r++){

        for(let c = 0; c < bloqueColumnas; c++){

            const x =
                margenHorizontal +
                c * (bloqueAncho + espacio);

            const y =
                margenSuperior +
                r * (bloqueAlto + espacio);

            bloques.push(
                new Bloque(
                    x,
                    y,
                    bloqueAncho,
                    bloqueAlto
                )
            );
        }
    }
}

//Dibujar los ladrillos
function dibujarLadrillos(){
    bloques.forEach(bloque =>{
        if(bloque.status === 1){
            bloque.draw(context);

            if(bola.x > bloque.x && bola.x < bloque.x + bloque.ancho &&
                bola.y > bloque.y && bola.y < bloque.y + bloque.alto){
                    bola.velocidadY = -bola.velocidadY;
                    bloque.status = 0;
                    puntaje +=10;
                    sonidoBloque.currentTime = 0; 
                    sonidoBloque.play();
                    scoreElemento.textContent = puntaje;
                }
        }
    })
}

//Controles
document.addEventListener("keydown",(event)=>{
    if(event.key === "ArrowLeft"){
        plataforma.mover(-1);
    } else if(event.key ==="ArrowRight"){
        plataforma.mover(1);
    }
})

document.addEventListener("keyup",(event)=>{
    if(event.key === "ArrowLeft" || event.key === "ArrowRight"){
        plataforma.mover(0);
    }
})


crearPared();

//Resetear el juego
function resetearJuego(){

    bola.x = canvas.width / 2;
    bola.y = canvas.height / 2;

    bola.velocidadX = -2;
    bola.velocidadY = -2;

    plataforma.x = canvas.width / 2 - plataforma.ancho / 2;

    bloques.forEach(bloque => {
        bloque.status = 1;
    });
}

//Aumento de velocidad en la bola
let incrementoVelocidad = 0.3;
let tiempoIncremento = 5000;

setInterval(() => {

    if(bola.velocidadX > 0){
        bola.velocidadX += incrementoVelocidad;
    } else {
        bola.velocidadX -= incrementoVelocidad;
    }

    if(bola.velocidadY > 0){
        bola.velocidadY += incrementoVelocidad;
    } else {
        bola.velocidadY -= incrementoVelocidad;
    }

}, tiempoIncremento);

//Gameloop
function gameLoop(){
    dibujarFondo();

    bola.update()
    bola.draw(context);

    //Colision con los bordes
    if(bola.x - bola.radio <0 || bola.x + bola.radio > canvas.width){
        bola.velocidadX = -bola.velocidadX;
    }

    //Colision con el techo
    if(bola.y - bola.radio <0){
        bola.velocidadY = -bola.velocidadY;
    }

    //Colision de la plataforma
    if(bola.x + bola.radio > plataforma.x &&
       bola.x - bola.radio < plataforma.x + plataforma.ancho &&
       bola.y + bola.radio > plataforma.y){
        bola.velocidadY = -bola.velocidadY;
        sonidoPlataforma.currentTime = 0; 
        sonidoPlataforma.play();
       }

    //Concicion de derrota   
    if(bola.y + bola.radio > canvas.height){

    juegoTerminado = true;

    dibujarPantalla(
        "GAME OVER",
        "Presiona Iniciar para reiniciar"
    );

    return;
}

    //Condicion de victoria
    if(bloques.every(bloque => bloque.status === 0)){
        alert("Haz ganado!");
    }

    plataforma.draw(context);

    dibujarLadrillos();

    requestAnimationFrame(gameLoop);
}


