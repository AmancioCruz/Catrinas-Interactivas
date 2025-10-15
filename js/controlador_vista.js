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
            // Quita la clase 'tarjeta-seleccionada' de todas las tarjetas
            document.querySelectorAll('.tarjeta').forEach(tarjeta => {
                tarjeta.classList.remove('tarjeta-seleccionada');
            });

            // Selecciona el perfil en el gestor
            gestor_perfiles.seleccionarPerfil(id);

            // Marca la tarjeta seleccionada
            const tarjetaSeleccionada = document.querySelector(`#tarjeta_${id}`);
            if (tarjetaSeleccionada) tarjetaSeleccionada.classList.add('tarjeta-seleccionada');

            actualizarNombrePerfilSeleccionado(consultarTarjetaSeleccionada());
        },
        exportar(datos, nombreArchivo) {
            exportar(datos, nombreArchivo);
        },
        async enviarMensajeOllama() {
            const prompt = document.querySelector('#texto_prompt');
            const mensaje = new Mensaje(prompt.value);
            prompt.value = ' ';

            const perfil = formatearPersonaje(gestor_perfiles.seleccionado);

            const formatoRespuesta = `
Respond STRICTLY in Spanish, using ONLY the following JSON structure with three main levels:

{
  "respuesta": "What the character says, written in natural Spanish dialogue.",
  "gestos": "Describe the character's body movement, posture, and facial expressions.",
  "voz": "Describe the tone, speed, intensity, and emotional state of the voice."
}

Example of response format (keep it in JSON):
{
  "respuesta": "¡Saludos, noble viajero! Hoy el honor guía nuestros pasos.",
  "gestos": "Golpea el puño sobre el pecho y levanta la mirada con orgullo.",
  "voz": "Tono grave y solemne, habla despacio con pausas marcadas, emoción entusiasta."
}
`;

            const prompt_enviar = `
1. You are a character with the following profile:
${perfil}

2. Follow these response instructions exactly:
${formatoRespuesta}

3. User's question or message:
"${mensaje.mensaje}"

Remember:
- Answer completely in Spanish.
- Keep the response strictly in JSON format as shown above.
- Do not add explanations or text outside the JSON structure.
`;
            const gestor_vista = new GestorVista(gestor_perfiles.obtenerPerfiles);

            const contenedor_mensajes = document.querySelector('#contenedor-mensajes');
            contenedor_mensajes.appendChild(gestor_vista.agregarMensajeNuevo(mensaje));
            contenedor_mensajes.scrollTop = contenedor_mensajes.scrollHeight;

            let respuesta = await peticionOllama(prompt_enviar);

            


            respuesta = respuesta.match(/{.*}/s);
            respuesta = JSON.parse(respuesta[0]);

            const respuesta_nueva = new Mensaje(
                respuesta.respuesta,
                gestor_perfiles.seleccionado.nombre,
                respuesta.gestos,
                respuesta.voz
            )

            console.log(respuesta_nueva);


            contenedor_mensajes.appendChild(gestor_vista.agregarMensajeNuevo(respuesta_nueva));
            contenedor_mensajes.scrollTop = contenedor_mensajes.scrollHeight;
        }
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
