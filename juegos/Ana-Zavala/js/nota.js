export class Nota {
    constructor(x, carril, duracion = 0, color = "white", imagen = null) { //sin duracion es una nota normal
        this.carril = carril
        this.x = x;
        this.y = -100;
        this.ancho = 80;
        this.alto = 80;
        this.color = color;
        this.velocidad = 350;
        this.duracion = duracion;
        this.altoSostenido = this.duracion * this.velocidad; //da el tamaño de la barra de duracion
        this.imagen = imagen;

        this.tocada = false;
        this.iniciada = false;
        this.cancelada = false;

        this.progresoSostenido = 0;
    }

    actualizar(deltaTime) {
        if (!this.iniciada) { //antes de tocar baja normalmente
            this.y += this.velocidad * deltaTime;
        }

        if (this.iniciada && !this.cancelada) { //cuando ya se toco entonces deja de bajar y lo consume el progreso
            this.progresoSostenido +=
                this.velocidad * deltaTime;
        }
    }
    dibujar(ctx) {

        if (this.duracion > 0) { //si dura mas de 0 sale la barra de duracion
            ctx.fillStyle = this.color;
            let alturaVisible = this.altoSostenido - this.progresoSostenido; // el alto de la barra menos el progreso, da igual a la altura que se va viendo
            if (alturaVisible < 0) {//para asegurar el cero y no numero negativos
                alturaVisible = 0;
            }
            ctx.fillRect(this.x + 25, this.y - alturaVisible, 30, alturaVisible);
        }

        if (!this.tocada) {//es nota normal
            ctx.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto);
        }
    }
}