import { fetchAlbumById } from "./albums.js";
import { getAlbumInfo } from "./api.js";
import { agregarAlCarrito } from "./carrito.js";
import { renderNavCarrito, actualizarBadge } from "./nav.js";

renderNavCarrito("carrito.html");

// Modal
const modal    = document.getElementById("modal-portada");
const modalImg = document.getElementById("modal-img");

function abrirModal(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add("modal-visible");
    document.body.style.overflow = "hidden";
}

function cerrarModal() {
    modal.classList.remove("modal-visible");
    document.body.style.overflow = "";
}

document.getElementById("modal-cerrar").addEventListener("click", cerrarModal);

// Click en el fondo oscuro cierra el modal
modal.addEventListener("click", e => {
    if (e.target === modal) cerrarModal();
});

// ESC cierra el modal
document.addEventListener("keydown", e => {
    if (e.key === "Escape") cerrarModal();
});

// Helpers para hacer la imagen clickeable
function hacerImagenClickeable(img, srcGrande) {
    img.classList.add("portada-clickeable");
    img.title = "Ver imagen ampliada";
    img.addEventListener("click", () => abrirModal(srcGrande || img.src, img.alt));
}

async function cargarAlbum() {
    const parametros = new URLSearchParams(window.location.search);
    const id = Number(parametros.get("id"));

    const contenedor = document.getElementById("detalle-album");
    const listaTemas = document.getElementById("lista-temas");
    const titulo = document.getElementById("titulo-album");

    // Paso 1: buscar el disco en el JSON local
    let disco;
    try {
        disco = await fetchAlbumById(id, "../");
    } catch (error) {
        contenedor.innerHTML = `<p>Error: ${error.message}</p>`;
        listaTemas.innerHTML = "";
        console.error(error);
        return;
    }

    titulo.textContent = disco.artista;
    contenedor.innerHTML = `<p>Consultando Last.fm...</p>`;
    listaTemas.innerHTML = `<h2>Lista de canciones</h2><p>Buscando canciones...</p>`;

    // Paso 2: consultar Last.fm
    try {
        const info = await getAlbumInfo(disco.artista, disco.album);

        // Portada "large" para el card, "mega" para el modal
        const portada = info.image?.find(img => img.size === "large")?.["#text"]
            || `../img/${disco.imagen}`;
        const portadaGrande = info.image?.find(img => img.size === "mega")?.["#text"]
            || info.image?.find(img => img.size === "extralarge")?.["#text"]
            || `../img/${disco.imagen}`;

        renderDetalleAlbum(contenedor, disco, info, portada, portadaGrande);
        renderCanciones(listaTemas, info);

    } catch (error) {
        // mostrar datos del JSON local si Last.fm falla
        renderDetalleAlbumLocal(contenedor, disco);
        listaTemas.innerHTML = `<h2>Lista de canciones</h2><p>No se pudo obtener la lista: ${error.message}</p>`;
        console.error(error);
    }
}

function renderDetalleAlbum(contenedor, disco, info, portada, portadaGrande) {
    contenedor.innerHTML = `
        <article>
            <img src="${portada}" alt="Portada de ${info.name}">
            <div>
                <h3>${info.artist}</h3>
                <p>${info.name}</p>
                <p>$${disco.precio.toLocaleString("es-AR")}</p>
                <p>Reproducciones: ${Number(info.playcount).toLocaleString("es-AR")}</p>
                <button class="btn-comprar" id="btn-comprar">
                    <i class="fa-solid fa-cart-plus"></i> Agregar al carrito
                </button>
            </div>
        </article>
    `;

    document.getElementById("btn-comprar").addEventListener("click", () => {
        agregarAlCarrito({
            id: disco.id,
            artista: disco.artista,
            album: disco.album,
            imagen: disco.imagen,
            precio: disco.precio
        });
        actualizarBadge();
        mostrarConfirmacion();
    });

    hacerImagenClickeable(contenedor.querySelector("img"), portadaGrande);
}

function renderDetalleAlbumLocal(contenedor, disco) {
    contenedor.innerHTML = `
        <article>
            <img src="../img/${disco.imagen}" alt="${disco.artista}">
            <div>
                <h3>${disco.artista}</h3>
                <p>${disco.album}</p>
                <p>$${disco.precio.toLocaleString("es-AR")}</p>
                <button class="btn-comprar" id="btn-comprar">
                    <i class="fa-solid fa-cart-plus"></i> Agregar al carrito
                </button>
            </div>
        </article>
    `;

    document.getElementById("btn-comprar").addEventListener("click", () => {
        agregarAlCarrito({
            id: disco.id,
            artista: disco.artista,
            album: disco.album,
            imagen: disco.imagen,
            precio: disco.precio
        });
        actualizarBadge();
        mostrarConfirmacion();
    });

    hacerImagenClickeable(contenedor.querySelector("img"));
}

function renderCanciones(listaTemas, info) {
    const temas = info.tracks?.track || [];
    const lista = Array.isArray(temas) ? temas : [temas];

    if (lista.length === 0) {
        listaTemas.innerHTML = `<h2>Lista de canciones</h2><p>Last.fm no encontró canciones para este álbum.</p>`;
        return;
    }

    let html = `<h2>Lista de canciones (${lista.length})</h2><ol>`;

    lista.forEach(tema => {
        const duracion = Number(tema.duration || 0);
        const min = Math.floor(duracion / 60);
        const seg = String(duracion % 60).padStart(2, "0");
        html += `<li>${tema.name} <span>(${min}:${seg})</span></li>`;
    });

    html += `</ol>`;
    listaTemas.innerHTML = html;
}

function mostrarConfirmacion() {
    // Evitar duplicados
    if (document.getElementById("toast-confirmacion")) return;

    const toast = document.createElement("div");
    toast.id = "toast-confirmacion";
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ¡Agregado al carrito!`;
    document.body.appendChild(toast);

    // Forzar para que la animacion funcione
    toast.getBoundingClientRect();
    toast.classList.add("toast-visible");

    setTimeout(() => {
        toast.classList.remove("toast-visible");
        toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    }, 2000);
}

cargarAlbum();
