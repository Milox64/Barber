// ========================================
// AlfaBot Mejorado - Macho Alfa Barbería
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
            { name: 'Fade Clásico', price: 500, duration: 45 },
            { name: 'Corte + Barba Premium', price: 850, duration: 70 },
            { name: 'Afeitado Clásico', price: 400, duration: 30 }
        ];
    }

    servicios() { return this.serviciosList; }
    isAvailable(fechaHora) { return !this.citas.estaOcupado(fechaHora); }
    programarCita(cliente, servicio, fechaHora) { return this.citas.agendar(cliente, servicio, fechaHora); }
    cancelarCita(telefono, fechaHora) { return this.citas.cancelar(telefono, fechaHora); }
}

const bot = new MachoAlfaBot();

let flow = { state: 'idle', buffer: {} };

let chatModal, chatMessages, chatOptions, messageInput;

document.addEventListener('DOMContentLoaded', () => {
    chatModal = document.getElementById('chatModal');
    chatMessages = document.getElementById('chatMessages');
    chatOptions = document.getElementById('chatOptions');
    messageInput = document.getElementById('messageInput');

    document.getElementById('chatButton')?.addEventListener('click', openChat);
    document.getElementById('heroReserve')?.addEventListener('click', openChat);

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const name = card.dataset.service;
            const servicio = bot.servicios().find(s => s.name === name);
            showServicesPopup(name, `$${servicio.price} MXN • ${servicio.duration} min`, card.querySelector('img').src);
        });
    });
});

function openChat() {
    chatModal.style.display = 'flex';
    chatModal.setAttribute('aria-hidden', 'false');
    if (flow.state === 'idle') showWelcome();
}

function closeChat() {
    chatModal.style.display = 'none';
    chatModal.setAttribute('aria-hidden', 'true');
}

function showWelcome() {
    flow = { state: 'menu', buffer: {} };
    addBotMessage('¡Hola! 👋 Soy <strong>AlfaBot</strong>, tu asistente en Macho Alfa Barbería. ¿En qué te puedo ayudar hoy?');
    showMenuOptions();
}

function showMenuOptions() {
    clearOptions();
    const opciones = [
        { id: 'book', label: 'Reservar cita' },
        { id: 'services', label: 'Ver servicios y precios' },
        { id: 'hours', label: 'Horarios' },
        { id: 'cancel', label: 'Cancelar cita' },
        { id: 'contact', label: 'Ubicación y contacto' }
    ];
    opciones.forEach(op => {
        const btn = document.createElement('button');
        btn.textContent = op.label;
        btn.onclick = () => handleOption(op.id);
        chatOptions.appendChild(btn);
    });
}

function clearOptions() { chatOptions.innerHTML = ''; }

function handleOption(id) {
    clearOptions();
    if (id === 'book') startBooking();
    else if (id === 'services') listServices();
    else if (id === 'hours') showHours();
    else if (id === 'cancel') startCancel();
    else if (id === 'contact') showContact();
}

function startBooking() {
    flow.state = 'booking_name';
    flow.buffer = {};
    addBotMessage('¡Perfecto! 💈 Vamos a reservar tu cita. ¿Cuál es tu nombre completo?');
}

function startCancel() {
    flow.state = 'cancel_input';
    addBotMessage('Para cancelar, escribe tu teléfono (10 dígitos) y la fecha/hora de la cita.\nEjemplo: <code>5512345678 2025-12-20 15:00</code>');
}

function listServices() {
    addBotMessage('💈 Estos son nuestros servicios:');
    bot.servicios().forEach(s => {
        addBotMessage(`• <strong>${s.name}</strong> — ${s.duration} min — $${s.price} MXN`);
    });
    showMenuOptions();
}

function showHours() {
    addBotMessage('🕒 Horario: Lunes a Sábado de 9:00 a 19:00 hrs.\nDomingos cerrado.');
    showMenuOptions();
}

function showContact() {
    addBotMessage('📍 Dirección: Calle Ficticia 123, Ciudad Ejemplo\n📞 Teléfono: +52 1 123 456 7890');
    showMenuOptions();
}

function addBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'message bot-message';
    div.innerHTML = text;
    chatMessages.appendChild(div);
    scrollChat();
}

function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'message user-message';
    div.innerHTML = `<strong>Tú:</strong> ${text}`;
    chatMessages.appendChild(div);
    scrollChat();
}

function scrollChat() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function typingIndicator() {
    const div = document.createElement('div');
    div.id = 'typing';
    div.className = 'message bot-message';
    div.textContent = 'AlfaBot está escribiendo...';
    chatMessages.appendChild(div);
    scrollChat();
    return div;
}

function removeTyping() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
}

function sendMessage() {
    const input = messageInput.value.trim();
    if (!input) return;
    addUserMessage(input);
    messageInput.value = '';
    const typing = typingIndicator();
    setTimeout(() => {
        removeTyping();
        procesarMensaje(input);
    }, 800);
}

// --- Extracción simple de intención y entidades (NLP ligero)
function extractPhone(text){
    const m = text.match(/\+?\d[\d\s\-()]{8,}\d/);
    if(!m) return null;
    const digits = m[0].replace(/\D/g,'');
    return digits.length >= 10 ? digits.slice(-10) : null;
}

function extractDateTime(text){
    // busca formato YYYY-MM-DD HH:MM
    const m = text.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
    if(m) return m[1];
    // intenta palabras tipo "mañana 15:00" -> no soportado aún
    return null;
}

function extractService(text){
    const s = bot.servicios();
    const lower = text.toLowerCase();
    // coincidencia por inclusión de palabras clave
    for(const serv of s){
        if(lower.includes(serv.name.toLowerCase())) return serv.name;
        const tokens = serv.name.toLowerCase().split(/\s+/);
        if(tokens.some(t => lower.includes(t))) return serv.name;
    }
    return null;
}

function extractName(text){
    // busca frases "me llamo X", "mi nombre es X"
    let m = text.match(/me llamo\s+([A-Za-zÁÉÍÓÚÑü\s]+)/i);
    if(m) return m[1].trim();
    m = text.match(/mi nombre es\s+([A-Za-zÁÉÍÓÚÑü\s]+)/i);
    if(m) return m[1].trim();
    // si el texto corto y capitalizado, podría ser un nombre
    if(/^[A-ZÁÉÍÓÚÑ][a-záéíóúñü]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñü]+)?$/.test(text.trim())) return text.trim();
    return null;
}

function parseIntent(text){
    const lower = text.toLowerCase();
    const intent = { name: 'unknown', phone: null, date: null, service: null, person: null };
    if(/reservar|cita|turno|agendar/.test(lower)) intent.name = 'book';
    if(/cancelar|eliminar|quitar/.test(lower)) intent.name = 'cancel';
    if(/horario|horarios|abierto/.test(lower)) intent.name = 'hours';
    if(/servicios|precio|precios|corte/.test(lower)) intent.name = 'services';
    if(/direccion|ubicaci[oó]n|donde/.test(lower)) intent.name = 'contact';

    intent.phone = extractPhone(text);
    intent.date = extractDateTime(text);
    intent.service = extractService(text);
    intent.person = extractName(text);
    return intent;
}

function procesarMensaje(mensaje) {
    const lower = mensaje.toLowerCase();

    // saludo rápido
    if (/\b(hola|buenos|buenas|hey)\b/.test(lower)){
        addBotMessage('¡Hola! 😎 Puedes reservar una cita, preguntar por servicios, horarios o cancelar. Escríbeme como prefieras.');
        showMenuOptions();
        return;
    }

    // Intento de parseo avanzado
    const intent = parseIntent(mensaje);

    // Si detectó intención de reservar y al menos un dato clave, intenta continuar
    if(intent.name === 'book'){
        // si tenemos todos los datos, agendamos directo
        if(intent.person && intent.phone && intent.service && intent.date){
            const cliente = new Cliente(intent.person, intent.phone);
            if(bot.programarCita(cliente, intent.service, intent.date)){
                addBotMessage(`¡Perfecto ${intent.person}! 🎉 Tu cita para <strong>${intent.service}</strong> el <strong>${intent.date}</strong> quedó confirmada.`);
                flow.state = 'menu';
                showMenuOptions();
                return;
            } else {
                addBotMessage('Ese horario ya está ocupado. ¿Quieres intentar otro horario?');
                flow.state = 'booking_datetime';
                return;
            }
        }

        // si estamos ya en flujo de reserva, dejar que el flujo maneje
        if(flow.state.startsWith('booking')){
            // dejar caer al manejo por estado más abajo
        } else {
            // iniciar flujo y prellenar datos si se encontraron
            flow.state = 'booking_name';
            flow.buffer = {};
            if(intent.person) flow.buffer.name = intent.person;
            if(intent.phone) flow.buffer.phone = intent.phone;
            if(intent.service) flow.buffer.service = intent.service;
            if(intent.date) flow.buffer.date = intent.date;
            // avanzar según lo que falte
            if(!flow.buffer.name){ addBotMessage('Perfecto, ¿cuál es tu nombre completo?'); return; }
            if(!flow.buffer.phone){ flow.state='booking_phone'; addBotMessage(`Gracias, ${flow.buffer.name}. ¿Cuál es tu teléfono?`); return; }
            if(!flow.buffer.service){ flow.state='booking_service'; addBotMessage('¿Qué servicio deseas?'); showServiceButtons(); return; }
            if(!flow.buffer.date){ flow.state='booking_datetime'; addBotMessage('¿Para qué fecha y hora la quieres? (Formato: YYYY-MM-DD HH:MM)'); return; }
        }
    }

    // Cancelación con información en texto
    if(intent.name === 'cancel'){
        if(intent.phone && intent.date){
            if(bot.cancelarCita(intent.phone, intent.date)){
                addBotMessage('He cancelado tu cita. ✅');
            } else addBotMessage('No encontré una cita con esos datos.');
            flow.state='menu'; showMenuOptions(); return;
        }
        // si faltan datos, pedirlos
        flow.state='cancel_input'; addBotMessage('Para cancelar dime tu teléfono y la fecha/hora (ej: 5512345678 2025-12-20 15:00)'); return;
    }

    // Servicios / horarios / contacto (intents simples)
    if(intent.name === 'services'){ listServices(); return; }
    if(intent.name === 'hours'){ showHours(); return; }
    if(intent.name === 'contact'){ showContact(); return; }

    // --- Manejo por estado (si se inició flujo de reserva antes)
    if (flow.state === 'booking_name') {
        if (mensaje.trim().length < 3) {
            addBotMessage('El nombre parece muy corto. Por favor escribe tu nombre completo.');
            return;
        }
        flow.buffer.name = mensaje.trim();
        flow.state = 'booking_phone';
        addBotMessage(`Gracias, ${flow.buffer.name}. Ahora dime tu número de teléfono (10 dígitos).`);
        return;
    }

    if (flow.state === 'booking_phone') {
        const phone = extractPhone(mensaje) || mensaje.replace(/\D/g, '');
        if (!phone || phone.length !== 10) {
            addBotMessage('Número inválido. Por favor ingresa 10 dígitos (ej: 5512345678).');
            return;
        }
        flow.buffer.phone = phone;
        flow.state = 'booking_service';
        addBotMessage('¿Qué servicio deseas?');
        showServiceButtons();
        return;
    }

    if (flow.state === 'booking_service') {
        // intenta detectar el servicio en la frase
        const serv = extractService(mensaje);
        if(serv){ flow.buffer.service = serv; flow.state='booking_datetime'; addBotMessage(`Elegiste <strong>${serv}</strong>. Ahora dime la fecha y hora (YYYY-MM-DD HH:MM)`); return; }
        // si no, mostrar opciones
        addBotMessage('No reconocí ese servicio. Elige una de las opciones:');
        showServiceButtons();
        return;
    }

    if (flow.state === 'booking_datetime') {
        const possible = extractDateTime(mensaje) || mensaje.trim();
        const error = validarFechaHora(possible);
        if (error) { addBotMessage(error + ' Por favor intenta con otra fecha/hora.'); return; }
        const cliente = new Cliente(flow.buffer.name, flow.buffer.phone);
        const servicio = flow.buffer.service;
        if (bot.programarCita(cliente, servicio, possible)) {
            addBotMessage(`¡Listo! 🎉 Tu cita ha sido confirmada:\n\n<strong>${flow.buffer.name}</strong>\nServicio: ${servicio}\nFecha: ${possible}\n\n¡Te esperamos en Macho Alfa!`);
        } else {
            addBotMessage('Lo siento, ese horario ya está ocupado. Elige otro por favor.');
        }
        flow.state = 'menu';
        showMenuOptions();
        return;
    }

    // Cancelación por estado
    if (flow.state === 'cancel_input') {
        const phoneMatch = extractPhone(mensaje);
        const dateMatch = extractDateTime(mensaje) || mensaje.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/)?.[1];
        if (!phoneMatch || !dateMatch) {
            addBotMessage('Formato incorrecto. Ejemplo: <code>5512345678 2025-12-20 15:00</code>');
            return;
        }
        const phone = phoneMatch;
        const datetime = dateMatch;
        if (bot.cancelarCita(phone, datetime)) {
            addBotMessage('¡Cita cancelada exitosamente! 👍');
        } else {
            addBotMessage('No encontramos ninguna cita con esos datos.');
        }
        flow.state = 'menu';
        showMenuOptions();
        return;
    }

    // Fallback más amable y con ejemplo
    addBotMessage('Lo siento, no entendí completamente. Puedes escribir algo como: "Reservar para 2025-12-20 15:00 Fade Clásico, me llamo Juan, mi teléfono 5512345678" o usar los botones.');
    showMenuOptions();
}

function showServiceButtons() {
    clearOptions();
    bot.servicios().forEach(s => {
        const btn = document.createElement('button');
        btn.textContent = `${s.name} (${s.duration} min)`;
        btn.onclick = () => {
            flow.buffer.service = s.name;
            flow.state = 'booking_datetime';
            clearOptions();
            addBotMessage(`Elegiste <strong>${s.name}</strong>. ¿Para qué fecha y hora?\n(Formato: 2025-12-20 15:00)`);
        };
        chatOptions.appendChild(btn);
    });
}

function validarFechaHora(input) {
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(input)) {
        return '⚠️ Formato incorrecto. Usa: YYYY-MM-DD HH:MM';
    }
    const now = new Date();
    const selected = new Date(input.replace(' ', 'T'));
    if (selected <= now) {
        return '⚠️ La fecha debe ser futura.';
    }
    if (!bot.isAvailable(input)) {
        return '⚠️ Ese horario ya está ocupado.';
    }
    return null;
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

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