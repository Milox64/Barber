// ========================================
// AlfaBot Fluido - Macho Alfa Barbería v2
// Sistema de IA conversacional sin opciones predefinidas
// ========================================

class Cliente {
    constructor(nombre, telefono) {
        this.nombre = nombre.trim();
        this.telefono = telefono.replace(/\s/g, '');
    }
}

class Citas {
    constructor() {
        this.lista = JSON.parse(localStorage.getItem('citasMachoAlfa')) || [];
    }

    agendar(cliente, servicio, fechaHora) {
        if (this.lista.some(c => c.fechaHora === fechaHora)) return false;
        this.lista.push({ cliente, servicio, fechaHora });
        localStorage.setItem('citasMachoAlfa', JSON.stringify(this.lista));
        return true;
    }

    cancelar(telefono, fechaHora) {
        const inicial = this.lista.length;
        this.lista = this.lista.filter(c => !(c.cliente.telefono === telefono && c.fechaHora === fechaHora));
        if (this.lista.length !== inicial) {
            localStorage.setItem('citasMachoAlfa', JSON.stringify(this.lista));
            return true;
        }
        return false;
    }

    estaOcupado(fechaHora) {
        return this.lista.some(c => c.fechaHora === fechaHora);
    }
}

class MachoAlfaBot {
    constructor() {
        this.citas = new Citas();
        this.serviciosList = [
            { name: 'Fade Clásico', price: 500, duration: 45, keywords: ['fade', 'clasico'], desc: 'Degradado perfecto de los costados' },
            { name: 'Fade Undercut', price: 550, duration: 50, keywords: ['undercut', 'undercut fade'], desc: 'Volumen arriba, costados limpios' },
            { name: 'Pompadour', price: 600, duration: 55, keywords: ['pompadour', 'pompadur'], desc: 'Clásico con volumen hacia atrás' },
            { name: 'Buzz Cut', price: 400, duration: 30, keywords: ['buzz', 'buzz cut'], desc: 'Corte militar pulcro' },
            { name: 'Skin Fade', price: 550, duration: 50, keywords: ['skin', 'skin fade'], desc: 'Fade extremo casi a ras' },
            { name: 'Corte + Barba Premium', price: 850, duration: 70, keywords: ['barba', 'premium'], desc: 'Corte + perfilado de barba' },
            { name: 'Afeitado Clásico', price: 400, duration: 30, keywords: ['afeitado', 'rasura'], desc: 'Afeitado tradicional con navaja' },
            { name: 'Tratamiento Capilar', price: 450, duration: 45, keywords: ['tratamiento', 'capilar', 'hidratacion'], desc: 'Hidratación profunda del cabello' }
        ];
    }

    servicios() { return this.serviciosList; }
    isAvailable(fechaHora) { return !this.citas.estaOcupado(fechaHora); }
    programarCita(cliente, servicio, fechaHora) { return this.citas.agendar(cliente, servicio, fechaHora); }
    cancelarCita(telefono, fechaHora) { return this.citas.cancelar(telefono, fechaHora); }
}

const bot = new MachoAlfaBot();

// Estado del chatbot
let chatState = {
    conversationHistory: [],
    userPreferences: { serviceType: null, budget: null, style: null },
    lastRecommendation: null,
    visitCount: 0
};

let chatModal, chatMessages, messageInput;

// ====== INICIALIZACIÓN ======
document.addEventListener('DOMContentLoaded', () => {
    chatModal = document.getElementById('chatModal');
    chatMessages = document.getElementById('chatMessages');
    messageInput = document.getElementById('messageInput');

    document.getElementById('chatButton')?.addEventListener('click', openChat);
    document.getElementById('heroReserve')?.addEventListener('click', openChat);

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const name = card.dataset.service;
            const servicio = bot.servicios().find(s => s.name === name);
            if (servicio) {
                showServicesPopup(name, `$${servicio.price} MXN • ${servicio.duration} min`, card.querySelector('img').src);
            }
        });
    });

    // Renderizar productos
    if (typeof renderProductos === 'function') renderProductos();
});

function openChat() {
    chatModal.style.display = 'flex';
    chatModal.setAttribute('aria-hidden', 'false');
    if (chatState.conversationHistory.length === 0) {
        showWelcome();
    }
}

function closeChat() {
    chatModal.style.display = 'none';
    chatModal.setAttribute('aria-hidden', 'true');
}

function showWelcome() {
    chatState.visitCount++;
    const greeting = chatState.visitCount === 1 
        ? '¡Qué onda! 💈 Soy AlfaBot, el asistente de Macho Alfa. ¿Buscas un corte, productos o quieres agendar una cita?'
        : '¿Qué te trae de vuelta, hermano? 😎';
    addBotMessage(greeting);
}

function addBotMessage(text, html = false) {
    const div = document.createElement('div');
    div.className = 'message bot-message';
    if (html) {
        div.innerHTML = text;
    } else {
        div.textContent = text;
    }
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatState.conversationHistory.push({ role: 'bot', content: text });
}

function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'message user-message';
    div.textContent = `Tú: ${text}`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatState.conversationHistory.push({ role: 'user', content: text });
}

function sendMessage() {
    const input = messageInput.value.trim();
    if (!input) return;
    
    addUserMessage(input);
    messageInput.value = '';
    
    // Simular escritura del bot
    setTimeout(() => {
        procesarMensajeInteligente(input);
    }, 800);
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

// ====== PROCESAMIENTO INTELIGENTE DE MENSAJES ======

// Detección de intención primaria
function detectIntent(text) {
    const lower = text.toLowerCase();
    
    if (/reserv|agend|cita|turno|pedir|horario|fecha|hora/.test(lower)) return 'booking';
    if (/producto|pomada|shampoo|tonico|acondicion|gotas|comprar|vender/.test(lower)) return 'products';
    if (/corte|fade|peinado|peluqueria|estilo|haircut/.test(lower)) return 'haircut';
    if (/cancelar|eliminar|quitar|borrar/.test(lower)) return 'cancel';
    if (/precio|costo|cuanto|caro|presupuesto|valor/.test(lower)) return 'price';
    if (/recomend|sugerir|que me recomiendas|cual es mejor|cual me va bien/.test(lower)) return 'recommendation';
    if (/hola|buenos|hey|¿que tal|como estás|saludos/.test(lower)) return 'greeting';
    if (/horario|abierto|cuando|atienden/.test(lower)) return 'hours';
    if (/ubicacion|donde|direccion|local/.test(lower)) return 'location';
    if (/gracias|thanks|ok|vale|listo/.test(lower)) return 'acknowledgment';
    
    return 'unknown';
}

// Extracción de servicios mencionados
function extractServices(text) {
    const lower = text.toLowerCase();
    return bot.servicios().filter(s => 
        s.keywords.some(k => lower.includes(k)) || 
        lower.includes(s.name.toLowerCase())
    );
}

// Extracción de presupuesto
function extractBudget(text) {
    const match = text.match(/\$?\s?(\d+)\s?(pesos|mxn|mx)?/i);
    return match ? parseInt(match[1]) : null;
}

// Recomendaciones contextuales lógicas
function recommendBasedOnContext(intent, services) {
    const budget = chatState.userPreferences.budget;
    const style = chatState.userPreferences.style;
    
    let recommendations = [];

    if (intent === 'haircut') {
        // Si pregunta por cortes, recomendar basado en estilo detectado
        if (style && style.includes('volumen')) {
            recommendations.push(bot.servicios().find(s => s.name === 'Pompadour'));
            recommendations.push(bot.servicios().find(s => s.name === 'Fade Undercut'));
        } else if (style && style.includes('limpio')) {
            recommendations.push(bot.servicios().find(s => s.name === 'Skin Fade'));
            recommendations.push(bot.servicios().find(s => s.name === 'Fade Clásico'));
        } else {
            // Default: los 3 más populares
            recommendations = [
                bot.servicios().find(s => s.name === 'Fade Clásico'),
                bot.servicios().find(s => s.name === 'Fade Undercut'),
                bot.servicios().find(s => s.name === 'Pompadour')
            ];
        }
    } else if (intent === 'products') {
        // Recomendar productos relacionados lógicos
        if (services.length > 0) {
            // Si ya mencionó un producto, recomendar sus relacionados
            if (typeof obtenerRelacionados === 'function') {
                recommendations = obtenerRelacionados(services[0].name);
            }
        } else {
            // Sugerir combo básico de cuidado
            recommendations = productos.slice(0, 3);
        }
    }
    
    return recommendations;
}

// Respuestas contextualmente inteligentes
function procesarMensajeInteligente(mensaje) {
    const intent = detectIntent(mensaje);
    const services = extractServices(mensaje);
    const productMatches = (typeof buscarProducto === 'function') ? buscarProducto(mensaje) : [];
    const budget = extractBudget(mensaje);
    
    // Actualizar preferencias
    if (budget) chatState.userPreferences.budget = budget;
    
    // Detectar estilo del usuario
    const lower = mensaje.toLowerCase();
    if (/volumen|arriba|pompadour|undercut/.test(lower)) chatState.userPreferences.style = 'volumen';
    if (/limpio|fade|ras|corto/.test(lower)) chatState.userPreferences.style = 'limpio';

    // Responder según intención
    if (intent === 'greeting') {
        addBotMessage('¿Qué onda! 😎 ¿Necesitas un corte, productos para la barba, o quieres agendar cita?');
    } 
    else if (intent === 'haircut') {
        if (services.length === 0) {
            addBotMessage('Te muestro nuestros cortes más populares:');
            const top3 = bot.servicios().slice(0, 3);
            top3.forEach(s => {
                addBotMessage(`💈 <strong>${s.name}</strong> - $${s.price} MXN (${s.duration} min) • ${s.desc}`);
            });
            addBotMessage('¿Cuál te late? O cuéntame qué estilo buscas: ¿volumen, limpio, clásico?');
        } else {
            addBotMessage(`Excelente, el <strong>${services[0].name}</strong> es una opción brutal. Te cuesta $${services[0].price} MXN en ${services[0].duration} minutos.`);
            const recommendations = recommendBasedOnContext('haircut', services);
            if (recommendations.length > 0) {
                addBotMessage('Por si quieres comparar, también te recomiendo:');
                recommendations.slice(0, 2).forEach(s => {
                    if (s) addBotMessage(`• <strong>${s.name}</strong> - $${s.price} MXN`);
                });
            }
            addBotMessage('¿Quieres agendar una de estas o prefieres conocer más detalles?');
        }
    }
    else if (intent === 'products') {
        // Primero, mostrar coincidencias directas en productos
        if (productMatches.length > 0) {
            addBotMessage('Encontré estos productos para ti:');
            productMatches.slice(0, 4).forEach(p => mostrarProductoHTML(p));
            // Recomendaciones lógicas
            addBotMessage('También podrían interesarte:');
            const recs = recommendBasedOnContext('products', [productMatches[0]]);
            recs.slice(0, 3).forEach(p => { if (p) addBotMessage(`• <strong>${p.nombre}</strong> - $${p.precio} MXN`); });
            return;
        }

        // Si no hay coincidencias directas pero detectó servicios (posible confusión), mostrar esos
        if (services.length > 0) {
            addBotMessage(`¿Te refieres al servicio <strong>${services[0].name}</strong> o buscabas productos relacionados?`);
            return;
        }

        // Si el usuario escribió una sola palabra, intentar buscar por categoría
        const single = mensaje.trim().split(/\s+/).length === 1;
        if (single && typeof obtenerPorCategoria === 'function') {
            const cat = mensaje.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const porCat = obtenerPorCategoria(cat);
            if (porCat && porCat.length > 0) {
                addBotMessage(`Encontré estos productos en la categoría "${mensaje}":`);
                porCat.slice(0,6).forEach(p => mostrarProductoHTML(p));
                return;
            }
        }

        // Fallback para productos
        addBotMessage('Veo que buscas productos. ¿Qué andas necesitando? ¿Pomada, shampoo, tónico, gotas de seda?');
    }
    else if (intent === 'booking') {
        addBotMessage('Perfecto, te ayudo a agendar. ¿Qué servicio quieres? Puedes decir el nombre o describir el corte que buscas.');
        addBotMessage('Y avísame qué día y hora te viene bien. Nuestro horario es Lunes-Sábado 9:00 - 19:00.');
    }
    else if (intent === 'price') {
        if (services.length > 0) {
            addBotMessage(`El ${services[0].name} te sale en $${services[0].price} MXN.`);
        } else {
            addBotMessage('Nuestros servicios van desde $400 (Afeitado/Buzz Cut) hasta $850 (Corte + Barba Premium). ¿Hay algo en ese rango que te lata?');
        }
    }
    else if (intent === 'recommendation') {
        addBotMessage('Claro, ¿qué tipo de corte buscas? ¿Algo con volumen, limpio y definido, o clásico sin tanto rollo?');
        addBotMessage('También me ayuda saber: ¿tienes cabello liso, ondulado o rizado?');
    }
    else if (intent === 'hours') {
        addBotMessage('📍 Nuestro horario es: Lunes-Sábado de 9:00 a 19:00. Domingos cerrado.');
        addBotMessage('¿Quieres agendar una cita?');
    }
    else if (intent === 'location') {
        addBotMessage('📍 Nos encuentras en: Calle Ficticia 123, Ciudad Ejemplo.');
        addBotMessage('También puedes comunicarte al +52 1 123 456 7890 para preguntar o agendar.');
    }
    else if (intent === 'cancel') {
        addBotMessage('Entendido. Para cancelar una cita, dame tu teléfono y la fecha de tu cita.');
    }
    else if (intent === 'acknowledgment') {
        const responses = [
            '¡De nada carnal! Cualquier cosa aquí estoy 💈',
            'Para eso estamos, hermano. ¿Algo más?',
            '¡Chido! ¿Te ayudo con algo más?'
        ];
        addBotMessage(responses[Math.floor(Math.random() * responses.length)]);
    }
    else {
        // Fallback inteligente
        addBotMessage('Hmm, no capté bien 😅 ¿Andas buscando un corte, productos, o quieres agendar cita?');
        addBotMessage('Cuéntame más: ¿qué necesitas?');
    }
}

// Función helper para mostrar producto como HTML
function mostrarProductoHTML(prod) {
    const html = `
        <div style="border:1px solid rgba(124,92,255,0.3); border-radius:12px; padding:15px; margin:10px 0; background:rgba(17,18,30,0.8); color:white; max-width:100%;">
            <img src="${prod.imagen}" style="width:100%; border-radius:10px; max-height:200px; object-fit:cover;">
            <h4 style="margin:10px 0 5px; color:#7c5cff;">${prod.nombre}</h4>
            <p style="text-decoration:line-through; color:#666; margin:3px 0; font-size:0.9rem;">$${prod.precioOriginal}</p>
            <p style="font-size:20px; color:#00d4ff; margin:5px 0; font-weight:bold;">$${prod.precio} MXN</p>
            <p style="font-size:0.9rem; color:#9aa3b2; margin:5px 0;">${prod.descripcion}</p>
        </div>`;
    addBotMessage(html, true);
}

// ====== FUNCIONES DE SERVICIOS ======

function showServicesPopup(title, price, imgSrc) {
    document.getElementById('popupTitle').textContent = title;
    document.getElementById('popupPrice').textContent = price;
    document.getElementById('popupImage').src = imgSrc;
    document.getElementById('popupImage').alt = `Imagen de ${title}`;
    document.getElementById('servicePopup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('servicePopup').style.display = 'none';
}

function renderProductos() {
    const container = document.getElementById('productsList');
    if (!container) return;
    if (typeof productos === 'undefined') {
        console.warn('productos no está definido. Carga Productos.js primero.');
        return;
    }
    
    container.innerHTML = '';
    productos.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const descuento = prod.precioOriginal ? Math.round((1 - prod.precio / prod.precioOriginal) * 100) : 0;
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
                ${descuento > 0 ? `<span class="discount-badge">-${descuento}%</span>` : ''}
            </div>
            <div class="product-body">
                <h3>${prod.nombre}</h3>
                <p class="description">${prod.descripcion}</p>
                <div class="price-section">
                    ${prod.precioOriginal ? `<span class="original-price">$${prod.precioOriginal}</span>` : ''}
                    <span class="price">$${prod.precio}</span>
                </div>
                <button class="btn-product" onclick="agregarCarrito('${prod.nombre.replace(/'/g, "\\'")}', ${prod.precio})">Agregar al carrito</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function agregarCarrito(nombre, precio) {
    addBotMessage(`¡Chido! Agregué <strong>${nombre}</strong> ($${precio}) a tu carrito. 🛒`);
    addBotMessage('¿Quieres llevar algo más o prefieres ir a pagar?');
}
