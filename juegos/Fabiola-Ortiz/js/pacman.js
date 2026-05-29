const musica = document.getElementById("musica-fondo");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ======================================
// CANVAS
// ======================================

canvas.width = 1000;
canvas.height = 600;

const tileSize = 40;

// ======================================
// HUD
// ======================================

let score = 0;
let vidas = 3;

let gameOver = false;
let win = false;

let juegoIniciado = false;

let modoMiedo = false;
let tiempoMiedo = 0;

// ======================================
// MAPA
// ======================================

const mapaTexto = [

    "#########################",
    "#......................o#",
    "#.#####.#######.#####...#",
    "#........o.............##",
    "#.#####.#.....#.#####...#",
    "#.......#.....#.........#",
    "#####.#####.#####.#######",
    "#..........o............#",
    "#.#####.#######.#####...#",
    "#......................##",
    "#.#####.#.....#.#####...#",
    "#.......#.....#.........#",
    "#####.#####.#####.#######",
    "#o.....................o#",
    "#########################"

];

let mapa = mapaTexto.map(fila => fila.split(""));

// ======================================
// PACMAN
// ======================================

const pacman = {

    x: tileSize + tileSize / 2,
    y: tileSize + tileSize / 2,

    radio: 12,

    dx: 0,
    dy: 0,

    speed: 2,

    angulo: 0

};

// ======================================
// FANTASMAS
// ======================================

const ghosts = [

    {
        x: 440,
        y: 200,
        size: 14,
        color: "red",
        dx: 2,
        dy: 0
    },

    {
        x: 560,
        y: 200,
        size: 14,
        color: "pink",
        dx: -2,
        dy: 0
    },

    {
        x: 440,
        y: 360,
        size: 14,
        color: "cyan",
        dx: 2,
        dy: 0
    },

    {
        x: 560,
        y: 360,
        size: 14,
        color: "orange",
        dx: -2,
        dy: 0
    }

];

// ======================================
// CONTROLES
// ======================================

document.addEventListener("keydown", (e) => {

    if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
    ) {
        e.preventDefault();
    }

    if (!juegoIniciado) return;

    if (e.key === "ArrowUp") {

        pacman.dx = 0;
        pacman.dy = -pacman.speed;
        pacman.angulo = 1.5;

    }

    if (e.key === "ArrowDown") {

        pacman.dx = 0;
        pacman.dy = pacman.speed;
        pacman.angulo = 0.5;

    }

    if (e.key === "ArrowLeft") {

        pacman.dx = -pacman.speed;
        pacman.dy = 0;
        pacman.angulo = 1;

    }

    if (e.key === "ArrowRight") {

        pacman.dx = pacman.speed;
        pacman.dy = 0;
        pacman.angulo = 0;

    }

});

// ======================================
// DIBUJAR MAPA
// ======================================

function dibujarMapa() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let fila = 0; fila < mapa.length; fila++) {

        for (let columna = 0; columna < mapa[fila].length; columna++) {

            let tile = mapa[fila][columna];

            let x = columna * tileSize;
            let y = fila * tileSize;

            // MUROS

            if (tile === "#") {

                ctx.strokeStyle = "#00f0ff";
                ctx.lineWidth = 3;

                ctx.strokeRect(
                    x,
                    y,
                    tileSize,
                    tileSize
                );

            }

            // PUNTOS

            if (tile === ".") {

                ctx.fillStyle = "white";

                ctx.beginPath();

                ctx.arc(
                    x + tileSize / 2,
                    y + tileSize / 2,
                    2,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

            // POWER PELLET

            if (tile === "o") {

                ctx.fillStyle = "white";

                ctx.beginPath();

                ctx.arc(
                    x + tileSize / 2,
                    y + tileSize / 2,
                    8,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

        }

    }

}

// ======================================
// PACMAN
// ======================================

let boca = 0.2;
let cerrar = false;

function dibujarPacman() {

    if (cerrar) {

        boca -= 0.02;

        if (boca <= 0.05) {

            cerrar = false;

        }

    } else {

        boca += 0.02;

        if (boca >= 0.25) {

            cerrar = true;

        }

    }

    ctx.fillStyle = "yellow";

    ctx.beginPath();

    ctx.arc(
        pacman.x,
        pacman.y,
        pacman.radio,
        (boca + pacman.angulo) * Math.PI,
        ((2 - boca) + pacman.angulo) * Math.PI
    );

    ctx.lineTo(pacman.x, pacman.y);

    ctx.fill();

}

// ======================================
// DIBUJAR FANTASMAS
// ======================================

function dibujarFantasmas() {

    ghosts.forEach(g => {

        if (modoMiedo) {

            ctx.fillStyle = "#0044ff";

        } else {

            ctx.fillStyle = g.color;

        }

        ctx.beginPath();

        ctx.arc(
            g.x,
            g.y,
            g.size,
            Math.PI,
            0
        );

        ctx.lineTo(g.x + g.size, g.y + g.size);
        ctx.lineTo(g.x - g.size, g.y + g.size);

        ctx.closePath();

        ctx.fill();

        ctx.fillStyle = "white";

        ctx.beginPath();

        ctx.arc(g.x - 5, g.y - 3, 3, 0, Math.PI * 2);
        ctx.arc(g.x + 5, g.y - 3, 3, 0, Math.PI * 2);

        ctx.fill();

    });

}

// ======================================
// 
//MURO
// ======================================

function tocaMuro(x, y, radio) {

    let izquierda = Math.floor((x - radio) / tileSize);
    let derecha = Math.floor((x + radio) / tileSize);

    let arriba = Math.floor((y - radio) / tileSize);
    let abajo = Math.floor((y + radio) / tileSize);

    return (

        mapa[arriba][izquierda] === "#" ||
        mapa[arriba][derecha] === "#" ||
        mapa[abajo][izquierda] === "#" ||
        mapa[abajo][derecha] === "#"

    );

}

// ======================================
// MOVER PACMAN
// ======================================

function moverPacman() {

    let siguienteX = pacman.x + pacman.dx;
    let siguienteY = pacman.y + pacman.dy;

    if (!tocaMuro(siguienteX, siguienteY, pacman.radio)) {

        pacman.x = siguienteX;
        pacman.y = siguienteY;

    }

}

// ======================================
// COMER PUNTOS
// ======================================

function comerPuntos() {

    let columna = Math.floor(pacman.x / tileSize);
    let fila = Math.floor(pacman.y / tileSize);

    if (mapa[fila][columna] === ".") {

        mapa[fila][columna] = " ";
        score += 10;

    }

    if (mapa[fila][columna] === "o") {

        mapa[fila][columna] = " ";

        score += 50;

        modoMiedo = true;
        tiempoMiedo = 600;

    }

}

// ======================================
// MOVER FANTASMAS
// ======================================

function moverFantasmas() {

    ghosts.forEach(ghost => {

        let siguienteX = ghost.x + ghost.dx;
        let siguienteY = ghost.y + ghost.dy;

        if (tocaMuro(siguienteX, siguienteY, ghost.size)) {

            const direcciones = [

                { dx: 2, dy: 0 },
                { dx: -2, dy: 0 },
                { dx: 0, dy: 2 },
                { dx: 0, dy: -2 }

            ];

            direcciones.sort(() => Math.random() - 0.5);

            for (let dir of direcciones) {

                let nx = ghost.x + dir.dx;
                let ny = ghost.y + dir.dy;

                if (!tocaMuro(nx, ny, ghost.size)) {

                    ghost.dx = dir.dx;
                    ghost.dy = dir.dy;

                    break;

                }

            }

        }

        ghost.x += ghost.dx;
        ghost.y += ghost.dy;

    });

}

// ======================================
// COLISION CON FANTASMAS
// ======================================

function detectarColision() {

    ghosts.forEach(ghost => {

        let dx = pacman.x - ghost.x;
        let dy = pacman.y - ghost.y;

        let distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < pacman.radio + ghost.size) {

            if (modoMiedo) {

                ghost.x = 480;
                ghost.y = 280;

                score += 200;

            } else {

                vidas--;

                pacman.x = tileSize + tileSize / 2;
                pacman.y = tileSize + tileSize / 2;

                pacman.dx = 0;
                pacman.dy = 0;

                if (vidas <= 0) {

                    gameOver = true;
                    juegoIniciado = false;

                    if (musica) {
                        musica.pause();
                    }

                }

            }

        }

    });

}

// ======================================
// VICTORIA
// ======================================

function verificarVictoria() {

    let quedanPuntos = false;

    for (let fila = 0; fila < mapa.length; fila++) {

        for (let columna = 0; columna < mapa[fila].length; columna++) {

            if (
                mapa[fila][columna] === "." ||
                mapa[fila][columna] === "o"
            ) {

                quedanPuntos = true;

            }

        }

    }

    if (!quedanPuntos) {

        win = true;
        juegoIniciado = false;

        if (musica) {
            musica.pause();
        }

    }

}

// ======================================
// HUD
// ======================================

function actualizarHUD() {

    document.getElementById("valor-puntaje")
        .textContent = score;

    document.getElementById("vida-jugador")
        .textContent = vidas;

}

// ======================================
// REINICIAR
// ======================================

function reiniciarJuego() {

    score = 0;
    vidas = 3;

    gameOver = false;
    win = false;

    juegoIniciado = true;

    modoMiedo = false;
    tiempoMiedo = 0;

    mapa = mapaTexto.map(fila => fila.split(""));

    pacman.x = tileSize + tileSize / 2;
    pacman.y = tileSize + tileSize / 2;

    pacman.dx = 0;
    pacman.dy = 0;

    ghosts[0].x = 440;
    ghosts[0].y = 200;

    ghosts[1].x = 560;
    ghosts[1].y = 200;

    ghosts[2].x = 440;
    ghosts[2].y = 360;

    ghosts[3].x = 560;
    ghosts[3].y = 360;

    ghosts[0].dx = 2;
    ghosts[1].dx = -2;
    ghosts[2].dx = 2;
    ghosts[3].dx = -2;

    ghosts[0].dy = 0;
    ghosts[1].dy = 0;
    ghosts[2].dy = 0;
    ghosts[3].dy = 0;

    actualizarHUD();

  if (musica) {

    musica.currentTime = 0;

}
}

// ======================================
// BOTON
// ======================================

const botonInicio =
    document.getElementById("reiniciar-juego");

botonInicio.addEventListener("click", async () => {

    reiniciarJuego();

    try {

        await musica.play();

    } catch(error) {

        console.log("No se pudo reproducir:", error);

    }

});

// ======================================
// LOOP
// ======================================

function actualizar() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ======================================
    // GAME OVER
    // ======================================

    if (gameOver) {

        // Fondo oscuro
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Posición centrada en el mapa
        const centroX = 530;
        const centroY = 300;

        // Texto principal
        ctx.fillStyle = "red";
        ctx.font = "bold 80px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "GAME OVER",
            centroX,
            centroY
        );

        // Texto secundario
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";

        ctx.fillText(
            "Presiona INICIAR",
            centroX,
            centroY + 60
        );

        requestAnimationFrame(actualizar);
        return;
    }



    // ======================================
    // YOU WIN
    // ======================================

    if (win) {

        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centroX = 530;
        const centroY = 300;

        ctx.fillStyle = "yellow";
        ctx.font = "bold 80px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "YOU WIN!",
            centroX,
            centroY
        );

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";

        ctx.fillText(
            "Presiona INICIAR",
            centroX,
            centroY + 60
        );

        requestAnimationFrame(actualizar);
        return;
    }
    dibujarMapa();

    if (juegoIniciado) {

        moverPacman();

        comerPuntos();

        moverFantasmas();

        detectarColision();

        verificarVictoria();

    }

    dibujarPacman();

    dibujarFantasmas();

    actualizarHUD();

    // ======================================
    // MODO MIEDO
    // ======================================

    if (modoMiedo) {

        tiempoMiedo--;

        if (tiempoMiedo <= 0) {

            modoMiedo = false;

        }

    }

    requestAnimationFrame(actualizar);

}

actualizar();
