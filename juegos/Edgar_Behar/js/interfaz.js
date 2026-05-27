const bannerUI = new Image();
bannerUI.src = "recursos/overlay.png";

const imagenHotel = new Image();
imagenHotel.src = "recursos/hotel.jpeg";

const areaHotel = {
    x: 350,
    y: 145,
    ancho: 505,
    alto: 500
};

const areasMejoras = [];
const areasMejorasClick = [];

const botonReinicio = {
    x: 450,
    y: 560,
    ancho: 300,
    alto: 50
};

const botonConfirmar = {
    x: 430,
    y: 430,
    ancho: 150,
    alto: 45
};

const botonCancelar = {
    x: 620,
    y: 430,
    ancho: 150,
    alto: 45
};

const botonContinuarFinal = {
    x: 500,
    y: 475,
    ancho: 200,
    alto: 45
};

let mostrarConfirmacionReinicio = false;
let mostrarPantallaFinal = false;

function dibujarInterfaz(ctx) {
    ctx.clearRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);

    if (bannerUI.complete) {
        ctx.drawImage(bannerUI, 0, 0, ANCHO_CANVAS, ALTO_CANVAS);
    }

    dibujarTextoSuperior(ctx);
    dibujarEstadisticas(ctx);
    dibujarHotel(ctx);
    dibujarMejorasClick(ctx);
    dibujarMejorasAuto(ctx);
    dibujarBotonPrestigio(ctx);
    dibujarTextosFlotantes(ctx);

    if (finalDesbloqueado || mostrarPantallaFinal) {
        dibujarPantallaFinal(ctx);
    }

    if (mostrarConfirmacionReinicio) {
        dibujarVentanaConfirmacion(ctx);
    }
}

function dibujarTextoSuperior(ctx) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = '18px "Nohemi", Arial';

    ctx.fillText(
        "Administra tu hotel y conviértelo en un resort de lujo",
        600,
        75
    );
}

/*  ESTADÍSTICAS */
function dibujarEstadisticas(ctx) {
    dibujarDato(ctx, "DINERO", `$${formatearNumero(dinero)}`, 105, 225);
    dibujarDato(ctx, "POR CLIC", `$${formatearNumero(dineroPorClick)}`, 105, 335);
    dibujarDato(ctx, "POR SEGUNDO", `$${formatearNumero(dineroPorSegundo)}`, 105, 445);
    dibujarDato(ctx, "MULTIPLICADOR", `x${multiplicador.toFixed(2)}`, 105, 555);
}

function dibujarDato(ctx, etiqueta, valor, x, y) {
    ctx.textAlign = "left";

    ctx.fillStyle = "#ffffff";
    ctx.font = '17px "Nohemi", Arial';
    ctx.fillText(etiqueta, x, y);

    ctx.fillStyle = "#e4002b";
    ctx.font = '44px "PPNeueBit-Bold", Arial';
    ctx.fillText(valor, x, y + 45);
}

/* HOTEL CENTRAL */
function dibujarHotel(ctx) {
    const centroX = areaHotel.x + areaHotel.ancho / 2;

    ctx.textAlign = "center";

    ctx.fillStyle = "#e4002b";
    ctx.font = '52px "PPNeueBit-Bold", Arial';
    ctx.fillText("¡HAZ CLIC!", centroX, 225);

    if (imagenHotel.complete) {
    ctx.drawImage(imagenHotel, centroX - 150, 250, 300, 220);
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = '52px "PPMondwest-Regular", Arial';
    ctx.fillText("GRAND HOTEL", centroX, 500);

    ctx.fillStyle = "#ffd400";
    ctx.font = "42px Arial";
    ctx.fillText("★★★★★", centroX, 545);
}

/* MEJORAS DE CLIC */
function dibujarMejorasClick(ctx) {
    areasMejorasClick.length = 0;

    const mejorasClick = mejoras
        .map((mejora, indice) => ({ ...mejora, indice }))
        .filter(mejora => mejora.tipo === "click");

    const posiciones = [
        { x: 55, y: 55 },
        { x: 920, y: 55 }
    ];

    mejorasClick.forEach((mejora, i) => {
        const pos = posiciones[i];
        if (!pos) return;

        const ancho = 225;
        const alto = 60;

        const boton = {
            x: pos.x,
            y: pos.y,
            ancho,
            alto,
            indice: mejora.indice
        };

        areasMejorasClick.push(boton);

        const disponible = dinero >= mejora.costo;

        ctx.fillStyle = disponible
            ? "rgba(228, 0, 43, 0.6)"
            : "rgba(0, 0, 0, 0.65)";
        ctx.fillRect(pos.x, pos.y, ancho, alto);

        ctx.strokeStyle = disponible ? "#ffd400" : "rgba(255,255,255,0.65)";
        ctx.lineWidth = disponible ? 3 : 2;
        ctx.strokeRect(pos.x, pos.y, ancho, alto);

        ctx.textAlign = "left";

        ctx.fillStyle = "#ffffff";
        ctx.font = '14px "Nohemi", Arial';
        ctx.fillText(mejora.nombre, pos.x + 12, pos.y + 19);

        ctx.fillStyle = "#e4002b";
        ctx.font = '13px "Nohemi", Arial';
        ctx.fillText(`+$${formatearNumero(mejora.click)} por clic`, pos.x + 12, pos.y + 37);

        ctx.fillStyle = "#ffd400";
        ctx.font = '20px "PPNeueBit-Bold", Arial';
        ctx.fillText(`$${formatearNumero(mejora.costo)}`, pos.x + 12, pos.y + 57);

        ctx.fillStyle = "#ffffff";
        ctx.font = '13px "Nohemi", Arial';
        ctx.textAlign = "right";
        ctx.fillText(`x${mejora.cantidad}`, pos.x + ancho - 12, pos.y + 54);
    });
}

/*  MEJORAS AUTOMÁTICAS */
function dibujarMejorasAuto(ctx) {
    areasMejoras.length = 0;

    const mejorasAuto = mejoras
        .map((mejora, indice) => ({ ...mejora, indice }))
        .filter(mejora => mejora.tipo !== "click");

    let x = 890;
    let y = 160;
    const ancho = 250;
    const alto = 52;
    const separacion = 58;

    mejorasAuto.forEach((mejora) => {
        const boton = {
            x,
            y,
            ancho,
            alto,
            indice: mejora.indice
        };

        areasMejoras.push(boton);

        const disponible = dinero >= mejora.costo;

        ctx.fillStyle = disponible
            ? "rgba(228, 0, 43, 0.45)"
            : "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(x, y, ancho, alto);

        ctx.strokeStyle = disponible ? "#ffd400" : "rgba(255,255,255,0.55)";
        ctx.lineWidth = disponible ? 3 : 2;
        ctx.strokeRect(x, y, ancho, alto);

        ctx.textAlign = "left";

        ctx.fillStyle = "#ffffff";
        ctx.font = '12px "Nohemi", Arial';
        ctx.fillText(mejora.nombre, x + 12, y + 15);

        if (mejora.tipo === "final") {
            ctx.fillStyle = "#e4002b";
            ctx.font = '11px "Nohemi", Arial';
            ctx.fillText("Final del juego", x + 12, y + 30);
        } else {
            ctx.fillStyle = "#ffffff";
            ctx.font = '11px "Nohemi", Arial';
            ctx.fillText(`+$${formatearNumero(mejora.produccion)} por seg`, x + 12, y + 30);
        }

        ctx.fillStyle = "#ffd400";
        ctx.font = '18px "PPNeueBit-Bold", Arial';
        ctx.fillText(`$${formatearNumero(mejora.costo)}`, x + 12, y + 48);

        ctx.fillStyle = "#ffffff";
        ctx.font = '12px "Nohemi", Arial';
        ctx.textAlign = "right";
        ctx.fillText(`x${mejora.cantidad}`, x + ancho - 12, y + 44);

        y += separacion;
    });
}

/* BOTÓN DE PRESTIGIO */
function dibujarBotonPrestigio(ctx) {
    const disponible = puedeReiniciarHotel();
    const siguienteMultiplicador = (multiplicador + 0.25).toFixed(2);

    ctx.fillStyle = disponible
        ? "rgba(228, 0, 43, 0.75)"
        : "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(botonReinicio.x, botonReinicio.y, botonReinicio.ancho, botonReinicio.alto);

    ctx.strokeStyle = disponible ? "#ffd400" : "rgba(255,255,255,0.45)";
    ctx.lineWidth = disponible ? 3 : 2;
    ctx.strokeRect(botonReinicio.x, botonReinicio.y, botonReinicio.ancho, botonReinicio.alto);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = '24px "PPNeueBit-Bold", Arial';
    ctx.fillText("PRESTIGIARSE", botonReinicio.x + botonReinicio.ancho / 2, botonReinicio.y + 26);

    ctx.font = '12px "Nohemi", Arial';
    ctx.fillStyle = disponible ? "#ffd400" : "rgba(255,255,255,0.7)";

    ctx.fillText(
        disponible
            ? `x${siguienteMultiplicador} ganancias permanentes`
            : "Requiere $250,000 para prestigiarse",
        botonReinicio.x + botonReinicio.ancho / 2,
        botonReinicio.y + 41
    );
}

function dibujarVentanaConfirmacion(ctx) {
    const siguienteMultiplicador = (multiplicador + 0.25).toFixed(2);

    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);

    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(350, 230, 500, 270);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(350, 230, 500, 270);

    ctx.strokeStyle = "#e4002b";
    ctx.lineWidth = 3;
    ctx.strokeRect(365, 245, 470, 240);

    ctx.textAlign = "center";

    ctx.fillStyle = "#e4002b";
    ctx.font = '42px "PPNeueBit-Bold", Arial';
    ctx.fillText("¿PRESTIGIARSE?", 600, 285);

    ctx.fillStyle = "#ffffff";
    ctx.font = '18px "Nohemi", Arial';
    ctx.fillText("Perderás tu dinero y mejoras actuales,", 600, 330);
    ctx.fillText("pero ganarás un multiplicador permanente.", 600, 355);

    ctx.fillStyle = "#ffd400";
    ctx.font = '24px "PPNeueBit-Bold", Arial';
    ctx.fillText(`Nuevo multiplicador: x${siguienteMultiplicador}`, 600, 395);

    dibujarBotonModal(ctx, botonConfirmar, "CONFIRMAR", "#e4002b");
    dibujarBotonModal(ctx, botonCancelar, "CANCELAR", "#111111");
}

/*  PANTALLA FINAL  */
function dibujarPantallaFinal(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
    ctx.fillRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(260, 160, 680, 380);

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 7;
    ctx.strokeRect(260, 160, 680, 380);

    ctx.strokeStyle = "#e4002b";
    ctx.lineWidth = 5;
    ctx.strokeRect(280, 180, 640, 340);

    ctx.textAlign = "center";

    ctx.fillStyle = "#e4002b";
    ctx.font = '68px "PPNeueBit-Bold", Arial';
    ctx.fillText("HOTEL DEFINITIVO", 600, 245);

    ctx.fillStyle = "#000000";
    ctx.font = '26px "Nohemi", Arial';
    ctx.fillText("Has convertido tu hotel en el resort más prestigioso del mundo.", 600, 305);
    ctx.fillText("Tus huéspedes viajan desde todos los rincones para visitarlo.", 600, 340);

    ctx.fillStyle = "#e4002b";
    ctx.font = '34px "PPNeueBit-Bold", Arial';
    ctx.fillText("¡FINAL DESBLOQUEADO!", 600, 395);

    dibujarBotonModal(ctx, botonContinuarFinal, "CONTINUAR", "#e4002b");
}

function dibujarBotonModal(ctx, boton, texto, color) {
    ctx.fillStyle = color;
    ctx.fillRect(boton.x, boton.y, boton.ancho, boton.alto);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(boton.x, boton.y, boton.ancho, boton.alto);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = '22px "PPNeueBit-Bold", Arial';
    ctx.fillText(texto, boton.x + boton.ancho / 2, boton.y + 30);
}

function dibujarTextosFlotantes(ctx) {
    for (let i = textosFlotantes.length - 1; i >= 0; i--) {
        const texto = textosFlotantes[i];

        ctx.save();
        ctx.globalAlpha = texto.opacidad;

        if (texto.automatico) {
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.font = '18px "Nohemi", Arial';
        } else {
            ctx.fillStyle = "#ffd400";
            ctx.font = '32px "PPNeueBit-Bold", Arial';
        }

        ctx.textAlign = "center";
        ctx.fillText(texto.texto, texto.x, texto.y);

        ctx.restore();

        texto.y -= 1.5;
        texto.opacidad -= 0.02;

        if (texto.opacidad <= 0) {
            textosFlotantes.splice(i, 1);
        }
    }
}

/* CLICS  */
function procesarClick(x, y) {
    if (finalDesbloqueado || mostrarPantallaFinal) {
        if (estaDentro(x, y, botonContinuarFinal)) {
            mostrarPantallaFinal = false;
            finalDesbloqueado = false;
            guardarJuego();
            return;
        }

        return;
    }

    if (mostrarConfirmacionReinicio) {
        if (estaDentro(x, y, botonConfirmar)) {
            reiniciarConPrestigio();
            mostrarConfirmacionReinicio = false;
            return;
        }

        if (estaDentro(x, y, botonCancelar)) {
            mostrarConfirmacionReinicio = false;
            return;
        }

        return;
    }

    if (estaDentro(x, y, botonReinicio) && puedeReiniciarHotel()) {
        mostrarConfirmacionReinicio = true;
        return;
    }

    if (
        x >= areaHotel.x &&
        x <= areaHotel.x + areaHotel.ancho &&
        y >= areaHotel.y &&
        y <= areaHotel.y + areaHotel.alto
    ) {
        agregarDinero(dineroPorClick);
        return;
    }

    for (let i = 0; i < areasMejorasClick.length; i++) {
        const area = areasMejorasClick[i];

        if (estaDentro(x, y, area)) {
            comprarMejora(area.indice);
            return;
        }
    }

    for (let i = 0; i < areasMejoras.length; i++) {
        const area = areasMejoras[i];

        if (estaDentro(x, y, area)) {
            comprarMejora(area.indice);
            return;
        }
    }
}

function estaDentro(x, y, area) {
    return (
        x >= area.x &&
        x <= area.x + area.ancho &&
        y >= area.y &&
        y <= area.y + area.alto
    );
}