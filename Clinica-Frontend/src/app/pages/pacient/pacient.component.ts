import { Pacient } from './../../models/pacient';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PacientService } from '../../services/pacient.service';
import { Prescription } from '../../models/prescription';
import { PrescriptionService } from '../../services/prescription.service';

@Component({
  selector: 'app-pacient',
  templateUrl: './pacient.component.html',
  styleUrls: ['./pacient.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class PacientComponent implements OnInit {

  pacients: Pacient[] = [];
  pacientsInTreatment: Pacient[] = [];
  searchForm!: FormGroup;
  pacientForm!: FormGroup;
  isNew: boolean = false;
  displayModalEdit: boolean = false;
  displayModalSave: boolean = false;
  searchOptions = [
    { label: 'CPF', value: 'cpf' },
    { label: 'Nome', value: 'nome' },
  ];
  selectedPacient: Pacient = {
    cpf: '',
    nome: '',
    endereco: '',
    telefone: '',
    idade: 0,
  };
  error: string | null = null;
searchTerm: string = '';

constructor(
    private prescriptionService: PrescriptionService,
    private pacientService: PacientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _buildForm: FormBuilder
  ) {}

  ngOnInit() {
    this.loadPacients();
    this.loadPacientsInTreatment()
    this.buildPacient();
  }

  buildPacient() {
    this.pacientForm = this._buildForm.group({
      cpf: [{ value: '', disabled: true }, Validators.required],
      nome: ['', Validators.required],
      idade: ['', Validators.required],
      endereco: ['', Validators.required],
      telefone: ['', Validators.required],
    });
  }


  async loadPacients() {
    try {
      const data = await this.pacientService.getPacients().toPromise();
      this.pacients = data || [];
    } catch (error) {
      this.error = 'Erro ao carregar pacientes';
    }
  }

  onEditPacient(pacient: Pacient) {
    this.selectedPacient = { ...pacient };
    this.displayModalEdit = true;
    this.pacientForm.patchValue(pacient);
    this.pacientForm.controls['cpf'].disable();
  }
  onNewPacient() {
    this.pacientForm.reset();
    this.pacientForm.controls['cpf'].enable();
    this.displayModalSave = true;
  }

  async onDeletePacient(cpf: string) {
    try {
      await this.pacientService.deletePacient(cpf).toPromise();
      this.loadPacients(); 
      this.messageService.add({
        severity: 'success',
        summary: 'Deletado',
        detail: 'Paciente deletado com sucesso',
      });
    } catch (error) {
      
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível excluir o paciente. Ele pode ter prescrições associadas.',
      });
    }
  }


  async onSavePacient() {
    if (this.pacientForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos',
      });
      return;
    }

    try {
      const pacient = this.pacientForm.getRawValue();
      const exists = await this.checkCpf(pacient.cpf);
      if (exists) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: 'Este paciente já possui cadastro',
        });
        return;
      } else {
        await this.pacientService.addPacient(pacient).toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cadastro realizado com sucesso!',
        });
      }

      this.loadPacients();
      this.displayModalSave = false;
    } catch (error) {
      this.error = 'Erro ao salvar o paciente';
    }
  }


  async onUpdatePacient() {
    console.log('entrou em update');
    if (this.pacientForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos',
      });
      return;
    }
    try {
      const pacient = this.pacientForm.getRawValue(); 
      console.log('Atualizando paciente:', pacient); 
      await this.pacientService.updatePacient(pacient.cpf, pacient).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Dados do paciente atualizados com sucesso',
      });
      this.loadPacients(); 
      this.displayModalEdit = false;
    } catch (error) {
      this.error = 'Erro ao atualizar o paciente';
    }
  }

  confirmDelete(cpf: string) {
    console.log('entrou em confirm')
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar este paciente?',
      accept: () => {
        this.onDeletePacient(cpf);
      },
    });
  }

  async checkCpf(cpf: string): Promise<boolean> {
    try {
      const pacient = await this.pacientService.getPacientByCpf(cpf).toPromise();
      return !!pacient; 
    } catch (error) {
      return false; 
    }
  }


  async addPacient(pacient: Pacient) {
    try {
      await this.pacientService.addPacient(pacient);
    } catch (error) {
      this.error = 'Erro ao adicionar paciente';
    }
  }

  async updatePacient(pacient: Pacient) {
    try {
      await this.pacientService.updatePacient(pacient.cpf, pacient);
    } catch (error) {
      this.error = 'Erro ao atualizar paciente';
    }
  }

  filteredPacients(): any[] {
    if (!this.searchTerm) {
      return this.pacients; 
    }
    return this.pacients.filter(pacients =>
      pacients.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async loadPacientsInTreatment() {
    try {
      const allPrescriptions = await this.prescriptionService.getPrescriptions().toPromise();

      if (!allPrescriptions || allPrescriptions.length === 0) {
        this.pacientsInTreatment = [];
        return; 
      }

      const prescriptionsInTreatment = allPrescriptions.filter(prescription =>
        prescription.status !== 'CONCLUIDA' && new Date(prescription.dataRevisao) > new Date()
      );

      this.pacientsInTreatment = this.getPacientsFromPrescriptions(prescriptionsInTreatment);

    } catch (error) {
      this.error = 'Erro ao carregar pacientes em tratamento';
    }
  }

  getPacientsFromPrescriptions(prescriptions: Prescription[]): Pacient[] {
    const pacientsInTreatment = prescriptions.map(prescription => prescription.paciente);
    return pacientsInTreatment.filter((value, index, self) =>
      index === self.findIndex((t) => t.cpf === value.cpf)
    );
  }
}

