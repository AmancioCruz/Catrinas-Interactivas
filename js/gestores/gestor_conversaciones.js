//crear gestor de conversaciones 

export class GestorConversaciones {
    constructor() {
        this.listaConversaciones = null;
    }

    cargarConversaciones(arreglo_conversaciones) {
        //falta verificar si el arreglo no es vacio
        this.listaConversaciones = arreglo_conversaciones;
        console.log(this.listaConversaciones);
    }

    obtenerListaConversaciones() {
        try {
            if (this.#verificarCargaDeLista) {
                return this.listaConversaciones();
            }
        } catch (error) {
            return error;
        }
    }

    obtenerConversacionPorID(id) {
        try {
            if (this.#verificarCargaDeLista) {

                const conversacion_retornar = this.listaConversaciones.find(conversacion => conversacion.perfilId === id);
                if (!conversacion_retornar)
                    throw new Error('no existe una conversacion para ese ID');
                return conversacion_retornar;
            }
        } catch (error) {
            console.log(error)
            return error;
        }
    }


    agregarNuevaConversacion(conversacio) {

    }

    agregarNuevoMensajeAConversacion(id, mensaje) {
        try {
            if (this.#verificarCargaDeLista()) {
                const indice_conversacion = this.listaConversaciones.findIndex(conversacion => conversacion.perfilId === id);
                console.log(indice_conversacion);
                if (indice_conversacion === -1)
                    throw new Error('No se encontro la ocnversacion, verifique el id');
                this.listaConversaciones[indice_conversacion].mensajes.push(mensaje);
                
                this.#exportar(this.listaConversaciones, 'conversaciones')
            }
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }

    #exportar(datos, nombreArchivo) {
        const datosJSON = JSON.stringify(datos, null, 2);
        const blob = new Blob([datosJSON], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = `${nombreArchivo}.json`;
        enlace.click();

        URL.revokeObjectURL(url);
    }

    #verificarCargaDeLista() {
        try {
            if (!this.listaConversaciones)
                throw new Error('No se ha inicializado el gestor');
            return true;
        }
        catch (error) {
            throw error;
        }
    }
}