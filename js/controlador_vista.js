import { peticion } from "./LMStudio/peticion.js";
import { peticionOllama } from "./ollama/peticion_ollama.js";
import { actualizarNombrePerfilSeleccionado, consultarTarjetaSeleccionada, exportar, formatear_texto, formatearPersonaje, Mensaje } from "./utilidades/ayudas.js";
import { GestorVista } from "./vistas/gestor_de_vista.js";

const contenido = document.querySelector('#contenido');

export function crearFuncionesBotones(gestor_perfiles, gestor_tarjetas) {
    return {
        mostrarPerfil: (id) => {
            renderizarContenido(
                gestor_tarjetas.generarTarjetaPerfilConDatos(gestor_perfiles.obtenerPerfilPorId(id), crearFuncionesBotones(gestor_perfiles, gestor_tarjetas))
            );
            console.log('Mostrar perfil completo:', id);
        },
        seleccionarTarjeta: (id) => {
            /* Quita la clase 'tarjeta-seleccionada' de todas las tarjetas
            document.querySelectorAll('.tarjeta').forEach(tarjeta => {
                tarjeta.classList.remove('tarjeta-seleccionada');
            });

            // Selecciona el perfil en el gestor
            gestor_perfiles.seleccionarPerfil(id);

            // Marca la tarjeta seleccionada
            const tarjetaSeleccionada = document.querySelector(`#tarjeta_${id}`);
            if (tarjetaSeleccionada) tarjetaSeleccionada.classList.add('tarjeta-seleccionada');

            actualizarNombrePerfilSeleccionado(consultarTarjetaSeleccionada());*/
        },
        exportar(datos, nombreArchivo) {
            exportar(datos, nombreArchivo);
        },
        /*async enviarMensaje() {
            const prompt = document.querySelector('#texto_prompt');
            const mensaje = new Mensaje(prompt.value);

            const gestor_vista = new GestorVista(gestor_perfiles.obtenerPerfiles);

            const contenedor_mensajes = document.querySelector('#contenedor-mensajes');
            contenedor_mensajes.appendChild(gestor_vista.agregarMensajeNuevo(mensaje));
            contenedor_mensajes.scrollTop = contenedor_mensajes.scrollHeight;

            const perfil = formatearPersonaje(gestor_perfiles.seleccionado);

            const animaciones = gestor_perfiles.seleccionado.animaciones_disponibles;
            const estados_de_animo = gestor_perfiles.seleccionado.estados_animo_disponibles;

            const formatoRespuesta = `Eres un personaje con el siguiente perfil: ${perfil}.
Responde ÚNICAMENTE en el siguiente formato JSON válido:

{
  "respuesta": "tu respuesta al usuario",
  "gestos": "gestos que realizas al responder",
  "voz": "tipo de voz o tono con el que respondes",
  "animacion_seleccionada": "elige UNA animación de la siguiente lista: ${animaciones}",
  "estado_de_animo_seleccionado": "elige UNO de los siguientes estados de ánimo: ${estados_de_animo}"
}

No escribas nada fuera del JSON. No expliques, solo responde con el objeto JSON.`;

            console.log(estados_de_animo)

            const respuesta = await peticion(formatoRespuesta, mensaje.mensaje);

            console.log(respuesta);
        }*/
    };
}

/**
 * Genera y renderiza todas las tarjetas en la vista
 */
export function crearTarjetasEnVista(gestor_perfiles) {
    const gestor_tarjetas = new GestorVista(gestor_perfiles.obtenerPerfiles());
    const funciones_botones = crearFuncionesBotones(gestor_perfiles, gestor_tarjetas);

    const contenedor = gestor_tarjetas.generarTarjetas(funciones_botones);
    renderizarContenido(contenedor);

    return { gestor_tarjetas, funciones_botones };
}

/*genera y renderiza toda la conversacion de un perfil */
export function crearConversacionesEnVista(conversacio, gestor_perfiles) {
    const gestor_vista = new GestorVista();
    const gestor_tarjetas = new GestorVista(gestor_perfiles.obtenerPerfiles());
    renderizarContenido(gestor_vista.generarConversaciones(conversacio, crearFuncionesBotones(gestor_perfiles, gestor_tarjetas)));
}

/**
 * Renderiza un elemento en el contenedor principal
 */
export function renderizarContenido(elemento) {
    if (!elemento) throw new Error('Elemento vacío');
    contenido.innerHTML = '';
    contenido.appendChild(elemento);
}
