// Injectable marca esta clase como un servicio que puede ser inyectado en otros componentes o servicios
import { Injectable } from '@angular/core';
// HttpClient permite hacer peticiones HTTP a un servidor backend
import { HttpClient } from '@angular/common/http';
// Observable permite trabajar con datos asincrónicos, como las respuestas HTTP que llegan en el futuro
import { Observable } from 'rxjs';

// Definimos la estructura que debe tener un Contacto en nuestra app
export interface Contact {
  id: number;      // Identificador único del contacto
  name: string;    // Nombre del contacto
  email: string;   // Correo electrónico del contacto
  phone: string;   // Teléfono del contacto
}

// Decorador que indica que este servicio se provee en toda la aplicación (singleton)
@Injectable({ providedIn: 'root' })
export class ContactService {
  // URL base del API donde se gestionan los contactos
  private API = 'http://localhost:3001/contacts';

  // Inyectamos HttpClient para poder hacer peticiones HTTP
  constructor(private http: HttpClient) {}

  // Método para obtener la lista completa de contactos desde el servidor
  // Devuelve un Observable que emitirá un array de Contactos cuando la petición termine
  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.API);
  }

  // Método para crear un nuevo contacto en el servidor
  // Recibe un contacto sin id (porque el backend lo asignará)
  // Devuelve un Observable que emitirá el contacto creado con su id asignado
  create(contact: Omit<Contact, 'id'>): Observable<Contact> {
    return this.http.post<Contact>(this.API, contact);
  }

  // Método para actualizar un contacto existente
  // Recibe un contacto completo con su id
  // Devuelve un Observable que emitirá el contacto actualizado
  update(contact: Contact): Observable<Contact> {
    // Hacemos una petición PUT a la URL con el id del contacto para actualizarlo
    return this.http.put<Contact>(
      `${this.API}/${contact.id}`,  // URL con id del contacto
      contact                      // datos para actualizar
    );
  }
  

  // Método para eliminar un contacto por su id
  // Devuelve un Observable vacío (void) porque no esperamos datos de respuesta
  delete(id: number): Observable<void> {
    // Petición DELETE a la URL con el id del contacto
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
