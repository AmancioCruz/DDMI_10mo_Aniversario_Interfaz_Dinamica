
const musicaFondo = new Audio(
    "./recursos/musicadefondo.mp3"
);

musicaFondo.loop = true;
musicaFondo.volume = 0.3;

// EFECTOS

let audioGanaste =
new Audio("recursos/Ganaste.mp3");
let audioPerdiste =
new Audio("recursos/Perdiste.mp3");
let audioRisaDueno =
new Audio("recursos/RisaDueno.mp3");
let audioTelevision =
new Audio("recursos/Television.mp3");
audioTelevision.loop = true;
audioTelevision.volume = 0.02;

let audioConejoRisa =
new Audio("recursos/ConejoRisa.mp3");
let audioExplosion =
new Audio("recursos/ExplosionConejo.mp3");
let audioBleh =
new Audio("recursos/Bleh.mp3");

// FUNCIONES

function reproducirRisaDueno(){
    audioRisaDueno.pause();
    audioRisaDueno.currentTime = 0;
    audioRisaDueno.play().catch(() => {});

}

function reproducirTelevision(){
    audioTelevision.currentTime = 0;
    audioTelevision.play();
}

function reproducirConejoRisa(){
    audioConejoRisa.currentTime = 0;
    audioConejoRisa.play();
}

function reproducirExplosion(){
    audioExplosion.currentTime = 0;
    audioExplosion.play();
}

function reproducirBleh(){
    audioBleh.currentTime = 0;
    audioBleh.play();
}

function reproducirGanaste(){
    audioGanaste.currentTime = 0;
    audioGanaste.play();

}

function reproducirPerdiste(){
    audioPerdiste.currentTime = 0;
    audioPerdiste.play();

}

function detenerRisaDueno(){
    audioRisaDueno.pause();
    audioRisaDueno.currentTime = 0;

}