// Abrir modal y cargar datos del pedido
function openEditModal(order) {
    document.getElementById("edit-id").value = order.id;
    document.getElementById("edit-customer").value = order.customer;
    document.getElementById("edit-product").value = order.product;
    document.getElementById("edit-status").value = order.status;
    document.getElementById("edit-modal").classList.remove("hidden");
}

// Cerrar modal
function closeEditModal() {
    document.getElementById("edit-modal").classList.add("hidden");
}

// Manejar envío del formulario de edición
document.getElementById("form-edit-order").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-id").value;
    const customer = document.getElementById("edit-customer").value;
    const product = document.getElementById("edit-product").value;
    const status = document.getElementById("edit-status").value;

    const updatedOrder = { customer, product, status };
    const success = await updateOrder(id, updatedOrder);
    if (success) {
        Swal.fire("Éxito", "Pedido actualizado correctamente", "success");
        closeEditModal();
        // Recargar la lista de pedidos después de editar
        await loadOrders();
    }
});

// Cerrar modal al hacer clic en la X
document.querySelector(".close").addEventListener("click", closeEditModal);