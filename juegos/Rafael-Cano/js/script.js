document.addEventListener("DOMContentLoaded", () => {
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Estado del juego
let juegoActivo = false;
let vidas = 3;
let nivelActual = 1;
let estadoPantalla = "juego"; // "juego", "ganar", "perder"
let botonSeleccionado = 0;
let aguaRecogida = 0;
let aguaTotalNivel = 0;
let dialogoHUD = {
    activo: false,
    personaje: "wallace",
    lineas: [],
    lineaActual: 0,
    escribiendo: "",
    indiceTexto: 0,
    velocidadTexto: 2,
    frameTexto: 0
};
let juegoPausado = false;
let dialogoActivo = false;

// Control de teclado
const teclas = {};

// Variable global para controlar el desplazamiento de la cámara y el zoom
let camaraX = 0;
let camaraY = 0; 
let zoom = 1;    
const ANCHO_NIVEL = 1680;
const ALTO_NIVEL = 3178;

const musicaFondo = new Audio('recursos/Sonidos/003_Wallaces_Theme.mp3');
musicaFondo.loop = true; // Hace que se repita infinitamente
musicaFondo.volume = 0.4; // Volumen al 40% para que no tape los diálogos/efectos
// Cargar Fuente Personalizada para el Canvas
const fuenteApocalypse = new FontFace('ApocalypseGrunge', 'url(recursos/Fuentes/ApocalypseGrunge.ttf)');
fuenteApocalypse.load().then((fuente) => {
    document.fonts.add(fuente);
    console.log("Fuente Apocalypse Grunge cargada.");
});
const fuenteDoubleHomicide = new FontFace('DoubleHomicide', 'url(recursos/Fuentes/DoubleHomicide.ttf)');
fuenteDoubleHomicide.load().then((fuente) => {
    document.fonts.add(fuente);
    console.log("Fuente Double Homicide cargada.");
});


// Cargar imágenes de la interfaz en spritesGlobales
const spritesGlobales = {
    robin: new Image(),
    fondo: new Image(),
    plataformaChica: new Image(),
    plataformaGrande: new Image(), 
    plataformaMediana: new Image(), 
    elevador: new Image(),
    acido: new Image(),          
    escalera: new Image(),
    barricada: new Image(),
    computadora: new Image(),
    tablaMadera: new Image(),
    bateItem : new Image(),
    wallaceIntroFight: new Image(),
    wallaceAttack : new Image(),
    wallaceOutroFight : new Image(),
    wallaceAttackIdle : new Image(),
    bateriaItem : new Image(),
    salida : new Image(),
    vigaTrasera : new Image(),
    vigaElevador : new Image(),
    vigaHorizontal : new Image(),
    pantallaFondo : new Image(),
    btnNormal : new Image(),
    btnSelected : new Image(),
    aguaItem : new Image(),
    btnPausa : new Image(),
    btnPausaSel : new Image(),
    btnReset : new Image(),
    btnResetSel : new Image(),
    btnLargo: new Image(),
    robinIdle: new Image(),
    wallaceWalk: new Image(),
    wallaceIdle: new Image(),
    RobinWalk: new Image(),
    dialogoWallace: new Image(),
    dialogoRobin: new Image(),
};

spritesGlobales.RobinWalk.src = 'recursos/Sprites/robin_walk_strip.png';
spritesGlobales.wallaceIdle.src = 'recursos/Sprites/wallace_idle_strip.png';
spritesGlobales.wallaceWalk.src = 'recursos/Sprites/wallace_walk_strip.png';
spritesGlobales.robinIdle.src = 'recursos/Sprites/robin_idle_strip.png';
spritesGlobales.btnResetSel.src = 'recursos/HUD/BotonResetSelected.png';
spritesGlobales.btnReset.src = 'recursos/HUD/BotonReset.png';
spritesGlobales.btnLargo.src = 'recursos/HUD/BotonLargo.png';
spritesGlobales.btnPausaSel.src = 'recursos/HUD/BotonPausaSelected.png';
spritesGlobales.btnPausa.src = 'recursos/HUD/BotonPausa.png';
spritesGlobales.pantallaFondo.src = 'recursos/pantallas/Fondo.png';
spritesGlobales.btnNormal.src = 'recursos/Assets/spr_bttn.png';
spritesGlobales.btnSelected.src = 'recursos/Assets/spr_bttn_selected.png';
spritesGlobales.aguaItem.src = 'recursos/Items/Agua.png';
spritesGlobales.vigaTrasera.src = 'recursos/Assets/Viga.png'; 
spritesGlobales.vigaElevador.src = 'recursos/Assets/VigaElevador.png'; 
spritesGlobales.vigaHorizontal.src = 'recursos/Assets/VigaHorizontal.png'; 
spritesGlobales.bateriaItem.src = 'recursos/Items/Bateria.png'; 
spritesGlobales.salida.src = 'recursos/Assets/salida.png';
spritesGlobales.wallaceAttackIdle.src = 'recursos/Sprites/spr_wallace_idle_fight_strip.png';
spritesGlobales.robin.src = 'recursos/Sprites/robin_sprite.png'; 
spritesGlobales.fondo.src = 'recursos/Bg.jpg';
spritesGlobales.plataformaChica.src = 'recursos/Assets/PlataformaChica.png';
spritesGlobales.plataformaMediana.src = 'recursos/Assets/Chica-Media.png';
spritesGlobales.plataformaGrande.src = 'recursos/Assets/PlataformaMediana.png';
spritesGlobales.elevador.src = 'recursos/Assets/Elevador.png';
spritesGlobales.acido.src = 'recursos/Assets/Acido.png';
spritesGlobales.escalera.src = 'recursos/Assets/Escalera.png';
spritesGlobales.barricada.src = 'recursos/Assets/Barricada.png';
spritesGlobales.computadora.src = 'recursos/Assets/Compu.png';
spritesGlobales.tablaMadera.src = 'recursos/Assets/Tabla.png';
spritesGlobales.bateItem.src = 'recursos/Items/Bate.png'; 
spritesGlobales.wallaceIntroFight.src = 'recursos/Sprites/spr_wallace_intro_fight_strip.png'; 
spritesGlobales.wallaceAttack.src = 'recursos/Sprites/spr_wallace_attack_strip.png';          
spritesGlobales.wallaceOutroFight.src = 'recursos/Sprites/spr_wallace_outro_fight_strip.png';   
spritesGlobales.dialogoWallace.src = 'recursos/HUD/DialogoWallace.png';
spritesGlobales.dialogoRobin.src = 'recursos/HUD/DialogoRobin.png';   

const voces = {
    wallace: new Audio('recursos/sonidos/wallaceVoice.wav'),
    robin: new Audio('recursos/sonidos/robinVoice.wav')
};

class Personaje {
    constructor(x, y, nombre, controles) {
        this.spawnX = x;
        this.spawnY = y;

        this.x = x;
        this.y = y;
        this.width = 50; 
        this.height = 80;
        
        this.nombre = nombre;
        this.controles = controles;
        this.velocidad = (nombre === "Wallace") ? 6 : 4; 
        this.fuerzaSalto = 12;
        this.velX = 0;
        this.velY = 0;
        this.enSuelo = false;

        this.invulnerable = false;
        this.tiempoInvulnerable = 0; 
        this.visible = true;       

        this.tieneBateria = false;     // Exclusivo para Robin
        this.operandoConsola = false;  // Indica si está controlando el elevador
  
        if (this.nombre === "Wallace") {
            this.sprites = {
                idle: spritesGlobales.wallaceIdle, 
                walk: spritesGlobales.wallaceWalk
            };
            
            this.spriteW = 100; 
            this.spriteH = 200;
            
            this.frameActual = 0;
            this.frameTimer = 0;
            this.frameInterval = 8; 
            this.mirandoDerecha = true;

            //Variables del bate
            this.tieneBate = false;       
            this.modoPelea = false;       
            this.estadoAnimacion = 'normal'; 
            this.maxFramesEstado = 6;    
        }
        if (this.nombre === "Robin") {
            this.direccion = -1; // -1 Izquierda, 1 Derecha
            
            // Unificamos las hojas de sprites en un objeto propio
            this.sprites = {
                idle: spritesGlobales.robinIdle,
                walk: spritesGlobales.RobinWalk
            };
            
            // Dimensiones del frame de Robin
            this.spriteW = 100; 
            this.spriteH = 200;

            this.frameActual = 0;
            this.frameTimer = 0;
            this.frameInterval = 6; // Qué tan rápido cambian los frames
            this.totalFramesIdle = 6;
            this.totalFramesWalk = 6;
        }
    }

    ejecutarGolpeBate() {
        // Creamos una hitbox temporal más larga en horizontal para romper las barricadas
        let alcanceAtaque = 90;
        let ataqueX = this.mirandoDerecha ? (this.x + this.width) : (this.x - alcanceAtaque);
        
        let hitboxAtaque = {
            x: ataqueX,
            y: this.y + 10,
            width: alcanceAtaque,
            height: this.height - 20
        };

        // Buscamos si golpeó una barricada de madera
        obstaculosDelNivel.forEach(obs => {
            if (obs.tipo === 'barricada' && !obs.destruido) {
                // Validación AABB manual contra la hitbox de ataque extendida
                if (hitboxAtaque.x < obs.hitboxX + obs.hitboxWidth &&
                    hitboxAtaque.x + hitboxAtaque.width > obs.hitboxX &&
                    hitboxAtaque.y < obs.hitboxY + obs.hitboxHeight &&
                    hitboxAtaque.y + hitboxAtaque.height > obs.hitboxY) {
                    
                    // Activamos el efecto de parpadeo en la barricada
                    obs.recibiendoGolpe = true;
                    obs.tiempoBarricada = 30; // 30 frames parpadeando antes de borrarse
                    sfx.romperBarricada.play();
                    console.log("¡Barricada golpeada por Wallace!");
                }
            }
        });
    }

actualizar() {
//Recolección de Items
        itemsDelNivel.forEach(item => {
            if (!item.recogido) {
                if (this.x < item.x + item.width && this.x + this.width > item.x &&
                    this.y < item.y + item.height && this.y + this.height > item.y) {
                    
                if (this.nombre === "Wallace" && item.nombre === 'bate') {
                    item.recogido = true;
                    this.tieneBate = true;
                    sfx.recogerItem.play();

                    mostrarDialogo(
                        "wallace",
                        "¡ENHORABUENA, CONSEGUISTE UN [y]BATE[/y]!",
                        "PRESIONA [y]ENTER[/y] PARA ENTRAR Y SALIR DEL MODO [y]ATAQUE[/y].",
                        "PRESIONA [y]ESPACIO[/y] PARA ROMPER [y]BARRICADAS[/y].",
                        "¡ES HORA DE ABRIR CAMINO!"
                    );
                }
                    if (this.nombre === "Robin" && item.nombre === 'bateria') {
                        item.recogido = true;
                        this.tieneBateria = true;
                        sfx.recogerItem.play(); 
                        
                    mostrarDialogo(
                        "robin",
                        "¡ESTO ES ELECTRIZANTE!",
                        "COLOCA LA [y]BATERÍA[/y] EN UNA [y]COMPUTADORA[/y].",
                        "PRESIONA [y]E[/y] PARA USAR LA CONSOLA.",
                        "USA [y]A[/y] Y [y]D[/y] PARA CONTROLAR EL [y]ELEVADOR[/y].",
                        "¡AYUDA A [y]WALLACE[/y] A SUBIR!"
                    );
                    }
                    if (item.nombre === 'agua') {
                        item.recogido = true;
                        aguaRecogida++; // Suma al contador global
                        sfx.agua.currentTime = 0;
                        sfx.agua.play();
                        console.log(`Agua recolectada: ${aguaRecogida}/${aguaTotalNivel}`);
                    }
                }
            }
        });

        //Invulnerabilidad
        if (this.invulnerable) {
            this.tiempoInvulnerable--;
            if (this.tiempoInvulnerable % 4 === 0) this.visible = !this.visible;
            if (this.tiempoInvulnerable <= 0) { this.invulnerable = false; this.visible = true; }
        }

        //Restricciones de Movimiento
        let puedeMoverse = true;

        if (this.nombre === "Wallace" && (this.modoPelea || this.estadoAnimacion !== 'normal')) {
            puedeMoverse = false;
            this.velX = 0;
        }

        //Si Robin está usando la computadora, se queda quieta
        if (this.nombre === "Robin" && this.operandoConsola) {
            puedeMoverse = false;
            this.velX = 0;

            //Control Elevador
            obstaculosDelNivel.forEach(obs => {
                if (obs.tipo === 'elevador') {
                    if (teclas['KeyA']) { 
                        obs.y -= 4; // Mueve hacia arriba
                        if (obs.y < 2500) obs.y = 2500; 
                    }
                    if (teclas['KeyD']) { 
                        obs.y += 4; // Mueve hacia abajo
                        if (obs.y > 2950) obs.y = 2950; 
                    }
                }
            });

            if (teclas['KeyA'] || teclas['KeyD']) {
                if (sfx.elevador.paused) sfx.elevador.play(); 
            } else {
                sfx.elevador.pause(); 
            }
        }

        if (puedeMoverse) {
            if (teclas[this.controles.izq]) {
                this.velX = -this.velocidad;
                this.mirandoDerecha = false;
                this.direccion = -1; 
            } else if (teclas[this.controles.der]) {
                this.velX = this.velocidad;
                this.mirandoDerecha = true;
                this.direccion = 1;  
            } else {
                this.velX = 0;
            }
        }

        //Saltos
        if (puedeMoverse && teclas[this.controles.salto] && this.enSuelo) {
            this.velY = -this.fuerzaSalto;
            this.enSuelo = false;
            sfx.salto.currentTime = 0; 
            sfx.salto.play(); 
        }
        
        //Animación Combate Wallace
        if (this.nombre === "Wallace" && (this.estadoAnimacion !== 'normal' || this.modoPelea)) {
            this.frameTimer++;
            if (this.frameTimer >= this.frameInterval) {
                this.frameTimer = 0; this.frameActual++;
                if (this.frameActual >= this.maxFramesEstado) {
                    if (this.estadoAnimacion === 'intro') { this.estadoAnimacion = 'normal'; this.modoPelea = true; this.frameActual = 0; this.maxFramesEstado = 6; }
                    else if (this.estadoAnimacion === 'atacando') { this.ejecutarGolpeBate(); this.estadoAnimacion = 'normal'; this.frameActual = 0; this.maxFramesEstado = 6; this.frameInterval = 8; }
                    else if (this.estadoAnimacion === 'outro') { this.estadoAnimacion = 'normal'; this.modoPelea = false; this.frameActual = 0; }
                    else if (this.modoPelea && this.estadoAnimacion === 'normal') { this.frameActual = 0; }
                }
            }
        }

        // Aplicación fuerzas físicas
        this.velY += 0.6; // Gravedad
        this.x += this.velX;
        this.y += this.velY;
        this.enSuelo = false;

        //Colisiones
        obstaculosDelNivel.forEach(obs => {
            if (obs.destruido) return;

            if (obs.tipo === 'plataforma' || obs.tipo === 'elevador' || obs.tipo === 'tabla') {
                if (obs.tipo === 'tabla' && verificarColisionAABB(this, obs) && this.nombre === "Robin") {
                    if (!obs.tablaRompiendose) { obs.tablaRompiendose = true; obs.tiempoTabla = 45; sfx.romperTabla.play();}
                }
                if (verificarColisionAABB(this, obs)) {
                    if (this.velY > 0 && (this.y + this.height - this.velY) <= obs.hitboxY + 4) {
                        this.y = obs.hitboxY - this.height; this.velY = 0; this.enSuelo = true;
                    }
                }
            }
            if (obs.tipo === 'escalera' && verificarColisionAABB(this, obs) && teclas[this.controles.salto]) {
                this.velY = -5; this.enSuelo = false;
            }
            if (obs.tipo === 'barricada' && verificarColisionAABB(this, obs)) {
                if (this.velX > 0) this.x = obs.hitboxX - this.width;
                else if (this.velX < 0) this.x = obs.hitboxX + obs.hitboxWidth;
            }
        });

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > ANCHO_NIVEL) this.x = ANCHO_NIVEL - this.width;

        //Movimiento general
        //Animación de Wallace
        if (this.nombre === "Wallace" && this.estadoAnimacion === 'normal' && !this.modoPelea) {
            if (Math.abs(this.velX) > 0 && this.enSuelo) {
                this.frameTimer++; 
                if (this.frameTimer >= this.frameInterval) { 
                    this.frameTimer = 0; 
                    this.frameActual = (this.frameActual + 1) % 6; 
                }
            } else if (!this.enSuelo) { 
                this.frameActual = 1; 
            } else { 
                this.frameTimer++; 
                if (this.frameTimer >= this.frameInterval) { 
                    this.frameTimer = 0; 
                    this.frameActual = (this.frameActual + 1) % 6; 
                }
            }
        }

// Animación de Robin
        if (this.nombre === "Robin") {
            let maxFrames = this.totalFramesIdle;

            if (Math.abs(this.velX) > 0 && this.enSuelo) {
                //Caminando
                this.spriteActual = this.sprites.walk;
                maxFrames = this.totalFramesWalk;
            } else {
                //Idle / Quieta / Aire
                this.spriteActual = this.sprites.idle;
                maxFrames = this.totalFramesIdle;
            }

            // Control de fotogramas unificado (No avanza si el juego está pausado)
            if (!juegoPausado) {
                this.frameTimer++;
                if (this.frameTimer >= this.frameInterval) {
                    this.frameTimer = 0;
                    this.frameActual = (this.frameActual + 1) % maxFrames;
                }
            }
        }
        
        // Cuentas regresivas de destrucción
        obstaculosDelNivel.forEach(obs => {
            if (obs.tipo === 'tabla' && obs.tablaRompiendose && !obs.destruido) {
                obs.tiempoTabla--; if (obs.tiempoTabla <= 0) obs.destruido = true;
            }
            if (obs.tipo === 'barricada' && obs.recibiendoGolpe && !obs.destruido) {
                obs.tiempoBarricada--; if (obs.tiempoBarricada <= 0) obs.destruido = true;
            }
        });
    }

dibujar() {
    if (!this.visible) return; 

    // Renders Wallace
if (this.nombre === "Wallace") {
    // Selecciona la tira según si se mueve o está quieto
    let tiraActual = (Math.abs(this.velX) > 0) ? this.sprites.walk : this.sprites.idle;
    
    // Selectores de estado de combate
    if (this.estadoAnimacion === 'intro') {
        tiraActual = spritesGlobales.wallaceIntroFight;
    } else if (this.estadoAnimacion === 'atacando') {
        tiraActual = spritesGlobales.wallaceAttack;
    } else if (this.estadoAnimacion === 'outro') {
        tiraActual = spritesGlobales.wallaceOutroFight;
    } else if (this.modoPelea) {
        tiraActual = spritesGlobales.wallaceAttackIdle;
    }
    
    // Si la tira específica está lista, la animamos frame por frame. 
    // Si no ha cargado, usamos el sprite base transitorio sin romper el bucle.
    ctx.save();
    if (tiraActual && tiraActual.complete && tiraActual.naturalWidth !== 0) {
        if (!this.mirandoDerecha) {
            ctx.translate(this.x + this.width, this.y); 
            ctx.scale(-1, 1);
            ctx.drawImage(tiraActual, this.frameActual * this.spriteW, 0, this.spriteW, this.spriteH, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(tiraActual, this.frameActual * this.spriteW, 0, this.spriteW, this.spriteH, this.x, this.y, this.width, this.height);
        }
    } else {
        // Render de respaldo en lo que carga la hoja de sprites completa
        if (spritesGlobales.wallace.complete) {
            if (!this.mirandoDerecha) {
                ctx.translate(this.x + this.width, this.y); ctx.scale(-1, 1);
                ctx.drawImage(spritesGlobales.wallace, 0, 0, this.width, this.height);
            } else {
                ctx.drawImage(spritesGlobales.wallace, this.x, this.y, this.width, this.height);
            }
        } else {
            ctx.fillStyle = "blue"; ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    ctx.restore();
}
    
    //Renders Robin
    else if (this.nombre === "Robin") {
        let tiraActual = this.spriteActual || this.sprites.idle;
        let maxFrames = (tiraActual === this.sprites.walk) ? this.totalFramesWalk : this.totalFramesIdle;

        if (tiraActual && tiraActual.complete && tiraActual.naturalWidth !== 0) {
            
            let anchoFrameUnico = tiraActual.width / maxFrames;
            let altoFrameUnico = tiraActual.height;
            let origenCorteX = this.frameActual * anchoFrameUnico;

            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            let escalaX = (this.direccion === 1) ? 1 : -1;
            ctx.scale(escalaX, 1);

            ctx.drawImage(
                tiraActual,
                origenCorteX, 0, anchoFrameUnico, altoFrameUnico,
                -this.width / 2, -this.height / 2, this.width, this.height
            );
            ctx.restore();
            
        } else {
            if (spritesGlobales.robin.complete) {
                ctx.save();
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                let escalaX = (this.direccion === 1) ? 1 : -1;
                ctx.scale(escalaX, 1);
                ctx.drawImage(spritesGlobales.robin, -this.width / 2, -this.height / 2, this.width, this.height);
                ctx.restore();
            } else {
                ctx.fillStyle = "red"; ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }
}
}  


class Item {
    constructor(x, y, width, height, nombre) {
        this.x = x;
        this.y = y;
        this.nombre = nombre; 
        this.recogido = false;

        //Tamaños Items
        if (this.nombre === 'bate') {
            this.width = 52.5;
            this.height = 11.5;
        }  else if (this.nombre === 'bateria') {
            this.width = 40;
            this.height = 40;
        }
            else if (this.nombre === 'agua') {
            this.width = 45;
            this.height = 45;
        }
            else {
            this.width = width;
            this.height = height;
        }
    }

    dibujar() {
        if (this.recogido) return;
        
        if (this.nombre === 'bate') {
            ctx.drawImage(spritesGlobales.bateItem, this.x, this.y, this.width, this.height);
        } else if (this.nombre === 'bateria') {
            ctx.drawImage(spritesGlobales.bateriaItem, this.x, this.y, this.width, this.height);
        }else if (this.nombre === 'agua') { 
        ctx.drawImage(spritesGlobales.aguaItem, this.x, this.y, this.width, this.height);
        }

        // Hitboxes
        /*
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        */
        
    }
}
window.addEventListener('keydown', (e) => {
    

    const teclasBloqueadas = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    
    if (teclasBloqueadas.includes(e.code)) {
        e.preventDefault(); // Mantiene la pantalla fija en su lugar
    }
    teclas[e.code] = true;

// AVANZAR DIÁLOGOS
if (dialogoHUD.activo && e.code === 'Enter') {

    const textoCompleto = dialogoHUD.textoCompleto;

    // Si aún se está escribiendo → completar instantáneamente
    if (dialogoHUD.escribiendo.length < textoCompleto.length) {

        dialogoHUD.escribiendo = textoCompleto;
        dialogoHUD.indiceTexto = textoCompleto.length;

    } else {

        // Cerrar diálogo
        dialogoHUD.activo = false;
        dialogoActivo = false;
    }

    return;
}

// Menús
    if (estadoPantalla === "ganar" || estadoPantalla === "perder") {
        if (e.code === 'KeyW' || e.code === 'ArrowUp') {
            botonSeleccionado = 0;
        }
        if (e.code === 'KeyS' || e.code === 'ArrowDown') {
            botonSeleccionado = 1;
        }
        if (e.code === 'Enter' || e.code === 'Space') {
            if (botonSeleccionado === 0) {
                // Reiniciar juego limpiamente
                location.reload();
            }
        }
        return; // Bloquea las acciones de los personajes mientras estás en el menú
    }
    // Tecla E Robin
    if (juegoActivo && e.code === 'KeyE') {
        // Buscamos si Robin está tocando la computadora
        obstaculosDelNivel.forEach(obs => {
            if (obs.tipo === 'computadora') {
                if (verificarColisionAABB(robin, obs) && robin.tieneBateria) {
                    obs.activada = true; // La compu ahora tiene energía
                    robin.operandoConsola = !robin.operandoConsola;
                    sfx.usarCompu.currentTime = 0;
                    sfx.usarCompu.play();
                    console.log(robin.operandoConsola ? "Robin hackeando el elevador..." : "Robin soltó la consola.");
                }
            }
        });
    }

    // Teclas Wallace
    if (juegoActivo && wallace.tieneBate) {
        if (e.code === 'Enter' && wallace.estadoAnimacion === 'normal') {
            if (!wallace.modoPelea) {
                wallace.estadoAnimacion = 'intro'; wallace.frameActual = 0; wallace.frameTimer = 0; wallace.maxFramesEstado = 4; wallace.frameInterval = 8;
            } else {
                wallace.estadoAnimacion = 'outro'; wallace.frameActual = 0; wallace.frameTimer = 0; wallace.maxFramesEstado = 4; wallace.frameInterval = 8;
            }
        }
        if (e.code === 'Space' && wallace.modoPelea && wallace.estadoAnimacion === 'normal') {
            wallace.estadoAnimacion = 'atacando'; wallace.frameActual = 0; wallace.frameTimer = 0; wallace.maxFramesEstado = 6; wallace.frameInterval = 4;
        }
    }
});

window.addEventListener('keyup', (e) => {
    teclas[e.code] = false;
});

const itemsDelNivel = [
    // Items
    new Item(350, 2860, null, null, 'bate'),
    new Item(160, 2700, null, null, 'bateria'),
    new Item(250, 2820, null, null, 'agua'),
    new Item(150, 2820, null, null, 'agua'),
    new Item(50, 2820, null, null, 'agua'),
    new Item(250, 2560, null, null, 'agua'),
    new Item(300, 2700, null, null, 'agua'),
    new Item(560, 2560, null, null, 'agua'),
    new Item(730, 2560, null, null, 'agua'),
    new Item(910, 2560, null, null, 'agua'),
    new Item(700, 2820, null, null, 'agua'),
    new Item(1150, 2820, null, null, 'agua'),
    new Item(1250, 2820, null, null, 'agua'),
    new Item(1600, 2560, null, null, 'agua')
];

aguaTotalNivel = itemsDelNivel.filter(i => i.nombre === 'agua').length;


let tiempoSegundos = 0;
let intervaloTimer = null;

function iniciarCronometro() {
    if (intervaloTimer) clearInterval(intervaloTimer);
    intervaloTimer = setInterval(() => {
        if (
            juegoActivo &&
            !juegoPausado &&
            !dialogoActivo &&
            estadoPantalla === "juego"
        ) {
            tiempoSegundos++;
        }
    }, 1000);
}

// Inicialización automática cuando arranca el script de fondo
iniciarCronometro();

function formatearTiempo(segundos) {
    let mins = Math.floor(segundos / 60);
    let segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
}

function mostrarDialogo(personaje, ...lineas) {

    dialogoActivo = true;

    dialogoHUD.activo = true;
    dialogoHUD.personaje = personaje;

    // Une todas las líneas en un solo texto
    dialogoHUD.textoCompleto = lineas.join("\n");

    dialogoHUD.escribiendo = "";
    dialogoHUD.indiceTexto = 0;

    dialogoHUD.frameTexto = 0;
}

const vigasDecorativas = [
      { x: 18, y: 2760, width: 80, height: 420, tipo: 'vertical'},
    { x: 18, y: 2460, width: 80, height: 420, tipo: 'vertical'},
  
    { x: 220, y: 2720, width: 80, height: 480, tipo: 'vertical' },
    { x: 220, y: 2600, width: 80, height: 480, tipo: 'vertical' },

    { x: 500, y: 2850, width: 80, height: 480, tipo: 'vertical' },
    { x: 890, y: 2850, width: 80, height: 480, tipo: 'vertical' },
    { x: 710, y: 2840, width: 80, height: 480, tipo: 'vertical' },
    { x: 710, y: 2600, width: 80, height: 300, tipo: 'vertical' },
    { x: 1180, y: 2850, width: 80, height: 480, tipo: 'vertical' },
    { x: 1150, y: 2600, width: 80, height: 300, tipo: 'vertical' },
    { x: 1475, y: 2720, width: 80, height: 480, tipo: 'vertical' },
    { x: 1590, y: 2620, width: 80, height: 100, tipo: 'vertical' },

    { x: 615, y: 2582, width: 120, height: 55, tipo: 'horizontal' },
    { x: 795, y: 2582, width: 120, height: 55, tipo: 'horizontal' },

    { x: 1335, y: 2900, width: 123, height: 468, tipo: 'elevador' },
    { x: 1335, y: 2500, width: 123, height: 468, tipo: 'elevador' }, 
];

// SFX
const sfx = {
    salto: new Audio('recursos/sonidos/Salto.mp3'),
    recogerItem: new Audio('recursos/sonidos/RecogerItem.mp3'),
    dano: new Audio('recursos/sonidos/Dano.mp3'),
    romperBarricada: new Audio('recursos/sonidos/RomperBarricada.mp3'),
    elevador: new Audio('recursos/sonidos/Elevador.mp3'),
    usarCompu: new Audio('recursos/sonidos/UsarCompu.mp3'),
    romperTabla: new Audio('recursos/sonidos/RomperTabla.mp3'),
    perder: new Audio('recursos/sonidos/Perder.mp3'),
    ganar: new Audio('recursos/sonidos/Ganar.mp3'),
    agua: new Audio('recursos/sonidos/Agua.mp3')
};

//Volúmenes
sfx.salto.volume = 0.3;
sfx.recogerItem.volume = 0.5;
sfx.dano.volume = 0.6;
sfx.romperBarricada.volume = 0.6;
sfx.elevador.volume = 1;
sfx.usarCompu.volume = 0.5;
sfx.romperTabla.volume = 0.6;
sfx.perder.volume = 0.7;
sfx.ganar.volume = 0.7;
sfx.agua.volume = 0.5;

function procesarDanoAcido(personaje) {
    // Si ya es invulnerable, ignoramos el daño temporalmente
    if (personaje.invulnerable) return;

    // Restamos 1 vida global en general
    vidas--;
    sfx.dano.play();

    const hudVidas = document.querySelector('.estado-juego span:nth-child(2)');
    if (hudVidas) {
        hudVidas.innerHTML = `<i class="fa-solid fa-heart"></i> VIDAS: ${vidas}`;
    }

    //Game Over
    if (vidas <= 0) {
        juegoActivo = false;
        estadoPantalla = "perder";
        musicaFondo.pause(); 
        sfx.perder.play();  
        return;
    }

    //Volver al Spawn
    personaje.x = personaje.spawnX;
    personaje.y = personaje.spawnY;
    personaje.velX = 0;
    personaje.velY = 0;

    // Invulnerabilidad
    personaje.invulnerable = true;
    personaje.tiempoInvulnerable = 90;
}

function actualizarHUDVidasHTML() {
    const elementoVidas = document.getElementById('vidas-compartidas');
    if (elementoVidas) {
        elementoVidas.innerHTML = `<i class="fa-solid fa-heart"></i> VIDAS: ${vidas}`;
    } else {
        const hudVidasAlternativo = document.querySelector('.estado-juego span:nth-child(2)');
        if (hudVidasAlternativo) {
            hudVidasAlternativo.innerHTML = `<i class="fa-solid fa-heart"></i> VIDAS: ${vidas}`;
        }
    }
}



class Obstaculo {
    constructor(x, y, width, height, subTipo, tipo) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tipo = tipo;       // 'plataforma', 'elevador', 'acido', 'escalera', 'barricada', 'computadora', 'tabla' , etc
        this.subTipo = subTipo; 

        // Variables de estado mecánicas
        this.destruido = false;
        this.destruido = false;       
        this.activada = false;        
        this.tablaRompiendose = false;
        this.tiempoTabla = 0;
        this.tiempoBarricada = 0;
        this.hitboxWidth = this.width;   
        this.hitboxHeight = this.height; 
        this.hitboxOffsetX = 0; 
        this.hitboxOffsetY = 0;

        // Elevador
        if (this.tipo === 'elevador') {
            this.hitboxHeight = 50; 
            this.hitboxOffsetY = this.height - this.hitboxHeight; 
        }

        // Plataformas
        if (this.tipo === 'plataforma') {
            this.hitboxOffsetY = 24
            this.hitboxHeight = 15; 

            if (this.subTipo === 'chica') {
                this.hitboxWidth = this.width - 40; 
                this.hitboxOffsetX = 20; 
            }
            if (this.subTipo === 'mediana') {
                this.hitboxWidth = this.width - 40;
                this.hitboxOffsetX = 20; 
            }
            if (this.subTipo === 'grande') {
                this.hitboxWidth = this.width - 30;
                this.hitboxOffsetX = 20; 
            }
        }

        // Interactuables
        if (this.tipo === 'tabla') {
            this.hitboxHeight = 10;
            this.hitboxOffsetY = 10;
            this.hitboxWidth = 180;
            this.hitboxOffsetX = 10;
        }
        else if (this.tipo === 'escalera') {
            this.hitboxHeight = 70; 
            this.hitboxOffsetY = 10;
        }
        else if (this.tipo === 'barricada') {
            this.hitboxHeight = 65; 
            this.hitboxOffsetY = 5;
        }
        
    }

    

    get hitboxX() { return this.x + this.hitboxOffsetX; }
    get hitboxY() { return this.y + this.hitboxOffsetY; }

    dibujar() {
        if (this.destruido) return;

    
    if (this.tipo === 'tabla' && this.tablaRompiendose && Math.floor(Date.now() / 70) % 2 === 0) {
        return; 
    }

    // Efecto parpadeo de la barricada cuando recibe un batazo
    if (this.tipo === 'barricada' && this.recibiendoGolpe && Math.floor(Date.now() / 80) % 2 === 0) {
        return; 
    }

        // Renderizado por tipo
        if (this.tipo === 'plataforma') {
            let spritePlataforma = spritesGlobales.plataformaMediana;
            if (this.subTipo === 'chica') spritePlataforma = spritesGlobales.plataformaChica;
            if (this.subTipo === 'grande') spritePlataforma = spritesGlobales.plataformaGrande;
            ctx.drawImage(spritePlataforma, this.x, this.y, this.width, this.height);
        } else if (this.tipo === 'elevador') {
            ctx.drawImage(spritesGlobales.elevador, this.x, this.y, this.width, this.height);
        } else if (this.tipo === 'acido') {
            ctx.drawImage(spritesGlobales.acido, this.x, this.y, this.width, this.height);
        } else if (this.tipo === 'escalera') {
            ctx.drawImage(spritesGlobales.escalera, this.x, this.y, this.width, this.height);
        } else if (this.tipo === 'barricada') {
            ctx.drawImage(spritesGlobales.barricada, this.x, this.y, this.width, this.height);
        } else if (this.tipo === 'computadora') {
        ctx.drawImage(spritesGlobales.computadora, this.x, this.y, this.width, this.height);
        } else if (this.tipo === 'salida') {
            ctx.drawImage(spritesGlobales.salida, this.x, this.y, this.width, this.height);
        } else if (this.tipo === 'tabla') {
            ctx.drawImage(spritesGlobales.tablaMadera, this.x, this.y, this.width, this.height);
        }

        // Hitboxes
        /*
        ctx.strokeStyle = (this.tipo === 'escalera' || this.tipo === 'computadora') ? 'yellow' : (this.tipo === 'elevador' ? 'cyan' : 'green');
        ctx.lineWidth = 2;
        ctx.strokeRect(this.hitboxX, this.hitboxY, this.hitboxWidth, this.hitboxHeight);
        */
    }
}
    


// SpawnPoints
const robin = new Personaje(1200, 2500, "Robin", { salto: 'KeyW', izq: 'KeyA', der: 'KeyD' });
const wallace = new Personaje(500, 2750, "Wallace", { salto: 'ArrowUp', izq: 'ArrowLeft', der: 'ArrowRight' });




const obstaculosDelNivel = [
    // SECCIÓN IZQUIERDA: ESCALINATAS
    new Obstaculo(-22, 2850, 279.5, 70, 'grande', 'plataforma'),    
    new Obstaculo(228, 2850, 108, 70, 'chica', 'plataforma'),    
    new Obstaculo(309, 2850, 279.5, 70, 'grande', 'plataforma'),  

    new Obstaculo(310, 2740, 40-5, 160, null, 'barricada'),

    new Obstaculo(-240, 2715, 279.5, 70, 'grande', 'plataforma'),  
    new Obstaculo(10, 2715, 108, 70, 'chica', 'plataforma'),   
    new Obstaculo(92, 2715, 279.5, 70, 'grande', 'plataforma'),   
    new Obstaculo(343, 2715, 108, 70, 'chica', 'plataforma'),   

    //Barricadas que tapan caminos (Para que Wallace las rompa después)
    new Obstaculo(250, 2610, 40-5, 160, null, 'barricada'),

    new Obstaculo(80, 2600, 40, 160, null, 'escalera'), 
    new Obstaculo(92, 2590, 279.5, 70, 'grande', 'plataforma'),

    new Obstaculo(150, 2480, 40-5, 160, null, 'barricada'),
    new Obstaculo(-170, 2455, 279.5, 70, 'grande', 'plataforma'),     
    new Obstaculo(82, 2455, 108, 70, 'chica', 'plataforma'),   

    // SECCIÓN CENTRAL: PUENTES Y PLATAFORMAS FLOTANTES

    new Obstaculo(525, 2590, 108, 70, 'chica', 'plataforma'),   
    new Obstaculo(700, 2590, 108, 70, 'chica', 'plataforma'),   
    new Obstaculo(875, 2590, 108, 70, 'chica', 'plataforma'),   
    
    new Obstaculo(1050, 2590, 279.5, 70, 'grande', 'plataforma'), 
    new Obstaculo(875, 2850, 108, 70, 'chica', 'plataforma'),
    new Obstaculo(1115, 2850, 213, 70.5, 'mediana', 'plataforma'),

    // SECCIÓN DERECHA: TORRE INDUSTRIAL Y ELEVADOR
    new Obstaculo(1250, 2560, 60, 60, null, 'computadora'),
    
    new Obstaculo(1305, 2666, 153, 124, null, 'elevador'),   

    new Obstaculo(1428, 2715, 279.5, 70, 'grande', 'plataforma'),

    // Escaleras de mano para subir plataformas
    new Obstaculo(1540, 2600, 40, 160, null, 'escalera'), 
        
    new Obstaculo(1550, 2590, 279.5, 70, 'grande', 'plataforma'),

    new Obstaculo(420, 2730, 40, 160, null, 'escalera'), 
    
    // Meta Final
    new Obstaculo(1602, 2680, 60,60, null, 'salida'),

    // Tablas
    new Obstaculo(540, 2865, 200, 20, null, 'tabla'),
    new Obstaculo(710, 2865, 200, 20, null, 'tabla'),

    // ÁCIDO DEL PISO
    new Obstaculo(0, ALTO_NIVEL - 60, ANCHO_NIVEL, 60, null, 'acido')
];

function verificarColisionAABB(personaje, obstaculo) {
    return personaje.x < obstaculo.hitboxX + obstaculo.hitboxWidth &&
           personaje.x + personaje.width > obstaculo.hitboxX &&
           personaje.y < obstaculo.hitboxY + obstaculo.hitboxHeight &&
           personaje.y + personaje.height > obstaculo.hitboxY;
}
function bucleJuego() {
    if (!juegoActivo) {
        if (estadoPantalla === "perder") { dibujarPantallaPerder(); requestAnimationFrame(bucleJuego); return; }
        if (estadoPantalla === "ganar") { dibujarPantallaGanar(); requestAnimationFrame(bucleJuego); return; }
        return;
    }

    if (!juegoPausado && !dialogoActivo) {
        robin.actualizar();
        wallace.actualizar();
        actualizarCamara();

        // Verificar Victoria Cooperativa
        obstaculosDelNivel.forEach(obs => {
            if (obs.tipo === 'salida') {
                if (verificarColisionAABB(robin, obs) && verificarColisionAABB(wallace, obs)) {
                    juegoActivo = false;
                    estadoPantalla = "ganar";
                    clearInterval(intervaloTimer); // Congela el tiempo final de victoria
                    musicaFondo.pause(); sfx.elevador.pause(); sfx.ganar.play();
                }
            }
        });

        // Detectar caída al ácido
        if (robin.y + robin.height > ALTO_NIVEL - 100) procesarDanoAcido(robin);
        if (wallace.y + wallace.height > ALTO_NIVEL - 100) procesarDanoAcido(wallace);
    }

    // Escenario
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(-camaraX, -camaraY); 

    ctx.drawImage(spritesGlobales.fondo, 0, 0, ANCHO_NIVEL, ALTO_NIVEL);
    
    // Dibujar vigas, obstáculos, ítems y personajes
    vigasDecorativas.forEach(viga => {
        if (viga.tipo === 'vertical' && spritesGlobales.vigaTrasera.complete) ctx.drawImage(spritesGlobales.vigaTrasera, viga.x, viga.y, viga.width, viga.height);
        else if (viga.tipo === 'horizontal' && spritesGlobales.vigaHorizontal.complete) ctx.drawImage(spritesGlobales.vigaHorizontal, viga.x, viga.y, viga.width, viga.height);
        else if (viga.tipo === 'elevador' && spritesGlobales.vigaElevador.complete) ctx.drawImage(spritesGlobales.vigaElevador, viga.x, viga.y, viga.width, viga.height);
    });

    obstaculosDelNivel.forEach(obs => obs.dibujar());
    itemsDelNivel.forEach(item => item.dibujar());
    robin.dibujar();
    wallace.dibujar();

    ctx.restore();

    dibujarHUD();
    dibujarDialogoHUD();
    requestAnimationFrame(bucleJuego);
}

function dibujarPantallaPerder() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //Dibujar Fondo de pantalla original
    if (spritesGlobales.pantallaFondo.complete) {
        ctx.drawImage(spritesGlobales.pantallaFondo, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#110000"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    //Texto de Título
    ctx.fillStyle = "#ffff00";;
    ctx.font = "60px ApocalypseGrunge";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("MISION FALLIDA", canvas.width / 2, canvas.height / 3);

    ctx.fillStyle = "#ffffff";
    ctx.font = "24px ApocalypseGrunge";
    ctx.fillText("EL ACIDO CONSUMIO AL EQUIPO", canvas.width / 2, canvas.height / 2 - 30);

    //Botón de Reintentar
    let btnImg = (botonSeleccionado === 0) ? spritesGlobales.btnSelected : spritesGlobales.btnNormal;
    let btnW = 280;
    let btnH = 60;
    let btnX = canvas.width / 2 - btnW / 2;
    let btnY = canvas.height / 2 + 50;

    if (btnImg.complete) {
        ctx.drawImage(btnImg, btnX, btnY, btnW, btnH);
    }

    // Texto sobre el botón
    ctx.fillStyle = (botonSeleccionado === 0) ? "#00ff00" : "#ffffff";
    ctx.font = "20px ApocalypseGrunge";
    ctx.fillText("REINTENTAR", canvas.width / 2, btnY + btnH / 2 + 4);
}

function dibujarPantallaGanar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (spritesGlobales.pantallaFondo.complete) {
        ctx.drawImage(spritesGlobales.pantallaFondo, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#001100"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = "#ffff00";
    ctx.font = "60px ApocalypseGrunge";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("VICTORIA", canvas.width / 2, canvas.height / 4);

    ctx.fillStyle = "#ffffff";
    ctx.font = "24px ApocalypseGrunge";
    ctx.fillText(`AGUA RECOGIDA: ${aguaRecogida} / ${aguaTotalNivel}`, canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText(`VIDAS RESTANTES: ${vidas}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText(`TIEMPO DE MISION: ${formatearTiempo(tiempoSegundos)}`, canvas.width / 2, canvas.height / 2 + 70);

    // Dibujar Botón de Volver a Jugar
    let btnImg = (botonSeleccionado === 0) ? spritesGlobales.btnSelected : spritesGlobales.btnNormal;
    let btnW = 280;
    let btnH = 60;
    let btnX = canvas.width / 2 - btnW / 2;
    let btnY = canvas.height / 2 + 140;

    if (btnImg.complete) {
        ctx.drawImage(btnImg, btnX, btnY, btnW, btnH);
    }

    ctx.fillStyle = (botonSeleccionado === 0) ? "#00ff00" : "#ffffff";
    ctx.font = "20px ApocalypseGrunge";
    ctx.fillText("VOLVER A JUGAR", canvas.width / 2, btnY + btnH / 2 + 4);
}

function actualizarCamara() {
    let minX = Math.min(robin.x, wallace.x);
    let maxX = Math.max(robin.x + robin.width, wallace.x + wallace.width);
    let minY = Math.min(robin.y, wallace.y);
    let maxY = Math.max(robin.y + robin.height, wallace.y + wallace.height);

    // Margen de seguridad
    let distanciaX = (maxX - minX) + 200;
    let distanciaY = (maxY - minY) + 200;

    // Calcular zooms individuales para cada eje
    let zoomObjetivoX = canvas.width / distanciaX;
    let zoomObjetivoY = canvas.height / distanciaY; 

    // Zoom mínimo
    let zoomObjetivo = Math.min(zoomObjetivoX, zoomObjetivoY);
    
    let zoomMinimo = canvas.width / ANCHO_NIVEL; 
    zoom = Math.max(zoomMinimo, Math.min(1.5, zoomObjetivo));

    // Centrar en el punto medio de ambos héroes
    let centroPersonajesX = (minX + maxX) / 2;
    let centroPersonajesY = (minY + maxY) / 2;

    camaraX = centroPersonajesX - (canvas.width / 2) / zoom;
    camaraY = centroPersonajesY - (canvas.height / 2) / zoom;

    // Enclavamiento de seguridad para no salirse del mapa
    if (camaraX < 0) camaraX = 0;
    if (camaraX > ANCHO_NIVEL - (canvas.width / zoom)) {
        camaraX = ANCHO_NIVEL - (canvas.width / zoom);
    }
    if (camaraY < 0) camaraY = 0;
    if (camaraY > ALTO_NIVEL - (canvas.height / zoom)) {
        camaraY = ALTO_NIVEL - (canvas.height / zoom);
    }
}

// Botón Iniciar
document.getElementById('iniciar-juego').addEventListener('click', function() {
    juegoActivo = true;
    this.style.display = 'none'; // Oculta el menú/botón al arrancar
    
    musicaFondo.play().catch(error => {
        console.log("El navegador bloqueó el audio al inicio:", error);
    });
    
    // Cambia el texto del HUD de Apocalypse Four
    const estadoTexto = document.querySelector('.estado-juego p');
    if (estadoTexto) {
        estadoTexto.innerHTML = '<i class="fa-solid fa-signal"></i> Status: EN MISIÓN';
    }
    
    bucleJuego();
});


const hudBotones = {
    pausa: { x: 20, y: 20, w: 50, h: 50, hovered: false },
    reset: { x: 80, y: 20, w: 50, h: 50, hovered: false }
};

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (estadoPantalla === "juego" && juegoActivo) {
        if (juegoPausado) {
            let centroX = canvas.width / 2;
            let centroY = canvas.height / 2;
            let btnSize = 180;
            
            // Botón Pausa
            let pausaX = centroX - 200;
            let pausaY = centroY + 20; // Bajamos el Y un poco para dar aire al texto
            hudBotones.pausa.hovered = (mouseX >= pausaX && mouseX <= pausaX + btnSize &&
                                        mouseY >= pausaY && mouseY <= pausaY + btnSize);
                                        
            // Botón Reset
            let resetX = centroX + 20;
            let resetY = centroY + 20;
            hudBotones.reset.hovered = (mouseX >= resetX && mouseX <= resetX + btnSize &&
                                       mouseY >= resetY && mouseY <= resetY + btnSize);
        } else {
            // Coordenadas normales del HUD pequeño de la esquina superior izquierda
            hudBotones.pausa.hovered = (mouseX >= 20 && mouseX <= 70 && mouseY >= 20 && mouseY <= 70);
            hudBotones.reset.hovered = (mouseX >= 80 && mouseX <= 130 && mouseY >= 20 && mouseY <= 70);
        }
    }
});

canvas.addEventListener('click', (e) => {
    if (estadoPantalla === "juego" && juegoActivo) {
        if (hudBotones.pausa.hovered) {
            juegoPausado = !juegoPausado; // Reanuda el juego
        }
        if (hudBotones.reset.hovered) {
            location.reload(); // Reinicia el nivel
        }
    }
});

function dibujarDialogoHUD() {

    if (!dialogoHUD.activo) return;

    // Fondo oscuro pantalla completa
    ctx.fillStyle = "rgba(0,0,0,0.82)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let imagenDialogo =
        dialogoHUD.personaje === "wallace"
        ? spritesGlobales.dialogoWallace
        : spritesGlobales.dialogoRobin;

    // Caja
    let w = 1455/1.5;
    let h = 734 /1.5;

    let x = canvas.width / 2 - w / 2;
    let y = canvas.height - h - 20;

    // Render PNG
    if (imagenDialogo.complete) {
        ctx.drawImage(imagenDialogo, x, y, w, h);
    }

    // Texto actual
    const textoActual = dialogoHUD.textoCompleto;

    // Máquina de escribir
    dialogoHUD.frameTexto++;

    if (
        dialogoHUD.frameTexto >= dialogoHUD.velocidadTexto &&
        dialogoHUD.indiceTexto < textoActual.length
    ) {

        dialogoHUD.escribiendo +=
            textoActual[dialogoHUD.indiceTexto];
        let letraActual = textoActual[dialogoHUD.indiceTexto];

        if (
            dialogoHUD.indiceTexto % 2 === 0 &&
            letraActual !== ' ' &&
            letraActual !== '\n'
        ) {

            let voz =
                dialogoHUD.personaje === "wallace"
                ? voces.wallace
                : voces.robin;

            voz.currentTime = 0;
            voz.play();
        }
        dialogoHUD.indiceTexto++;

        dialogoHUD.frameTexto = 0;
    }

    // Texto principal
    ctx.fillStyle = "#ffffff";
    ctx.font = "34px DoubleHomicide";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    wrapText(
        dialogoHUD.escribiendo,
        canvas.width / 2,
        y + 220,
        w - 140,
        42
    );

    // Mensaje inferior
    ctx.font = "20px ApocalypseGrunge";

    ctx.fillStyle = "#ffff00";

    ctx.fillText(
        "PRESIONA ENTER PARA CONTINUAR",
        canvas.width / 2,
        y + h - 35
    );
}

function wrapText(texto, x, y, maxWidth, lineHeight) {

    const parrafos = texto.split('\n');

    for (let p = 0; p < parrafos.length; p++) {

        let palabras = parrafos[p].split(' ');
        let linea = '';
        let anchoLinea = 0;

        for (let n = 0; n < palabras.length; n++) {

            let palabraOriginal = palabras[n];

            // Detectar texto amarillo
            let esAmarillo =
                palabraOriginal.includes('[y]') &&
                palabraOriginal.includes('[/y]');

            let palabra = palabraOriginal
                .replace('[y]', '')
                .replace('[/y]', '');

            let testLinea = linea + palabra + ' ';
            let testWidth = ctx.measureText(testLinea).width;

            if (testWidth > maxWidth && n > 0) {
                y += lineHeight;
                linea = '';
                anchoLinea = 0;
            }

            // Color
            ctx.fillStyle = esAmarillo ? "#ffff00" : "#ffffff";

            ctx.textAlign = "left";

            ctx.fillText(
                palabra + ' ',
                x - (maxWidth / 2) + anchoLinea,
                y
            );

            anchoLinea += ctx.measureText(palabra + ' ').width;

            linea += palabra + ' ';
        }

        y += lineHeight;
        ctx.textAlign = "center";
    }
}

function dibujarHUD() {
    //Botón de Pausa
    let imgPausa = hudBotones.pausa.hovered ? spritesGlobales.btnPausaSel : spritesGlobales.btnPausa;
    if (imgPausa.complete) {
        ctx.drawImage(imgPausa, hudBotones.pausa.x, hudBotones.pausa.y, hudBotones.pausa.w, hudBotones.pausa.h);
    }

    //Botón de Reset
    let imgReset = hudBotones.reset.hovered ? spritesGlobales.btnResetSel : spritesGlobales.btnReset;
    if (imgReset.complete) {
        ctx.drawImage(imgReset, hudBotones.reset.x, hudBotones.reset.y, hudBotones.reset.w, hudBotones.reset.h);
    }

    //Botón Largo
    let largoW = 160;
    let largoH = 50;
    let largoX = canvas.width / 2 - largoW / 2;
    if (spritesGlobales.btnLargo.complete) {
        ctx.drawImage(spritesGlobales.btnLargo, largoX, 20, largoW, largoH);
    }
    
    // Texto del Cronómetro
    ctx.fillStyle = "#ffff00"; 
    ctx.font = "26px ApocalypseGrunge";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(formatearTiempo(tiempoSegundos), canvas.width / 2, 20 + largoH / 2 + 3);

    //Contador de Agua
        let aguaIconX = canvas.width - 180; 
        let aguaIconSize = 45;             
        
        if (spritesGlobales.aguaItem.complete) {
            ctx.drawImage(spritesGlobales.aguaItem, aguaIconX, 22, aguaIconSize, aguaIconSize);
        }
        
        ctx.fillStyle = "#ffffff"; 
        ctx.font = "28px ApocalypseGrunge";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`X${aguaRecogida}`, aguaIconX + 55, 20 + largoH / 2 + 3);

if (juegoPausado && !dialogoActivo) {
        // Fondo traslúcido oscuro
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Letrero de PAUSA
        ctx.fillStyle = "#ffff00";
        ctx.font = "60px ApocalypseGrunge";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PAUSA", canvas.width / 2, canvas.height / 2 - 60);

        let centroX = canvas.width / 2;
        let centroY = canvas.height / 2;
        let btnSize = 180;
        let panelY = centroY + 20;

        // Botón Reanudar Grande
        let imgPausa = hudBotones.pausa.hovered ? spritesGlobales.btnPausaSel : spritesGlobales.btnPausa;
        if (imgPausa.complete) {
            ctx.drawImage(imgPausa, centroX - 200, panelY, btnSize, btnSize);
        }

        // Botón Reiniciar Grande
        let imgReset = hudBotones.reset.hovered ? spritesGlobales.btnResetSel : spritesGlobales.btnReset;
        if (imgReset.complete) {
            ctx.drawImage(imgReset, centroX + 20, panelY, btnSize, btnSize);
        }
    }
}

const elementoVidas = document.getElementById('vidas-compartidas');
if (elementoVidas) {
    elementoVidas.innerHTML = `<i class="fa-solid fa-heart"></i> Vidas: ${vidas}`;
}

actualizarHUDVidasHTML();
});