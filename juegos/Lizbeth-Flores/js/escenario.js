export function dibujarEscenario(ctx, colores) {
  ctx.fillStyle = colores.cafe;
  ctx.fillRect(0, ctx.canvas.height - 40, ctx.canvas.width, 40);

  ctx.fillStyle = colores.menta;
  ctx.fillRect(250, ctx.canvas.height - 120, 120, 20);
  ctx.fillRect(500, ctx.canvas.height - 200, 150, 20);
  ctx.fillRect(750, ctx.canvas.height - 280, 100, 20);

  ctx.fillStyle = colores.rosa;
  ctx.fillRect(400, ctx.canvas.height - 60, 40, 20);

  ctx.fillStyle = colores.amarillo;
  ctx.beginPath();
  ctx.moveTo(600, ctx.canvas.height - 40);
  ctx.lineTo(620, ctx.canvas.height - 40);
  ctx.lineTo(610, ctx.canvas.height - 70);
  ctx.closePath();
  ctx.fill();
}

export function obtenerBloques(ctx) {
  return [
    { x: 0, y: ctx.canvas.height - 40, ancho: ctx.canvas.width, alto: 40 },
    { x: 250, y: ctx.canvas.height - 120, ancho: 120, alto: 20 },
    { x: 500, y: ctx.canvas.height - 200, ancho: 150, alto: 20 },
    { x: 750, y: ctx.canvas.height - 280, ancho: 100, alto: 20 },
    { x: 400, y: ctx.canvas.height - 60, ancho: 40, alto: 20 },
    { x: 600, y: ctx.canvas.height - 70, ancho: 20, alto: 30, peligro: true } 
  ];
}
