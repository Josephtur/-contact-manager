// Importamos lo necesario para crear el componente, formularios reactivos y comunicación con el servicio
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ContactService, Contact } from '../../services/contact.service';

@Component({
  selector: 'app-contact-form',                            // Nombre del selector para usar el componente
  standalone: true,                                        // Componente independiente (sin módulo)
  imports: [                                               // Módulos que se necesitan dentro del HTML del componente
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './contact-form.component.html',            // Archivo HTML asociado
  styleUrls: ['./contact-form.component.css']              // Archivo CSS asociado
})
export class ContactFormComponent implements OnChanges {   // Implementa OnChanges para reaccionar a cambios en @Input

  // Recibe el contacto a editar desde el componente padre
  @Input() editContact?: Contact;

  // Eventos que se emiten cuando se crea, actualiza o cancela el formulario
  @Output() created = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  // Definimos el formulario reactivo con sus campos y validaciones
  form = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone: new FormControl<string>('', Validators.required)
  });

  constructor(private svc: ContactService) {} // Inyectamos el servicio que maneja las llamadas HTTP

  // Método que se ejecuta automáticamente si cambia el valor del @Input editContact
  ngOnChanges(changes: SimpleChanges) {
    // Si se detecta un cambio en editContact y tiene datos, se actualiza el formulario
    if (changes['editContact'] && this.editContact) {
      this.form.patchValue({
        id: this.editContact.id,       // Carga los datos en el formulario
        name: this.editContact.name,
        email: this.editContact.email,
        phone: this.editContact.phone
      });
    }
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit() {
    // Si el formulario no es válido, no hacemos nada
    if (this.form.invalid) return;

    // Obtenemos los valores del formulario
    const id = this.form.get('id')!.value as number | null;
    const name  = this.form.get('name')!.value as string;
    const email = this.form.get('email')!.value as string;
    const phone = this.form.get('phone')!.value as string;

    // Si hay ID, actualizamos un contacto existente
    if (id) {
      this.svc.update({ id, name, email, phone })
        .subscribe(() => this.resetAndEmitUpdated());
    } else {
      // Si no hay ID, es un nuevo contacto
      this.svc.create({ name, email, phone })
        .subscribe(() => this.resetAndEmitCreated());
    }
  }

  // Resetea el formulario y emite evento de creación
  private resetAndEmitCreated() {
    this.form.reset({ id: null, name: '', email: '', phone: '' });
    this.created.emit(); // Notificamos al componente padre
  }

  // Resetea el formulario y emite evento de actualización
  private resetAndEmitUpdated() {
    this.form.reset({ id: null, name: '', email: '', phone: '' });
    this.updated.emit(); // Notificamos al componente padre
  }

  // Cuando se cancela el formulario
  onCancel() {
    this.form.reset({ id: null, name: '', email: '', phone: '' });
    this.canceled.emit(); // Notificamos al componente padre que se canceló
  }
}
