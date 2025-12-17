// Servicios.js - lista de servicios y helpers
export const serviciosList = [
    { name: 'Fade Clásico', price: 500, duration: 45 },
    { name: 'Corte + Barba Premium', price: 850, duration: 70 },
    { name: 'Afeitado Clásico', price: 400, duration: 30 }
];

export function listarServicios(){
    return serviciosList.map(s => `${s.name} — ${s.duration} min — $${s.price} MXN`).join('\n');
}
