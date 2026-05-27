let menuActual = 0;
let hoverJugarIntro = false;
let hoverJugarMenu = false;
let menuNivelesDesdeJuego = false;
let hoverNivelesMenu = false;
let hoverSonidoMenu = false;
let hoverNivel1 = false;
let hoverNivel2 = false;
let hoverRegresar = false;
let pistaActiva = false;
let hoverSonidoBarra = false;
let hoverRegresarBarra = false;
let hoverNivelesBarra = false;
let hoverPistaBarra = false;

// DIBUJAR MENU ACTUAL
function dibujarMenuActual(){
    if(menuActual === 0){
        dibujarMenuIntro();
    }
    if(menuActual === 1){
        dibujarMenuPrincipal();
    }
    if(menuActual === 2){
        dibujarMenuNiveles();
    }
}

// MENU INTRO
function dibujarMenuIntro(){
    ctx.drawImage(
        fondoMenuPrimero,
        0,
        0,
        canvas.width,
        canvas.height
    );
    ctx.drawImage(
        menuIntroFrames[menuIntroFrame],
        0,
        0,
        canvas.width,
        canvas.height
    );
    // BOTON JUGAR
    ctx.save();
    if(hoverJugarIntro){
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
        jugarIntro,
        0,
        0,
        canvas.width,
        canvas.height
    );
    ctx.restore();
}

// MENU PRINCIPAL
function dibujarMenuPrincipal(){
    ctx.drawImage(
        fondoMenu,
        0,
        0,
        canvas.width,
        canvas.height
    );
    // CONEJO
    if(conejoMenuRisa){
        ctx.drawImage(
            conejoMenuRisaFrames[conejoMenuRisaFrame],
            0,
            0,
            canvas.width,
            canvas.height
        );
 }else{
    ctx.drawImage(
        conejoMenuFrames[conejoMenuFrame],
        0,
        0,
        canvas.width,
        canvas.height
    );
}
    // BOTON JUGAR
    ctx.save();
    if(hoverJugarMenu){
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
        botonJugarMenu,
        0,
        0,
        canvas.width,
        canvas.height
    );
    ctx.restore();
    // BOTON NIVELES
    ctx.save();
    if(hoverNivelesMenu){
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
        botonNivelesMenu,
        0,
        0,
        canvas.width,
        canvas.height
    );
    ctx.restore();
    // BOTON SONIDO
    ctx.drawImage(
        botonSonidoMenu,
        0,
        0,
        canvas.width,
        canvas.height
    );
}

// MENU NIVELES
function dibujarMenuNiveles(){
    ctx.drawImage(
        fondoNivelesMenu,
        0,
        0,
        canvas.width,
        canvas.height
    );
    // NIVEL 1
    ctx.drawImage(
        nivel1Menu,
        0,
        0,
        canvas.width,
        canvas.height
    );
    // NIVEL 2
    ctx.drawImage(
        nivel2Menu,
        0,
        0,
        canvas.width,
        canvas.height
    );
   
    // REGRESAR
    ctx.save();
    if(hoverRegresar){
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
        botonRegresarNiveles,
        0,
        0,
        canvas.width,
        canvas.height
    );
    ctx.restore();
}

// HOVER MENUS
function moverMouseMenu(mouseX, mouseY){
    hoverJugarIntro = false;
    hoverNivel1 = false;
    hoverNivel2 = false;
    hoverJugarMenu = false;
    hoverNivelesMenu = false;
    hoverRegresar = false;
    hoverSonidoMenu = false;
    // MENU INTRO
    if(menuActual === 0){
        if(
          mouseX >= 330 &&
mouseX <= 490 &&
mouseY >= 320 &&
mouseY <= 410
        ){
            hoverJugarIntro = true;
        }
    }
    // MENU PRINCIPAL
    if(menuActual === 1){
        if(
          mouseX >= 650 &&
mouseX <= 780 &&
mouseY >= 40 &&
mouseY <= 150
        ){
            hoverJugarMenu = true;
         if(!conejoMenuRisa){
         reproducirConejoRisa();

        }
            conejoMenuRisa = true;
          
        }else{
            conejoMenuRisa = false;
        }
        if(
       mouseX >= 650 &&
mouseX <= 780 &&
mouseY >= 170 &&
mouseY <= 290
        ){
            hoverNivelesMenu = true;
        }
        // BOTON SONIDO
if(
    mouseX >= 0 &&
    mouseX <= 100 &&
    mouseY >= 250 &&
    mouseY <= 380
){
    hoverSonidoMenu = true;
}
    }
    // MENU NIVELES
    if(menuActual === 2){
        if(
mouseX >= 0 &&
mouseX <= 120 &&
mouseY >= 360 &&
mouseY <= 500
        ){
            hoverRegresar = true;
        }
          // NIVEL 1
if(
 mouseX >= 100 &&
mouseX <= 280 &&
mouseY >= 20 &&
mouseY <= 180
){
    hoverNivel1 = true;
}
// NIVEL 2
if(
  mouseX >= 470 &&
mouseX <= 650 &&
mouseY >= 20 &&
mouseY <= 180
){
    hoverNivel2 = true;
}
    }
}

// CLICK MENUS
function clickMenu(mouseX, mouseY){
    // MENU INTRO
    if(menuActual === 0){
      if(hoverJugarIntro){
    musicaFondo.play();
    menuActual = 1;
    
}
    }
    // MENU PRINCIPAL
    else if(menuActual === 1){
      if(hoverJugarMenu){
    reiniciarNivel1();
    reiniciarNivel2();
    juegoIniciado = true;
    nivelActual = 1;
}
        if(hoverNivelesMenu){
            detenerRisaDueno();
            audioTelevision.pause();
            menuNivelesDesdeJuego = false;
            audioTelevision.currentTime = 0;
            menuNivelesDesdeJuego = false;
            menuActual = 2;
        }
        // SONIDO
if(hoverSonidoMenu){
    if(musicaFondo.paused){
        musicaFondo.play();
    }else{
        musicaFondo.pause();
    }
}
    }
    // MENU NIVELES
    else if(menuActual === 2){
      if(hoverRegresar){
        detenerRisaDueno();
        audioTelevision.pause();

audioTelevision.currentTime = 0;
   if(menuNivelesDesdeJuego){

    juegoIniciado = true;

}else{

    juegoIniciado = false;

    menuActual = 1;

}


}
        // NIVEL 1
if(hoverNivel1){
    reiniciarNivel1();
    juegoIniciado = true;
    nivelActual = 1;
}
// NIVEL 2
if(hoverNivel2){
    detenerRisaDueno();
    reiniciarNivel2();
    juegoIniciado = true;
    nivelActual = 2;
}
    }
}

// BARRA NIVEL
function dibujarBarraNivel(){
    // BARRA
    ctx.drawImage(
        barraMenu,
        0,
        0,
        canvas.width,
        canvas.height
    );
    // SONIDO
    ctx.drawImage(
        sonidoBarra,
        0,
        0,
        canvas.width,
        canvas.height
    );
    // REGRESAR
    ctx.drawImage(
        regresarMenu2,
        0,
        0,
        canvas.width,
        canvas.height
    );
    // NIVELES
    ctx.drawImage(
        nivelesBarra,
        0,
        0,
        canvas.width,
        canvas.height
    );
    // PISTA
    ctx.drawImage(
        pistaBarra,
        0,
        0,
        canvas.width,
        canvas.height
    );
    // TITULO
    if(nivelActual === 1){
        ctx.drawImage(
            nivel1Titulo,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    if(nivelActual === 2){
        ctx.drawImage(
            nivel2Titulo,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    // PISTA MENU
if(pistaActiva){
    ctx.drawImage(
        pistaMenu,
        0,
        0,
        canvas.width,
        canvas.height
    );
    if(nivelActual === 1){
        ctx.drawImage(
            pistaNivel1,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    if(nivelActual === 2){
        ctx.drawImage(
            pistaNivel2,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}
}

// CLICK BARRA
function clickBarra(mouseX, mouseY){
    
    // REGRESAR MENU
    if(
        mouseX >= 580 &&
        mouseX <= 640 &&
        mouseY >= 0 &&
        mouseY <= 60
    ){
       juegoIniciado = false;

duenoRisaActiva = false;

detenerRisaDueno();
audioTelevision.pause();

audioTelevision.currentTime = 0;

menuActual = 1; false;
        menuActual = 1;
        return;
    }
    // PISTA
    if(
        mouseX >= 640 &&
        mouseX <= 695 &&
        mouseY >= 0 &&
        mouseY <= 60
    ){
        pistaActiva = !pistaActiva;
        return;
    }
    // NIVELES
    if(
        mouseX >= 695 &&
        mouseX <= 755 &&
        mouseY >= 0 &&
        mouseY <= 60
    ){
       juegoIniciado = false;

duenoRisaActiva = false;

detenerRisaDueno();
audioTelevision.pause();

audioTelevision.currentTime = 0;
menuNivelesDesdeJuego = true;
menuActual = 2;
        return;
    }
    // SONIDO
    if(
        mouseX >= 755 &&
        mouseX <= 820 &&
        mouseY >= 0 &&
        mouseY <= 60
    ){
        if(musicaFondo.paused){
            musicaFondo.play();
        }else{
            musicaFondo.pause();
        }
        return;
    }

    
}