// MachoAlfaBot.js - orquestador del flujo conversacional en JS (módulo ES)
import { Citas } from './Citas.js';
import { listarServicios, serviciosList } from './Servicios.js';

export class MachoAlfaBot {
    constructor(){
        this.citas = new Citas();
    }

    bienvenida(){
        return '¿En qué puedo ayudarte? Puedes: Programar cita, Consultar horarios, Ver servicios, Cancelar cita o Contacto.';
    }

    listarServicios(){
        return listarServicios();
    }

    programarCita(cliente, servicio, fechaHora){
        return this.citas.agendar(cliente, servicio, fechaHora);
    }

    cancelarCita(nombre, telefono){
        return this.citas.cancelar(nombre, telefono);
    }

    horariosDisponibles(){
        return 'Lunes-Viernes 09:00 - 20:00. Sábados 09:00 - 15:00.';
    }

    servicios(){
        return serviciosList;
    }

    // Comprueba si un horario está disponible
    isAvailable(fechaHora){
        const lista = this.citas.listar();
        return !lista.some(c => c.fechaHora === fechaHora);
    }

    listarCitas(){
        return this.citas.listar();
    }
}
