const API_BASE_URL = "http://localhost:5000/api/orders";
// Función genérica para manejar respuestas y errores
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en la solicitud");
    }
    return await response.json();
}

// Obtener todos los pedidos
async function fetchOrders() {
    try {
        const response = await fetch(API_BASE_URL);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        Swal.fire("Error", error.message, "error");
        return [];
    }
}

// Obtener un pedido específico
async function fetchOrder(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error al obtener el pedido:", error);
        Swal.fire("Error", error.message, "error");
        return null;
    }
}

// Crear un nuevo pedido
async function createOrder(order) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error al crear pedido:", error);
        Swal.fire("Error", error.message, "error");
        return null;
    }
}

// Actualizar un pedido
async function updateOrder(id, order) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error al actualizar pedido:", error);
        Swal.fire("Error", error.message, "error");
        return null;
    }
}

// Eliminar un pedido
async function deleteOrder(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
        });
        await handleResponse(response);
        return true;
    } catch (error) {
        console.error("Error al eliminar pedido:", error);
        Swal.fire("Error", error.message, "error");
        return false;
    }
}