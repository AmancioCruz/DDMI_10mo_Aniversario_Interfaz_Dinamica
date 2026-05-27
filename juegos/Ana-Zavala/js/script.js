import { Nota } from "./Nota.js";
import { Personaje } from "./Personaje.js";
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d")

const cancion = new Audio("recursos/audio/cancionInterfaz.mp3");
const efectoNotaPerdida = new Audio("recursos/audio/notaPerdida.mp3")
const sonidoGanar = new Audio("recursos/audio/ganar.mp3");
const sonidoPerder = new Audio("recursos/audio/perder.mp3");
const sonidoInicio = new Audio("recursos/audio/inicio.mp3");

const botonReiniciar = document.querySelector("#reiniciar-juego");
const iconoBoton = botonReiniciar.querySelector("i");
const textoBoton = botonReiniciar.querySelector("span");

let moverFondo = false;
const fondo = new Image();
fondo.src = "recursos/img/fondo.png"
const pantallaInicio = new Image();
pantallaInicio.src = "recursos/img/pantallaInicioAhoraSi.png"
const pantallaGanar1 = new Image();
pantallaGanar1.src = "recursos/img/pantallaGanar1.png"
const pantallaGanar2 = new Image();
pantallaGanar2.src = "recursos/img/pantallaGanar2.png"
const pantallaGanar3 = new Image();
pantallaGanar3.src = "recursos/img/pantallaGanar3.png"
const pantallaPerder = new Image();
pantallaPerder.src = "recursos/img/pantallaPerder.png"

const receptorY = 500;//la altura donde se debe presionar la tecla

let teclasPresionadas = {};

let notas = []; //arreglo donde se guardan las notas

let tiempoJuego = 0
let indiceNota = 0; //que nota sigue para salir
const tiempoAnticipacion = 1.7;//anticipacion para que la nota salga antes y baje, saldra dos segundos antes

let fallos = 0;//para guaradr los fallos 
let puntuacion = 0; //ps para la puntuacion xd
const textoPuntajeActual = document.querySelector("#puntajeActual")

const textoMejorPuntaje = document.querySelector("#mejorPuntuaje");
let mejorPuntuacion =
    localStorage.getItem(
        "mejorPuntuacion"
    ) || 0;
textoMejorPuntaje.textContent = mejorPuntuacion;
let ultimoTiempo = 0;//guarda el frame anterior

let juegoIniciado = false;
let juegoTerminado = false;
let perdio = false

//imagenes para la animacion de estado normal del personaje
const normal1 = new Image();
normal1.src = "recursos/img/normal1.png";
const normal2 = new Image();
normal2.src = "recursos/img/normal2.png";
const normal3 = new Image();
normal3.src = "recursos/img/normal3.png";
const normal4 = new Image();
normal4.src = "recursos/img/normal4.png";
const normal5 = new Image();
normal5.src = "recursos/img/normal5.png";
const normal6 = new Image();
normal6.src = "recursos/img/normal6.png";

//imagenes de flechas para las notas que caen 
const flechaIzquierda = new Image();
flechaIzquierda.src = "recursos/img/flecha_izquierda.png";
const flechaAbajo = new Image();
flechaAbajo.src = "recursos/img/flecha_abajo.png";
const flechaArriba = new Image();
flechaArriba.src = "recursos/img/flecha_arriba.png";
const flechaDerecha = new Image();
flechaDerecha.src = "recursos/img/flecha_derecha.png";

pantallaInicio.onload = () => {

    console.log("imagen cargada");

};
//imagenes de fleha para los receptores
const receptorIzquierda = new Image();
receptorIzquierda.src = "recursos/img/receptor_izquierda.png";
const receptorAbajo = new Image();
receptorAbajo.src = "recursos/img/receptor_abajo.png";
const receptorArriba = new Image();
receptorArriba.src = "recursos/img/receptor_arriba.png";
const receptorDerecha = new Image();
receptorDerecha.src = "recursos/img/receptor_derecha.png";

//imagenes del personaje
const normal = new Image();
normal.src = "recursos/img/normal.png";
const izquierda = new Image();
izquierda.src = "recursos/img/izquierda.png";
const abajo = new Image();
abajo.src = "recursos/img/abajo.png";
const arriba = new Image();
arriba.src = "recursos/img/arriba.png";
const derecha = new Image();
derecha.src = "recursos/img/derecha.png";
const fallo = new Image();
fallo.src = "recursos/img/fallo.png";

const personaje = new Personaje([normal1, normal2, normal3, normal4, normal5, normal6], izquierda, abajo, arriba, derecha, fallo);//se crea el personaje

const carriles = [ //los carriles por donde pasan las notas y que tecla corresponde al carril
    { x: 260, tecla: "ArrowLeft", color: "#c24b99", imagen: flechaIzquierda, receptor: receptorIzquierda },
    { x: 380, tecla: "ArrowDown", color: "#00ffff", imagen: flechaAbajo, receptor: receptorAbajo },
    { x: 500, tecla: "ArrowUp", color: "#12fa05", imagen: flechaArriba, receptor: receptorArriba },
    { x: 620, tecla: "ArrowRight", color: "#f9393f", imagen: flechaDerecha, receptor: receptorDerecha }
];



function bucleJuego(tiempoActual) {

    //requestAnimationFrame es literalmente las animaciones que se general con el juego, 
    // las teclas cayendo y asi, se le pasa el bucle por que es lo que va estar ejecutando por frames 
    let offsetX = 0;
    if (!juegoIniciado) {
        if (moverFondo) {
            offsetX = Math.random() * 4 - 2;
            ctx.drawImage(pantallaInicio, offsetX, 0, canvas.width, canvas.height);
        } else {
            ctx.drawImage( pantallaInicio, 0, 0, canvas.width, canvas.height);
        }
        requestAnimationFrame(bucleJuego);
        return;
    }
    let deltaTime =
        (tiempoActual - ultimoTiempo) / 1000;

    ultimoTiempo = tiempoActual;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //el fondo jijiji
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

    tiempoJuego = cancion.currentTime;//segundos exactos de la cancion
    if (cancion.ended && !perdio) {//si la cancion termino el juego se termina
        juegoTerminado = true;
        sonidoGanar.play()
        if (puntuacion > mejorPuntuacion) {//para guardar la mejor puntuacion
            mejorPuntuacion = puntuacion;
            localStorage.setItem(
                "mejorPuntuacion",
                mejorPuntuacion
            );
        }
        textoMejorPuntaje.textContent = mejorPuntuacion;
    }
    if (juegoTerminado) {
        dibujarFinJuego();

        requestAnimationFrame(bucleJuego);
        return;
    }
    revisarMapaNotas()
    actualizarNotas(deltaTime)
    dibujarReceptores()
    personaje.animacion(deltaTime);
    personaje.dibujar(ctx);
    dibujarNotas()
    dibujarPuntuacion();
    dibujarBarraProgreso();
    dibujarFinJuego();
    requestAnimationFrame(bucleJuego);

}

function dibujarFinJuego() {

    if (!juegoTerminado) return;

    if (perdio) {
        ctx.drawImage(pantallaPerder, 0, 0, canvas.width, canvas.height);
    }

    if (puntuacion >= 14000 && !perdio) {
        ctx.drawImage(pantallaGanar1, 0, 0, canvas.width, canvas.height);
    } else if (puntuacion >= 1300 && !perdio) {
        ctx.drawImage(pantallaGanar2, 0, 0, canvas.width, canvas.height);
    } else if (puntuacion < 1200 && !perdio) {
        ctx.drawImage(pantallaGanar3, 0, 0, canvas.width, canvas.height);
    }

}

function reiniciarJuego() {//al reiniciar se resetean los valores e inicia la cancion de nuevo
    notas = [];
    fallos = 0;
    puntuacion = 0;
    indiceNota = 0;
    juegoTerminado = false;
    juegoIniciado = true;
    perdio = false;
    iconoBoton.classList.remove("fa-play");
    iconoBoton.classList.add("fa-rotate-right");
    textoBoton.textContent = "Reiniciar";
    textoPuntajeActual.textContent = 0;
    cancion.currentTime = 0; //regresa la cancion al inicio
    cancion.play();
}

//receptores para las notas que caigan
function dibujarReceptores() {
    for (let i = 0; i < carriles.length; i++) {

        if (teclasPresionadas[carriles[i].tecla]) { //si la tecla se presiono genera un sombra y se hace un poco grande
            ctx.shadowColor = carriles[i].color;
            ctx.shadowBlur = 50;
            ctx.drawImage(carriles[i].receptor, carriles[i].x - 5, receptorY - 5, 90, 90);
        } else { //al soltar vuelve a su tamaño normal
            ctx.drawImage(carriles[i].receptor, carriles[i].x, receptorY, 80, 80);
        }

        ctx.shadowBlur = 0;
    }
}

const mapaNotas = [ //arreglo donde estan las notas que se tocan en el tiempo de la cancion y el carril de la flecha

    // Intro voz
    { tiempo: 8.00, carril: 1 },
    { tiempo: 8.35, carril: 2 },
    { tiempo: 8.80, carril: 0 },
    { tiempo: 9.30, carril: 3 },

    { tiempo: 9.95, carril: 2 },
    { tiempo: 10.25, carril: 1 },
    { tiempo: 10.80, carril: 0 },
    { tiempo: 11.30, carril: 3 },

    { tiempo: 11.95, carril: 2 },
    { tiempo: 12.30, carril: 1 },
    { tiempo: 12.80, carril: 0 },
    { tiempo: 13.30, carril: 3 },

    { tiempo: 13.95, carril: 1 },
    { tiempo: 14.25, carril: 2 },
    { tiempo: 14.50, carril: 1 },
    { tiempo: 14.80, carril: 3 },

    { tiempo: 15.30, carril: 2 },
    { tiempo: 15.60, carril: 1 },
    { tiempo: 15.95, carril: 0 },

    { tiempo: 16.30, carril: 2, duracion: 0.60 },
    { tiempo: 16.85, carril: 3 },
    { tiempo: 17.30, carril: 1 },
    { tiempo: 17.75, carril: 0 },

    { tiempo: 18.00, carril: 2 },
    { tiempo: 18.45, carril: 3 },
    { tiempo: 18.85, carril: 1 },
    { tiempo: 19.30, carril: 0, duracion: 0.45 },

    // Parte principal
    { tiempo: 20.00, carril: 1 },
    { tiempo: 20.30, carril: 2 },
    { tiempo: 20.65, carril: 3 },
    { tiempo: 21.00, carril: 0 },

    { tiempo: 21.40, carril: 2 },
    { tiempo: 21.70, carril: 1 },
    { tiempo: 22.00, carril: 0 },
    { tiempo: 22.35, carril: 3 },

    { tiempo: 22.80, carril: 1, duracion: 0.42 },
    { tiempo: 23.10, carril: 2 },
    { tiempo: 23.50, carril: 3 },
    { tiempo: 23.85, carril: 0 },

    { tiempo: 24.20, carril: 1 },
    { tiempo: 24.55, carril: 2 },
    { tiempo: 24.90, carril: 1 },
    { tiempo: 25.20, carril: 3 },

    { tiempo: 25.60, carril: 0 },
    { tiempo: 26.00, carril: 2 },
    { tiempo: 26.40, carril: 3 },
    { tiempo: 26.75, carril: 1 },

    { tiempo: 27.15, carril: 0 },
    { tiempo: 27.55, carril: 1 },
    { tiempo: 27.90, carril: 2 },
    { tiempo: 28.25, carril: 3 },

    // Variación
    { tiempo: 28.80, carril: 2, duracion: 0.50 },
    { tiempo: 29.40, carril: 1 },
    { tiempo: 29.75, carril: 0 },
    { tiempo: 30.10, carril: 3 },

    { tiempo: 30.45, carril: 2 },
    { tiempo: 30.80, carril: 1 },
    { tiempo: 31.10, carril: 2 },
    { tiempo: 31.45, carril: 3 },

    { tiempo: 31.90, carril: 0, duracion: 0.40 },
    { tiempo: 32.25, carril: 1 },
    { tiempo: 32.60, carril: 2 },
    { tiempo: 32.95, carril: 3 },

    { tiempo: 33.35, carril: 1 },
    { tiempo: 33.70, carril: 0 },
    { tiempo: 34.00, carril: 1 },
    { tiempo: 34.35, carril: 2 },

    { tiempo: 34.80, carril: 3 },
    { tiempo: 35.20, carril: 2 },
    { tiempo: 35.55, carril: 1 },
    { tiempo: 35.90, carril: 0 },

    // Puente
    { tiempo: 36.40, carril: 2 },
    { tiempo: 36.80, carril: 3 },
    { tiempo: 37.20, carril: 1 },
    { tiempo: 37.60, carril: 0 },

    { tiempo: 38.00, carril: 2, duracion: 0.70 },
    { tiempo: 38.85, carril: 1 },
    
    { tiempo: 40.35, carril: 2, duracion: 0.45 },
    
    { tiempo: 41.00, carril: 1 },

    { tiempo: 41.30, carril: 0 },
    { tiempo: 41.65, carril: 2 },
    { tiempo: 42.00, carril: 3 },
    { tiempo: 42.40, carril: 1 },

    // Clímax
    { tiempo: 43.00, carril: 0 },
    { tiempo: 43.25, carril: 1 },
    { tiempo: 43.50, carril: 2 },
    { tiempo: 43.75, carril: 3 },

    { tiempo: 44.10, carril: 2 },
    { tiempo: 44.40, carril: 1 },
    { tiempo: 44.70, carril: 0 },
    { tiempo: 45.00, carril: 3 },

    { tiempo: 45.30, carril: 2 },
    { tiempo: 45.60, carril: 1 },
    { tiempo: 45.95, carril: 2 },
    { tiempo: 46.30, carril: 3 },

    { tiempo: 46.70, carril: 0 },
    { tiempo: 47.30, carril: 1 },
    { tiempo: 47.65, carril: 2 },
    
    { tiempo: 49.30, carril: 0 },
    { tiempo: 49.70, carril: 3 },

    { tiempo: 50.10, carril: 2 },
    { tiempo: 50.50, carril: 1 },
    { tiempo: 50.90, carril: 0 },
    { tiempo: 51.30, carril: 3 },

    { tiempo: 51.80, carril: 1 },
    { tiempo: 52.10, carril: 2 },
    { tiempo: 52.40, carril: 3 },
    { tiempo: 52.75, carril: 0 },

    { tiempo: 53.20, carril: 2, duracion: 0.50 },
    { tiempo: 53.60, carril: 1 },
    { tiempo: 54.00, carril: 3 },
    { tiempo: 54.40, carril: 0 },

    // Cierre
    { tiempo: 55.00, carril: 1 },
    { tiempo: 55.30, carril: 2 },
    { tiempo: 55.65, carril: 1 },
    { tiempo: 56.00, carril: 3 },

    { tiempo: 56.40, carril: 0 },
    { tiempo: 56.80, carril: 2 },
    { tiempo: 57.20, carril: 3 },
    { tiempo: 57.60, carril: 1 },

    { tiempo: 58.00, carril: 0 },
    { tiempo: 58.35, carril: 1 },
    { tiempo: 58.70, carril: 2 },
    { tiempo: 59.05, carril: 3 },

    { tiempo: 59.50, carril: 2, duracion: 0.80 },
    { tiempo: 60.40, carril: 1 },
    { tiempo: 60.80, carril: 0 },

    
    { tiempo: 66.50, carril: 2 },
    { tiempo: 67.10, carril: 1 },
    { tiempo: 67.55, carril: 3 }


];

//PRUEBA DE QUE SI FUNCIONA LA NOTA 
//notas.push(new Nota(carriles[0].x))
/*notas.push(
    new Nota(carriles[0].x)
);

notas[i].dibujar(ctx);*/

//deltatime es el tiempo real segun la cancion
function actualizarNotas(deltaTime) {

    for (let i = 0; i < notas.length; i++) {
        notas[i].actualizar(deltaTime);

        let nota = notas[i];

        if (nota.iniciada && !nota.cancelada) {
            let teclaCarril = carriles[nota.carril].tecla;

            if (!teclasPresionadas[teclaCarril]) {
                nota.cancelada = true;
            }
        }

        if (nota.cancelada) {//si la nota se dejo de presionar se cancela, y se elimina
            notas.splice(i, 1);
            i--;
            continue;
        }

        if (nota.iniciada && nota.progresoHold >= nota.altoSostenido) {
            notas.splice(i, 1);
            i--;
            continue;
        }
        if (nota.y - nota.altoSostenido > receptorY + 100) { //verificar el fallo, si se pasa del receptor es una fallo 
            console.log("FALLO");
            fallos++;//el arreglo aumenta
            personaje.mostrarFallo();
            setTimeout(() => {

                personaje.volverNormal();

            }, 200);
            if (fallos >= 15) { //si llega a 15 fallos el juego se termina y pierdes
                juegoTerminado = true;
                perdio = true;
                cancion.pause();
                sonidoPerder.play()
            }
            notas.splice(i, 1);//lo elimina
            i--;//para que no se salte una nota
            efectoNotaPerdida.currentTime = 0; //se reinicia
            efectoNotaPerdida.play();
        }
    }
}

function dibujarNotas() {
    for (let i = 0; i < notas.length; i++) {
        notas[i].dibujar(ctx);
    }
    ctx.beginPath() //para mostrar cuantos fallos hubo en la partida
    ctx.fillStyle = "white";
    ctx.font = "40px 'Pixelify Sans'";
    ctx.fillText("Fallos: " + fallos, 40, 560);
}

function dibujarPuntuacion() {
    ctx.fillStyle = "white";
    ctx.font = "40px 'Pixelify Sans'";
    ctx.fillText("Puntos: " + puntuacion, 740, 560);
}

function revisarMapaNotas() {//creacion de las notas

    if (indiceNota >= mapaNotas.length) return; //para verificar que todas las notas ya pasaron

    let notaMapa = mapaNotas[indiceNota]; //para obtener la nota que sigue

    if (tiempoJuego >= notaMapa.tiempo - tiempoAnticipacion) { //si el tiempo que transcurrio es el mismo que el tiempo donde la nota sale entonces se crea
        notas.push(
            new Nota(carriles[notaMapa.carril].x, notaMapa.carril, notaMapa.duracion || 0, carriles[notaMapa.carril].color, carriles[notaMapa.carril].imagen)//si no hay duracion pone 0, osae normal
        );
        indiceNota++; //avanzar  a la siguiente nota
    }
}

function presionarTecla(evento) {
    console.log(evento.key);

    if (juegoTerminado && evento.key === "Enter") {// si el juego se termino y se presiona enter se reinicia
        reiniciarJuego();
        juegoIniciado = true;
        return;
    }

    personaje.cambiarAnimacion(evento.key);//se va cambiando la imagen del personaje

    //para recorrer todas la notas
    for (let i = 0; i < notas.length; i++) {
        let nota = notas[i];//obtener la nota
        let carrilNota = carriles[nota.carril];//para obtener el carril de la nota y saber con que tecla va
        let teclaCorrecta = carrilNota.tecla === evento.key; //guarda la tecla que se presiono y si es la misma que va con la nota
        let distancia = Math.abs(nota.y - receptorY);//para saber si esta lejos del receptor
        let estaCerca = distancia < 50; //si esta menos de 50 pixeles del receptor entonces la nota se acertó


        if (teclaCorrecta && estaCerca) { //si se presiono la tecla de la nota entonces es un acierto 
            console.log("ACIERTO");
            //nota perfecta
            if (distancia < 15) {
                puntuacion += 100;
                textoPuntajeActual.textContent = puntuacion;
                console.log("PERFECTA");
            }
            // nota buena
            else if (distancia < 35) {
                puntuacion += 50;
                textoPuntajeActual.textContent = puntuacion;
                console.log("BIEN");
            }
            // mal
            else {
                puntuacion += 25;
                textoPuntajeActual.textContent = puntuacion;
                console.log("MAL");
            }


            // si es nota sostenida
            if (nota.duracion > 0) {
                nota.tocada = true;
                nota.iniciada = true;
                nota.y = receptorY; //la barra se pega al receptor y no se ve raro
            }
            // nota normal
            else {
                notas.splice(i, 1);//y se elimina la nota
            }
            break; //y se sale por que la nota solo se acierta una vez
        }

    }
}

function iniciarJuego(evento) {

    if (evento.key === "Enter") {

        sonidoInicio.currentTime = 0;
        sonidoInicio.play();
        moverFondo = true;
        //cancion.play();
        setTimeout(() => {
            juegoIniciado = true;
            cancion.play();//inicio de la cancion
            moverFondo = false;
        }, 500);
        /*

        window.removeEventListener(
            "keydown",
            iniciarJuego
        );*/
    }
}

function dibujarBarraProgreso() {

    let progreso = 0; //se inicializa en 0

    //el tiempo actual entre la duracion de la cancion para saber le progreso
    if (cancion.duration > 0) { //cuando ya inicia la cancion
        progreso = cancion.currentTime / cancion.duration;
    }
    let anchoBarra = 400 * progreso;
    // barra vacia
    ctx.fillStyle = "gray";
    ctx.fillRect(300, 20, 400, 17);
    //el progreso
    ctx.fillStyle = "#12fa05";
    ctx.fillRect(300, 20, anchoBarra, 17);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(300, 20, 400, 17);
}
pantallaGanar3.onerror =
    () => {

        console.log(
            "ERROR imagen"
        );

    };
window.addEventListener("keydown", (evento) => {
    const teclasBloqueadas = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        " "
    ];

    if (teclasBloqueadas.includes(evento.key)) {
        evento.preventDefault(); //para bloquear el movimiento del scroll al usar las flechas 
    }
    presionarTecla(evento);

}); //para detectar las teclas 
window.addEventListener("keydown", iniciarJuego);

window.addEventListener("keydown", (evento) => { //con esto se hace la nota sostenida
    teclasPresionadas[evento.key] = true;
});

window.addEventListener("keyup", (evento) => {
    teclasPresionadas[evento.key] = false;
    personaje.volverNormal();
});
botonReiniciar.addEventListener("click", reiniciarJuego);
bucleJuego(0)

