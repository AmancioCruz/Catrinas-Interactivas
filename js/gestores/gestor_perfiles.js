export class GestorPerfiles {
    constructor() {
        this.perfiles = [];
        this.seleccionado = null;
    }

     /* -------------------------------------------------------------------------- */
    /*                                 PÚBLICOS                                  */
    /* -------------------------------------------------------------------------- */
    

    cargarPerfiles(arregloPerfiles, perfilSeleccionado) {
        this.perfiles = Array.isArray(arregloPerfiles) ? arregloPerfiles : [];
        
        if (perfilSeleccionado && this.perfiles.some(p => p.id === perfilSeleccionado.id)) {
            this.seleccionado = perfilSeleccionado;
        } else {
            this.seleccionado = null; // Si no se manda perfil o no existe, es null
        }
    }

    obtenerPerfiles() {  
        return this.perfiles;
    }

    obtenerPerfilPorId(id) {
        return this.perfiles.find(perfil => perfil.id === id) || null;
    }

    agregarPerfil(perfil) {
        if (!perfil || !perfil.id) {
            console.warn("Intento de agregar un perfil inválido:", perfil);
            return;
        }

        const existe = this.perfiles.some(p => p.id === perfil.id);
        if (existe) {
            console.warn(`Ya existe un perfil con ID ${perfil.id}. No se agregará.`);
            return;
        }

        this.perfiles.push(perfil);
    }

    eliminarPerfilPorId(id) {
        this.perfiles = this.perfiles.filter(perfil => perfil.id !== id);
        if (this.seleccionado?.id === id) {
            this.seleccionado = null;
        }
    }

    actualizarPorId(id, datosActualizados) {
        const indice = this.perfiles.findIndex(perfil => perfil.id === id);
        if (indice !== -1) {
            this.perfiles[indice] = {
                ...this.perfiles[indice],
                ...datosActualizados
            };
            if (this.seleccionado?.id === id) {
                this.seleccionado = this.perfiles[indice];
            }
        } else {
            console.warn(`No se encontró un perfil con ID: ${id}`);
        }
    }

    seleccionarPerfil(id) {
        this.seleccionado = this.obtenerPerfilPorId(id);
    }

    obtenerJSONPerfilSeleccionado() {
        return this.seleccionado ? JSON.stringify(this.seleccionado, null, 2) : null;
    }

    obtenerJSONPerfiles() {
        return JSON.stringify(this.perfiles, null, 2);
    }

    obtenerJSONPerfilPorId(id) {
        const perfil = this.obtenerPerfilPorId(id);
        return perfil ? JSON.stringify(perfil, null, 2) : null;
    }

    exportarPerfiles() {
        this.#exportar(this.perfiles, "perfiles");
    }

    exportarPerfilPorId(id) {
        const perfil = this.obtenerPerfilPorId(id);
        if (!perfil) {
            console.warn(`No se pudo exportar. No existe perfil con ID ${id}.`);
            return;
        }

        const nombreArchivo = `perfil_${perfil.id}_${this.#sanearNombre(perfil.nombre)}`;
        this.#exportar(perfil, nombreArchivo);
    }

    exportarPerfilSeleccionado() {
        if (!this.seleccionado) {
            console.warn("No hay perfil seleccionado para exportar.");
            return;
        }
        const nombreArchivo = `perfil_${this.seleccionado.id}_${this.#sanearNombre(this.seleccionado.nombre)}`;
        this.#exportar(this.seleccionado, nombreArchivo);
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

    #sanearNombre(nombre = "") {
        return nombre
            .trim()
            .replace(/\s+/g, "_")
            .replace(/[^\w\-]/g, "");
    }
}