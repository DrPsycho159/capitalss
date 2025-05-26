// Variables
let hamburguesas = JSON.parse(localStorage.getItem("hamburguesas")) || [];

const agregarBtn = document.getElementById("agregarBtn");
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
const formularioContainer = document.getElementById("formulario-container");
const form = document.getElementById("formHamburguesa");
const lista = document.getElementById("lista-hamburguesas");
const loginContainer = document.getElementById("login-container");
const loginForm = document.getElementById("loginForm");
const error = document.getElementById("error");
const panel = document.getElementById("panel");

let editandoId = null;

// Mostrar el formulario al hacer clic en agregar
agregarBtn.addEventListener("click", () => {
  formularioContainer.style.display = "block";
  form.reset();
  editandoId = null;

  // Mostrar también la lista debajo del formulario
  lista.style.display = "block";
  mostrarHamburguesas(); 
});

// Mostrar solo la lista al hacer clic en Lista de Hamburguesas


// Cerrar sesión
cerrarSesionBtn.addEventListener("click", () => {
  panel.style.display = "none";
  loginContainer.style.display = "flex";
  lista.style.display = "none"; // 👈 También aquí
});
// Iniciar sesión
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;

  if (usuario === "admin" && clave === "1234") {
    loginContainer.style.display = "none";
    panel.style.display = "block";
     lista.style.display = "none";
    //mostrarHamburguesas();
  } else {
    error.textContent = "Usuario o contraseña incorrectos";
  }
});

// Guardar hamburguesa
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = form.nombre.value;
  const descripcion = form.descripcion.value;
  const ingredientes = form.ingredientes.value;
  const preparacion = form.preparacion.value;
  const fotoFile = form.foto.files[0];

  if (fotoFile) {
    const reader = new FileReader();
    reader.onloadend = function () {
      guardarHamburguesa(nombre, descripcion, ingredientes, preparacion, reader.result);
    };
    reader.readAsDataURL(fotoFile);
  } else {
    guardarHamburguesa(nombre, descripcion, ingredientes, preparacion, null);
  }
});

function guardarHamburguesa(nombre, descripcion, ingredientes, preparacion, foto) {
  const nueva = { nombre, descripcion, ingredientes, preparacion, foto };

  if (editandoId !== null) {
    hamburguesas[editandoId] = nueva;
  } else {
    hamburguesas.push(nueva);
  }

  localStorage.setItem("hamburguesas", JSON.stringify(hamburguesas));
  formularioContainer.style.display = "none";
  mostrarHamburguesas();
}

function mostrarHamburguesas() {
  lista.style.display = "block"; // 👈 Asegura que esté visible
  lista.innerHTML = "";

 hamburguesas.forEach((ham, index) => {
    const div = document.createElement("div");
    div.className = "hamburguesa";

div.innerHTML = `
  <div class="tarjeta">
    <div class="numero">${index + 1}</div>
    <div class="info">
      <h3>${ham.nombre}</h3>
      <p><strong>Descripción:</strong> ${ham.descripcion}</p>
      <p><strong>Ingredientes:</strong> ${ham.ingredientes}</p>
      <p><strong>Preparación:</strong> ${ham.preparacion}</p>
    </div>
    <div class="foto">
      ${ham.foto ? `<img src="${ham.foto}" alt="foto">` : `<div class="no-foto">Sin foto</div>`}
    </div>
  </div>
  <div class="botones">
    <button onclick="editar(${index})">✏️ Editar</button>
    <button onclick="eliminar(${index})">🗑️ Eliminar</button>
  </div>
`;

    lista.appendChild(div);
  });
}

function editar(index) {
  const ham = hamburguesas[index];
  form.nombre.value = ham.nombre;
  form.descripcion.value = ham.descripcion;
  form.ingredientes.value = ham.ingredientes;
  form.preparacion.value = ham.preparacion;
  editandoId = index;
  formularioContainer.style.display = "block";

  // Hacer scroll al formulario suavemente
  window.scrollTo({ top: 0, behavior: "auto" });

}

function eliminar(index) {
  if (confirm("¿Eliminar esta hamburguesa?")) {
    hamburguesas.splice(index, 1);
    localStorage.setItem("hamburguesas", JSON.stringify(hamburguesas));
    mostrarHamburguesas();
  }
}

// Inicializar
//mostrarHamburguesas();
// Ocultar el formulario al hacer clic fuera de él
document.addEventListener("click", (e) => {
  const esClickDentroDelFormulario = formularioContainer.contains(e.target);
  const esClickEnBotonAgregar = agregarBtn.contains(e.target);
  const esClickEnBotonEditar = e.target.closest(".editar button");

  if (!esClickDentroDelFormulario && !esClickEnBotonAgregar && !esClickEnBotonEditar) {
    formularioContainer.style.display = "none";
    lista.style.display = "none"; // 👈 Oculta la lista también
  }
});
