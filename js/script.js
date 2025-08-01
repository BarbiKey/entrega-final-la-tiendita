document.addEventListener("DOMContentLoaded", () => {
    const productosContainer = document.getElementById("productos-container");
    const contadorCarrito = document.getElementById("contador-carrito");
    

    let carrito = recuperarCarrito();
    actualizarContador();

    // Verificamos si estamos en la página del carrito
    if (document.getElementById("carrito-container")) {
        renderizarCarrito();
    }

    function actualizarContador() {
        if (contadorCarrito) {
            contadorCarrito.textContent = `🛒 Carrito: ${carrito.length}`;
        }
    }

    obtenerProductos();

    // 🔁 Función principal para obtener productos desde la API
    function obtenerProductos() {
        fetch("https://fakestoreapi.com/products")
            .then((res) => res.json())
            .then((productos) => {
                                if (productosContainer) {
                    productos.forEach(renderizarProducto);
                }
            })
            .catch((error) => {
                if (productosContainer) {
                    productosContainer.innerHTML = `<p style="color:red;">No se pudo cargar la API 😢</p>`;
                }
                console.error("Error al cargar productos:", error);
            });
    }

    // 🧩 Renderiza una tarjeta individual de producto
    function renderizarProducto(producto) {
        const card = document.createElement("div");
        card.className = "grid-item";
        card.innerHTML = `
            <h4 style="text-align:center;">${producto.title}</h4>
            <img src="${producto.image}" alt="${producto.title}" style="width:100px; height:auto; display:block; margin: 0 auto;" />
            <p style="text-align:center;">Precio: $${producto.price}</p>
            <div style="text-align:center;">
                <button class="btn-agregar">Agregar al carrito</button>
            </div>
        `;

        card.querySelector(".btn-agregar").addEventListener("click", () => {
            agregarAlCarrito(producto);
        });

        productosContainer.appendChild(card);
    }

    // 🛒 Agrega un producto al carrito y lo guarda en LocalStorage
    function agregarAlCarrito(producto) {
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();
        mostrarToast(`${producto.title} se agregó al carrito`);
        if (document.getElementById("carrito-container")) {
            renderizarCarrito();
        }
    }


    // 🔁 Recupera el carrito desde LocalStorage
    function recuperarCarrito() {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    }

    // 🔔 Muestra un mensaje tipo toast
    function mostrarToast(mensaje) {
        const toast = document.createElement("div");
        toast.textContent = mensaje;
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.right = "20px";
        toast.style.background = "#688AFF";
        toast.style.color = "#fff";
        toast.style.padding = "0.8rem 1rem";
        toast.style.borderRadius = "8px";
        toast.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
        toast.style.zIndex = "1000";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    function configurarBotonVaciar() {
        const botonVaciar = document.getElementById("vaciar-carrito");
            if (botonVaciar) {
                botonVaciar.addEventListener("click", () => {
                    localStorage.removeItem("carrito");
                    carrito = [];
                    actualizarContador();
                    renderizarCarrito();
                    mostrarToast("Carrito vaciado con éxito");
                });
            }
    }

    configurarBotonVaciar();
});


// 🔁 Función para renderizar el carrito 
function renderizarCarrito() {
    const carritoContainer = document.getElementById("carrito-container");
    carritoContainer.innerHTML = ""; // Limpia contenido previo

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.innerHTML = `
        <thead>
            <tr>
                <th style="border: 1px solid #ccc; padding: 8px;">Cant.</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Imagen</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Descripcion</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Precio <br> unitario</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Precio <br> Total</th>
            </tr>
        </thead>
        <tbody id="carrito-table-body"></tbody>
    `;
    carritoContainer.appendChild(table);
    const tbody = document.getElementById("carrito-table-body");

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        carritoContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
        return;
    }

    const productosAgrupados = {};

    carrito.forEach((producto) => {
        if (productosAgrupados[producto.id]) {
            productosAgrupados[producto.id].cantidad++;
        } else {
            productosAgrupados[producto.id] = { ...producto, cantidad: 1 };
        }
    });

    Object.values(productosAgrupados).forEach((producto) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="border: 1px solid #ccc; padding: 8px;">${producto.cantidad}</td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center;"><img src="${producto.image}" alt="${producto.title}" style="width:50px;"></td>
            <td style="border: 1px solid #ccc; padding: 8px; max-width: 200px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" title="${producto.title}">${producto.title}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">$${producto.price}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">$${(producto.price * producto.cantidad).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}