//crear gestor de conversaciones 

export class GestorConversaciones{
    constructor(){
        this.listaConversaciones = null;
        this.conversacionSeleccionada = null;
    }

    cargarConversaciones(){

    }

    obtenerListaConversaciones(){

    }

    obtenerConversacionPorID(){

    }

    obtenerConversacionSeleccionada(){

    }

    agregarNuevaConversacion(){

    }

    agregarNuevoMensajeAConversacionSeleccionada(){

    }

    #verificarCargaDeLista(){
        try{
            if(!this.listaConversaciones)
                throw new Error('No se ha inicializado el gestor');
            return true;
        }
        catch(error){
            throw error;
        }
    }
}