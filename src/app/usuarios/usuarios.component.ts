import { Component,ElementRef, ViewChild ,  ViewEncapsulation } from '@angular/core';
import { Usuarios } from './Usuarios';
import { UsuariosService } from './usuarios.service';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Roles } from './Roles';

@Component({

  
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsuariosComponent {
  
 





  constructor(private usuariosService:UsuariosService){}



 
 













  usuarios: Usuarios[] = []

   /////////////////////////////////////
   selectedRoleId: number=0;

   ///////////////////////////
  roles: Roles[] = [];
/////////////////////////////////////////////////DATOS QUEMADOS PARA NIVEL ACADEMICO
nivelesAcademicos: string[] = ['1° - 3° año de Educación', '4° - 6° año de Educación', '7° - 9° año de Educación', 'Sin especificar'];

/////////////////////////////////////////////////////////
buscarTexto: string = '';
buscarCodigo: number=0;


buscarUsuarios() {
  const textoBusqueda = this.buscarTexto.trim().toLowerCase();

  if (textoBusqueda === '') {
    this.list();
  } else {
    this.usuarios = this.usuarios.filter(usuario =>
      usuario.usu_nombre.toLowerCase().includes(textoBusqueda) ||
      usuario.correo.toLowerCase().includes(textoBusqueda)
    );
  }
}

///////////////////////////////////////////////////////////////
buscarUsuarioPorCodigo() {
  const codigoBusqueda = this.buscarCodigo.toString().trim();

  if (codigoBusqueda === '') {
    this.list();
  } else {
    this.usuarios = this.usuarios.filter(usuario =>
      usuario.id_usuario.toString().includes(codigoBusqueda)
    );
  }
}




  formUsuarios: FormGroup = new FormGroup({});

  isupdate: boolean=false;

    ngOnInit(): void{ 
    
    this.obtenerRoles();
    this.list();
    this.formUsuarios= new FormGroup({
      id_usuario: new FormControl(''),
      usu_nombre: new FormControl(''),
      usu_fecha_nacimiento: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]),
      usu_contra: new FormControl(''),
      correo: new FormControl(''),
      usu_nivelacademico: new FormControl(''),
      id_rol: new FormControl('')
      
      
      
      });
  }

  
  

 obtenerRoles() {
  this.usuariosService.obtenerRoles().subscribe(
    (response: any[]) => {
      this.roles = response; // Asigna la lista de roles a la variable roles en el componente
    },
    (error) => {
      console.log(error);
    }
  );
}


savee() {
  if (this.formUsuarios.valid) {
    const usuario = this.formUsuarios.value;
    //console.log(" id de rol: "+usuario.id_rol);
    const idRol = usuario.id_rol; // Obtén el id_rol del formulario


    // Asigna el id_rol al objeto usuario

    usuario.roles = new Roles(idRol,"admin");
    console.log("despues del rol");


    this.usuariosService.postUsuarios(usuario).subscribe(
      (resp) => {
        this.list();
        this.formUsuarios.reset();
        Swal.fire('Usuario Registrado', 'Usuario registrado con éxito', 'success');
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Ocurrió un error al registrar el usuario', 'error');
      }
    );
  }else {
    Swal.fire('Campos Incompletos', 'Por favor, completa todos los campos obligatorios', 'warning');
    this.formUsuarios.markAllAsTouched();
  }
  this.formUsuarios.get('usu_contra')?.enable();
}

editar() {
  if (this.formUsuarios.valid) {
    const usuario = this.formUsuarios.value;
    //console.log(" id de rol: "+usuario.id_rol);
    const idRol = usuario.id_rol; // Obtén el id_rol del formulario


    // Asigna el id_rol al objeto usuario

   



    this.usuariosService.ModificarUser(usuario).subscribe(
      (resp) => {
        this.list();
        this.formUsuarios.reset();
        Swal.fire('Usuario Registrado', 'Usuario registrado con éxito', 'success');
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Ocurrió un error al registrar el usuario', 'error');
      }
    );
  }else {
    Swal.fire('Campos Incompletos', 'Por favor, completa todos los campos obligatorios', 'warning');
    this.formUsuarios.markAllAsTouched();
  }
}

  list(){
    this.usuariosService.ListarUsuarios().subscribe(resp=>{
         if(resp){
          this.usuarios=resp;
         }
    });
  }

 


  update() {

    if (this.formUsuarios.valid) {
      const usuario = this.formUsuarios.value;
      const idRol = usuario.id_rol;
  

      // Crea un objeto Roles con el id_rol seleccionado y un valor de rol temporal ("admin" en este caso)
      const selectedRole: Roles = new Roles(idRol, "admin");

  
      // Asigna el objeto de rol seleccionado al objeto usuario
      usuario.roles = selectedRole;
  
      // Obtiene el ID del usuario que se está actualizando
      const userId = this.formUsuarios.controls['id_usuario'].value;
  
      // Realiza el update llamando al servicio correspondiente
      this.usuariosService.updateUsuario(userId, usuario).subscribe(
        (resp) => {

      // ... Rest of the code ...
  
    

          this.list();
          this.formUsuarios.reset();
          Swal.fire('Usuario Actualizado', 'Usuario actualizado con éxito', 'success');
        },
        (error) => {

          // Error handling

          console.log(error);
          Swal.fire('Error', 'Ocurrió un error al actualizar el usuario', 'error');
        }
      );
    } else {
      Swal.fire('Campos Incompletos', 'Por favor, completa todos los campos obligatorios', 'warning');
    }
  }
 
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////



  eliminarUsuario(id: any) {
    Swal.fire({
      title: '¿Estas seguro de eliminar este usuario?',
      text: "No podras revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4361ee',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: true
    }).then((result) => {
      if (result.value) {
        this.usuariosService.EliminarUsuarios(id).subscribe(
          usuarios => {
            this.usuariosService.getUsuarios().subscribe(
              response => this.usuarios = response
            )
            Swal.fire(
              'Eliminado!',
              'El usuario ha sido eliminado'
            )
          })
      }
    })
  }




 

  newUsuario(){
    this.isupdate=false;
    this.formUsuarios.reset();
  }

  selectItem(item: any){
    this.isupdate = true;
    this.formUsuarios.controls['id_usuario'].setValue(item.id_usuario);
    this.formUsuarios.controls['usu_nombre'].setValue(item.usu_nombre);
    this.formUsuarios.controls['usu_fecha_nacimiento'].setValue(item.usu_fecha_nacimiento);
    this.formUsuarios.controls['usu_contra'].setValue(item.usu_contra);
    this.formUsuarios.controls['correo'].setValue(item.correo);

  


    this.formUsuarios.controls['usu_nivelacademico'].setValue(item.usu_nivelacademico);
    this.formUsuarios.controls['id_rol'].setValue(item.roles.id_rol); // Asignar el valor del ID del rol seleccionado
   

     // Deshabilitar el campo de contraseña para edición
     this.formUsuarios.get('usu_contra')?.disable();

  }

}
