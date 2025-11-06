import mysql.connector
from mysql.connector import Error

def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost', #poner la del pc donde se va correr.
            user='root',
            password='Jesu1701',#contraseña de la base de datos en el pc que se ponga.
            database='order_management'
        )
        return connection
    except Error as e:
        print(f"Error al conectar a MySQL: {e}")
    return None

def create_table(connection):
    try:
        cursor = connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer VARCHAR(100) NOT NULL,
                product VARCHAR(100) NOT NULL,
                status VARCHAR(50) NOT NULL
            )
        ''')
        connection.commit()
    except Error as e:
        print(f"Error al crear la tabla: {e}")

def insert_initial_data(connection):
    try:
        cursor = connection.cursor()
        cursor.execute('SELECT COUNT(*) FROM orders')
        count = cursor.fetchone()[0]
        if count == 0:
            initial_orders = [
                ("Jesús Rendón", "Laptop", "pendiente"),
                ("Ana Gómez", "Teléfono", "enviado")
            ]
            cursor.executemany(
                'INSERT INTO orders (customer, product, status) VALUES (%s, %s, %s)',
                initial_orders
            )
            connection.commit()
    except Error as e:
        print(f"Error al insertar datos iniciales: {e}")

def init_db():
    connection = create_connection()
    if connection is not None:
        create_table(connection)
        insert_initial_data(connection)
        connection.close()