class Nave {
    constructor(x, y, vida, escala, velocidad, grosorLinea, colorLinea, colorRelleno, areaColision) {
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
        this.limite = 25 * this.escala;
        this.areaColision = areaColision;
    }

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

    mover(contexto, posicion) {
        this.x = Math.max(this.limite, Math.min(posicion.x, contexto.width - this.limite));
        this.y = Math.max(this.limite, Math.min(posicion.y, contexto.height - this.limite));
        this.actualizarAreaColision();
    }

    actualizarAreaColision() {
        if (!this.areaColision) return;

        this.areaColision.x = this.x - this.areaColision.ancho / 2;
        this.areaColision.y = this.y - this.areaColision.alto / 2;
    }

    // Colision rectangular simple: suficiente para figuras pequeñas y rapidas.
    detectarColision(objeto) {
        const a = this.areaColision;
        const b = objeto.areaColision;

        return a.x < b.x + b.ancho &&
            a.x + a.ancho > b.x &&
            a.y < b.y + b.alto &&
            a.y + a.alto > b.y;
    }

    recibirDanio(danio) {
        this.vida = Math.max(0, this.vida - danio);
    }
}

export class NaveJugador extends Nave {
    constructor(x, y, vida, escala, velocidad, colores) {
        const ancho = 44 * escala;
        const alto = 54 * escala;

        super(x, y, vida, escala, velocidad, 2, colores.azul, "rgba(41, 102, 255, .22)", {
            x: x - ancho / 2,
            y: y - alto / 2,
            ancho,
            alto
        });

        this.colores = colores;
        this.colorSombra = colores.azul;
        this.brillo = 12;
    }

    crear(ctx) {
        const forma = new Path2D();
        forma.moveTo(this.x, this.y - 28 * this.escala);
        forma.lineTo(this.x - 22 * this.escala, this.y + 22 * this.escala);
        forma.lineTo(this.x - 7 * this.escala, this.y + 14 * this.escala);
        forma.lineTo(this.x, this.y + 30 * this.escala);
        forma.lineTo(this.x + 7 * this.escala, this.y + 14 * this.escala);
        forma.lineTo(this.x + 22 * this.escala, this.y + 22 * this.escala);
        forma.closePath();

        this.dibujar(ctx, forma);
    }

    mover(contexto, estados) {
        const posicion = { x: this.x, y: this.y };

        if (estados.arriba) posicion.y -= this.velocidad;
        if (estados.abajo) posicion.y += this.velocidad;
        if (estados.izquierda) posicion.x -= this.velocidad;
        if (estados.derecha) posicion.x += this.velocidad;

        super.mover(contexto, posicion);
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

export class NaveEnemigo extends Nave {
    constructor(x, y, vida, escala, velocidad, colores) {
        const ancho = 48 * escala;
        const alto = 28 * escala;

        super(x, y, vida, escala, velocidad, 2, colores.rosa, "rgba(238, 142, 250, .35)", {
            x: x - ancho / 2,
            y: y - alto / 2,
            ancho,
            alto
        });

        this.colores = colores;
        this.colorSombra = colores.rosa;
        this.brillo = 10;
    }

    crear(ctx) {
        const cuerpo = new Path2D();
        cuerpo.ellipse(this.x, this.y, 22 * this.escala, 10 * this.escala, 0, 0, Math.PI * 2);

        const cabina = new Path2D();
        cabina.arc(this.x, this.y - 6 * this.escala, 9 * this.escala, Math.PI, 0);
        cabina.lineTo(this.x + 9 * this.escala, this.y);
        cabina.lineTo(this.x - 9 * this.escala, this.y);
        cabina.closePath();

        this.dibujar(ctx, cuerpo);
        this.dibujar(ctx, cabina);
    }

    mover(contexto, objetivo) {
        const deltaX = objetivo.x - this.x;
        const deltaY = objetivo.y - this.y;
        const distancia = Math.max(1, Math.hypot(deltaX, deltaY));

        super.mover(contexto, {
            x: this.x + (deltaX / distancia) * this.velocidad,
            y: this.y + (deltaY / distancia) * this.velocidad
        });
    }

    recibirDanio(danio) {
        this.colorLinea = this.colores.amarillo;
        this.colorRelleno = "rgba(255, 234, 0, .45)";

        setTimeout(() => {
            this.colorLinea = this.datosOriginales.colorLinea;
            this.colorRelleno = this.datosOriginales.colorRelleno;
        }, 100);

        super.recibirDanio(danio);
    }
}

export class Bala {
    constructor(x, y, velocidad, danio, color) {
        this.x = x;
        this.y = y;
        this.velocidad = velocidad;
        this.danio = danio;
        this.color = color;
        this.radio = 4;
        this.activa = true;
        this.areaColision = { x, y, ancho: this.radio * 2, alto: this.radio * 2 };
    }

    crear(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        this.actualizarAreaColision();
    }

    mover() {
        this.y -= this.velocidad;
        this.activa = this.y > -this.radio;
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
