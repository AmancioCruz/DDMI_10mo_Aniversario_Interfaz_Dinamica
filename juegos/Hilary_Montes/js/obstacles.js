// --------- OBSTACULOS -----------
// Guarda todos los objetos con colisión del mapa
const obstacles = [
    // --------- ZONA SUPERIOR --------
    {
        x: 750,
        y: 120,

        width: 200,
        height: 230,

        collisionOffsetX: 80,
        collisionOffsetY: 80,

        collisionWidth: 50,
        collisionHeight: 50
    },

    {
        x: 600,
        y: 220,

        width: 200,
        height: 230,

        collisionOffsetX: 80,
        collisionOffsetY: 80,

        collisionWidth: 50,
        collisionHeight: 50
    },

    // --------- IZQUIERDA ----------
    {
        x: 30,
        y: 1000,

        width: 200,
        height: 230,

        collisionOffsetX: 80,
        collisionOffsetY: 80,

        collisionWidth: 50,
        collisionHeight: 50
    },

    {
        x: 230,
        y: 1120,

        width: 200,
        height: 230,

        collisionOffsetX: 80,
        collisionOffsetY: 80,

        collisionWidth: 50,
        collisionHeight: 50
    },

    // ---------- DERECHA ------
    {
        x: 1400,
        y: 580,

        width: 200,
        height: 230,

        collisionOffsetX: 80,
        collisionOffsetY: 80,

        collisionWidth: 50,
        collisionHeight: 50
    },

    // --------- ABAJO DERECHA ---------
    {
        x: 1280,
        y: 1550,

        width: 200,
        height: 230,

        collisionOffsetX: 80,
        collisionOffsetY: 80,

        collisionWidth: 50,
        collisionHeight: 50
    },

    {
        x: 1700,
        y: 1150,

        width: 200,
        height: 230,

        collisionOffsetX: 80,
        collisionOffsetY: 80,

        collisionWidth: 50,
        collisionHeight: 50
    },

    // ---------- ABAJO ----------

    {
        x: 820,
        y: 1490,

        width: 200,
        height: 230,

        collisionOffsetX: 80,
        collisionOffsetY: 80,

        collisionWidth: 50,
        collisionHeight: 50
    }
];

// -------- SPRITES -----------
// Sprite de los árboles
const treeSprite = new Image();

treeSprite.src =
"../Hilary_Montes/recursos/tree_1.png";


// Verifica colisiones normales entre dos objetos
// Se usa para gemas 
function checkCollision(a, b){
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&

        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Verifica las colisiones personalizadas para los arboles
// Usa una hitbox más pequeña que el sprite
function checkObstacleCollision(a, b){
    return (
        a.x < b.x + b.collisionOffsetX + b.collisionWidth &&
        a.x + a.width > b.x + b.collisionOffsetX &&

        a.y < b.y + b.collisionOffsetY + b.collisionHeight &&
        a.y + a.height > b.y + b.collisionOffsetY
    );
}

// Dibuja todos los obstáculos del mapa
function drawObstacles(){
    // Recorre el arreglo de obstáculos y dibuja cada árbol en pantalla
    for(let obstacle of obstacles){
        ctx.drawImage(
            treeSprite,

            obstacle.x - camera.x,
            obstacle.y - camera.y,

            obstacle.width,
            obstacle.height
        );
    }
}