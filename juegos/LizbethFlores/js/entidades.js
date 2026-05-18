class Entidad {
  constructor(x, y, ancho, alto) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.areaColision = { x, y, ancho, alto };
  }

  actualizarAreaColision() {
    this.areaColision.x = this.x;
    this.areaColision.y = this.y;
    this.areaColision.ancho = this.ancho;
    this.areaColision.alto = this.alto;
  }

  detectarColision(objeto) {
    const a = this.areaColision;
    const b = objeto.areaColision;
    return (
      a.x < b.x + b.ancho &&
      a.x + a.ancho > b.x &&
      a.y < b.y + b.alto &&
      a.y + a.alto > b.y
    );
  }
}

export class RegalizJugador extends Entidad {
  constructor(x, y, largoBase, velocidad, colores) {
    super(x, y, largoBase, 20);
    this.largoBase = largoBase;
    this.largoActual = largoBase;
    this.velocidad = velocidad;
    this.colores = colores;
    this.estirando = false;
    this.vida = 3;
    this.monedas = 0;
  }

  dibujar(ctx) {
    ctx.save();
    ctx.fillStyle = this.colores.rosa;
    ctx.shadowColor = this.colores.rosa;
    ctx.shadowBlur = 8;

    ctx.fillRect(this.x, this.y, this.largoActual, this.alto);

    ctx.restore();
    this.actualizarAreaColision();
  }

  mover(estados) {
    if (estados.arriba) this.y -= this.velocidad;
    if (estados.abajo) this.y += this.velocidad;
    if (estados.izquierda) this.x -= this.velocidad;
    if (estados.derecha) this.x += this.velocidad;

    if (this.estirando) {
      this.largoActual = Math.min(this.largoBase * 2, this.largoActual + 2);
    } else {
      this.largoActual = Math.max(this.largoBase, this.largoActual - 2);
    }
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