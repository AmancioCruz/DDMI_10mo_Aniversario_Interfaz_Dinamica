// nave
const barra = {

    x: 540,
    y: 620,

    ancho: 180,
    alto: 80,

    velocidad: 12,

    imagen: new Image()
};


// pelota
const pelota = {

    x: 640,
    y: 350,

    radio: 12,

    velocidadX: 6,
    velocidadY: 6,

    color: "white"
};
// ladrillos
const ladrillos = [];

const filas = 5;
const columnas = 8;

const anchoLadrillo = 80;
const altoLadrillo = 30;

const separacion = 25;
const anchoTotal =

    columnas *

    (anchoLadrillo + separacion)

    - separacion;


const offsetX =

    (1280 - anchoTotal) / 2;
const offsetY = 60;
// crear ladrillos
for (

    let fila = 0;
    fila < filas;
    fila++

) {

    for (

        let columna = 0;
        columna < columnas;
        columna++

    ) {

        ladrillos.push({

            x:
                offsetX +

                columna *

                (anchoLadrillo + separacion),

            y:
                offsetY +

                fila *

                (altoLadrillo + separacion),

            ancho: anchoLadrillo,

            alto: altoLadrillo,

            vidas: Math.max(1, 4 - fila)
        });
    }
}

// mover nave
function moverBarra(
    teclas,
    barra,
    canvas
) {

    if (teclas.izquierda) {

        barra.x -= barra.velocidad;
    }

    if (teclas.derecha) {

        barra.x += barra.velocidad;
    }


    // limites pantalla
    if (barra.x < 0) {

        barra.x = 0;
    }

    if (barra.x + barra.ancho > canvas.width) {

        barra.x = canvas.width - barra.ancho;
    }
}


// mover pelota
function moverPelota(
      pelota,
    barra,
    canvas,

    textoScore,
    scoreData,

    textoVidas,
    vidas,
    gameOver,

    reiniciarPelota

) {

    pelota.x += pelota.velocidadX;
    pelota.y += pelota.velocidadY;


    // rebote izquierda y derecha
    if (

        pelota.x - pelota.radio < 0 ||
        pelota.x + pelota.radio > canvas.width

    ) {

        pelota.velocidadX *= -1;
    }


    // rebote arriba
    if (

        pelota.y - pelota.radio < 0

    ) {

        pelota.velocidadY *= -1;
    }


    // colision con nave
    if (

        pelota.y + pelota.radio > barra.y &&
        pelota.y - pelota.radio < barra.y + barra.alto &&

        pelota.x + pelota.radio > barra.x &&
        pelota.x - pelota.radio < barra.x + barra.ancho

    ) {

        const choqueIzquierda =
            Math.abs((pelota.x + pelota.radio) - barra.x);

        const choqueDerecha =
            Math.abs((barra.x + barra.ancho) - (pelota.x - pelota.radio));

        const choqueArriba =
            Math.abs((pelota.y + pelota.radio) - barra.y);


        const menorChoque = Math.min(

            choqueIzquierda,
            choqueDerecha,
            choqueArriba
        );


        // rebote lateral izquierdo
        if (menorChoque === choqueIzquierda) {

            pelota.velocidadX *= -1;

            pelota.x = barra.x - pelota.radio;
        }


        // rebote lateral derecho
        else if (menorChoque === choqueDerecha) {

            pelota.velocidadX *= -1;

            pelota.x = barra.x + barra.ancho + pelota.radio;
        }


        // rebote arriba
        else {

            pelota.velocidadY *= -1;

            pelota.y = barra.y - pelota.radio;
        }
    }
    // colision con ladrillos
for (

    let i = 0;
    i < ladrillos.length;
    i++

) {

    const ladrillo = ladrillos[i];


    // ignorar destruidos
    if (ladrillo.vidas > 0) {

        if (

            pelota.x + pelota.radio > ladrillo.x &&
            pelota.x - pelota.radio < ladrillo.x + ladrillo.ancho &&

            pelota.y + pelota.radio > ladrillo.y &&
            pelota.y - pelota.radio < ladrillo.y + ladrillo.alto

        ) {// destruir ladrillo
    ladrillo.vidas--;


// sumar score solo al destruir
if (ladrillo.vidas <= 0) {

    scoreData.valor += 100;

    textoScore.textContent = scoreData.valor;
}


    // rebote
    pelota.velocidadY *= -1;

    break;

           
        }
    }
}
}


// reiniciar pelota
function reiniciarPelota(
    pelota
) {

    pelota.x = 640;
    pelota.y = 350;


    // velocidad fija
    const velocidad = 6;


    // direccion aleatoria
    if (Math.random() < 0.5) {

        pelota.velocidadX = -velocidad;
    }

    else {

        pelota.velocidadX = velocidad;
    }


    // siempre iniciar hacia abajo
    pelota.velocidadY = velocidad;
}


// dibujar nave
function dibujarBarra(
    ctx,
    barra
) {

    ctx.drawImage(

        barra.imagen,

        barra.x,
        barra.y,

        barra.ancho,
        barra.alto
    );
}


// dibujar pelota
function dibujarPelota(
    ctx,
    pelota
) {

    ctx.beginPath();

    ctx.fillStyle = pelota.color;

    ctx.arc(

        pelota.x,
        pelota.y,

        pelota.radio,

        0,
        Math.PI * 2
    );

    ctx.fill();
}
// dibujar ladrillos
function dibujarLadrillos(
    ctx
) {

    for (

        let i = 0;
        i < ladrillos.length;
        i++

    ) {

        const ladrillo = ladrillos[i];


        // no dibujar destruidos
        if (ladrillo.vidas > 0) {

           if (ladrillo.vidas === 4) {

    ctx.fillStyle = "red";
}

else if (ladrillo.vidas === 3) {

    ctx.fillStyle = "orange";
}

else if (ladrillo.vidas === 2) {

    ctx.fillStyle = "yellow";
}

else {

    ctx.fillStyle = "cyan";
}

            ctx.fillRect(

                ladrillo.x,
                ladrillo.y,

                ladrillo.ancho,
                ladrillo.alto
            );
        }
    }
}


export {

    barra,
    pelota,
    ladrillos,

    moverBarra,
    moverPelota,

    dibujarBarra,
    dibujarPelota,
    dibujarLadrillos,
    reiniciarPelota
};