export async function peticionOllama(texto) {
    try {
        const respuesta = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama2',
                prompt: texto,
                language: 'es',
                stream: false
            })
        });

        if (!respuesta.ok) {
            throw new Error(`Error: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        return datos.response;
    } catch (error) {
        console.log("Error: ", error.message);
        return null;
    }
}