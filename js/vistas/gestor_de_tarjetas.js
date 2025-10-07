import { crear_botones, crear_elemento, agregar_seccion, formatear_texto, consultarTarjetaSeleccionada } from "../utilidades/ayudas.js";

export class GestorTarjetas {
    constructor(perfiles = []) {
        this.perfiles = perfiles;
        this.contenedor = crear_elemento('div', { class: 'contenedor-tarjetas' });

    }

    generarTarjetas(funciones_botones) {
        this.contenedor.innerHTML = '';
        const perfil_seleccionado = consultarTarjetaSeleccionada();

        this.perfiles.forEach(perfil => {
            const tarjeta = this.#crearTarjetaLista(perfil, funciones_botones);

            if (perfil_seleccionado && perfil_seleccionado.id === perfil.id) {
                tarjeta.classList.add('tarjeta-seleccionada');
            }

            this.contenedor.appendChild(tarjeta);
        });

        return this.contenedor;
    }

    #crearTarjetaLista(perfil, funciones_botones) {
        const tarjeta = crear_elemento('div', { class: 'tarjeta', id: `tarjeta_${perfil.id}` });

        const identificador = crear_elemento('div', { class: 'identificador-tarjeta' });
        identificador.appendChild(
            crear_elemento('span', { class: 'id-perfil', textContent: `ID: ${perfil.id}` })
        );

        const nombre = crear_elemento('h2', { class: 'nombre-perfil', textContent: perfil.nombre });

        const contenidoBasico = crear_elemento('div', { class: 'datos-basicos' });
        Object.entries(perfil.datosBasicos).forEach(([clave, valor]) => {
            const dato = crear_elemento('div', { class: 'dato-basico' });
            dato.appendChild(crear_elemento('label', {
                class: 'color-rosa',
                textContent: `${formatear_texto(clave)}: `
            }));
            dato.appendChild(crear_elemento('span', { class: 'valor-dato', textContent: valor }));
            contenidoBasico.appendChild(dato);
        });

        const acciones = crear_elemento('div', { class: 'acciones-tarjeta' });
        const botones = [
            {
                clases: 'boton-ver',
                icono: 'fas fa-eye',
                texto: 'Ver Perfil',
                onClick: () => funciones_botones.mostrarPerfil(perfil.id)
            },
            {
                clases: 'boton-seleccionar',
                icono: 'fas fa-check',
                texto: 'Seleccionar',
                onClick: () => funciones_botones.seleccionarTarjeta(perfil.id)
            }
        ];
        crear_botones(botones, acciones);

        [identificador, nombre, contenidoBasico, acciones].forEach(elemento => tarjeta.appendChild(elemento));

        return tarjeta;
    }

    generarTarjetaPerfilConDatos(perfil) {
        const contenedores = {
            principales: crear_elemento('div', { class: 'datos-principales' }),
            basicos: crear_elemento('div', { class: 'datos-basicos' }),
            generales: crear_elemento('div', { class: 'contenedor-datos' }),
            acciones: crear_elemento('div', { class: 'acciones-perfil' })
        };

        const botones = [
            { clases: 'boton-perfil boton-seleccionar', icono: 'fas fa-user-check', texto: 'Seleccionar Perfil' },
            { clases: 'boton-perfil boton-editar', icono: 'fas fa-edit', texto: 'Editar Perfil' },
            { clases: 'boton-perfil boton-eliminar', icono: 'fas fa-trash-alt', texto: 'Eliminar Perfil' },
            { clases: 'boton-perfil boton-exportar', icono: 'fas fa-file-export', texto: 'Exportar Perfil' }
        ];

        return this.#generarTarjetaDetallada(perfil, botones, contenedores);
    }


    #generarTarjetaDetallada(perfil, botones, contenedores) {
        const contenedorPerfil = crear_elemento('div', { class: 'contenedor-perfil' });

        Object.entries(perfil).forEach(([clave, valor]) => {
            switch (clave) {
                case 'id':
                    contenedores.principales.appendChild(
                        crear_elemento('label', { id: `dato_${clave}_${valor}`, textContent: `ID: ${valor}` })
                    );
                    break;
                case 'nombre':
                    contenedores.principales.appendChild(
                        crear_elemento('h1', { id: `dato_${clave}_${perfil.id}`, textContent: valor })
                    );
                    break;
                case 'datosBasicos':
                    agregar_seccion(clave, valor, contenedores.basicos,
                        { tipo_elemento: 'input', tipo_contenido: 'value' },
                        'dato-basico'
                    );
                    break;
                default:
                    const contenedorGeneral = crear_elemento('div', { class: 'datos-generales' });
                    agregar_seccion(clave, valor, contenedorGeneral,
                        { tipo_elemento: 'textarea', tipo_contenido: 'textContent' },
                        'dato-general'
                    );
                    contenedores.generales.appendChild(contenedorGeneral);
                    break;
            }
        });

        crear_botones(botones, contenedores.acciones);
        Object.values(contenedores).forEach(contenedor_actual => contenedorPerfil.appendChild(contenedor_actual));

        return contenedorPerfil;
    }

}
