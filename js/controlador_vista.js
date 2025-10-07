import { actualizarNombrePerfilSeleccionado, consultarTarjetaSeleccionada } from "./utilidades/ayudas.js";
import { GestorTarjetas } from "./vistas/gestor_de_tarjetas.js";

const contenido = document.querySelector('#contenido');

export function crearFuncionesBotones(gestor_perfiles, gestor_tarjetas) {
    return {
        mostrarPerfil: (id) => {
            gestor_perfiles.seleccionarPerfil(id);
            renderizarContenido(
                gestor_tarjetas.generarTarjetaPerfilConDatos(gestor_perfiles.seleccionado)
            );
            console.log('Mostrar perfil completo:', id);
        },
        seleccionarTarjeta: (id) => {
            // Quita la clase 'tarjeta-seleccionada' de todas las tarjetas
            document.querySelectorAll('.tarjeta').forEach(tarjeta => {
                tarjeta.classList.remove('tarjeta-seleccionada');
            });

            // Selecciona el perfil en el gestor
            gestor_perfiles.seleccionarPerfil(id);

            // Marca la tarjeta seleccionada
            const tarjetaSeleccionada = document.querySelector(`#tarjeta_${id}`);
            if (tarjetaSeleccionada) tarjetaSeleccionada.classList.add('tarjeta-seleccionada');

            // Guarda el perfil seleccionado en LocalStorage
            localStorage.setItem('perfil_seleccionado', JSON.stringify(gestor_perfiles.seleccionado));

            actualizarNombrePerfilSeleccionado(gestor_perfiles.seleccionado);
        }
    };
}

/**
 * Genera y renderiza todas las tarjetas en la vista
 */
export function crearTarjetasEnVista(gestor_perfiles) {
    const gestor_tarjetas = new GestorTarjetas(gestor_perfiles.obtenerPerfiles());
    const funciones_botones = crearFuncionesBotones(gestor_perfiles, gestor_tarjetas);

    const contenedor = gestor_tarjetas.generarTarjetas(funciones_botones);
    renderizarContenido(contenedor);

    return { gestor_tarjetas, funciones_botones };
}

/**
 * Renderiza un elemento en el contenedor principal
 */
export function renderizarContenido(elemento) {
    if (!elemento) throw new Error('Elemento vacío');
    contenido.innerHTML = '';
    contenido.appendChild(elemento);
}
