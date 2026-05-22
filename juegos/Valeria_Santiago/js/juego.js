import { configuracion, sprites, mapasNiveles, generarEnemigos } from './entidades.js';
const lienzo = document.querySelector('#lienzo');
const ctx = lienzo.getContext('2d');

lienzo.width = configuracion.columnas * configuracion.tamanoCasilla;
lienzo.height = configuracion.filas * configuracion.tamanoCasilla;

// Variables de Estado del Juego
let nivelActual = 1;
const maxNiveles = 3;
let vidas = 3;
let puntuacion = 0;
let objetosRecolectados = 0;
let totalObjetosNecesarios = 0;
let juegoTerminado = false;
let juegoGanado = false;
let previsualizacionObstaculo = null;

// Variables del Jugador y Entidades
let jugador = { x: 1, y: 1, esInvulnerable: false, tiempoInvulnerable: 0 };
let cuadricula = [];
let enemigos = [];


// --- INICIALIZAR NIVEL ---
function iniciarNivel() {
    console.log("Cargando Nivel: " + nivelActual);
    
    // Clonar el mapa de entidades.js
    cuadricula = JSON.parse(JSON.stringify(mapasNiveles[nivelActual]));
    
    // Contar baratijas necesarias
    totalObjetosNecesarios = 0;
    for(let r = 0; r < configuracion.filas; r++) {
        for(let c = 0; c < configuracion.columnas; c++) {
            if(cuadricula[r][c] === 3) totalObjetosNecesarios++;
        }
    }

    jugador.x = 1;
    jugador.y = 1;
    cuadricula[jugador.y][jugador.x] = 0; 
    jugador.esInvulnerable = false; // Resetear poderes al cambiar de nivel

    objetosRecolectados = 0;
    enemigos = generarEnemigos(nivelActual);
    actualizarInterfaz();
}

function intentarAbrirPuerta() {
    if (objetosRecolectados < totalObjetosNecesarios) {
        const aviso = document.querySelector('#aviso-puerta');
        aviso.classList.remove('oculto');
        
        setTimeout(() => {
            aviso.classList.add('oculto');
        }, 2000);
    } else {
        avanzarNivel();
    }
}

function avanzarNivel() {
    if (nivelActual < maxNiveles) {
        nivelActual++;
        iniciarNivel();
    } else {
        juegoGanado = true;
        const textoPuntosFinales = document.querySelector('#puntuacion-final');
        if(textoPuntosFinales) textoPuntosFinales.innerText = puntuacion;
        document.querySelector('#pantalla-victoria').classList.remove('oculto');
    }
}



// --- CONTROLES DE MOVIMIENTO ---
window.addEventListener('keydown', (evento) => {
    if (juegoTerminado || juegoGanado) return;
    let siguienteX = jugador.x;
    let siguienteY = jugador.y;

    const tecla = evento.key.toLowerCase();
    if (tecla === 'w' || tecla === 'arrowup') siguienteY--;
    if (tecla === 's' || tecla === 'arrowdown') siguienteY++;
    if (tecla === 'a' || tecla === 'arrowleft') siguienteX--;
    if (tecla === 'd' || tecla === 'arrowright') siguienteX++;

    if (cuadricula[siguienteY] && cuadricula[siguienteY][siguienteX] !== undefined) {
        let celdaDestino = cuadricula[siguienteY][siguienteX];
        // 0=Suelo, 3=Baratija, 4=Salida, 5=Dulce
       // --- LÓGICA DE PUERTA ---
        if (celdaDestino === 4) {
            intentarAbrirPuerta(); 
        } 
        else if (celdaDestino === 0 || celdaDestino === 3 || celdaDestino === 5) {
            jugador.x = siguienteX;
            jugador.y = siguienteY;
            comprobarInteracciones();
        }
    }
    
});

// --- CLIC PARA CREAR BARRICADAS ---
lienzo.addEventListener('click', (evento) => {
    if (juegoTerminado || juegoGanado) return;
    if (!previsualizacionObstaculo) return;

    const { x: col, y: fila } = previsualizacionObstaculo;

    if (fila === jugador.y && col === jugador.x) return;
    if (enemigos.some(ene => ene.x === col && ene.y === fila)) return;

    cuadricula[fila][col] = 2;
    puntuacion += 5;
    
    previsualizacionObstaculo = null;
    actualizarInterfaz();
});



lienzo.addEventListener('mousemove', (e) => {
    const rect = lienzo.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / configuracion.tamanoCasilla);
    const y = Math.floor((e.clientY - rect.top) / configuracion.tamanoCasilla);

    if (Math.abs(x - jugador.x) <= 2 && Math.abs(y - jugador.y) <= 2 && cuadricula[y] && cuadricula[y][x] === 0) {
        previsualizacionObstaculo = { x, y };
    } else {
        previsualizacionObstaculo = null;
    }
});

// --- INTERACCIONES DEL JUGADOR ---
function comprobarInteracciones() {
    let celdaActual = cuadricula[jugador.y][jugador.x];
    
    // Recoger Baratija
    if (celdaActual === 3) {
        cuadricula[jugador.y][jugador.x] = 0;
        objetosRecolectados++;
        puntuacion += 200; 
        actualizarInterfaz();
    }

    // Recoger Dulce Invencible (Modo Supervivencia)
    if (celdaActual === 5) {
        cuadricula[jugador.y][jugador.x] = 0;
        puntuacion += 500;
        activarPoderEstrella();
    }
    
    // Salida del Nivel
    if (celdaActual === 4) {
        if (objetosRecolectados >= totalObjetosNecesarios) {
            if (nivelActual < maxNiveles) {
                nivelActual++;
                iniciarNivel(); 
            } else {
                juegoGanado = true;
                const textoPuntosFinales = document.querySelector('#puntuacion-final');
                if(textoPuntosFinales) textoPuntosFinales.innerText = puntuacion;
                document.querySelector('#pantalla-victoria').classList.remove('oculto');
            }
        }
    }
    comprobarColisionEnemigos();
}



// --- PODER ESPECIAL ---
function activarPoderEstrella() {
    jugador.esInvulnerable = true;
    jugador.tiempoInvulnerable = Date.now() + 6000; 
}

function comprobarColisionEnemigos() {
    // Si tienes el poder del dulce, ignoras el daño
    if (jugador.esInvulnerable && Date.now() < jugador.tiempoInvulnerable) return;

    if (enemigos.some(ene => ene.x === jugador.x && ene.y === jugador.y)) {
        vidas--;
        actualizarInterfaz();
        
        // Efecto visual de daño (sacudida de pantalla)
        lienzo.style.transform = "translate(5px, 5px)";
        setTimeout(() => lienzo.style.transform = "translate(0, 0)", 100);

        if (vidas <= 0) {
            juegoTerminado = true;
            document.querySelector('#pantalla-derrota').classList.remove('oculto');
        } else {
            jugador.esInvulnerable = true;
            jugador.tiempoInvulnerable = Date.now() + 1500; 
        }
    }
}

// --- INTELIGENCIA ARTIFICIAL DE ENEMIGOS ---
function actualizarEnemigos(tiempoActual) {
    //  invulnerabilidad si el tiempo expiró
    if (jugador.esInvulnerable && tiempoActual > jugador.tiempoInvulnerable) {
        jugador.esInvulnerable = false;
    }

    enemigos.forEach(enemigo => {
        if (enemigo.tipo === 'fantasma') {
            if (!enemigo.ultimoTeletransporte) enemigo.ultimoTeletransporte = tiempoActual;
            let tiempoTranscurrido = tiempoActual - enemigo.ultimoTeletransporte;

            if (tiempoTranscurrido > 3000 && tiempoTranscurrido < 4000) {
                enemigo.avisando = true;
            } else {
                enemigo.avisando = false;
            }

            if (tiempoTranscurrido > 4000) {
                enemigo.ultimoTeletransporte = tiempoActual;
                let opciones = [
                    {x: jugador.x + 1, y: jugador.y}, {x: jugador.x - 1, y: jugador.y},
                    {x: jugador.x, y: jugador.y + 1}, {x: jugador.x, y: jugador.y - 1}
                ];
                let celdasValidas = opciones.filter(op => cuadricula[op.y] && cuadricula[op.y][op.x] === 0);
                if (celdasValidas.length > 0) {
                    let elegida = celdasValidas[Math.floor(Math.random() * celdasValidas.length)];
                    enemigo.x = elegida.x;
                    enemigo.y = elegida.y;
                }
            }
        }

        // Movimiento regular basado en la velocidad
        if (tiempoActual - enemigo.ultimoMovimiento > enemigo.velocidad) {
            enemigo.ultimoMovimiento = tiempoActual;

            let sigX = enemigo.x;
            let sigY = enemigo.y;

            // Huyen del jugador si este agarró el dulce invencible, si no lo persiguen
            let factorDireccion = jugador.esInvulnerable && Date.now() < jugador.tiempoInvulnerable ? -1 : 1;

            if (Math.abs(jugador.x - enemigo.x) > Math.abs(jugador.y - enemigo.y)) {
                sigX += (jugador.x > enemigo.x ? 1 : -1) * factorDireccion;
            } else {
                sigY += (jugador.y > enemigo.y ? 1 : -1) * factorDireccion;
            }

            // Evitar salir del mapa al huir
            if (sigX < 0) sigX = 0; 
            if (sigX >= configuracion.columnas) sigX = configuracion.columnas - 1;
            if (sigY < 0) sigY = 0; 
            if (sigY >= configuracion.filas) sigY = configuracion.filas - 1;

            if (cuadricula[sigY] && cuadricula[sigY][sigX] !== undefined) {
                let destino = cuadricula[sigY][sigX];
                if (destino === 0 || destino === 3 || destino === 4 || destino === 5) {
                    enemigo.x = sigX;
                    enemigo.y = sigY;
                } else if (destino === 2) { 
                    if (enemigo.tipo === 'jefe') {
                        cuadricula[sigY][sigX] = 0; // El jefe destruye paredes
                        enemigo.x = sigX;
                        enemigo.y = sigY;
                    } else {
                        let altY = enemigo.y + (Math.random() > 0.5 ? 1 : -1);
                        if (cuadricula[altY] && cuadricula[altY][enemigo.x] === 0) enemigo.y = altY;
                    }
                }
            }
        }
    });
    comprobarColisionEnemigos();
}

// --- RENDERIZADO DEL JUEGO ---
function dibujar() {
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    const ts = configuracion.tamanoCasilla;

    for (let f = 0; f < configuracion.filas; f++) {
        for (let c = 0; c < configuracion.columnas; c++) {
            let celda = cuadricula[f][c];
            if (celda === 1) ctx.drawImage(sprites.muroFijo, c * ts, f * ts, ts, ts);
            else if (celda === 2) ctx.drawImage(sprites.muroJugador, c * ts, f * ts, ts, ts);
            else if (celda === 3) ctx.drawImage(sprites.baratija, c * ts, f * ts, ts, ts);
            else if (celda === 4) ctx.drawImage(sprites.puerta, c * ts, f * ts, ts, ts);
            else if (celda === 5) ctx.drawImage(sprites.poderEspecial, c * ts, f * ts, ts, ts);
        }
    }

    if (previsualizacionObstaculo) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#f7d070';
        ctx.fillRect(previsualizacionObstaculo.x * configuracion.tamanoCasilla, previsualizacionObstaculo.y * configuracion.tamanoCasilla, configuracion.tamanoCasilla, configuracion.tamanoCasilla);
        ctx.globalAlpha = 1.0;
    }

    // Dibujar Enemigos 
    enemigos.forEach(enemigo => {
        if (jugador.esInvulnerable && Date.now() < jugador.tiempoInvulnerable) {
            ctx.globalAlpha = 0.5; // Efecto visual de miedo
        }
        ctx.drawImage(enemigo.img, enemigo.x * ts, enemigo.y * ts, ts, ts);
        ctx.globalAlpha = 1.0;
    });

    enemigos.forEach(enemigo => {
        if (enemigo.avisando) {
            ctx.globalAlpha = 0.3;
        } else {
            ctx.globalAlpha = 1.0;
        }

        ctx.drawImage(enemigo.img, enemigo.x * configuracion.tamanoCasilla, enemigo.y * configuracion.tamanoCasilla, configuracion.tamanoCasilla, configuracion.tamanoCasilla);
        
        ctx.globalAlpha = 1.0;
    });

    // Dibujar Jugador 
    if (!jugador.esInvulnerable || Math.floor(Date.now() / 150) % 2 === 0) {
        ctx.drawImage(sprites.jugador, jugador.x * ts, jugador.y * ts, ts, ts);
    }
}

// --- INTERFAZ Y BUCLE DE JUEGO ---
function actualizarInterfaz() {
    const textoNivel = document.querySelector('#texto-nivel');
    const textoVidas = document.querySelector('#texto-vidas');
    const textoObjetos = document.querySelector('#texto-objetos');
    const textoPuntos = document.querySelector('#texto-puntuacion');

    if(textoNivel) textoNivel.innerText = nivelActual;
    if(textoVidas) textoVidas.innerText = "❤️".repeat(vidas) || "💀";
    if(textoObjetos) textoObjetos.innerText = `${objetosRecolectados} / ${totalObjetosNecesarios}`;
    if(textoPuntos) textoPuntos.innerText = puntuacion;
}

function reiniciarJuego(reinicioTotal = false) {
    if (reinicioTotal) {
        nivelActual = 1;
        vidas = 3;
        puntuacion = 0;
    }
    juegoTerminado = false;
    juegoGanado = false;
    
    document.querySelector('#pantalla-derrota').classList.add('oculto');
    document.querySelector('#pantalla-victoria').classList.add('oculto');
    
    iniciarNivel();
}

// Eventos de botones (QuerySelector)
document.querySelector('#btn-reiniciar-derrota').addEventListener('click', () => reiniciarJuego(true));
document.querySelector('#btn-reiniciar-victoria').addEventListener('click', () => reiniciarJuego(true));

function bucleJuego(tiempoActual) {
    if (!juegoTerminado && !juegoGanado) {
        actualizarEnemigos(tiempoActual);
    }
    dibujar();
    requestAnimationFrame(bucleJuego);
}

// Arranque
iniciarNivel();
requestAnimationFrame(bucleJuego);