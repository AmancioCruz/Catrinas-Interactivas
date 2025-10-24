import { readFile, writeFile } from "fs/promises";

export async function obtenerObjeto(ruta_archivo){
    return JSON.parse(await readFile(ruta_archivo, "utf-8"));
}

export async function actualizarObjeto(ruta_archivo, nuevoObjeto) {
  await writeFile(ruta_archivo, JSON.stringify(nuevoObjeto, null, 2));
  return nuevoObjeto;
}