import sqlite3
import hashlib

conn = sqlite3.connect("database.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    remember_token TEXT
)
""")

# Usuario de prueba
email = "test@example.com"
password = hashlib.sha256("1234".encode()).hexdigest()

try:
    cur.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
except:
    pass

conn.commit()
conn.close()

print("Base de datos creada ✔")