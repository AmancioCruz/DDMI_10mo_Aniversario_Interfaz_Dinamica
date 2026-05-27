// -------- SPRITES ----------
//Guarda todos los sprites de la brujita de todas las direcciones en las que se mueve
const playerSprites = {
    idleDown: new Image(),
    idleUp: new Image(),
    idleSide: new Image(),

    walkDown1: new Image(),
    walkDown2: new Image(),

    walkUp1: new Image(),
    walkUp2: new Image(),

    walkSide1: new Image(),
    walkSide2: new Image()
};

playerSprites.idleDown.src =
"../Hilary_Montes/recursos/brujita_spriteIdle.png";

playerSprites.walkDown1.src =
"../Hilary_Montes/recursos/brujita_walk_down_1.png";

playerSprites.walkDown2.src =
"../Hilary_Montes/recursos/brujita_walk_down_2.png";

playerSprites.idleSide.src =
"../Hilary_Montes/recursos/brujita_idle_side_izq.png";

playerSprites.walkSide1.src =
"../Hilary_Montes/recursos/brujita_walk_side_1.png";

playerSprites.walkSide2.src =
"../Hilary_Montes/recursos/brujita_walk_side_2.png";

playerSprites.idleUp.src =
"../Hilary_Montes/recursos/brujita_idle_walkback_down.png";

playerSprites.walkUp1.src =
"../Hilary_Montes/recursos/brujita_walkback_1.png";

playerSprites.walkUp2.src =
"../Hilary_Montes/recursos/brujita_walkback_2.png";

// --------- JUGADOR ----------
const player = {
    x: 960,
    y: 750,

    width: 192,
    height: 192,

    speed: 4,
    direction: "down"
};

// -------- ANIMACION ---------
// Controlan los frames de animación
let animationFrame = 0;
let animationTimer = 0;

// -------- MOVIMIENTO ---------
// Es la funcion por la que se mueve al jugador y detecta las colisiones
function movePlayer(){
    let nextX = player.x;
    let nextY = player.y;
    let moving = false;

    // izquierda
    if(keys["a"]){
        nextX -= player.speed;
        moving = true;
        player.direction = "left";
    }

    // derecha
    if(keys["d"]){
        nextX += player.speed;
        moving = true;
        player.direction = "right";
    }

    // arriba
    if(keys["w"]){
        nextY -= player.speed;
        moving = true;
        player.direction = "up";
    }

    // abajo
    if(keys["s"]){
        nextY += player.speed;
        moving = true;
        player.direction = "down";
    }

    // Comienza el juego al presionar "enter"
    if(keys["enter"]){
        if(gameState === GAME_STATES.INTRO){
            gameState = GAME_STATES.PLAYING;
    }
}

    // jugador temporal
    const futurePlayer = {
        x: nextX,
        y: nextY,
        width: player.width,
        height: player.height
    };

    // Revisa si el jugador choca con obstáculos
    let collision = false;
    for(let obstacle of obstacles){

        if(checkObstacleCollision(futurePlayer, obstacle)){
            collision = true;
            break;
        }
    }

    // Mueve al jugador solo si no hay colisión
    if(!collision){
        player.x = nextX;
        player.y = nextY;
    }

    // Evita que el jugador salga del mapa
    if(player.x < 0){
        player.x = 0;
    }
    if(player.y < 0){
        player.y = 0;
    }
    if(player.x + player.width > map.width){
        player.x = map.width - player.width;
    }
    if(player.y + player.height > map.height){
        player.y = map.height - player.height;
    }
    if(gameState !== GAME_STATES.PLAYING){
    return;
}

// -------- ANIMACION ----------
// Cambia los frames mientras el jugador camina
if(moving){
    animationTimer++;

    if(animationTimer >= 15){
        animationFrame++;

        if(animationFrame > 3){
            animationFrame = 0;
        }
        animationTimer = 0;
    }
}
else{
    animationFrame = 0;
}
}

// Dibuja a la brujita en pantalla
function drawPlayer(){
    let currentSprite;

// ------ IDLE -------
// Muestra sprites quietos dependiendo de la dirección del jugador
    if(!keys["w"] &&
        !keys["a"] &&
        !keys["s"] &&
        !keys["d"]){

    if(player.direction === "down"){
        currentSprite = playerSprites.idleDown;
    }
    else if(player.direction === "up"){
        currentSprite = playerSprites.idleUp;
    }
    else{
        currentSprite = playerSprites.idleSide;
    }
}

// --------- CAMINAR ----------
// Muestra la animación de movimiento
    else{

    // Animación caminando hacia abajo
    if(player.direction === "down"){
        if(animationFrame === 0){
            currentSprite = playerSprites.walkDown1;
        }
        else if(animationFrame === 1){
            currentSprite = playerSprites.idleDown;
        }
        else if(animationFrame === 2){
            currentSprite = playerSprites.walkDown2;
        }
        else{
            currentSprite = playerSprites.idleDown;
        }
    }

    // Animación caminando hacia arriba
    else if(player.direction === "up"){
        if(animationFrame === 0){
            currentSprite = playerSprites.walkUp1;
        }
        else if(animationFrame === 1){
            currentSprite = playerSprites.idleUp;
        }
        else if(animationFrame === 2){
            currentSprite = playerSprites.walkUp2;
        }
        else{
            currentSprite = playerSprites.idleUp;
        }
    }

    // Animación caminando para ambos lados (derecha e izquierda)
    else{
        if(animationFrame === 0){
            currentSprite = playerSprites.walkSide1;
        }
        else if(animationFrame === 1){
            currentSprite = playerSprites.idleSide;
        }
        else if(animationFrame === 2){
            currentSprite = playerSprites.walkSide2;
        }
        else{
            currentSprite = playerSprites.idleSide;
        }
    }
}

// ------- DIBUJAR ---------
// Voltea el sprite para mirar a la derecha
    if(player.direction === "right"){
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
            currentSprite,
            -(player.x - camera.x) - player.width,
            player.y - camera.y,

            player.width,
            player.height
        );
        ctx.restore();
    }

    // normal
    else{
        ctx.drawImage(
            currentSprite,
            player.x - camera.x,
            player.y - camera.y,
            player.width,
            player.height
        );
    }
}