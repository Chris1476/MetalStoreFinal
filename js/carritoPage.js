import { obtenerCarrito, eliminarDelCarrito, vaciarCarrito, calcularTotal } from "./carrito.js";
import { renderNavCarrito } from "./nav.js";

renderNavCarrito("carrito.html");

function renderCarrito() {
    const contenido = document.getElementById("carrito-contenido");
    const resumen = document.getElementById("carrito-resumen");
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenido.innerHTML = `
            <div class="carrito-vacio">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Tu carrito está vacío.</p>
                <a href="../index.html" class="btn-volver">Ver discos</a>
            </div>
        `;
        resumen.innerHTML = "";
        return;
    }

    // Tabla de items
    let html = `<table class="carrito-tabla">
        <thead>
            <tr>
                <th></th>
                <th>Artista / Álbum</th>
                <th>Precio unit.</th>
                <th>Cant.</th>
                <th>Subtotal</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
    `;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        html += `
            <tr>
                <td><img src="../img/${item.imagen}" alt="${item.artista}" class="carrito-img"></td>
                <td>
                    <strong>${item.artista}</strong><br>
                    <span>${item.album}</span>
                </td>
                <td>$${item.precio.toLocaleString("es-AR")}</td>
                <td>${item.cantidad}</td>
                <td>$${subtotal.toLocaleString("es-AR")}</td>
                <td>
                    <button class="btn-eliminar" data-id="${item.id}" title="Quitar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    contenido.innerHTML = html;

    // Eventos de eliminacion
    contenido.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
            eliminarDelCarrito(Number(btn.dataset.id));
            renderCarrito();
        });
    });

    // Resumen y botones
    const total = calcularTotal();
    resumen.innerHTML = `
        <div class="carrito-resumen-box">
            <p class="carrito-total">Total: <strong>$${total.toLocaleString("es-AR")}</strong></p>
            <div class="carrito-acciones">
                <button id="btn-vaciar" class="btn-vaciar">
                    <i class="fa-solid fa-trash-can"></i> Vaciar carrito
                </button>
                <button id="btn-pagar" class="btn-pagar">
                    <i class="fa-solid fa-credit-card"></i> Pagar
                </button>
            </div>
        </div>
    `;

    document.getElementById("btn-vaciar").addEventListener("click", () => {
        if (confirm("¿Vaciar el carrito?")) {
            vaciarCarrito();
            renderCarrito();
        }
    });

    document.getElementById("btn-pagar").addEventListener("click", () => {
        vaciarCarrito();
        contenido.innerHTML = `
            <div class="carrito-vacio pago-confirmado">
                <i class="fa-solid fa-circle-check"></i>
                <p>¡Gracias por tu compra!</p>
                <p>Tu pedido fue procesado correctamente.</p>
                <a href="../index.html" class="btn-volver">Seguir comprando</a>
            </div>
        `;
        resumen.innerHTML = "";
    });
}

renderCarrito();
