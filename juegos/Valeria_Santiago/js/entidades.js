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

// Placeholders estéticos ---! Hay que cambiar los gifs por ciclos for !---
sprites.jugador.src = './assets/kas.gif';
sprites.enemigoBasico.src = './assets/clown.gif';
sprites.enemigoRapido.src = './assets/max.gif';
sprites.enemigoFantasma.src = './assets/blot.gif';
sprites.enemigoJefe.src = 'https://placehold.co/40x40/8e44ad/ffffff?text=JEFE';
sprites.muroFijo.src = './assets/w.png';
sprites.muroJugador.src = 'https://placehold.co/40x40/d63031/ff7675?text=X';
sprites.baratija.src = './assets/bread.png';
sprites.puerta.src = 'https://placehold.co/40x40/00b894/ffffff?text=Salida';
sprites.poderEspecial.src = './assets/cotton.png';

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