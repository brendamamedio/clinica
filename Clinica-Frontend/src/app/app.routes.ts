import { Routes } from '@angular/router';
import { PacientComponent } from './pages/pacient/pacient.component';
import { DiseaseComponent } from './pages/disease/disease.component';
import { PrescriptionComponent } from './pages/prescription/prescription.component';  // Importando PrescriptionComponent
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'pacients', component: PacientComponent },
      { path: 'diseases', component: DiseaseComponent },  // Corrigido para 'diseases'
      { path: 'prescriptions', component: PrescriptionComponent },  // Adicionado para prescrições
      { path: '', redirectTo: 'pacients', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
