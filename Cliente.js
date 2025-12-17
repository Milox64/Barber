export class Cliente {
    constructor(nombre, telefono){
        this.nombre = nombre || '';
        this.telefono = telefono || '';
    }

    toString(){
        return `${this.nombre} (${this.telefono})`;
    }
}
