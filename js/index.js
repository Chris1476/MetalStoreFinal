import { fetchAlbums } from "./albums.js";
import { renderNavCarrito } from "./nav.js";

renderNavCarrito("pages/carrito.html");


// Mezcla un array in-place usando Fisher-Yates y devuelve los primeros n elementos.
function randomSlice(arr, n) {
    const copia = [...arr];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia.slice(0, n);
}

async function cargarDiscos() {
    const contenedor = document.getElementById("lista-discos");
    // Ojo aca usar rutas relativas en img para que funcione en github pages
    try {
        const todosLosDiscos = await fetchAlbums("./");
        const discos = randomSlice(todosLosDiscos, 20);

        contenedor.innerHTML = "";

        discos.forEach(disco => {
            const enlace = document.createElement("a");
            enlace.className = "disco-link";
            enlace.href = `pages/album.html?id=${disco.id}`;

            const article = document.createElement("article");
            article.innerHTML = `
                <img src="img/${disco.imagen}" alt="${disco.artista}">
                <h3>${disco.artista}</h3>
                <p>${disco.album}</p>
                <p>$${disco.precio.toLocaleString("es-AR")}</p>
            `;

            enlace.appendChild(article);
            contenedor.appendChild(enlace);
        });

    } catch (error) {
        contenedor.textContent = "Error: " + error.message;
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarDiscos();
}); 

