export class Personaje {
    constructor(animacion, izquierda, abajo, arriba, derecha, fallo) {
        this.x = 350;
        this.y = 200;
        this.ancho = 300;
        this.alto = 300

        this.frames = animacion;
        this.izquierda = izquierda;
        this.abajo = abajo;
        this.arriba = arriba;
        this.derecha = derecha;
        this.fallo = fallo;

        this.imagenActual = this.frames[0]; //la imagen que se va mostrando del personaje

        //variables para la animacion
        this.frameActual = 0;
        this.tiempoFrame = 0;
        this.estadoAnimacion = true;
    }

    dibujar(ctx) {
        let offsetX = 0;//para un efecto de moviemnto al hacer un fallo
        if (this.imagenActual === this.fallo) {
            offsetX = Math.random() * 10 - 5;
        }
        ctx.drawImage(this.imagenActual, this.x + offsetX, this.y, this.ancho, this.alto);
    }

    animacion(deltaTime) {
        //si el estado de la animacion es falsa se sale
        if (!this.estadoAnimacion) return;
        this.tiempoFrame += deltaTime; //el tiempo del frame aumento conforme el tiemp actual de la cancion

        if (this.tiempoFrame >= 0.25) { //el 0.25 es la velocidad en que cambian los frames

            this.frameActual++; //el frame aumneta
            if (this.frameActual >= this.frames.length) { //si llega al final de los frames, se reinicia
                this.frameActual = 0;
            }
            this.imagenActual =this.frames[this.frameActual];//se muestra la imagen en el frame que va
            this.tiempoFrame = 0;
        }
    }
    cambiarAnimacion(tecla) { //cambia la imagen segun la tecla de la nota
        if (tecla === "ArrowLeft") {
            this.estadoAnimacion = false;
            this.imagenActual = this.izquierda;
        } else if (tecla === "ArrowDown") {
            this.estadoAnimacion = false;
            this.imagenActual = this.abajo
        } else if (tecla === "ArrowUp") {
            this.estadoAnimacion = false;
            this.imagenActual = this.arriba;
        } else if (tecla === "ArrowRight") {
            this.estadoAnimacion = false
            this.imagenActual = this.derecha;
        }
    }

    volverNormal() { //imagen de etado normal
        this.estadoAnimacion = true;
    }

    mostrarFallo() { //para cambiar la imagen de estado cuando se falla la nota
        this.imagenActual = this.fallo;
    }
}