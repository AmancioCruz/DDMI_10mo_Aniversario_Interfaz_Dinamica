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
        context.fillStyle ="purple"
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
}

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const bola = new Bola(200, 200, 10, 2, 2);
bola.draw(context);

function gameLoop(){
    context.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)

    bola.update()
    bola.draw(context);

    requestAnimationFrame(gameLoop);
}

gameLoop();
