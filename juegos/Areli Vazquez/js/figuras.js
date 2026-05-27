//pondre clases, fiugras y objetos del juego
export class Jugador {
    constructor(x, y) { //El constrcutor guarda los datos del jugador 
        this.x = x;
        this.y = y;

        this.width = 25;
        this.height = 25;

        this.color = "red";
        this.speed = 4;
    }

    dibujar(ctx) { //Esto dibuja el cuadro rojo principal
        ctx.fillStyle = this.color;

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}
export class Enemigo {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;

        this.radius = radius;
        this.speed = speed;

        this.directionX = 1; //Esta funcion controla las direcciones 
        this.directionY = Math.random() > 0.5 ? 1 : -1;
    }

    dibujar(ctx) {
        ctx.beginPath();

        ctx.arc( //esto ayuda a dibujar los circulos
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "blue";
        ctx.fill();
    }

    mover() {
        this.x += this.speed * this.directionX;
        this.y += this.speed * this.directionY;

        // Limites v
        if (this.y > 500) {
            this.directionY = -1;
        }

        if (this.y < 100) {
            this.directionY = 1;
        }

        // Limites
        if (this.x > 850) {
            this.directionX = -1;
        }

        if (this.x < 170) {
            this.directionX = 1;
        }
    }
}