//clase base de tanque
class Tanque {
    constructor(x, y, vida, escala, velocidad, grosorLinea, colorLinea, colorRelleno, areaColision) {
        //se guardan los datos originales del tanque
        this.datosOriginales = {
            x,
            y,
            vida,
            escala,
            velocidad,
            grosorLinea,
            colorLinea,
            colorRelleno,
            colorSombra: "transparent",
            brillo: 0
        };

        Object.assign(this, this.datosOriginales);
        //define el limite dentro del canvas del tanque
        this.limite = 35 * this.escala;
        this.areaColision = areaColision;
        
    }

    //dibuja los tanques
    dibujar(ctx, forma) {
        ctx.save();
        ctx.lineWidth = this.grosorLinea;
        ctx.strokeStyle = this.colorLinea;
        ctx.fillStyle = this.colorRelleno;
        ctx.shadowColor = this.colorSombra;
        ctx.shadowBlur = this.brillo;
        ctx.fill(forma);
        ctx.stroke(forma);
        ctx.restore();
    }

    //mantiene a los tanques dentro del canvas
    mover(canvas, posicion) {
        this.x = Math.max(this.limite, Math.min(posicion.x, canvas.width - this.limite));
        this.y = Math.max(this.limite, Math.min(posicion.y, canvas.height - this.limite));
        this.actualizarAreaColision();
    }

    //actualiza el area de colision
    actualizarAreaColision() {
        if (!this.areaColision) return;

        this.areaColision.x = this.x - this.areaColision.ancho / 2;
        this.areaColision.y = this.y - this.areaColision.alto / 2;
    }

    //detecta colision entre objetos
    detectarColision(objeto) {
        const a = this.areaColision;
        const b = objeto.areaColision;

        return a.x < b.x + b.ancho &&
        a.x + a.ancho > b.x &&
        a.y < b.y + b.alto &&
        a.y + a.alto > b.y;

    }

    //mantiene la cuanta de los puntos de vida de los tanques
    recibirDanio(danio) {
        this.vida = Math.max(0, this.vida - danio);
    }
}

//class del tanque que controla el jugador
//se configura area de colision del jugador
//se dibuja el tanque jugador
//control de movimiento del tanque jugador
export class TanqueJugador extends Tanque {
    constructor(x, y, vida, escala, velocidad, colores) {
        const ancho = 70 * escala;
        const alto = 70 * escala;

        super(x, y, vida, escala, velocidad, 3, colores.azul, "rgba(41, 102, 255, .20)", {
                x: x - ancho / 2,
                y: y - alto / 2,
                ancho,
                alto
        });

        this.colores = colores;
        this.colorSombra = colores.azul;
        this.brillo = 14;
    }

    crear(ctx) {

        //Aqui se dibuja la parte del cuerpo del tanque (cuadro)
        const cuerpo = new Path2D();
        cuerpo.rect((this.x -  (this.escala * 25)), (this.y - (this.escala * 25)), (this.escala * 50), (this.escala * 50));
        this.dibujar(ctx, cuerpo);

        //Aqui se dibuja el cañon (rectangulo)
        const canion = new Path2D();
        canion.rect(this.x - (this.escala * 5), this.y - (this.escala * 45), (this.escala * 10), (this.escala * 20));
        this.dibujar(ctx, canion);
    }

    mover(canvas, estados) {

        const posicion = {x: this.x, y: this.y };

        if (estados.arriba) posicion.y -= this.velocidad;
        if (estados.abajo) posicion.y += this.velocidad;
        if (estados.izquierda) posicion.x -= this.velocidad;
        if (estados.derecha) posicion.x += this.velocidad;

        super.mover(canvas, posicion);
    }

    recibirDanio(danio) {
        this.colorLinea = this.colores.blanco;
        this.colorSombra = this.colores.rosa;

        setTimeout(() => {
            this.colorLinea = this.datosOriginales.colorLinea;

            this.colorSombra = this.datosOriginales.colorSombra;
        }, 120);

        super.recibirDanio(danio);
    }
}


//class del tanque que controla a los enemigos
//se configura area de colision de los enemigos
//se dibuja a los tanques enemigos
//control de movimiento de los tanuqes enemigos
export class TanqueEnemigo extends Tanque {
    constructor(x, y, vida, escala, velocidad, colores) {
        const ancho = 70 * escala;
        const alto = 70 * escala;

        super(x, y, vida, escala, velocidad, 3, colores.rosa,"rgba(255, 0, 200, .18)", {
                x: x - ancho / 2,
                y: y - alto / 2,
                ancho,
                alto
            });

        this.colores = colores;
        this.colorSombra = colores.rosa;
        this.brillo = 14;
    }

    crear(ctx) {

        const cuerpo = new Path2D();
        cuerpo.rect(this.x - (this.escala  * 25), this.y - (this.escala * 25), this.escala * 50, this.escala * 50);

        this.dibujar(ctx, cuerpo);


        const canion = new Path2D();
        canion.rect(this.x - (this.escala * 5), this.y + (this.escala * 25), (this.escala * 10), (this.escala * 20));
        this.dibujar(ctx, canion);
    }

    mover(canvas, objetivo) {
        const deltaX = objetivo.x - this.x;
        const deltaY = objetivo.y - this.y;
        const distancia = Math.max(1, Math.hypot(deltaX, deltaY));

        super.mover(canvas, {
            x:this.x + (deltaX / distancia) * this.velocidad,
            y: this.y + (deltaY / distancia) * this.velocidad
        });
    }

    recibirDanio(danio) {
        this.colorLinea = this.colores.amarillo;
        this.colorRelleno = "rgba(255, 234, 0, .40)";

        setTimeout(() => {
            this.colorLinea = this.datosOriginales.colorLinea;
            this.colorRelleno = this.datosOriginales.colorRelleno;
        }, 100);

        super.recibirDanio(danio);
    }
}

//clase que activa la bala
//mueve la bala
//dibuja la bala
//desactiva la bala cuando sale del canvas
//controla el area de colision de la bala
export class Bala {
    constructor(x, y, velocidadX, velocidadY, danio, color) {
        this.x = x;
        this.y = y;
        this.velocidadX = velocidadX;
        this.velocidadY = velocidadY;
        this.danio = danio;
        this.color = color;
        this.radio = 6;
        this.activa = true;
        this.areaColision = {x, y, ancho: this.radio * 2, alto: this.radio * 2};
    }

    crear(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 14;
        ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        this.actualizarAreaColision();
    }

    
    mover(canvas) {

        this.x += this.velocidadX;

        this.y += this.velocidadY;

        this.activa = (

            this.x > -this.radio &&
            this.x < canvas.width + this.radio &&
            this.y > -this.radio &&
            this.y < canvas.height + this.radio
        );
    }

    actualizarAreaColision() {
        this.areaColision = {
            x: this.x - this.radio,
            y: this.y - this.radio,
            ancho: this.radio * 2,
            alto: this.radio * 2
        };
    }

    detectarColision(objeto) {
        const a = this.areaColision;
        const b = objeto.areaColision;

        return a.x < b.x + b.ancho &&
            a.x + a.ancho > b.x &&
            a.y < b.y + b.alto &&
            a.y + a.alto > b.y;
    }
}