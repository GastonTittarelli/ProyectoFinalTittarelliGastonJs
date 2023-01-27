document.addEventListener("DOMContentLoaded", mostrarProductos);

const totalCompra = document.getElementById('totalCompra');
const comprarCarrito = document.querySelector(".comprarCarrito")
const conteinerProductos = document.querySelector(".contenedorProductos");

//productos a insertar
let storageData = []

//mostrar los productos de forma dinamica - consumo de API local
async function mostrarProductos() {
    const url = "../data.json"
    try {
        const resultado = await fetch(url);
        const data = await resultado.json();
        storageData = data

        data.forEach(producto => {
            const cardProducto = document.createElement("article");
            cardProducto.setAttribute("id", "tarjetaProducto");
            cardProducto.innerHTML = `
                                    <img class="prodImg" src="${producto.img}">
                                    <p class="nombreProd">${producto.nombre}</p>
                                    <p class="precio">${producto.precio}</p>
                                    <button id="${producto.id}" class="btnCompra">Agregar</button>
            `;
            conteinerProductos.appendChild(cardProducto);
        })
        const btnComprar = document.querySelectorAll(".btnCompra");
        btnComprar.forEach(elem => {
            elem.addEventListener("click", (e) => {
                agregarAlCarrito(e.target.id);

                //Funcionalidad de libreria toastify en botones de productos
                Toastify({
                            text: "Se agregó correctamente el producto al carrito ✔️",
                            className: "info",
                            style: {
                                background: "linear-gradient(to right, #00b09b, #96c93d)",
                            }
                        }).showToast();
                    });
            });
    //capturo el error (para que funcione correctamente el fetch)
    } catch (error) {
        console.log(error);
    }
}

//Recupero los datos que se guardaron y los retorno. O bien, toma el array vacío
const articulosCarrito = JSON.parse(localStorage.getItem("storageData")) || [];

//agrego los productos al carrito
function agregarAlCarrito(id) {
    let prodEncontrado = storageData.find(el => el.id === parseInt(id));
    articulosCarrito.push(prodEncontrado);

    //LLamo a la funcion para mostrar los productos en el carrito
    carritoHTML();
    guardarEnStorage();
}

//Mostrar los productos en el carrito
const carrito = document.querySelector("#carrito");

//Calcula el total de la compra
const calcularTotalCompra = () => {
    let total = 0;
    articulosCarrito.forEach((producto) => {
        total += producto.precio * producto.cantidad;
    });
    totalCompra.innerHTML = total;
};

//carrito
function carritoHTML() {
    let aux = '';
    articulosCarrito.forEach((producto) => {
        aux += `
        <div class="container">
        <h5>${producto.nombre}</h5>
        <p>$${producto.precio}</p>
        <p>Cantidad: <span id= "cantidad">${producto.cantidad}</span></p>
        <button class="btn-eliminar btn btn-danger"  onClick = "eliminarProducto(${producto.id})" ">Eliminar</button>
        </div>
        `;
    });
    carrito.innerHTML = aux;
    calcularTotalCompra();
}

//eliminar productos del carrito
function eliminarProducto(id) {
    const producto = articulosCarrito.find((producto) => producto.id === id);
    const indice = articulosCarrito.indexOf(producto);
    articulosCarrito.splice(indice, 1)
    carritoHTML();
    guardarEnStorage();
}

//limpia el carrito
function limpiarHTML() {
    carrito.innerHTML = "";
}

//guardar productos del carrito en el storage
const guardarEnStorage = () => {
    localStorage.setItem("storageData", JSON.stringify(articulosCarrito));
}

//Funcionalidad de libreria sweetalert 2 en boton de comprar carrito
comprarCarrito.addEventListener("click", () => {
    if (articulosCarrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Tu carrito esta vacio',
        })
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Tu pedido ha sido realizado ¡Muchas gracias!',
            timer: 2500
        })
        setTimeout(() => {
            localStorage.clear();
            window.location.reload();
        }, 2500)
    }
})

//Evita que los articulos del carrito desaparezcan cuando actualizas la pagina
if (articulosCarrito.length) {
    carritoHTML()
}


