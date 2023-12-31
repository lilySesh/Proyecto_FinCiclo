import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Niveles } from '../modelo/Niveles';
import { Observable, map } from 'rxjs';
import { NivelesService } from './niveles.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-niveles',
  templateUrl: './niveles.component.html',
  styleUrls: ['./niveles.component.css']
})
export class NivelesComponent {
  constructor(private aprendizajeService:NivelesService){}
  aprendizaje: Niveles[] = []
 
  formAprendizaje: FormGroup = new FormGroup({});

  isupdate: boolean=false;
  selectedItemId: number | undefined;

  ngOnInit(): void{ 
    this.list();
    this.formAprendizaje= new FormGroup({
      id_nivel: new FormControl(''),
      nv_numero_nivel: new FormControl('')
       
       
     });
   }
   
    
   list(){
     this.aprendizajeService.ListarAprendizaje().subscribe(resp=>{
          if(resp){
           this.aprendizaje=resp;
          }
     });
   }
 
   save() {
    this.aprendizajeService.postAprendizaje(this.formAprendizaje.value).subscribe(
      (resp) => {
        if (resp) {
          this.list();
          this.formAprendizaje.reset();
          Swal.fire('Guardado', 'Aprendizaje guardado con éxito', 'success');
        }
      },
      (error) => {
        console.error('Error al guardar el aprendizaje:', error);
        Swal.fire('Error', 'Hubo un problema al guardar el aprendizaje', 'error');
      }
    );
  }
   update() {
    const id = this.selectedItemId;
    const request = {
      id_nivel: id,
      ...this.formAprendizaje.value
    };
  
    this.aprendizajeService.ModificarAprendizaje(request).subscribe(resp => {
      if (resp) {
        this.list();
        this.formAprendizaje.reset();
      }
    });
  }
  
  delete(id: any) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este aprendizaje?',
      text: 'No podrás revertirlo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4361ee',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: true
    }).then((result) => {
      if (result.value) {
        this.aprendizajeService.EliminarAprendizaje(id).subscribe(
          (resp) => {
            if (resp) {
              this.list();
              this.formAprendizaje.reset();
              Swal.fire('Eliminado', 'El aprendizaje ha sido eliminado', 'success');
            }
          },
          (error) => {
            console.error('Error al eliminar el aprendizaje:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el aprendizaje', 'error');
          }
        );
      }
    });
  }
 
   newAprendizaje(){
     this.isupdate=false;
     this.formAprendizaje.reset();
   }
 
   selectItem(item: any){
    this.selectedItemId = item.id_nivel;
     this.isupdate = true;
     this.formAprendizaje.controls['id_nivel'].setValue(item.id_nivel);
     this.formAprendizaje.controls['nv_numero_nivel'].setValue(item.nv_numero_nivel);
 
     }

     
 
  
  
}
