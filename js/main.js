import { crearTarjetasEnVista } from "./controlador_vista.js";
import { GestorPerfiles } from "./gestores/gestor_perfiles.js";
import { actualizarNombrePerfilSeleccionado, consultarTarjetaSeleccionada, convertir_de_JSON_a_Objeto } from "./utilidades/ayudas.js";
import { renderizarContenido } from "./controlador_vista.js";

const gestor_perfiles = new GestorPerfiles();

const perfiles = await convertir_de_JSON_a_Objeto('datos/perfiles.json');

const conversaciones = await convertir_de_JSON_a_Objeto('datos/conversaciones.json');

localStorage.setItem('perfiles', JSON.stringify(perfiles));

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
     * Agregar la obtenecion de los perfiles de firestore y si nos e obtienen usar los que estan de forma local
     */
    
    gestor_perfiles.cargarPerfiles(JSON.parse(localStorage.getItem('perfiles')), consultarTarjetaSeleccionada());
    console.log(gestor_perfiles);
    actualizarNombrePerfilSeleccionado(gestor_perfiles.seleccionado);
}



document.querySelector('#boton_ver').addEventListener('click', () => {
    crearTarjetasEnVista(gestor_perfiles);
})

/*document.querySelector('#boton-conversar').addEventListener('click', ()=>{
    console.log(gestor_perfiles.seleccionado);
   renderizarContenido(crearConversacion(conversaciones[gestor_perfiles.seleccionado.id]));
})*/



IniciarApp();