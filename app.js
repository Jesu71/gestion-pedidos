document.addEventListener("DOMContentLoaded", () => {
    const btnNewOrder = document.getElementById("btn-new-order");
    const btnListOrders = document.getElementById("btn-list-orders");
    const orderFormSection = document.getElementById("order-form");
    const orderListSection = document.getElementById("order-list");
    const formOrder = document.getElementById("form-order");
    const ordersBody = document.getElementById("orders-body");
    const spinner = document.getElementById("spinner");

    // Mostrar formulario de nuevo pedido
    btnNewOrder.addEventListener("click", () => {
        orderFormSection.classList.remove("hidden");
        orderListSection.classList.add("hidden");
    });

    // Mostrar lista de pedidos
    btnListOrders.addEventListener("click", async () => {
        orderFormSection.classList.add("hidden");
        orderListSection.classList.remove("hidden");
        await loadOrders();
    });

    // Crear nuevo pedido
    formOrder.addEventListener("submit", async (e) => {
        e.preventDefault();
        const customer = document.getElementById("customer").value;
        const product = document.getElementById("product").value;
        const status = document.getElementById("status").value;

        const newOrder = { customer, product, status };
        spinner.classList.remove("hidden");
        const createdOrder = await createOrder(newOrder);
        spinner.classList.add("hidden");
        if (createdOrder) {
            Swal.fire("Éxito", "Pedido creado con éxito", "success");
            formOrder.reset();
        }
    });

    // Cargar pedidos
    async function loadOrders() {
        spinner.classList.remove("hidden");
        const orders = await fetchOrders();
        spinner.classList.add("hidden");
        ordersBody.innerHTML = "";
        orders.forEach(order => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.product}</td>
                <td>${order.status}</td>
                <td>
                    <button onclick="editOrder(${order.id})">Editar</button>
                    <button onclick="confirmDeleteOrder(${order.id})">Eliminar</button>
                </td>
            `;
            ordersBody.appendChild(row);
        });
    }

    // Función para abrir el modal de edición
    window.editOrder = async (id) => {
        try {
            const orders = await fetchOrders();
            const orderToEdit = orders.find(order => order.id == id);
            if (orderToEdit) {
                document.getElementById("edit-id").value = orderToEdit.id;
                document.getElementById("edit-customer").value = orderToEdit.customer;
                document.getElementById("edit-product").value = orderToEdit.product;
                document.getElementById("edit-status").value = orderToEdit.status;

                const modal = document.getElementById("edit-modal");
                modal.classList.remove("hidden");
                modal.style.display = "block"; // Forzar visualización correcta
            } else {
                Swal.fire("Error", "Pedido no encontrado", "error");
            }
        } catch (error) {
            console.error("Error al cargar el pedido para editar:", error);
            Swal.fire("Error", "No se pudo cargar el pedido para editar", "error");
        }
    };

    // Confirmar eliminación con SweetAlert2
    window.confirmDeleteOrder = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });
        if (result.isConfirmed) {
            spinner.classList.remove("hidden");
            const success = await deleteOrder(id);
            spinner.classList.add("hidden");
            if (success) {
                Swal.fire("Eliminado", "El pedido ha sido eliminado", "success");
                await loadOrders();
            }
        }
    };

    // Manejar envío del formulario de edición
    document.getElementById("form-edit-order").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit-id").value;
        const customer = document.getElementById("edit-customer").value;
        const product = document.getElementById("edit-product").value;
        const status = document.getElementById("edit-status").value;

        const updatedOrder = { customer, product, status };
        spinner.classList.remove("hidden");
        const success = await updateOrder(id, updatedOrder);
        spinner.classList.add("hidden");
        if (success) {
            Swal.fire("Éxito", "Pedido actualizado correctamente", "success");
            closeEditModal();
            await loadOrders();
        }
    });

    // Cerrar modal
    function closeEditModal() {
        const modal = document.getElementById("edit-modal");
        modal.classList.add("hidden");
        modal.style.display = "none"; // Ocultarlo correctamente
    }

    // Cerrar modal al hacer clic en la X
    document.querySelector(".close").addEventListener("click", closeEditModal);
});