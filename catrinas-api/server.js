import express from "express";
import cors from "cors";
import { readFile, writeFile } from "fs/promises";
import { GestorPerfiles } from "../js/gestores/gestor_perfiles.js";
import { GestorConversaciones } from "../js/gestores/gestor_conversaciones.js";
import { actualizarObjeto } from "../js/utilidades/archivos.js";
import { formatearPersonaje, Mensaje } from "../js/utilidades/ayudas.js";
import { peticion } from "../js/LMStudio/peticion.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


const RUTA_PERFILES = "../datos/perfiles.json";
const RUTA_CONVERSACIONES = "../datos/conversaciones.json";
const RUTA_SELECCIONADO = "../datos/seleccionado.json";

const animaciones_disponibles = [
  "sentarse",
  "saludar",
  "cambiar_vestido",
  "felicidad",
  "indignacion",
  "explicar",
  "alejarse"
];

const estados_animo_disponibles = [
  "alegre",
  "curiosa",
  "enojado",
  "indignacion",
  "explicar",
  "alejarse"
];


const perfiles = JSON.parse(await readFile(RUTA_PERFILES, "utf-8"));
const gestorPerfiles = new GestorPerfiles();
const gestorConversaciones = new GestorConversaciones();

gestorPerfiles.cargarPerfiles(perfiles);
gestorConversaciones.cargarConversaciones(JSON.parse(await readFile(RUTA_CONVERSACIONES, "utf-8")));



app.post("/mensaje", async (req, res) => {
  try {
    const { id_perfil, id_vestido, emocion_actual, mensaje_usuario } = req.body;

    //Validaciones básicas
    if (!id_perfil || isNaN(parseInt(id_perfil))) {
      return res.status(400).json({ error: "ID de perfil inválido o ausente." });
    }

    if (!id_vestido || isNaN(parseInt(id_vestido))) {
      return res.status(400).json({ error: "ID de vestido inválido o ausente." });
    }

    if (!mensaje_usuario || typeof mensaje_usuario !== "string" || mensaje_usuario.trim() === "") {
      return res.status(400).json({ error: "El mensaje del usuario no puede estar vacío." });
    }

    if (!emocion_actual || typeof emocion_actual !== "string") {
      return res.status(400).json({ error: "La emoción actual es inválida o ausente." });
    }

    console.clear();
    console.log("Petición recibida:");
    console.log("- ID perfil:", id_perfil);
    console.log("- ID vestido:", id_vestido);
    console.log("- Emoción actual:", emocion_actual);
    console.log("- Mensaje usuario:", mensaje_usuario);

    // Selecciona el perfil
    gestorPerfiles.seleccionarPerfil(parseInt(id_perfil));
    if (!gestorPerfiles.seleccionado) {
      return res.status(404).json({ error: "Perfil no encontrado." });
    }

    // Guarda mensaje del usuario
    gestorConversaciones.agregarNuevoMensajeAConversacion(
      parseInt(id_perfil),
      new Mensaje(mensaje_usuario)
    );

    // Actualiza archivo seleccionado
    await actualizarObjeto(RUTA_SELECCIONADO, {
      id_perfil: parseInt(id_perfil),
      id_vestido: parseInt(id_vestido),
      emocion_actual,
      animaciones_disponibles,
      estados_animo_disponibles
    });

    // Formatea perfil y genera prompt
    const perfilFormateado = formatearPersonaje(gestorPerfiles.seleccionado);

    const vestido = {
      "id": 1,
      "personalidad": "alegre y extrovertida",
      "colores": "rosa mexicano, amarillo pastel y blanco",
      "tipo_tela": "algodón ligero con bordados florales",
      "textura": "suave, con detalles bordados y relieve en las flores"
    };

    const formatoRespuesta = `
Eres una catrina con el siguiente perfil:
${perfilFormateado}
Tu emoción actual es ${emocion_actual}.
Que tu respuesta sea referente a el siguiente vestido: ${vestido},
Responde ÚNICAMENTE en el siguiente formato JSON válido:
{
  "respuesta": "tu respuesta al usuario",
  "gestos": "gestos que realizas al responder",
  "tono_voz": "tipo de voz o tono con el que respondes",
  "animacion_seleccionada": "elige UNA animación de: ${animaciones_disponibles}",
  "estado_de_animo_seleccionado": "elige UNO de: ${estados_animo_disponibles}",
  "emocion_actual": "emocion al responder"
}
No escribas nada fuera del JSON.
`;

    // Llamada a la IA
    const respuestaIA = JSON.parse(await peticion(formatoRespuesta, mensaje_usuario));

    // Crea mensaje del personaje
    const mensajePersonaje = new Mensaje(
      respuestaIA.respuesta,
      gestorPerfiles.seleccionado.nombre,
      respuestaIA.gestos,
      respuestaIA.tono_voz,
      respuestaIA.emocion_actual
    );

    // Guarda mensaje del personaje
    gestorConversaciones.agregarNuevoMensajeAConversacion(parseInt(id_perfil), mensajePersonaje);

    // Actualiza archivo de conversaciones
    await actualizarObjeto(RUTA_CONVERSACIONES, gestorConversaciones.listaConversaciones);

    res.json(respuestaIA);

  } catch (error) {
    console.error("Error en /mensaje:", error);
    res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
