import { contarItems } from "./carrito.js";


// Inserta el indicador del carrito en el nav. 
// Se llama en cada pagina que tenga nav.
export function renderNavCarrito(carritoHref) {
    const nav = document.querySelector("nav ul");
    if (!nav) return;

    const li = document.createElement("li");
    li.innerHTML = `
        <a href="${carritoHref}" id="nav-carrito">
            <i class="fa-solid fa-cart-shopping"></i>
            Carrito
            <span id="carrito-badge" class="carrito-badge"></span>
        </a>
    `;
    nav.appendChild(li);

    actualizarBadge();
}


// Actualiza el número del badge leyendo localStorage.
 export function actualizarBadge() {
    const badge = document.getElementById("carrito-badge");
    if (!badge) return;

    const cantidad = contarItems();
    badge.textContent = cantidad > 0 ? cantidad : "";
    badge.style.display = cantidad > 0 ? "inline-flex" : "none";
}
