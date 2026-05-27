let juegoIniciado = false;
let nivelActual = 1;

function dibujarNivelActual(){
    if(!juegoIniciado){
        dibujarMenuActual();
        return;
    }
    if(nivelActual === 1){
        dibujarNivel1();
    }
    if(nivelActual === 2){
        dibujarNivel2();
    }
}

// CLICK NIVEL
function clickNivelActual(mouseX, mouseY){
    if(!juegoIniciado){
        clickMenu(mouseX, mouseY);
        return;
    }
    if(nivelActual === 1){
        clickNivel1(mouseX, mouseY);
    }
    if(nivelActual === 2){
        clickNivel2(mouseX, mouseY);
    }
}

// HOVER NIVEL
function moverMouseNivelActual(mouseX, mouseY){
    if(!juegoIniciado){
        moverMouseMenu(mouseX, mouseY);
        return;
    }
    if(nivelActual === 1){
        moverMouseNivel1(mouseX, mouseY);
    }
    if(nivelActual === 2){
        moverMouseNivel2(mouseX, mouseY);
    }
}