// ------- SPRITES GEMA --------
// Guarda los frames de animación de las gemas
const gemFrames = [
    new Image(),
    new Image()
];

gemFrames[0].src =
"../Hilary_Montes/recursos/gem_1.png";

gemFrames[1].src =
"../Hilary_Montes/recursos/gem_2.png";

// ------- GEMAS --------
// Contiene todas las gemas del juego
const gems = [
    // gema 1
    {
        x: 1080,
        y: 230,

        width: 86,
        height: 86,

        collected: false
    },

    // gema 2
    {
        x: 320,
        y: 890,

        width: 86,
        height: 86,

        collected: false
    },

    // gema 3
    {
        x: 1650,
        y: 920,

        width: 86,
        height: 86,

        collected: false
    },

    // gema 4
    {
        x: 1610,
        y: 1550,

        width: 86,
        height: 86,

        collected: false
    },

    // gema 5
    {
        x: 1100,
        y: 1700,

        width: 86,
        height: 86,

        collected: false
    }
];

// Dibuja las gemas que aún no han sido recolectadas
function drawGems(){
    // Recorre todas las gemas del juego
    for(let gem of gems){

        // Solo dibuja las gemas no recolectadas
        if(!gem.collected){
            ctx.drawImage(
                gemFrames[gemFrame],

                gem.x - camera.x,
                gem.y - camera.y,

                gem.width,
                gem.height
            );
        }
    }
}

// ------- MINIJUEGO --------
// Indica si el minijuego está activo
let miniGameActive = false;

// Guarda la gema actual que el jugador encontró
let currentGem = null;

// Guarda el progreso del minijuego
let progress = 0;

// Cantidad máxima necesaria para completar el minijuego
const maxProgress = 100;

// Guarda la posición del mouse en pantalla
let mouse = {
    x: 0,
    y: 0
};

// Verifica si el jugador toca una gema
function collectGems(){
    for(let gem of gems){
        if(!gem.collected){
            const collision = checkCollision(player, {
                x: gem.x - gem.width / 2,
                y: gem.y - gem.height / 2,
                width: gem.width,
                height: gem.height
            });

            // Activa el minijuego al encontrar una gema
            if(collision){
                gameState = GAME_STATES.MINIGAME;
                currentGem = gem;
            }
        }
    }
}

// --------- CONTADOR ----------
// Cuenta cuántas gemas han sido recolectadas
function getCollectedGems(){
    let collected = 0;

    for(let gem of gems){
        if(gem.collected){
            collected++;
        }
    }
    return collected;
}
