import { crearConversacionesEnVista, crearTarjetasEnVista } from "./controlador_vista.js";
import { GestorPerfiles } from "./gestores/gestor_perfiles.js";
import { actualizarNombrePerfilSeleccionado, actualizarPerfilSeleccionado, consultarTarjetaSeleccionada, convertir_de_JSON_a_Objeto } from "./utilidades/ayudas.js";
import { renderizarContenido } from "./controlador_vista.js";
import { GestorConversaciones } from "./gestores/gestor_conversaciones.js";

const gestor_perfiles = new GestorPerfiles();

const perfiles = await convertir_de_JSON_a_Objeto('datos/perfiles.json');

const seleccionado = await convertir_de_JSON_a_Objeto('datos/seleccionado.json');

const conversaciones = await convertir_de_JSON_a_Objeto('datos/conversaciones.json');

//localStorage.setItem('perfiles', JSON.stringify(perfiles));

const perfil_vacio = {
    id: '',
    nombre: '',
    datosBasicos: {
        edad: '',
        genero: '',
        nacionalidad: '',
        ciudad: '',
        ocupacion: '',
        claseSocial: ''
    },
    personalidad: {
        rasgos: '',
        estadoAnimo: '',
        miedos: '',
        metas: ''
    },
    formaHablar: {
        modismos: '',
        tonoVoz: '',
        velocidad: '',
        frases: ''
    },
    intereses: {
        hobbies: '',
        gustos: '',
        temasApasionan: '',
        temasEvita: ''
    },
    lenguajeCorporal: {
        gestos: '',
        postura: '',
        expresiones: '',
        movimientos: ''
    },
    contexto: {
        situacion: '',
        estadoAnimo: '',
        relacion: ''
    },
    extras: {
        backstory: '',
        objetos: '',
        secretos: ''
    }
};



async function IniciarApp() {
    /**
     */

    gestor_perfiles.cargarPerfiles(perfiles);
    gestor_perfiles.seleccionarPerfil(seleccionado.id_perfil);
    actualizarPerfilSeleccionado(gestor_perfiles.seleccionado);
    //console.log(gestor_perfiles);
    actualizarNombrePerfilSeleccionado(gestor_perfiles.seleccionado);
}



document.querySelector('#boton_ver').addEventListener('click', () => {
    crearTarjetasEnVista(gestor_perfiles);
})

document.querySelector('#boton-conversar').addEventListener('click', () => {
    const gestor_conversaciones = new GestorConversaciones();

    gestor_conversaciones.cargarConversaciones(conversaciones);


    crearConversacionesEnVista(gestor_conversaciones.obtenerConversacionPorID(gestor_perfiles.seleccionado.id), gestor_perfiles);

    const contenedor_mensajes = document.querySelector('#contenedor-mensajes');
    contenedor_mensajes.scrollTop = contenedor_mensajes.scrollHeight;

    //gestor_conversaciones.agregarNuevoMensajeAConversacion(1);
})



IniciarApp();