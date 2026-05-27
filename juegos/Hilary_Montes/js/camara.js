// -------- CAMARA --------
// Guarda la posición de la cámara
const camera = {
    x: 0,
    y: 0
};

// Actualiza la posición de la cámara
function updateCamera(){
    // Centra la camara en el jugador
    camera.x = player.x - canvas.width / 2 + player.width / 2;
    camera.y = player.y - canvas.height / 2 + player.height / 2;

    // Límites de la camara
    // Evita que la cámara salga del mapa
    if(camera.x < 0){
        camera.x = 0;
    }

    if(camera.y < 0){
        camera.y = 0;
    }

    if(camera.x + canvas.width > map.width){
        camera.x = map.width - canvas.width;
    }

    if(camera.y + canvas.height > map.height){
        camera.y = map.height - canvas.height;
    }
}
