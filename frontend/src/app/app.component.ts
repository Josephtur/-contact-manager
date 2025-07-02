// src/app/app.component.ts
import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ContactListComponent } from './components/contact-list/contact-list.component';


@Component({
  selector: 'app-root',
  imports: [
    ButtonModule,
    RouterOutlet,
    ContactListComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  //Usamos 'viewChild' para obtener la referecia al componente 'ContactlISTComponent' desde el HTML
  @ViewChild(ContactListComponent) listCmp!: ContactListComponent;
}

  //Metodo que se puede llamar cuando se crea un contacto
  // Recarga la lista de contactos