import { crearConversacionesEnVista, crearTarjetasEnVista } from "./controlador_vista.js";
import { GestorPerfiles } from "./gestores/gestor_perfiles.js";
import { actualizarNombrePerfilSeleccionado, actualizarPerfilSeleccionado, convertir_de_JSON_a_Objeto } from "./utilidades/ayudas.js";
import { GestorConversaciones } from "./gestores/gestor_conversaciones.js";

const gestor_perfiles = new GestorPerfiles();
const gestor_conversaciones = new GestorConversaciones();

async function IniciarApp() {
    const [perfiles, seleccionado, conversaciones] = await Promise.all([
        convertir_de_JSON_a_Objeto('datos/perfiles.json'),
        convertir_de_JSON_a_Objeto('datos/seleccionado.json'),
        convertir_de_JSON_a_Objeto('datos/conversaciones.json')]);

    gestor_perfiles.cargarPerfiles(perfiles);
    gestor_perfiles.seleccionarPerfil(seleccionado.id_perfil);
    gestor_conversaciones.cargarConversaciones(conversaciones);

    actualizarPerfilSeleccionado(gestor_perfiles.seleccionado);
    actualizarNombrePerfilSeleccionado(gestor_perfiles.seleccionado);

    cargarConversaciones();
}

function cargarConversaciones() {
    const conversacion = gestor_conversaciones.obtenerConversacionPorID(gestor_perfiles.seleccionado.id);

    if (conversacion) {
        crearConversacionesEnVista(conversacion, gestor_perfiles);
    }
    else {
        console.error("No se cargo la conversacion de forma correcta");
    }

    const contenedor_mensajes = document.querySelector('#contenedor-mensajes');
    contenedor_mensajes.scrollTop = contenedor_mensajes.scrollHeight;
}

document.querySelector('#boton_ver').addEventListener('click', () => {
    crearTarjetasEnVista(gestor_perfiles);
});

document.querySelector('#boton-conversar').addEventListener('click', ()=>{
    cargarConversaciones();
})

IniciarApp();