import { API_KEY } from "./config.js";


// Consulta la API de Last.fm para obtener info de un álbum.
export async function getAlbumInfo(artista, album) {
    const url = new URL("https://ws.audioscrobbler.com/2.0/");

    url.search = new URLSearchParams({
        method: "album.getInfo",
        artist: artista,
        album: album,
        api_key: API_KEY,
        format: "json",
        autocorrect: "1"
    });

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    if (!respuesta.ok || datos.error) {
        throw new Error(datos.message || "Error HTTP " + respuesta.status);
    }

    return datos.album;
}
