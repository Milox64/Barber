export class Citas {
    constructor(){
        this.lista = [];
    }

    agendar(cliente, servicio, fechaHora){
        // verificación básica: no agendar si ya existe la misma fecha/hora
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
        // devuelve copia
        return this.lista.map(x => ({ ...x }));
    }

    buscarPorCliente(nombre){
        return this.lista.filter(c => c.cliente.nombre.toLowerCase().includes(nombre.toLowerCase()));
    }
}
