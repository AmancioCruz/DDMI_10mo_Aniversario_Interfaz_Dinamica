let scrollDiaNoche = 0;
let arrastrandoDiaNoche = false;
let nocheActiva = false;
let ultimoMouseX = 0;

function dibujarNivel2(){
    // DIA NOCHE
    ctx.save();
    ctx.translate(-scrollDiaNoche, 0);
    ctx.drawImage(
        diaNoche,
        0,
        0,
        canvas.width,
        canvas.height
    );
    ctx.restore();
    // FONDO
    if(nocheActiva){
        ctx.drawImage(
            fondoNoche,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else{
        ctx.drawImage(
            fondoDia,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    dibujarBarraNivel();
    // CAMA
    if(nocheActiva){
        ctx.drawImage(
            camaNoche,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else{
        ctx.drawImage(
            camaDia,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    // ZANAHORIA
    if(nocheActiva){
        ctx.drawImage(
            zanahoriaNoche,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else{
        ctx.drawImage(
            zanahoriaDia,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    // CONEJO
    if(conejoFelizActivo){
        ctx.drawImage(
            conejoFeliz,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else if(nocheActiva){
        ctx.drawImage(
            conejoNocheFrames[conejoNocheFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
    }else{
        ctx.drawImage(
            conejoDiaFrames[conejoDiaFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    // PANTALLA FINAL
    if(pantallaFinalActiva){
        ctx.drawImage(
            pantallaFinalFrames[pantallaFinalFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
        if(pantallaFinalTerminada){
            if(ganaste){
                ctx.drawImage(
                    textoGanaste,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                // REINICIAR
                ctx.save();
                if(hoverReiniciar){
                    ctx.translate(
                        canvas.width / 2,
                        canvas.height / 2
                    );
                    ctx.translate(5, 0);
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
                // SIGUIENTE
                ctx.save();
                if(hoverSiguiente){
                    ctx.translate(
                        canvas.width / 2,
                        canvas.height / 2
                    );
                    ctx.translate(-5, 0);
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
        }
    }
}

function clickNivel2(mouseX, mouseY){
    clickBarra(mouseX, mouseY);
    if(pantallaFinalActiva){
        if(hoverReiniciar){
            reiniciarNivel2();
        }
       if(

    ganaste &&
    hoverSiguiente

){
    pantallaFinalActiva = false;
    pantallaFinalTerminada = false;
    ganaste = false;
    juegoIniciado = false;
    menuActual = 2;
    menuNivelesDesdeJuego = false;

}
        return;
    }
    // ARRASTRAR DIA NOCHE
    if(
        !nocheActiva &&
        mouseX >= 80 &&
        mouseX <= 320 &&
        mouseY >= 40 &&
        mouseY <= 160
    ){
        arrastrandoDiaNoche = true;
        ultimoMouseX = mouseX;
    }
    // CLICK PATA CONEJO
    if(nocheActiva){
        if(
            mouseX >= 400 &&
            mouseX <= 500 &&
            mouseY >= 300 &&
            mouseY <= 380
        ){
            conejoFelizActivo = true;
            setTimeout(() => {
                pantallaFinalFrame = 0;
                pantallaFinalTerminada = false;
                ganaste = true;
                 reproducirGanaste();
                perdiste = false;
                pantallaFinalActiva = true;
            }, 1000);
        }
    }
}

function moverMouseNivel2(mouseX, mouseY){
    // DIA NOCHE
    if(arrastrandoDiaNoche){
        let diferenciaX = mouseX - ultimoMouseX;
        if(diferenciaX < 0){
            scrollDiaNoche += Math.abs(diferenciaX);
        }
        ultimoMouseX = mouseX;
    }
    if(scrollDiaNoche < 0){
        scrollDiaNoche = 0;
    }
    if(scrollDiaNoche > 239){
        scrollDiaNoche = 239;
    }
    // HOVER FINAL
    hoverReiniciar = false;
    hoverSiguiente = false;
    if(!pantallaFinalTerminada) return;
    // REINICIAR
    if(
        mouseX >= 340 &&
        mouseX <= 430 &&
        mouseY >= 190 &&
        mouseY <= 260
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

// PANTALLA FINAL
function reiniciarNivel2(){
    scrollDiaNoche = 0;
    arrastrandoDiaNoche = false;
    nocheActiva = false;
    ultimoMouseX = 0;
    conejoFelizActivo = false;
    pantallaFinalActiva = false;
    pantallaFinalTerminada = false;
    pantallaFinalFrame = 0;
    ganaste = false;
    perdiste = false;
}