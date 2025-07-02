// Importamos Component y OnInit desde Angular
import { Component, OnInit, signal } from '@angular/core';

// Módulo común (ngIf, ngFor, etc.)
import { CommonModule } from '@angular/common';

// Módulos de PrimeNG: tabla y botones
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

// Servicio que gestiona los datos de contactos
import { ContactService, Contact } from '../../services/contact.service';

// Componente de formulario para crear o editar un contacto
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-contact-list', // Selector que se usa en HTML
  standalone: true,             // Componente standalone (sin módulo)
  imports: [CommonModule, TableModule, ButtonModule, ContactFormComponent], // Módulos usados
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
// Implementamos la interfaz OnInit para usar el método ngOnInit()
export class ContactListComponent implements OnInit {
  // Signal para almacenar la lista de contactos
  contacts = signal<Contact[]>([]);

  // Signal que indica si estamos editando un contacto (o creando uno nuevo)
  editing = signal<Contact | undefined>(undefined);

  // Constructor: se ejecuta al crear la instancia del componente
  // Ideal para inyectar servicios, como ContactService
  constructor(private svc: ContactService) {}

  // ngOnInit(): método del ciclo de vida de Angular
  // Se ejecuta una sola vez después de que se inicializa el componente
  // Aquí solemos cargar datos desde el backend o inicializar variables
  ngOnInit() {
    this.load(); // Cargamos los contactos al iniciar el componente
  }

  // Método para cargar todos los contactos desde el servicio
  load() {
    this.svc.getAll().subscribe(list => {
      console.log('[DEBUG] contacts loaded:', list); // Debug en consola
      this.contacts.set(list); // Guardamos los contactos en el signal
    });
  }

  // Método que se llama al hacer clic en "Editar"
  onEdit(contact: Contact) {
    this.editing.set(contact); // Establece el contacto actual como el que se está editando
  }

  // Método que se llama al hacer clic en "Nuevo Contacto"
  newContact() {
    // Creamos un nuevo objeto vacío (con campos vacíos)
    this.editing.set({ id: undefined!, name: '', email: '', phone: '' });
  }

  // Método que se ejecuta después de crear, actualizar o cancelar el formulario
  onSaved() {
    this.editing.set(undefined); // Ocultamos el formulario
    this.load();                 // Recargamos la lista actualizada
  }

  // Método para eliminar un contacto
  delete(id: number | null) {
    // Validamos que el ID no sea null o undefined
    if (id == null) {
      console.warn('[DEBUG] delete() aborted: id is null or undefined');
      return; // Salimos si el ID no es válido
    }

    // Mostramos un cuadro de confirmación antes de borrar
    if (confirm('¿Borrar contacto?')) {
      // Llamamos al servicio para eliminar el contacto
      this.svc.delete(id).subscribe({
        next: () => this.load(), // Si todo va bien, recargamos la lista
        error: err => console.error('[DEBUG] delete() error =', err) // Si hay error, lo mostramos
      });
    }
  }
}
