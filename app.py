from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from models import init_db

app = Flask(__name__)
CORS(app)

# Inicializar la base de datos
init_db()

def get_db_connection():
    connection = mysql.connector.connect(
        host='localhost', #poner la del pc donde se va correr.
        user='root',
        password='Jesu1701', #contraseña de la base de datos en el pc que se ponga.
        database='order_management'
    )
    return connection

@app.route('/api/orders', methods=['GET'])
def get_orders():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM orders')
    orders = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(orders)

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM orders WHERE id = %s', (order_id,))
    order = cursor.fetchone()
    cursor.close()
    connection.close()
    if order:
        return jsonify(order)
    return jsonify({"error": "Pedido no encontrado"}), 404

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    if not data or 'customer' not in data or 'product' not in data or 'status' not in data:
        return jsonify({"error": "Datos incompletos"}), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        'INSERT INTO orders (customer, product, status) VALUES (%s, %s, %s)',
        (data['customer'], data['product'], data['status'])
    )
    connection.commit()
    order_id = cursor.lastrowid
    cursor.execute('SELECT * FROM orders WHERE id = %s', (order_id,))
    new_order = cursor.fetchone()
    cursor.close()
    connection.close()
    return jsonify(new_order), 201

@app.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.get_json()
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        'UPDATE orders SET customer = %s, product = %s, status = %s WHERE id = %s',
        (data['customer'], data['product'], data['status'], order_id)
    )
    connection.commit()
    cursor.execute('SELECT * FROM orders WHERE id = %s', (order_id,))
    updated_order = cursor.fetchone()
    cursor.close()
    connection.close()
    if updated_order:
        return jsonify(updated_order)
    return jsonify({"error": "Pedido no encontrado"}), 404

@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('DELETE FROM orders WHERE id = %s', (order_id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Pedido eliminado"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)