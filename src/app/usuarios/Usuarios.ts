import { Jugador } from "../modelo/Jugador";
import { Roles } from "./Roles";

export class Usuarios{
    id_usuario:number=0;
    usu_nombre:String="";
    usu_contra:String="";
    correo:String="";
    usu_nivelacademico:String="";
    roles: Roles; 
    
<<<<<<< HEAD
    jugador?: Jugador;
     usuarios: any;
=======
  
>>>>>>> bda46023378c037a51646c709ad93d0fb29b4e9e
    Usuarios(){}

    constructor() {
        this.roles = new Roles(1, "ADMINISTRADOR");
        // Inicializa la propiedad 'roles' como una instancia de la clase 'Roles'
      }
   
}
    