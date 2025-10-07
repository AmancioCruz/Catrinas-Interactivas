export function agregar_seccion(titulo_seccion, datos, contenedor, elemento, clase_contenedor) {
    contenedor.appendChild(
        crear_elemento('h1', {
            class: 'datos_titulo_seccion',
            textContent: formatear_texto(titulo_seccion)
        })
    );
    contenedor.appendChild(crear_elemento('hr'));

    Object.entries(datos).forEach(dato => {
        const contenedor_dato = crear_elemento('div', { class: clase_contenedor });
        contenedor_dato.appendChild(
            crear_elemento('label', {
                htmlFor: dato[0],
                textContent: formatear_texto(dato[0])
            }));
        contenedor_dato.appendChild(
            crear_elemento(elemento.tipo_elemento, {
                name: dato[0],
                [elemento.tipo_contenido]: dato[1],
                readonly: true
            })
        )
        contenedor.appendChild(contenedor_dato);
    });
}

export function crear_botones(botones, contenedor) {
    botones.forEach(({ clases, icono, texto, onClick }) => {
        const boton = crear_elemento('button', { class: clases });
        boton.appendChild(crear_elemento('i', { class: icono }));
        boton.appendChild(document.createTextNode(' ' + texto));

        if (typeof onClick === 'function') {
            boton.addEventListener('click', onClick);
        }

        contenedor.appendChild(boton);

    });
}

export function crear_elemento(tag, atributos = {}) {
    const elemento = document.createElement(tag);

    Object.entries(atributos).forEach(([key, value]) => {
        if (key === 'class') {
            value.split(' ').forEach(clase => elemento.classList.add(clase));;
        } else if (key === 'readonly' && value) {
            elemento.setAttribute(key, '');
        } else {
            elemento[key] = value;
        }
    });
    return elemento;
}

export function formatear_texto(clave) {
    return clave
        .replace(/([A-Z])/g, " $1") // inserta un espacio antes de cada mayúscula
        .replace(/^./, str => str.toUpperCase()); // pone la primera letra en mayúscula
}

export async function convertir_de_JSON_a_Objeto(url_perfiles) {
    try {
        const datos_perfiles = await fetch(url_perfiles);
        const perfiles = await datos_perfiles.json();
        return perfiles;
    } catch (error) {
        console.log(error);
    }
}

export function consultarTarjetaSeleccionada() {
    try {
        return JSON.parse(localStorage.getItem('perfil_seleccionado')) || null;
    } catch (error) {
        console.error('Error al leer el perfil seleccionado desde LocalStorage:', error);
        return null;
    }
}

export function actualizarNombrePerfilSeleccionado(perfil) {
    const elemento = document.querySelector('#perfil_seleccionado');
    if (!elemento) return; 

    elemento.textContent = perfil?.nombre || 'Sin perfil';
}

export function guardarCambioPagina(){
    
}