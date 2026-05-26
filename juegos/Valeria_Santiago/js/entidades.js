// --- CONFIGURACIÓN BASE ---
export const configuracion = {
    tamanoCasilla: 40,
    columnas: 19,
    filas: 13
};

// --- RECURSOS VISUALES ---
export const sprites = {
    jugador: new Image(),
    enemigoBasico: new Image(),
    enemigoRapido: new Image(),
    enemigoFantasma: new Image(),
    enemigoJefe: new Image(),
    muroFijo: new Image(),
    muroJugador: new Image(),
    baratija: new Image(),
    puerta: new Image(),
    poderEspecial: new Image() 
};

let frameActual = 0;
let contadorFrames = 0;
const velocidadAnimacion = 10;

// Placeholders estéticos ---
sprites.jugador.src = './assets/kas.png';
sprites.enemigoBasico.src = './assets/clown.png';
sprites.enemigoRapido.src = './assets/max.png';
sprites.enemigoFantasma.src = './assets/blot.png';
sprites.enemigoJefe.src = './assets/boss.png';


export const animConfig = {
    jugador: { totalFrames: 2, vel: 8 },
    enemigoBasico: { totalFrames: 4, vel: 10 },
    enemigoRapido: { totalFrames: 4, vel: 5 },
    enemigoFantasma: { totalFrames: 4, vel: 8 }
};

//Inmovil
sprites.muroFijo.src = './assets/w.png';
sprites.muroJugador.src = './assets/w2.png';
sprites.baratija.src = './assets/bread.png';
sprites.puerta.src = './assets/exit.png';
sprites.poderEspecial.src = './assets/cotton.png';


// SONIDOS

export const sonidos = {
    herido: new Audio('./assets/sonido/damage.mp3'),
    recolectar: new Audio('./assets/sonido/grab.wav'),
    victoria: new Audio('./assets/sonido/victory.mp3'),
    derrota: new Audio('./assets/sonido/gameover.wav'),
    pared: new Audio('./assets/sonido/wall.wav'),
    invencible: new Audio('./assets/sonido/upgrade.wav'),
    cerrado: new Audio('./assets/sonido/locked.wav'),
    nivel: new Audio('./assets/sonido/levelup.wav'),
    musicaFondo: new Audio('./assets/sonido/carnival-town.mp3'),
    derrotaMusica: new Audio('./assets/sonido/lose.mp3')
};

// --- MAPAS (0=Suelo, 1=Muro, 2=Barricada, 3=Baratija, 4=Salida, 5=Dulce Invencibilidad) ---
export const mapasNiveles = {
    1: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,3,1],
        [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,3,1,0,0,0,0,0,0,0,0,0,1,3,1,0,1],
        [1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1],
        [1,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,1], 
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,1],
        [1,3,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    2: [ 
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,3,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,3,1],
        [1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,1,5,1,0,0,0,0,0,0,0,1], 
        [1,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1],
        [1,3,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,3,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], 
        [1,0,0,0,1,0,0,0,1,3,1,0,0,0,1,0,0,4,1], 
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    3: [ 
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0,1], 
        [1,0,1,3,1,0,0,1,3,1,3,1,0,0,1,3,1,0,1],
        [1,0,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,1], 
        [1,1,1,0,0,1,1,1,0,0,0,1,1,1,0,0,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,0,1],
        [1,0,1,3,1,0,0,1,1,1,1,1,0,0,1,3,1,0,1],
        [1,0,1,0,1,0,0,0,0,5,0,0,0,0,1,0,1,0,1], 
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
};

// --- FUNCIÓN PARA GENERAR ENEMIGOS ---
export function generarEnemigos(nivel) {
    if (nivel === 1) {
        return [
            { x: 16, y: 1, tipo: 'basico', img: sprites.enemigoBasico, ultimoMovimiento: 0, velocidad: 450 },
            { x: 16, y: 11, tipo: 'basico', img: sprites.enemigoBasico, ultimoMovimiento: 0, velocidad: 500 }
        ];
    } else if (nivel === 2) {
        return [
            { x: 17, y: 1, tipo: 'basico', img: sprites.enemigoBasico, ultimoMovimiento: 0, velocidad: 400 },
            { x: 1, y: 10, tipo: 'rapido', img: sprites.enemigoRapido, ultimoMovimiento: 0, velocidad: 220 },
            { x: 15, y: 9, tipo: 'rapido', img: sprites.enemigoRapido, ultimoMovimiento: 0, velocidad: 250 }
        ];
    } else if (nivel === 3) {
        return [
            { x: 9, y: 1, tipo: 'jefe', img: sprites.enemigoJefe, ultimoMovimiento: 0, velocidad: 500 },
            { x: 17, y: 1, tipo: 'fantasma', img: sprites.enemigoFantasma, ultimoMovimiento: 0, velocidad: 800, ultimoTeletransporte: 0 },
            { x: 1, y: 11, tipo: 'rapido', img: sprites.enemigoRapido, ultimoMovimiento: 0, velocidad: 200 }
        ];
    }
}