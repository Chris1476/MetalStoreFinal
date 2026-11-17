// Obtiene el listado de albumes desde el JSON local.
export async function fetchAlbums(basePath = "./") {
    const respuesta = await fetch(`${basePath}data/albums.json`);

    if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los discos");
    }

    return respuesta.json();
}


//Busca un album por id dentro del JSON local.
export async function fetchAlbumById(id, basePath = "./") {
    const discos = await fetchAlbums(basePath);
    const disco = discos.find(d => d.id === id);

    if (!disco) {
        throw new Error("No se encontró el álbum con id " + id);
    }

    return disco;
}
