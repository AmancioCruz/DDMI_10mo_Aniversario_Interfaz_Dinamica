// Obtiene el canvas y permite dibujar elementos del juego
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

// Tamaño del canvas
canvas.width = 800;
canvas.height = 600;

// Estados principales del juego, se usan para cambiar entre pantallas y modos
const GAME_STATES = {
    INTRO: "intro",
    PLAYING: "playing",
    MINIGAME: "minigame",
    ENDING: "ending"
};

let gameState = GAME_STATES.INTRO;
let showTutorial = true;
let tutorialTimer = 0;

// -------- PANTALLAS ---------
// Intro
const introFrames = [
    new Image(),
    new Image()
];

introFrames[0].src =
"../Hilary_Montes/recursos/screen_start_1-01.png";

introFrames[1].src =
"../Hilary_Montes/recursos/screen_start_3-01.png";

// Final
const endingFrames = [
    new Image(),
    new Image()
];

endingFrames[0].src =
"../Hilary_Montes/recursos/screen_end_1-01.png";

endingFrames[1].src =
"../Hilary_Montes/recursos/screen_end_2-01.png";


// Animacion de la interfaz
let uiFrame = 0;
let uiTimer = 0;
let gemFrame = 0;
let gemTimer = 0;

// -------- TECLAS ----------
// Guarda las teclas presionadas por el jugador
const keys = {};

// Detecta cuando una tecla es presionada
window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    if(keys["enter"]){

        if(gameState === GAME_STATES.INTRO){
            gameState = GAME_STATES.PLAYING;
        }
        showTutorial = true;
        tutorialTimer = 0;
    }
});

// Detecta cuando una tecla deja de presionarse
window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

function updateUIAnimation(){
    uiTimer++;

    if(uiTimer >= 40){
        uiFrame++;
        if(uiFrame > 1){
            uiFrame = 0;
        }
        uiTimer = 0;
    }
}

function updateGemAnimation(){
    gemTimer++;

    if(gemTimer >= 30){
        gemFrame++;
        if(gemFrame > 1){
            gemFrame = 0;
        }
        gemTimer = 0;
    }
}

// --------- INTERFAZ -----------
// Muestra el contador de gemas en pantalla
function drawUI(){

    // caja fondo
    ctx.fillStyle = "rgba(165, 137, 189, 0.38)";
    ctx.fillRect(20, 20, 220, 70);

    // texto
    ctx.fillStyle = "#2d2436";
    ctx.font = "bold 24px Arial";

    ctx.fillText(
        "Piedritas: " +
        getCollectedGems() +
        " / " +
        gems.length,
        40,
        65
    );
}

// Pantalla inicial del juego
function drawIntro(){
    if(gameState === GAME_STATES.INTRO){
        ctx.drawImage(
            introFrames[uiFrame],

            0,
            0,

            canvas.width,
            canvas.height
        );
    }
}

// Muestra las instrucciones y objetivo del juego temporalmente al iniciar
function drawTutorial(){
    if(showTutorial){

        // fondo
        ctx.fillStyle = "rgba(139, 103, 170, 0.83)";
        ctx.fillRect(
            140,
            170,

            520,
            220
        );

        // borde
        ctx.strokeStyle = "#301647";
        ctx.lineWidth = 4;
        ctx.strokeRect(

            140,
            170,

            520,
            220
        );

        // texto
        ctx.fillStyle = "#0a0013";
        ctx.textAlign = "center";

        // titulo
        ctx.font = "bold 28px Arial";
        ctx.fillText(
            "Controls",
            canvas.width / 2,
            220
        );

        // controles
        ctx.font = "bold 24px Arial";
        ctx.fillText(
            "Use W A S D to move.",
            canvas.width / 2,
            280
        );

        // historia
        ctx.font = "bold 22px Arial";
        ctx.fillText(
            "Collect the 5 magic gems ",
            canvas.width / 2,
            330
        );

        ctx.fillText(
            "to find your cat.",
            canvas.width / 2,
            365
        );

        // restaurar alineación
        ctx.textAlign = "left";

        // ---------- CRONOMETRO ---------
        tutorialTimer++;

        if(tutorialTimer >= 300){
            showTutorial = false;
        }
    }
}

function drawEnding(){
    if(gameState === GAME_STATES.ENDING){
        ctx.drawImage(
            endingFrames[uiFrame],

            0,
            0,

            canvas.width,
            canvas.height
        );
    }
}

// Muestra el minijuego del cursor en el circulo para obtener una gema
function drawMiniGame(){
    if(gameState === GAME_STATES.MINIGAME){

        // fondo oscuro
        ctx.fillStyle = "rgba(165, 137, 189, 0.38)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // circulo objetivo
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

        ctx.fillStyle = "#9b75a5";
        ctx.fill();

        // texto
        ctx.fillStyle = "#301647";
        ctx.font = "bold 30px Arial";

        ctx.fillText(
            "Place the cursor inside the circle",
            180,
            150
        );

        // barra progreso
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(250, 500, 300, 30);

        ctx.fillStyle = "#301647";
        ctx.fillRect(250, 500, progress * 3, 30);

        // distancia mouse
        const dx = mouse.x - centerX;
        const dy = mouse.y - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // progreso
        if(distance < radius){
            progress += 1;
            if(progress >= maxProgress){
                currentGem.collected = true;
                    progress = 0;


        // verificar final
        if(getCollectedGems() === gems.length){

    gameState = GAME_STATES.ENDING;
        }
            else{
                gameState = GAME_STATES.PLAYING;
            }
        }
    }
        else{
            progress -= 1;
            if(progress < 0){
                progress = 0;
            }
        }
    }
}

// -------- GAME LOOP --------
// Bucle principal del juego. Actualiza y 
// dibuja todos los elementos constantemente
function gameLoop(){
    // limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // actualizar
    updateUIAnimation();
    updateGemAnimation();
    movePlayer();
    collectGems();
    updateCamera();

    // -------- INTRO -----------
if(gameState === GAME_STATES.INTRO){
    drawIntro();
}

// --------- JUGANDO ---------
else if(
    gameState === GAME_STATES.PLAYING ||
    gameState === GAME_STATES.MINIGAME
){
    drawMap();
    drawObstacles();
    drawGems();
    drawPlayer();
    drawUI();
    drawTutorial();
    drawMiniGame();
}

// --------- FINAL ---------
// Pantalla final que se muestra al encontrar todas las gemas
else if(gameState === GAME_STATES.ENDING){
    drawEnding();
}
    // repetir
    requestAnimationFrame(gameLoop);
}

// iniciar juego
gameLoop();