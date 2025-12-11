const menu = document.getElementById("menu");
const openBtn = document.getElementById("open-menu");
const closeBtn = document.getElementById("close-menu");

openBtn.addEventListener("click", () => {
  menu.classList.add("abierto");
});

closeBtn.addEventListener("click", () => {
  menu.classList.remove("abierto");
});


const bloques = document.querySelectorAll('.bloque');

function revelar() {
  bloques.forEach(e => {
    const top = e.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      e.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revelar);
revelar();


// -------------------- COMENTARIOS --------------------

let publicaciones = JSON.parse(localStorage.getItem("posts")) || [];

function publicar() {
    let texto = document.getElementById("comentarioTexto").value;
    let archivo = document.getElementById("imagenArchivo").files[0];

    if (!texto && !archivo) {
        alert("Escribe un comentario o agrega una imagen");
        return;
    }

    let reader = new FileReader();

    reader.onload = function () {
        let nuevaPublicacion = {
            id: Date.now(),
            texto: texto,
            imagen: archivo ? reader.result : null,
            likes: 0,
            propietario: true
        };

        publicaciones.unshift(nuevaPublicacion);
        localStorage.setItem("posts", JSON.stringify(publicaciones));
        mostrarPublicaciones();
    };

    if (archivo) reader.readAsDataURL(archivo);
    else {
        reader.onload();
    }
}

function mostrarPublicaciones() {
    let mis = document.getElementById("misPublicaciones");
    let otros = document.getElementById("otrasPublicaciones");

    mis.innerHTML = "";
    otros.innerHTML = "";

    publicaciones.forEach(pub => {
        let div = document.createElement("div");
        div.className = "publicacion";

        div.innerHTML = `
            <p>${pub.texto}</p>
            ${pub.imagen ? `<img src="${pub.imagen}">` : ""}
            <br/>
            <span class="like-btn" onclick="darLike(${pub.id})">👍 ${pub.likes}</span>
            ${pub.propietario ? `<button class="delete-btn" onclick="borrar(${pub.id})">Eliminar</button>` : ""}
        `;

        if (pub.propietario) mis.appendChild(div);
        else otros.appendChild(div);
    });
}

function darLike(id) {
    publicaciones = publicaciones.map(p => {
        if (p.id === id) p.likes++;
        return p;
    });

    localStorage.setItem("posts", JSON.stringify(publicaciones));
    mostrarPublicaciones();
}

function borrar(id) {
    publicaciones = publicaciones.filter(p => p.id !== id);
    localStorage.setItem("posts", JSON.stringify(publicaciones));
    mostrarPublicaciones();
}

mostrarPublicaciones();


// -------------------- CALIFICACIÓN --------------------

let hojas = document.querySelectorAll("#hojasRating span");

hojas.forEach(hoja => {
    hoja.addEventListener("click", function () {
        let valor = this.getAttribute("data-value");

        hojas.forEach(h => h.classList.remove("active"));
        for (let i = 0; i < valor; i++) {
            hojas[i].classList.add("active");
        }

        localStorage.setItem("rating", valor);
        document.getElementById("resultadoRating").textContent =
            "Tu calificación: " + valor + " / 5";
    });
});

let guardado = localStorage.getItem("rating");
if (guardado) {
    for (let i = 0; i < guardado; i++) {
        hojas[i].classList.add("active");
    }
    document.getElementById("resultadoRating").textContent =
        "Tu calificación: " + guardado + " / 5";
}

function toggleInfo(boton) {
    const texto = boton.nextElementSibling;

    if (texto.style.display === "block") {
        texto.style.display = "none";
        boton.textContent = "Más información";
    } else {
        texto.style.display = "block";
        boton.textContent = "Ocultar";
    }
}

// Cerrar el formulario con la X
document.getElementById("closeLogin").onclick = function () {
    document.getElementById("loginModal").style.display = "none";
};

// Cerrar haciendo clic fuera del formulario
window.onclick = function (e) {
    if (e.target.id === "loginModal") {
        document.getElementById("loginModal").style.display = "none";
    }
};

// Evitar que recargue la página
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Tu información se registró.");
});