console.log("ANIMACIONES OK");

let hoverReiniciar = false;
let hoverSiguiente = false;

// CONEJO
let conejoFrame = 0;
let ultimoConejo = 0;

// CONEJO DIA
let conejoDiaFrame = 0;
let ultimoConejoDia = 0;

// CONEJO NOCHE
let conejoNocheFrame = 0;
let ultimoConejoNoche = 0;

// CONEJO FELIZ
let conejoFelizActivo = false;

// CONEJO RISA
let conejoRiendo = false;
let conejoRisaFrame = 0;
let ultimoConejoRisa = 0;

// CONEJO EXPLOTAR
let conejoExplotando = false;
let conejoExplotado = false;
let conejoExplotarFrame = 0;
let ultimoConejoExplotar = 0;

// TELEVISION
let televisionFrame = 0;
let ultimaTelevision = 0;

// TELEVISION CAMBIO
let televisionCambiando = false;
let televisionCambioFrame = 0;
let ultimaTelevisionCambio = 0;
let televisionFinalActiva = false;

// CUADRO
let cuadroAnimando = false;
let cuadroDesaparecido = false;
let cuadroFrame = 0;
let ultimoCuadro = 0;

// DUEÑO
let duenoRisaActiva = false;
let duenoEnojadoActivo = false;
let duenoRisaFrame = 0;
let ultimoDuenoRisa = 0;
let ultimaRisaIdle = 0;
let tiempoInicioRisa = 0;
let duenoBlehActivo = false;

// CONEJO POPO
let conejoPopoActivo = false;
let conejoPopoFrame = 0;
let ultimoConejoPopo = 0;
let tiempoInicioPopo = 0;

// POPO
let popoActiva = false;
let popos = [];
let ultimoPopo = 0;
let bowlPopoActivo = false;

// DUEÑO COMER
let duenoComiendo = false;
let duenoComerFrame = 0;
let ultimoDuenoComer = 0;

// PANTALLA FINAL
let pantallaFinalActiva = false;
let pantallaFinalFrame = 0;
let ultimaPantallaFinal = 0;
let pantallaFinalTerminada = false;
let ganaste = false;
let perdiste = false;

// MENU INTRO
let menuIntroFrame = 0;
let ultimoMenuIntro = 0;

// MENU CONEJO
let conejoMenuFrame = 0;
let ultimoConejoMenu = 0;

// MENU CONEJO RISA
let conejoMenuRisa = false;
let conejoMenuRisaFrame = 0;
let ultimoConejoMenuRisa = 0;

// ACTUALIZAR ANIMACIONES
function actualizarAnimaciones(){
    const ahora = Date.now();

    // RISA AUTOMATICA
    if(
        !duenoRisaActiva &&
        !duenoEnojadoActivo &&
        !duenoBlehActivo &&
        !duenoComiendo
    ){
        if(ahora - ultimaRisaIdle > 5000){
            activarRisaDueno();
            ultimaRisaIdle = ahora;
        }
    }
    // CONEJO IDLE
    if(ahora - ultimoConejo > 100){
        conejoFrame++;
        if(conejoFrame >= conejoFrames.length){
            conejoFrame = 0;
        }
        ultimoConejo = ahora;
        // CONEJO DIA
        if(ahora - ultimoConejoDia > 100){
            conejoDiaFrame++;
            if(conejoDiaFrame >= conejoDiaFrames.length){
                conejoDiaFrame = 0;
            }
            ultimoConejoDia = ahora;
        }
        // CONEJO NOCHE
        if(ahora - ultimoConejoNoche > 100){
            conejoNocheFrame++;
            if(conejoNocheFrame >= conejoNocheFrames.length){
                conejoNocheFrame = 0;
            }
            ultimoConejoNoche = ahora;
        }
    }
    // CONEJO EXPLOTAR
    if(conejoExplotando){
        if(ahora - ultimoConejoExplotar > 80){
            conejoExplotarFrame++;
            if(conejoExplotarFrame >= conejoExplotarFrames.length){
                conejoExplotando = false;
                conejoExplotado = true;
            }
            ultimoConejoExplotar = ahora;
        }
    }
    // TELEVISION IDLE
    if(ahora - ultimaTelevision > 20){
        televisionFrame++;
        if(televisionFrame >= televisionFrames.length){
            televisionFrame = 0;
        }
        ultimaTelevision = ahora;
    }
    // TELEVISION CAMBIO
    if(televisionCambiando){
        if(ahora - ultimaTelevisionCambio > 120){
            televisionCambioFrame++;
            if(televisionCambioFrame >= televisionCambioFrames.length){
                televisionCambiando = false;
                televisionFinalActiva = true;
            }
            ultimaTelevisionCambio = ahora;
        }
    }
    // DUEÑO RISA
    if(duenoRisaActiva){
        if(ahora - ultimoDuenoRisa > 50){
            duenoRisaFrame++;
            if(duenoRisaFrame >= duenoRisaFrames.length){
                duenoRisaFrame = 0;
            }
            ultimoDuenoRisa = ahora;
        }
        // TERMINAR RISA
        if(ahora - tiempoInicioRisa > 1000){
            duenoRisaActiva = false;
            duenoRisaFrame = 0;
        }
    }
    // CUADRO
    if(cuadroAnimando){
        if(ahora - ultimoCuadro > 120){
            ultimoCuadro = ahora;
            cuadroFrame++;
            if(cuadroFrame >= cuadroFrames.length){
                cuadroAnimando = false;
                cuadroDesaparecido = true;
                cuadroFrame = cuadroFrames.length - 1;
            }
        }
    }
    // POPO
    if(conejoPopoActivo){
        // CREAR POPOS
        if(ahora - ultimoPopo > 120){
            popos.push({
                x: 485 + Math.random() * 4,
                y: 470 + Math.random() * 4
            });
            ultimoPopo = ahora;
        }
    }
    // MOVER POPOS
    for(let i = popos.length - 1; i >= 0; i--){
        popos[i].x -= 4;
        popos[i].y -= 4;
        // LLEGÓ AL BOWL
        if(popos[i].x <= 400 && popos[i].y <= 340){
            popos.splice(i, 1);
        }
    }
    // CONEJO POPO
    if(conejoPopoActivo){
        if(ahora - ultimoConejoPopo > 120){
            conejoPopoFrame++;
            if(conejoPopoFrame >= conejoPopoFrames.length){
                conejoPopoFrame = 0;
            }
            ultimoConejoPopo = ahora;
        }
        // TERMINAR POPO
        if(ahora - tiempoInicioPopo > 3000){
            conejoPopoActivo = false;
            popoActiva = false;
        }
    }
    // DUEÑO COMER
    if(duenoComiendo){
        if(ahora - ultimoDuenoComer > 120){
            duenoComerFrame++;
            if(duenoComerFrame >= duenoComerFrames.length){
                duenoComiendo = false;
                duenoBlehActivo = true;
            }
            ultimoDuenoComer = ahora;
        }
    }
    // CONEJO RISA
    if(conejoRiendo){
        if(ahora - ultimoConejoRisa > 120){
            conejoRisaFrame++;
            if(conejoRisaFrame >= conejoRisaFrames.length){
                conejoRisaFrame = 0;
            }
            ultimoConejoRisa = ahora;
        }
    }
    // PANTALLA FINAL
    if(pantallaFinalActiva){
        if(ahora - ultimaPantallaFinal > 100){
            pantallaFinalFrame++;
            if(pantallaFinalFrame >= 11){
                pantallaFinalFrame = 11;
                pantallaFinalTerminada = true;
            }
            ultimaPantallaFinal = ahora;
        }
    }
    // MENU INTRO
    if(ahora - ultimoMenuIntro > 120){
        menuIntroFrame++;
        if(menuIntroFrame >= menuIntroFrames.length){
            menuIntroFrame = 0;
        }
        ultimoMenuIntro = ahora;
    }
    // MENU CONEJO
    if(conejoMenuRisa){
        if(ahora - ultimoConejoMenuRisa > 20){
            conejoMenuRisaFrame++;
            if(conejoMenuRisaFrame >= conejoMenuRisaFrames.length){
                conejoMenuRisaFrame = 0;
            }
            ultimoConejoMenuRisa = ahora;
        }
    }else{
        if(ahora - ultimoConejoMenu > 120){
            conejoMenuFrame++;
            if(conejoMenuFrame >= conejoMenuFrames.length){
                conejoMenuFrame = 0;
            }
            ultimoConejoMenu = ahora;
        }
    }
}

// ACTIVAR RISA
function activarRisaDueno(){
    duenoRisaActiva = true;
    duenoRisaFrame = 0;
    tiempoInicioRisa = Date.now();
}