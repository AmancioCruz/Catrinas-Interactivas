export async function peticion(formatoRespuesta ,mensaje) {
    const mensajes = [
        { "role": "system", "content": formatoRespuesta },
        { "role": "user", "content": mensaje }
    ]

    try {
        const respuesta = await fetch("http://localhost:1234/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-20b',
                messages: mensajes,
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
            })
        });

        const datos = await respuesta.json();
        return datos.choices[0].message.content;
    }
    catch (error) {
        throw error;
    }
}


