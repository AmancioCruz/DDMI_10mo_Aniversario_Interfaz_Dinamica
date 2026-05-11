const opcionesMenu = document.querySelectorAll('.menu li');
const botonMenu = document.querySelector('.boton-menu');
const navegacion = document.querySelector('.navegacion');
const iconoMenu = botonMenu?.querySelector('i');

opcionesMenu.forEach((opcion) => {
    opcion.addEventListener('click', () => {
        opcionesMenu.forEach((elemento) => {
            elemento.classList.remove('activo');
        });

        opcion.classList.add('activo');

        navegacion?.classList.remove('abierto');
        botonMenu?.setAttribute('aria-expanded', 'false');
        iconoMenu?.classList.add('fa-bars');
        iconoMenu?.classList.remove('fa-xmark');
    });
});

botonMenu?.addEventListener('click', () => {
    const menuAbierto = navegacion?.classList.toggle('abierto');

    botonMenu.setAttribute('aria-expanded', menuAbierto);
    iconoMenu?.classList.toggle('fa-bars', !menuAbierto);
    iconoMenu?.classList.toggle('fa-xmark', menuAbierto);
});
