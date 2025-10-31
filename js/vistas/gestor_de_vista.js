import { crear_botones, crear_boton, crear_elemento, agregar_seccion, formatear_texto, consultarTarjetaSeleccionada } from "../utilidades/ayudas.js";

export class GestorVista {
    constructor(perfiles = []) {
        this.perfiles = perfiles;
        this.conversacion = null;
        this.contenedor = crear_elemento('div', { class: 'contenedor-tarjetas' });
    }

    generarConversaciones(conversacion, funciones_botones) {
        this.contenedor.className = 'contenedor-conversaciones';

        const { perfilId, mensajes } = conversacion;

        const botones = [
            {
                clases: 'boton-acciones boton-ver',
                icono: 'fas fa-eye',
                texto: 'Ver perfil',
                onClick: () => funciones_botones.mostrarPerfil(perfilId)
            },
            {
                clases: 'boton-acciones boton-eliminar',
                icono: 'fas fa-file-export',
                texto: 'Exportar',
                onClick: () => funciones_botones.exportar(conversacion, `conversacion_de_${conversacion.mensajes[1].de}_${conversacion.perfilId}`)
            }
        ];

        const contenedores = {
            cabecera: crear_elemento('div', { class: 'cabecera-conversacion' }),
            mensajes: crear_elemento('div', { class: 'contenedor-mensajes', id: 'contenedor-mensajes' }),
            entrada: crear_elemento('div', { class: 'contenedor-mensaje-nuevo' })
        };

        const nombre = mensajes?.[1]?.de || 'Sin remitente';
        contenedores.cabecera.appendChild(
            crear_elemento('h2', { class: 'nombre', textContent: `${perfilId} ${nombre}` })
        );

        const acciones = crear_elemento('div', { class: 'acciones' });
        crear_botones(botones, acciones);
        contenedores.cabecera.appendChild(acciones);

        mensajes.forEach(mensaje => {
            contenedores.mensajes.appendChild(this.agregarMensajeNuevo(mensaje));
        });

        /*contenedores.entrada.append(
            crear_elemento('input', {
                id: 'texto_prompt',
                class: 'input-entrada-texto',
                placeholder: 'Escribe un mensaje...'
            }),
            crear_boton({
                clases: 'boton-enviar',
                icono: 'fa-solid fa-arrow-right',
                texto: 'Enviar',
                onClick: () => funciones_botones.enviarMensaje()
            })
        );*/

        Object.values(contenedores).forEach(contenedor_actual => this.contenedor.appendChild(contenedor_actual));
        return this.contenedor;
    }

    agregarMensajeNuevo(mensaje) {
        const esUsuario = mensaje.de === 'usuario';
        const contenedor_Mensaje = crear_elemento('div', {
            class: `contenedor-mensaje ${esUsuario ? 'mensaje-usuario' : 'respuesta'}`
        });

        contenedor_Mensaje.append(
            crear_elemento('h3', { textContent: mensaje.de }),
            crear_elemento('hr'),
            crear_elemento('p', { textContent: mensaje.mensaje })
        );

        if (!esUsuario) {
            const respuesta = crear_elemento('div', { class: 'caracteristicas-respuesta' });
            respuesta.append(
                crear_elemento('p', { textContent: mensaje.gesto }),
                crear_elemento('p', { textContent: mensaje.voz }),
                crear_elemento('p', { textContent: mensaje.emocion_actual })
            );
            contenedor_Mensaje.appendChild(respuesta);
        }
        contenedor_Mensaje.appendChild(crear_elemento('span', { textContent: mensaje.fecha }));
        return contenedor_Mensaje;
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

        const acciones = crear_elemento('div', { class: 'acciones' });
        const botones = [
            {
                clases: 'boton-acciones boton-ver',
                icono: 'fas fa-eye',
                texto: 'Ver Perfil',
                onClick: () => funciones_botones.mostrarPerfil(perfil.id)
            }/*,
            {
                clases: 'boton-acciones boton-seleccionar',
                icono: 'fas fa-check',
                texto: 'Seleccionar',
                onClick: () => funciones_botones.seleccionarTarjeta(perfil.id)
            }*/
        ];
        crear_botones(botones, acciones);

        [identificador, nombre, contenidoBasico, acciones].forEach(elemento => tarjeta.appendChild(elemento));

        return tarjeta;
    }

    generarTarjetaPerfilConDatos(perfil, funciones_botones) {
        const contenedores = {
            principales: crear_elemento('div', { class: 'datos-principales' }),
            basicos: crear_elemento('div', { class: 'datos-basicos' }),
            generales: crear_elemento('div', { class: 'contenedor-datos' }),
            acciones: crear_elemento('div', { class: 'acciones' })
        };

        const botones = [
            {
                clases: 'boton-acciones boton-seleccionar',
                icono: 'fas fa-user-check',
                texto: 'Seleccionar Perfil',
                onClick: () => funciones_botones.seleccionarTarjeta(perfil.id)
            },
            {
                clases: 'boton-acciones boton-editar',
                icono: 'fas fa-edit',
                texto: 'Editar Perfil'
            },
            {
                clases: 'boton-acciones boton-eliminar',
                icono: 'fas fa-trash-alt',
                texto: 'Eliminar Perfil',
            },
            {
                clases: 'boton-acciones boton-exportar',
                icono: 'fas fa-file-export',
                texto: 'Exportar Perfil',
                onClick: () => funciones_botones.exportar(conversacion, `conversacion_de_${conversacion.mensajes[1].de}_${conversacion.perfilId}`)
            }
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

        //crear_botones(botones, contenedores.acciones);
        Object.values(contenedores).forEach(contenedor_actual => contenedorPerfil.appendChild(contenedor_actual));

        return contenedorPerfil;
    }

}
