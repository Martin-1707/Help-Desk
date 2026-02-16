import { Prioridad } from "./prioridad";

export class SolicitudCreateUpadteDTO {
    titulo: string = '';
    descripcion: string = '';
    prioridad: Prioridad = Prioridad.MEDIA;
    solicitanteId?: number;
}