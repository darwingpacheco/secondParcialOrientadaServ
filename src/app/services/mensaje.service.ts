import { Injectable } from '@angular/core';
import { MensajeInterface } from '../interfaces/mensaje-interface';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {



  mensaje :MensajeInterface[]= [];
  constructor() { }

  addMensaje(msn: string, au:string){

    
    this.mensaje.push({mensaje: msn, autor: au});


  }





}

