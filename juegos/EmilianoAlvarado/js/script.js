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
    draw(context){
        context.fillStyle = "orange";
        context.fillRect(this.x, this.y, this.ancho, this.alto);
    }
    mover(direcccion){
        this.x += this.velocidad * direcccion;
    }
}

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const bola = new Bola(200, 200, 10, 2, 2);
const plataforma = new Plataforma(175, canvas.clientHeight-20,70,10,20);


document.addEventListener("keydown",(event)=>{
    if(event.key === "ArrowLeft"){
        plataforma.mover(-1);
    } else if(event.key ==="ArrowRight"){
        plataforma.mover(1);
    }
})

function gameLoop(){
    context.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)

    bola.update()
    bola.draw(context);

    if(bola.x -)

    plataforma.draw(context);

    requestAnimationFrame(gameLoop);
}

gameLoop();
