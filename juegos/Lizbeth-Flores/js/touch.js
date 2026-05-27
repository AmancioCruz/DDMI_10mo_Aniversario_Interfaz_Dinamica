import { estados } from "./juego.js";

const canvas = document.querySelector("#canvas");

function obtenerDireccionTouch(x) {
    const rect = canvas.getBoundingClientRect();
    const touchX = x - rect.left;
    const tercio = rect.width / 3;
    if (touchX < tercio) {
        return "izquierda";
    }

    if (touchX > tercio * 2) {
        return "derecha";
    }

    return "salto";
}

canvas.addEventListener(
    "touchstart",
    (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const accion = obtenerDireccionTouch(touch.clientX);
        if (accion === "izquierda") {
            estados.izquierda = true;
        }
        if (accion === "derecha") {
            estados.derecha = true;
        }
        if (accion === "salto") {
            estados.arriba = true;
            window.dispatchEvent(
                new KeyboardEvent("keydown", {
                    code: "Space",
                })
            );
        }
    },
    { passive: false }
);

canvas.addEventListener(
    "touchend",
    (e) => {
        e.preventDefault();
        estados.arriba = false;
        estados.abajo = false;
        estados.izquierda = false;
        estados.derecha = false;
    },
    { passive: false }
);