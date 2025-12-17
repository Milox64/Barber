// ============================================
// AlfaBot - Chatbot frontend (sin IA)
// ============================================

// ========== CLASES ==========
class Cliente {
    constructor(nombre, telefono){
        this.nombre = nombre || '';
        this.telefono = telefono || '';
    }
}

class Citas {
    constructor(){
        this.lista = [];
    }

    agendar(cliente, servicio, fechaHora){
        if(this.lista.some(c=>c.fechaHora === fechaHora)) return false;
        this.lista.push({ cliente, servicio, fechaHora });
        return true;
    }

    cancelar(nombre, telefono){
        const idx = this.lista.findIndex(c => c.cliente.nombre.toLowerCase() === nombre.toLowerCase() && (c.cliente.telefono || '').includes(telefono));
        if(idx === -1) return false;
        this.lista.splice(idx,1);
        return true;
    }

    listar(){
        return this.lista.map(x => ({ ...x }));
    }
}

class MachoAlfaBot {
    constructor(){
        this.citas = new Citas();
        this.serviciosList = [
            { name: 'Fade Clásico', price: 500, duration: 45 },
            { name: 'Corte + Barba Premium', price: 850, duration: 70 },
            { name: 'Afeitado Clásico', price: 400, duration: 30 }
        ];
    }

    servicios(){
        return this.serviciosList;
    }

    isAvailable(fechaHora){
        const lista = this.citas.listar();
        return !lista.some(c => c.fechaHora === fechaHora);
    }

    programarCita(cliente, servicio, fechaHora){
        return this.citas.agendar(cliente, servicio, fechaHora);
    }

    cancelarCita(nombre, telefono){
        return this.citas.cancelar(nombre, telefono);
    }

    listarCitas(){
        return this.citas.listar();
    }
}

// ========== INSTANCIA BOT ==========
// ========== INSTANCIA BOT ==========
const bot = new MachoAlfaBot();

// ========== ESTADO DEL FLUJO ==========
let flow = { state: 'idle', buffer: {} };

// ========== UI HOOKS (serán asignadas en DOMContentLoaded) ==========
let chatButton, chatModal, chatMessages, chatOptions, messageInput, heroReserve;

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 DOMContentLoaded disparado');
    
    // Asignar referencias a elementos DOM
    chatButton = document.getElementById('chatButton');
    chatModal = document.getElementById('chatModal');
    chatMessages = document.getElementById('chatMessages');
    chatOptions = document.getElementById('chatOptions');
    messageInput = document.getElementById('messageInput');
    heroReserve = document.getElementById('heroReserve');
    
    console.log('chatButton:', chatButton);
    console.log('chatModal:', chatModal);
    console.log('messageInput:', messageInput);
    
    // Mostrar botón inmediatamente
    if(chatButton) {
        chatButton.style.display = 'inline-block';
        console.log('✓ chatButton visible');
    } else {
        console.error('✗ chatButton NO encontrado');
    }
    
    // Asignar event listeners
    if(chatButton) {
        chatButton.onclick = openChat;
        console.log('✓ chatButton.onclick = openChat');
    }
    if(heroReserve) {
        heroReserve.onclick = openChat;
        console.log('✓ heroReserve.onclick = openChat');
    } else {
        console.warn('⚠ heroReserve NO encontrado');
    }
    
    // Listeners para tarjetas de servicio
    const cards = document.querySelectorAll('.service-card');
    console.log('Tarjetas encontradas:', cards.length);
    
    cards.forEach(card=>{
        card.addEventListener('click', ()=>{
            const name = card.dataset.service || card.querySelector('h3')?.textContent;
            const s = bot.servicios().find(x=>x.name===name) || {price:'—', duration:''};
            showServicesPopup(name, `$${s.price} MXN • ${s.duration} min`, card.querySelector('img')?.src);
        });
    });
    
    console.log('✓ Inicialización completa');
});

function openChat(){
    chatModal.style.display = 'block';
    chatModal.setAttribute('aria-hidden', 'false');
    showWelcome();
}
function closeChat(){
    chatModal.style.display = 'none';
    chatModal.setAttribute('aria-hidden', 'true');
    clearOptions();
}

function showWelcome(){
    flow = { state: 'menu', buffer: {} };
    addBotMessage('¿En qué puedo ayudarte? Puedes programar una cita, consultar horarios disponibles, conocer nuestros servicios, cancelar una cita existente o obtener información de contacto.');
    showMenuOptions();
}

function showMenuOptions(){
    clearOptions();
    const opts = [
        { id: 'book', label: 'Programar cita' },
        { id: 'hours', label: 'Consultar horarios' },
        { id: 'services', label: 'Ver servicios' },
        { id: 'cancel', label: 'Cancelar cita' },
        { id: 'contact', label: 'Información de contacto' }
    ];
    opts.forEach(o => {
        const btn = document.createElement('button');
        btn.textContent = o.label; btn.onclick = () => handleOption(o.id);
        chatOptions.appendChild(btn);
    });
}

function clearOptions(){ chatOptions.innerHTML = ''; }

function handleOption(id){
    clearOptions();
    if(id === 'book') startBooking();
    else if(id === 'hours') showHours();
    else if(id === 'services') listServices();
    else if(id === 'cancel') startCancel();
    else if(id === 'contact') showContact();
}

/* ------------------ Booking flow ------------------ */
function startBooking(){
    flow.state = 'booking_name';
    flow.buffer = {};
    addBotMessage('Perfecto. Dime tu nombre completo para reservar.');
}

function bookNext(){
    if(flow.state === 'booking_name'){
        const name = (messageInput.value || '').trim();
        if(!name){ addBotMessage('Necesito tu nombre para continuar.'); return; }
        flow.buffer.name = name; addUserMessage(name); messageInput.value = '';
        flow.state = 'booking_service';
        addBotMessage('¿Qué servicio quieres? Elige:');
        showServiceButtons();
    } else if(flow.state === 'booking_service'){
        // service set via button click
    } else if(flow.state === 'booking_datetime'){
        const datetime = (messageInput.value || '').trim();
        if(!datetime){ addBotMessage('Dime la fecha y hora preferida (e.g., 2025-12-01 17:00).'); return; }
        flow.buffer.datetime = datetime; addUserMessage(datetime); messageInput.value = '';
        // check availability via bot
        if(!bot.isAvailable(datetime)){ addBotMessage('Ese horario no está disponible. Dame otra opción.'); return; }
        // confirm via bot
        const cliente = new Cliente(flow.buffer.name, flow.buffer.phone || '');
        const ok = bot.programarCita(cliente, flow.buffer.service, flow.buffer.datetime);
        if(ok){
            addBotMessage(`Cita confirmada para ${flow.buffer.name} - ${flow.buffer.service} el ${flow.buffer.datetime}. Te contactaremos por ${flow.buffer.phone || 'teléfono proporcionado'}.`);
        } else {
            addBotMessage('No se pudo reservar ese horario. Intenta otro.');
        }
        flow.state = 'idle';
        showMenuOptions();
    }
}

function showServiceButtons(){
    clearOptions();
    bot.servicios().forEach(s=>{
        const b=document.createElement('button'); b.textContent = `${s.name} • ${s.duration}m`; b.onclick=()=>{
            flow.buffer.service = s.name; flow.state='booking_phone'; clearOptions(); addBotMessage(`Has elegido ${s.name}. Dime tu teléfono para confirmar.`);
        };
        chatOptions.appendChild(b);
    });
}

function isAvailable(datetime){
    return bot.isAvailable(datetime);
}

/* ------------------ Cancel flow ------------------ */
function startCancel(){
    flow.state='cancel_name'; flow.buffer={}; addBotMessage('Para cancelar, dime tu nombre completo.');
}

function cancelNext(){
    if(flow.state==='cancel_name'){
        const name=(messageInput.value||'').trim(); if(!name){ addBotMessage('Necesito el nombre.'); return; }
        flow.buffer.name=name; addUserMessage(name); messageInput.value=''; flow.state='cancel_phone'; addBotMessage('Ahora dime tu teléfono registrado.');
    } else if(flow.state==='cancel_phone'){
        const phone=(messageInput.value||'').trim(); if(!phone){ addBotMessage('Necesito el teléfono.'); return; }
        addUserMessage(phone); messageInput.value='';
        const ok = bot.cancelarCita(flow.buffer.name, phone);
        if(ok){ addBotMessage('Cita cancelada correctamente.'); }
        else addBotMessage('No encontramos ninguna cita con esos datos.');
        flow.state='idle'; showMenuOptions();
    }
}

/* ------------------ Utilities: hours/services/contact ------------------ */
function showHours(){
    addBotMessage('Horarios disponibles: Lunes-Viernes 09:00 - 20:00. Sábados 09:00 - 15:00');
    showMenuOptions();
}

function listServices(){
    bot.servicios().forEach(s=> addBotMessage(`${s.name} — ${s.duration} min — $${s.price} MXN`));
    showMenuOptions();
}

function showContact(){
    addBotMessage('Tel: +52 1 123 456 7890 • WhatsApp: +52 1 123 456 7890');
    showMenuOptions();
}

/* ------------------ Message UI ------------------ */
function addBotMessage(text){
    const d=document.createElement('div'); d.className='message bot-message'; d.innerHTML=`<strong>AlfaBot:</strong> ${text}`; chatMessages.appendChild(d); scrollChat();
}
function addUserMessage(text){
    const d=document.createElement('div'); d.className='message user-message'; d.innerHTML=`<strong>Tú:</strong> ${text}`; chatMessages.appendChild(d); scrollChat();
}
function scrollChat(){ chatMessages.scrollTop = chatMessages.scrollHeight; }

/* ------------------ Input handling ------------------ */
function sendMessage(){
    const txt = (messageInput.value||'').trim(); if(!txt) return;
    if(flow.state.startsWith('booking') && (flow.state==='booking_name' || flow.state==='booking_datetime' || flow.state==='booking_phone')){
        if(flow.state==='booking_name' || flow.state==='booking_datetime') { addUserMessage(txt); }
        if(flow.state==='booking_name'){
            flow.buffer.name = txt; messageInput.value=''; flow.state='booking_service'; addBotMessage('Selecciona el servicio:'); showServiceButtons(); return;
        }
        if(flow.state==='booking_phone'){
            flow.buffer.phone = txt; messageInput.value=''; flow.state='booking_datetime'; addBotMessage('Dime la fecha y hora preferida (e.g., 2025-12-01 17:00)'); return;
        }
        if(flow.state==='booking_datetime'){
            // handled in bookNext
            bookNext(); return;
        }
    }

    if(flow.state.startsWith('cancel')){ addUserMessage(txt); cancelNext(); return; }

    // generic commands
    addUserMessage(txt);
    const l = txt.toLowerCase();
    if(l.includes('horario') || l.includes('dispon')) showHours();
    else if(l.includes('servicio') || l.includes('precio')) listServices();
    else if(l.includes('reserv') || l.includes('cita')) startBooking();
    else if(l.includes('cancel')) startCancel();
    else addBotMessage('Escribe una opción o usa los botones.');
    messageInput.value='';
}

function handleKeyPress(e){ if(e.key === 'Enter') sendMessage(); }

/* popup handling (service details) */
function showServicesPopup(title, price, img){
    document.getElementById('popupTitle').textContent = title;
    document.getElementById('popupPrice').textContent = price;
    document.getElementById('popupImage').src = img || '';
    document.getElementById('servicePopup').style.display='flex';
}
function closePopup(){ document.getElementById('servicePopup').style.display='none'; }