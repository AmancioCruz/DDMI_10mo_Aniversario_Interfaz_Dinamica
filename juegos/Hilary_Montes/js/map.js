// --------- IMAGEN MAPA -------
// Imagen principal del mapa
const mapImage = new Image();

mapImage.src =
"../Hilary_Montes/recursos/map2.png";

// --------- MAPA -------
const map = {
    width: 2000,
    height: 2000
};

// Dibuja el mapa en pantalla
function drawMap(){
    ctx.drawImage(
        mapImage,

        -camera.x,
        -camera.y,

        map.width,
        map.height
    );
}