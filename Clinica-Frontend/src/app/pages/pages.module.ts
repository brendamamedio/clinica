import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importe ReactiveFormsModule aqui
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card'; // Importar o módulo do p-card
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ComponentsModule } from '../components/components.module';
import { DiseaseComponent } from './disease/disease.component';
import { PacientComponent } from './pacient/pacient.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmationService } from 'primeng/api';


@NgModule({
  declarations: [DiseaseComponent, PacientComponent, PrescriptionComponent,],
  imports: [
    ComponentsModule,
    CalendarModule,
    FormsModule,
    AccordionModule,
    DialogModule,
    ConfirmDialogModule,
    TabViewModule,
    CommonModule,
    ButtonModule,
    MenuModule,
    TableModule,
    ToastModule,
    TagModule,
    DropdownModule,
    InputTextModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    CardModule,
    FieldsetModule,
  ],
  providers: [MessageService, ConfirmationService]
})
export class PagesModule {}
