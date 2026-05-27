//Puntaje
let puntaje = 0
const scoreElemento = document.getElementById("valor-puntaje");


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

function dibujarFondo(){

    // Fondo blanco
    context.fillStyle = "aliceblue";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Cuadrícula
    context.strokeStyle = "#adadad";
    context.lineWidth = 1;

    const tamañoCuadricula = 50;

    // Líneas verticales
    for(let x = 0; x <= canvas.width; x += tamañoCuadricula){
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    // Líneas horizontales
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
                    scoreElemento.textContent = puntaje;
                    
                }
        }
    })
}

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

let incrementoVelocidad = 0.2;
let tiempoIncremento = 10000;

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

function gameLoop(){
    dibujarFondo();

    bola.update()
    bola.draw(context);

    if(bola.x - bola.radio <0 || bola.x + bola.radio > canvas.width){
        bola.velocidadX = -bola.velocidadX;
    }

    if(bola.y - bola.radio <0){
        bola.velocidadY = -bola.velocidadY;
    }

    if(bola.x + bola.radio > plataforma.x &&
       bola.x - bola.radio < plataforma.x + plataforma.ancho &&
       bola.y + bola.radio > plataforma.y){
        bola.velocidadY = -bola.velocidadY;
       }

    if(bola.y + bola.radio > canvas.height){
        alert("Perdiste! Fin del juego")
        resetearJuego();
    }

    if(bloques.every(bloque => bloque.status === 0)){
        alert("Haz ganado!");
    }

    plataforma.draw(context);

    dibujarLadrillos();

    requestAnimationFrame(gameLoop);
}

gameLoop();
