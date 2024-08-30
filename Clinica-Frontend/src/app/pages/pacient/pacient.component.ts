import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Pacient } from '../../models/pacient';
import { PacientService } from '../../services/pacient.service';

@Component({
  selector: 'app-pacient',
  templateUrl: './pacient.component.html',
  styleUrls: ['./pacient.component.scss'],
  providers: [MessageService]
})

export class PacientComponent implements OnInit {
  pacients: Pacient[] = [];
  pacientsInTreatment: Pacient[] = [];
  searchForm!: FormGroup;
  pacientForm!: FormGroup;
  displayModal: boolean = false;
  searchOptions = [
    { label: 'CPF', value: 'cpf' },
    { label: 'Nome', value: 'nome' }
  ];

  constructor(
    private fb: FormBuilder,
    private pacientService: PacientService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForms();
    this.buildPacientForm();
    this.loadPacients();
  }

  handleAddPacient() {
    this.displayModal = true;
    this.buildPacientForm();

  }
  initForms() {
    this.searchForm = this.fb.group({
      searchType: [''],
      searchValue: ['']
    });

  }

  buildPacientForm() {
    this.pacientForm = this.fb.group({
      cpf: [{ value: '', disabled: true }], // CPF desabilitado ao editar
      nome: [''],
      idade: [''],
      endereco: [''],
      telefone: ['']
    });
  }

  loadPacients() {
    this.pacientService.getPacients().subscribe(
      (data: Pacient[]) => {
        this.pacients = data;
        this.filterPacientsInTreatment();
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pacientes' });
      }
    );
  }

  searchPacients(): void {
    this.pacientService.getPacients().subscribe(
      (data: Pacient[]) => { // Recebe um array de Paciente
        this.pacients = data; // Atribui à variável que armazena a lista de pacientes
      },
      error => {
        console.error('Erro ao listar pacientes:', error);
      }
    );
  }

  // private searchPacientsByName(searchValue: string) {
  //   this.pacientService.getPacientByName(searchValue).subscribe(
  //     (data: Pacient[]) => {
  //       this.pacients = data;
  //       this.filterPacientsInTreatment();
  //     },
  //     (error: any) => {
  //       this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar pacientes por nome' });
  //     }
  //   );
  // }

  private searchPacientsByCpfPartial(searchValue: string) {
    this.pacientService.getPacients().subscribe(
      (data: Pacient[]) => {
        this.pacients = this.filterPacientsByCpf(data, searchValue);
        this.filterPacientsInTreatment();
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar pacientes' });
      }
    );
  }

  private filterPacientsByCpf(pacients: Pacient[], cpf: string): Pacient[] {
    return pacients.filter(pacient => pacient.cpf.includes(cpf));
  }

  filterPacientsInTreatment() {
    this.pacientsInTreatment = this.pacients.filter(pacient =>
      pacient.prescriptions && pacient.prescriptions.some(prescription =>
        prescription.status === 'em andamento'
      )
    );
  }

  savePacient() {
    if (this.isEditing()) {
      this.updatePacient();
    } else {
      this.addNewPacient();
    }
  }

  private isUpdating(cpf: string): boolean {
    return this.pacients.some(p => p.cpf === cpf);
  }

  private addNewPacient() {
    const pacientData = this.pacientForm.getRawValue() as Pacient; // Usa getRawValue para obter o CPF mesmo se desabilitado
    this.pacientService.addPacient(pacientData).subscribe(
      () => {
        this.onSuccess('Paciente cadastrado com sucesso');
      },
      (error: any) => {
        this.onError('Erro ao cadastrar paciente');
      }
    );
  }

  private updatePacient() {
    const pacientData = this.pacientForm.getRawValue() as Pacient;
    this.pacientService.updatePacient(pacientData.cpf, pacientData).subscribe(
      () => {
        this.onSuccess('Paciente atualizado com sucesso');
      },
      (error: any) => {
        this.onError('Erro ao atualizar paciente');
      }
    );
  }

  private onSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
    this.loadPacients();
    this.displayModal = false;
  }

  private onError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }

  isEditing(): boolean {
    return this.pacientForm.get('cpf')?.value !== '';
  }

  deletePacient(cpf: string) {
    this.pacientService.deletePacient(cpf).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Paciente excluído com sucesso' });
        this.loadPacients();
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir paciente' });
      }
    );
  }

  onSelectPacient(pacient: Pacient) {
    this.pacientForm.patchValue(pacient);
    this.displayModal = true;
  }
}
