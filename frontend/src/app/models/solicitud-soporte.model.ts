import { Estado } from "./estado";
import { Prioridad } from "./prioridad";
import { Usuario } from "./usuario.model";

export class SolicitudSoporte {
    id: number = 0;
    titulo: string = "";
    descripcion: string = "";
    prioridad: Prioridad = Prioridad.MEDIA;
    estado: Estado = Estado.NUEVO;
    solicitanteUser: Usuario = new Usuario(); 
    fechaCreacion: string = "";  
    fechaActualizacion: string = ""; 
}