class Entidad {
  constructor(x, y, ancho, alto) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;

    this.areaColision = { x: this.x, y: this.y, ancho: this.ancho, alto: this.alto };
  }

  actualizarAreaColision() {
    this.areaColision.x = this.x;
    this.areaColision.y = this.y;
    this.areaColision.ancho = this.ancho;
    this.areaColision.alto = this.alto;
  }

  detectarColision(objeto) {
    const a = this.areaColision;
    const b = objeto.areaColision || objeto;
    return (
      a.x < b.x + b.ancho &&
      a.x + a.ancho > b.x &&
      a.y < b.y + b.alto &&
      a.y + a.alto > b.y
    );
  }
}

export class RegalizJugador extends Entidad {
  constructor(x, y, tamañoBase, velocidad, colores) {
    super(x, y, tamañoBase, tamañoBase);
    this.largoBase = tamañoBase;
    this.largoActual = tamañoBase;
    this.velocidad = velocidad;
    this.colores = colores;
    this.vida = 3;
    this.monedas = 0;
  }

  dibujar(ctx) {
    ctx.save();
    ctx.fillStyle = this.colores.rosa;
    ctx.shadowColor = this.colores.rosa;
    ctx.shadowBlur = 10;
    ctx.fillRect(this.x, this.y, this.largoActual, this.alto);
    ctx.restore();

    this.ancho = this.largoActual;
    this.actualizarAreaColision();
  }

  mover(estados, canvas) {
    if (estados.arriba) this.y -= this.velocidad;
    if (estados.abajo) this.y += this.velocidad;
    if (estados.izquierda) this.x -= this.velocidad;
    if (estados.derecha) this.x += this.velocidad;

    this.largoActual = this.largoBase + (this.monedas * 20);

    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.largoActual > canvas.width) this.x = canvas.width - this.largoActual;
    if (this.y + this.alto > canvas.height) this.y = canvas.height - this.alto;

    this.actualizarAreaColision();
  }
}

export class DulceMenta extends Entidad {
  constructor(x, y, colores) {
    super(x, y, 40, 40);
    this.colores = colores;
  }

  dibujar(ctx) {
    ctx.save();
    ctx.fillStyle = this.colores.menta; 
    ctx.strokeStyle = this.colores.rosa;
    ctx.lineWidth = 3;
    ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    ctx.strokeRect(this.x, this.y, this.ancho, this.alto);
    ctx.restore();
    this.actualizarAreaColision();
  }

  mover(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.actualizarAreaColision();
  }
}

export class Moneda extends Entidad {
  constructor(x, y, colores) {
    super(x, y, 20, 20);
    this.colores = colores;
    this.recolectada = false;
  }

  dibujar(ctx) {
    if (this.recolectada) return;
    ctx.save();
    ctx.fillStyle = this.colores.amarillo;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.ancho / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    this.actualizarAreaColision();
  }
}
