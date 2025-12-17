let historial = [];
let contexto = { productoActual: null, necesitaMasInfo: false };

function agregarMensajeBot(texto, html = false) {
  historial.push({ emisor: "bot", texto, html });
  actualizarChat();
}

function agregarMensajeUsuario(texto) {
  historial.push({ emisor: "usuario", texto });
  actualizarChat();
}

function actualizarChat() {
  const chat = document.getElementById("chat-messages");
  chat.innerHTML = "";
  historial.forEach(msg => {
    const div = document.createElement("div");
    div.className = msg.emisor;
    if (msg.html) {
      div.innerHTML = msg.texto;
    } else {
      div.textContent = msg.texto;
    }
    chat.appendChild(div);
  });
  chat.scrollTop = chat.scrollHeight;
}

function agregarMensajeBotHTML(html) {
  agregarMensajeBot(html, true);
}

function mostrarProducto(prod) {
  const html = `
    <div style="border:1px solid #ccc; border-radius:12px; padding:15px; margin:15px 0; background:#1a1a1a; color:white; max-width:300px;">
      <img src="${prod.imagen}" style="width:100%; border-radius:10px;">
      <h3 style="margin:10px 0;">${prod.nombre}</h3>
      <p style="text-decoration:line-through; color:gray; margin:5px 0;">$${prod.precioOriginal}</p>
      <p style="font-size:22px; color:#ffcc00; margin:5px 0;">$${prod.precio}</p>
      <p style="font-size:14px;">${prod.descripcion}</p>
      <button style="background:#ffcc00; color:black; padding:10px; border:none; border-radius:8px; width:100%; font-weight:bold;" onclick="alert('Agregado al carrito: ${prod.nombre}')">
        Añadir al carrito
      </button>
    </div>`;
  agregarMensajeBotHTML(html);
}

function recomendarRelacionados(nombre) {
  const relacionados = obtenerRelacionados(nombre);
  if (relacionados.length > 0) {
    agregarMensajeBot("Y para complementar, te recomiendo estos que van perfecto:");
    relacionados.forEach(mostrarProducto);
    agregarMensajeBot("¿Te late alguno? ¿O buscas algo más específico?");
  }
}

function procesarMensaje(mensaje) {
  if (!mensaje.trim()) return;
  agregarMensajeUsuario(mensaje);

  const lower = mensaje.toLowerCase();
  const encontrados = buscarProducto(mensaje);

  if (encontrados.length > 0) {
    contexto.productoActual = encontrados[0].nombre;
    
    if (encontrados.length > 1) {
      agregarMensajeBot("Encontré varios que podrían interesarte:");
      encontrados.slice(0, 3).forEach(mostrarProducto);
    } else {
      agregarMensajeBot(`¡Buena elección! Aquí te va el ${encontrados[0].nombre}:`);
      mostrarProducto(encontrados[0]);
    }
    
    recomendarRelacionados(encontrados[0].nombre);
  } else if (lower.includes("hola") || lower.includes("buenas") || historial.length === 0) {
    agregarMensajeBot("¡Qué onda! 💈 Bienvenido a Macho Alfa. ¿Qué andas buscando hoy para verte bien chido? ¿Pomada, shampoo, algo para la barba?");
  } else if (lower.includes("gracias") || lower.includes("ok")) {
    agregarMensajeBot("De nada hermano, cualquier cosa aquí estoy. ¿Algo más en lo que te ayude?");
  } else {
    agregarMensajeBot("No entendí bien eso 😅 ¿Me lo repites? Buscas algo para fijar el cabello, limpiar, barba o qué onda?");
    agregarMensajeBot("Por ejemplo: 'Quiero una pomada mate' o 'Algo para hidratar el cabello'");
  }
}

function iniciarChat() {
  agregarMensajeBot("¡Qué onda! Soy el asistente Macho Alfa. ¿En qué te ayudo hoy con productos para cabello o barba?");
}

// Llama esto al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  iniciarChat();
  document.getElementById("enviar-btn").addEventListener("click", () => {
    const input = document.getElementById("user-input");
    procesarMensaje(input.value);
    input.value = "";
  });
  
  document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      document.getElementById("enviar-btn").click();
    }
  });
});