let dinero = 0;
let dineroPorClick = 1;
let dineroPorSegundo = 0;
let nivelHotel = 1;
let tiempoAcumulado = 0;

let multiplicador = 1;
let reiniciosHotel = 0;

let finalDesbloqueado = false;
let textosFlotantes = [];

const DINERO_NECESARIO_REINICIO = 250000;

function inicializarJuego() {
    dinero = 0;
    dineroPorClick = 1;
    dineroPorSegundo = 0;
    nivelHotel = 1;
    tiempoAcumulado = 0;
    textosFlotantes = [];

    cargarJuego();
}

/* AGREGAR DINERO */
function agregarDinero(cantidad) {
    const ganancia = cantidad * multiplicador;
    dinero += ganancia;

    textosFlotantes.push({
        texto: `+$${formatearNumero(ganancia)}`,
        x: areaHotel.x + areaHotel.ancho / 2,
        y: areaHotel.y + 180,
        opacidad: 1,
        automatico: false
    });
}

function agregarDineroAutomatico(cantidad) {
    const ganancia = cantidad * multiplicador;
    dinero += ganancia;

    if (cantidad > 0) {
        textosFlotantes.push({
            texto: `+$${formatearNumero(ganancia)}`,
            x: 1000,
            y: 430,
            opacidad: 0.7,
            automatico: true
        });
    }
}

function actualizarJuego(deltaTiempo) {
    tiempoAcumulado += deltaTiempo;

    while (tiempoAcumulado >= 1) {
        agregarDineroAutomatico(dineroPorSegundo);
        tiempoAcumulado -= 1;
    }

    nivelHotel = Math.floor(dinero / 1000) + 1;
}

/* COMPRAR MEJORA */
function comprarMejora(indice) {
    const mejora = mejoras[indice];

    if (!mejora) return;
    if (dinero < mejora.costo) return;

    dinero -= mejora.costo;
    mejora.cantidad++;

    if (mejora.tipo === "click") {
        dineroPorClick += mejora.click;
    } else if (mejora.tipo === "auto") {
        dineroPorSegundo += mejora.produccion;
    } else if (mejora.tipo === "final") {
        finalDesbloqueado = true;
    }

    mejora.costo = Math.floor(mejora.costo * 1.35);

    guardarJuego();
}

/* PRESTIGIO */
function puedeReiniciarHotel() {
    return dinero >= DINERO_NECESARIO_REINICIO;
}

function reiniciarConPrestigio() {
    if (!puedeReiniciarHotel()) return;

    reiniciosHotel++;
    multiplicador = 1 + reiniciosHotel * 0.25;

    dinero = 0;
    dineroPorClick = 1;
    dineroPorSegundo = 0;
    nivelHotel = 1;
    tiempoAcumulado = 0;
    textosFlotantes = [];

    reiniciarMejoras();

    guardarJuego();
}

function reiniciarMejoras() {
    mejoras.forEach((mejora) => {
        mejora.cantidad = 0;

        if (mejora.nombre === "Clientes VIP") {
            mejora.costo = 100;
        } else if (mejora.nombre === "Publicidad") {
            mejora.costo = 500;
        } else if (mejora.nombre === "Botones de Servicio") {
            mejora.costo = 15;
        } else if (mejora.nombre === "Recepcionista") {
            mejora.costo = 100;
        } else if (mejora.nombre === "Camaristas") {
            mejora.costo = 500;
        } else if (mejora.nombre === "Restaurante del Hotel") {
            mejora.costo = 2000;
        } else if (mejora.nombre === "Piscina y Spa") {
            mejora.costo = 10000;
        } else if (mejora.nombre === "Suite Presidencial") {
            mejora.costo = 100000;
        } else if (mejora.nombre === "Resort de Lujo") {
            mejora.costo = 750000;
        } else if (mejora.nombre === "Hotel Definitivo") {
            mejora.costo = 10000000;
        }
    });

    finalDesbloqueado = false;
}

/* GUARDAR */
function guardarJuego() {
    const datosGuardados = {
        dinero,
        dineroPorClick,
        dineroPorSegundo,
        nivelHotel,
        multiplicador,
        reiniciosHotel,
        finalDesbloqueado,
        mejoras: mejoras.map(mejora => ({
            costo: mejora.costo,
            cantidad: mejora.cantidad
        }))
    };

    localStorage.setItem("grandHotelClicker", JSON.stringify(datosGuardados));
}

function cargarJuego() {
    const datos = localStorage.getItem("grandHotelClicker");

    if (!datos) return;

    const partida = JSON.parse(datos);

    dinero = partida.dinero ?? 0;
    dineroPorClick = partida.dineroPorClick ?? 1;
    dineroPorSegundo = partida.dineroPorSegundo ?? 0;
    nivelHotel = partida.nivelHotel ?? 1;
    multiplicador = partida.multiplicador ?? 1;
    reiniciosHotel = partida.reiniciosHotel ?? 0;
    finalDesbloqueado = partida.finalDesbloqueado ?? false;

    if (partida.mejoras) {
        partida.mejoras.forEach((mejoraGuardada, indice) => {
            if (mejoras[indice]) {
                mejoras[indice].costo = mejoraGuardada.costo;
                mejoras[indice].cantidad = mejoraGuardada.cantidad;
            }
        });
    }
}

function formatearNumero(valor) {
    return Math.floor(valor).toLocaleString("es-MX");
}

setInterval(() => {
    guardarJuego();
}, 5000);