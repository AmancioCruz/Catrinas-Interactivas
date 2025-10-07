import { crear_botones, crear_elemento, agregar_seccion } from "../utilidades/ayudas.js";


export function crear_tarjeta(perfil){
    //<div id="contenedor_perfil" class="contenedor-perfil"> </div>
    const contenedor_perfil = crear_elemento('div', {class: 'contenedor-perfil'});
    contenedor_perfil.innerHTML = ' ';

    let contenedores = {
        principales: crear_elemento('div', { class: 'datos-principales' }),
        basicos: crear_elemento('div', { class: 'datos-basicos' }),
        generales: crear_elemento('div', { class: 'contenedor-datos' }),
        acciones: crear_elemento('div', { class: 'acciones-perfil' })
    };

    const botones = [
        {
            clases: 'boton-perfil boton-seleccionar',
            icono: 'fas fa-user-check',
            texto: 'Seleccionar Perfil'
        },
        {
            clases: 'boton-perfil boton-editar',
            icono: 'fas fa-edit',
            texto: 'Editar Perfil'
        },
        {
            clases: 'boton-perfil boton-eliminar',
            icono: 'fas fa-trash-alt',
            texto: 'Eliminar Perfil'
        },
        {
            clases: 'boton-perfil boton-exportar',
            icono: 'fas fa-file-export',
            texto: 'Exportar Perfil'
        }
    ];


    Object.entries(perfil).forEach(([clave, valor]) => {
        switch (clave) {
            case 'id':
                contenedores.principales.appendChild(
                    crear_elemento('label', {
                        id: `dato_${clave}_${valor}`,
                        textContent: `${valor}-`
                    }));
                break;
            case 'nombre':
                contenedores.principales.appendChild(
                    crear_elemento('h1', {
                        id: `dato_${clave}_${perfil.id}`,
                        textContent: valor
                    }));
                break;
            case 'datosBasicos':
                agregar_seccion(clave, valor, contenedores.basicos, { tipo_elemento: 'input', tipo_contenido: 'value' }, 'dato-basico');
                break;
            default:
                let contenedor = crear_elemento('div', { class: 'datos-generales' });
                agregar_seccion(clave, valor, contenedor, { tipo_elemento: 'textarea', tipo_contenido: 'textContent' }, 'dato-general')
                contenedores.generales.appendChild(contenedor);
                break;
        }

    });

    crear_botones(botones, contenedores.acciones);

    Object.values(contenedores).forEach(contenedor => {
        contenedor_perfil.appendChild(contenedor);
    })

    return contenedor_perfil;
}

