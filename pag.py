from flask import Flask, render_template, request, redirect, make_response, session, flash
import sqlite3
import hashlib
import uuid

app = Flask(__name__, static_folder='Static', template_folder='Templates')
app.secret_key = "clave-super-secreta"

# ------------------------------
# FUNCIÓN PARA CONECTAR A LA BASE
# ------------------------------
def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def query_db(query, args=(), one=False):
    conn = get_db_connection()
    cur = conn.execute(query, args)
    rv = cur.fetchall()
    conn.commit()
    conn.close()
    return (rv[0] if rv else None) if one else rv

# ------------------------------
# RUTA LOGIN (usa formulario.html)
# ------------------------------
@app.route('/', methods=['GET', 'POST'])
def login():

    # Si existe cookie remember_token, entrar directo
    token = request.cookies.get("remember_token")
    if token:
        user = query_db("SELECT * FROM users WHERE remember_token = ?", (token,), one=True)
        if user:
            session["usuario_id"] = user["id"]
            return redirect('/inicio')

    if request.method == 'POST':
        email = request.form['email']
        password = hashlib.sha256(request.form['password'].encode()).hexdigest()
        remember = request.form.get('remember')

        user = query_db("SELECT * FROM users WHERE email=? AND password=?", 
                        (email, password), 
                        one=True)

        if user:
            session["usuario_id"] = user["id"]

            response = make_response(redirect('/inicio'))

            # Guardar cookie si el usuario marcó "mantener guardado"
            if remember:
                new_token = str(uuid.uuid4())
                query_db("UPDATE users SET remember_token=? WHERE id=?", 
                         (new_token, user['id']))
                response.set_cookie("remember_token", new_token, max_age=60*60*24*30)

            return response
        
        else:
            flash("❌ Correo o contraseña incorrectos")
            return redirect('/')

    return render_template('formulario.html')

# ------------------------------
# RUTA DE INICIO DESPUÉS DEL LOGIN
# ------------------------------
@app.route('/inicio')
def inicio():
    if "usuario_id" not in session:
        return redirect("/")
    return render_template('inicio.html')

# ------------------------------
# PÁGINAS DEL MENÚ
# ------------------------------
@app.route('/index')
def index():
    return render_template('index.html')

@app.route("/importancia")
def importancia():
    return render_template("importancia.html")

@app.route("/maneras")
def maneras():
    return render_template("maneras.html")

@app.route("/beneficios")
def beneficios():
    return render_template("beneficios.html")

@app.route("/centros")
def centros():
    return render_template("centros.html")

@app.route("/educacion")
def educacion():
    return render_template("educacion.html")

@app.route("/tecnologia")
def tecnologia():
    return render_template("tecnologia.html")

@app.route("/impacto")
def impacto():
    return render_template("impacto.html")

@app.route("/proyectos")
def proyectos():
    return render_template("proyectos.html")

@app.route("/extra")
def extra():
    return render_template("extra.html")

@app.route("/catalogo")
def catalogo():
    return render_template("catalogo.html")

# ------------------------------
# EJECUCIÓN
# ------------------------------
if __name__ == '__main__':
    app.run(debug=True)