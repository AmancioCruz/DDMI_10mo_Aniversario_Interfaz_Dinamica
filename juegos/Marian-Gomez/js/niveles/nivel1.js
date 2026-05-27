function dibujarNivel1(){
    // FONDO
    ctx.drawImage(
        fondo,
        0,
        0,
        canvas.width,
        canvas.height
    );

    dibujarBarraNivel();
    // TELEVISION
    if(televisionCambiando){
        ctx.drawImage(
            televisionCambioFrames[televisionCambioFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else if(televisionFinalActiva){
        ctx.drawImage(
            televisionFinal,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else{
        ctx.drawImage(
            televisionFrames[televisionFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    // CUADRO
    if(cuadroAnimando){
        ctx.drawImage(
            cuadroFrames[cuadroFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else if(!cuadroDesaparecido){
        ctx.drawImage(
            cuadroInicial,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    // DUEÑO
    if(duenoComiendo){
        ctx.drawImage(
            duenoComerFrames[duenoComerFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else if(duenoBlehActivo){
        ctx.drawImage(
            duenoBleh,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else if(duenoEnojadoActivo){
        ctx.drawImage(
            duenoEnojado,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else if(duenoRisaActiva){
        ctx.drawImage(
            duenoRisaFrames[duenoRisaFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else{
        ctx.drawImage(
            dueno,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    // BOWL
    if(bowlPopoActivo){
        ctx.drawImage(
            bowlPopo,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else{
        ctx.drawImage(
            bowl,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    // LUZ
    ctx.drawImage(
        luz,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // POPO
    for(let i = 0; i < popos.length; i++){
        ctx.beginPath();
        ctx.arc(
            popos[i].x,
            popos[i].y,
            5,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = "#232115";
        ctx.fill();
    }

    // CONEJO
    if(conejoRiendo){
        ctx.drawImage(
            conejoRisaFrames[conejoRisaFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else if(conejoPopoActivo){
        ctx.drawImage(
            conejoPopoFrames[conejoPopoFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else if(conejoExplotando){
        ctx.drawImage(
            conejoExplotarFrames[conejoExplotarFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else if(conejoExplotado){
        ctx.drawImage(
            conejoQuemado,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else{
        ctx.drawImage(
            conejoFrames[conejoFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    // PANTALLA FINAL
    if(pantallaFinalActiva){
        // ANIMACION
        ctx.drawImage(
            pantallaFinalFrames[pantallaFinalFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
        // TEXTOS
        if(pantallaFinalTerminada){
            // GANASTE
            if(ganaste){
                ctx.drawImage(
                    textoGanaste,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.save();
                if(hoverReiniciar){
                    ctx.translate(
                        canvas.width / 2,
                        canvas.height / 2
                    );
                    ctx.scale(1.01, 1);
                    ctx.translate(
                        -canvas.width / 2,
                        -canvas.height / 2
                    );
                }
                ctx.drawImage(
                    textoGanasteReiniciar,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.restore();
                ctx.save();
                if(hoverSiguiente){
                    ctx.translate(
                        canvas.width / 2,
                        canvas.height / 2
                    );
                    ctx.scale(1.03, 1);
                    ctx.translate(
                        -canvas.width / 2,
                        -canvas.height / 2
                    );
                }
                ctx.drawImage(
                    textoGanasteSiguiente,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.restore();
            }
            // PERDISTE
            if(perdiste){
                ctx.drawImage(
                    textoPerdiste,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.save();
                if(hoverReiniciar){
                    ctx.translate(
                        canvas.width / 2,
                        canvas.height / 2
                    );
                    ctx.scale(1.03, 1);
                    ctx.translate(
                        -canvas.width / 2,
                        -canvas.height / 2
                    );
                }
                ctx.drawImage(
                    textoPerdisteReiniciar,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                ctx.restore();
                ctx.drawImage(
                    textoPerdisteIcono,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            }
        }
    }
}

// HOVER
function moverMouseNivel1(mouseX, mouseY){
    if(!juegoIniciado || nivelActual !== 1){
    audioRisaDueno.pause();
    audioRisaDueno.currentTime = 0;
    return;

}

    hoverReiniciar = false;
    hoverSiguiente = false;
    // HOVER DUEÑO
    if(
        mouseX >= 150 &&
        mouseX <= 320 &&
        mouseY >= 100 &&
        mouseY <= 350
    ){
        if(
            !duenoRisaActiva &&
            !duenoEnojadoActivo &&
            !duenoBlehActivo &&
            !duenoComiendo
        ){
            activarRisaDueno();
        }
    }
    if(!pantallaFinalTerminada) return;
    hoverReiniciar = false;
    hoverSiguiente = false;
    // REINICIAR
    if(
       
    mouseX >= 430 &&
    mouseX <= 510 &&

    mouseY >= 220 &&
    mouseY <= 300
    ){
        hoverReiniciar = true;
    }
    // SIGUIENTE
    if(
        mouseX >= 360 &&
        mouseX <= 430 &&
        mouseY >= 260 &&
        mouseY <= 330
    ){
        hoverSiguiente = true;
    }
}

// CLICK
function clickNivel1(mouseX, mouseY){
    console.log(mouseX, mouseY);
    if(mouseY <= 80){
        clickBarra(mouseX, mouseY);
        return;
    }
    if(pantallaFinalActiva){
        if(hoverReiniciar){
            reiniciarNivel1();
        }
        if(
            ganaste &&
            hoverSiguiente
        ){
            nivelActual = 2;
            pantallaFinalActiva = false;
            pantallaFinalTerminada = false;
            ganaste = false;
        }
        return;
    }

    // CLICK LUZ
    if(
        mouseX >= 0 &&
        mouseX <= 80 &&
        mouseY >= 150 &&
        mouseY <= 280
    ){
        activarExplosionConejo();
    }
    // CLICK TV
    if(
        mouseX >= 620 &&
        mouseX <= 760 &&
        mouseY >= 220 &&
        mouseY <= 420
    ){
        activarTelevisionCambio();
        if(duenoBlehActivo){
            
            conejoRiendo = true;
            reproducirConejoRisa();
            setTimeout(() => {
                perdiste = false;
                ganaste = true;
                reproducirGanaste();

                pantallaFinalActiva = true;
            }, 2000);

            
        }else{
            setTimeout(() => {
                ganaste = false;
                perdiste = true;
                pantallaFinalActiva = true;
            }, 2000);
        }
    }
    // CLICK CUADRO
    if(
        mouseX >= 40 &&
        mouseX <= 140 &&
        mouseY >= 40 &&
        mouseY <= 140
    ){
        activarCuadro();
    }
    // CLICK BOWL
    if(
        mouseX >= 220 &&
        mouseX <= 340 &&
        mouseY >= 220 &&
        mouseY <= 340
    ){
        activarPopo();
    }
}

// ACTIVAR RISA
function activarRisaDueno(){
    if(!juegoIniciado) return;
    if(nivelActual !== 1) return;
    duenoRisaActiva = true;
    duenoRisaFrame = 0;
    tiempoInicioRisa = Date.now();
    reproducirRisaDueno();

}
// ACTIVAR EXPLOSION
function activarExplosionConejo(){
    reproducirExplosion();
    if(conejoExplotado) return;
    conejoExplotando = true;
    conejoExplotarFrame = 0;
    setTimeout(() => {
        duenoEnojadoActivo = true;
    }, 600);
    setTimeout(() => {
        ganaste = false;
        perdiste = true;
        reproducirPerdiste();
        pantallaFinalActiva = true;
    }, 1400);

    
}

// ACTIVAR TELEVISION
function activarTelevisionCambio(){
    audioTelevision.pause();
    televisionCambiando = true;
    televisionCambioFrame = 0;
    setTimeout(() => {
        duenoEnojadoActivo = true;
    }, 600);
    setTimeout(() => {
        ganaste = false;
        perdiste = true;
       
        pantallaFinalActiva = true;
    }, 1400);
}

// ACTIVAR CUADRO
function activarCuadro(){
    if(cuadroDesaparecido) return;
    cuadroAnimando = true;
    cuadroFrame = 0;
    ultimoCuadro = Date.now();
    setTimeout(() => {
        duenoEnojadoActivo = true;
    }, 600);
    setTimeout(() => {
        ganaste = false;
        perdiste = true;
        reproducirPerdiste();
        pantallaFinalActiva = true;
    }, 1400);
}

// ACTIVAR POPO
function activarPopo(){
    popoActiva = true;
    conejoPopoActivo = true;
    conejoPopoFrame = 0;
    tiempoInicioPopo = Date.now();
    popos = [];
    setTimeout(() => {
        bowlPopoActivo = true;
        duenoComiendo = true;
        duenoComerFrame = 0;
    }, 2500);

    
}

// REINICIAR NIVEL 1
function reiniciarNivel1(){
    conejoExplotando = false;
    conejoExplotado = false;
    conejoExplotarFrame = 0;
    televisionCambiando = false;
    televisionCambioFrame = 0;
    televisionFinalActiva = false;
    cuadroAnimando = false;
    cuadroDesaparecido = false;
    cuadroFrame = 0;
    duenoRisaActiva = false;
    duenoEnojadoActivo = false;
    duenoBlehActivo = false;
    duenoComiendo = false;
    duenoComerFrame = 0;
    conejoPopoActivo = false;
    conejoPopoFrame = 0;
    bowlPopoActivo = false;
    conejoRiendo = false;
    popos = [];
    pantallaFinalActiva = false;
    pantallaFinalTerminada = false;
    pantallaFinalFrame = 0;
    ganaste = false;
    perdiste = false;
    audioTelevision.currentTime = 0;
    audioTelevision.play();
    audioRisaDueno.pause();
    audioRisaDueno.currentTime = 0;
}