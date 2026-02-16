import { Rol } from "./rol.model";

export class Usuario {
    id: number = 0;
    username: string = "";
    nombres: string = '';
    enabled: boolean = true;
    rol: Rol = new Rol();
}