const STORAGE_KEY = "metalstore_carrito";


// Devuelve el array del carrito desde localStorage.
export function obtenerCarrito() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}


// Guarda el carrito en localStorage.
function guardarCarrito(carrito) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}

// Agrega un disco al carrito. Si ya existe, incrementa la cantidad.
export function agregarAlCarrito(disco) {
    const carrito = obtenerCarrito();
    const existente = carrito.find(item => item.id === disco.id);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...disco, cantidad: 1 });
    }

    guardarCarrito(carrito);
}

// Elimina un disco del carrito por id.
export function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito().filter(item => item.id !== id);
    guardarCarrito(carrito);
}


// Vacia el carrito completamente.
export function vaciarCarrito() {
    localStorage.removeItem(STORAGE_KEY);
}


// Devuelve la cantidad total de ítems en el carrito.
export function contarItems() {
    return obtenerCarrito().reduce((acc, item) => acc + item.cantidad, 0);
}


// Devuelve el total a pagar.
export function calcularTotal() {
    return obtenerCarrito().reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}
