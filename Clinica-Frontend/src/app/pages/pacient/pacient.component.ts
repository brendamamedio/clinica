import { Pacient } from './../../models/pacient';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PacientService } from '../../services/pacient.service';

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

  constructor(
    private pacientService: PacientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _buildForm: FormBuilder
  ) {}

  ngOnInit() {
    this.loadPacients();
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
      this.loadPacients(); // Recarregar a lista após exclusão
      this.messageService.add({
        severity: 'success',
        summary: 'Deletado',
        detail: 'Cadastro deletado com sucesso',
      });
    } catch (error) {
      this.error = 'Erro ao excluir o paciente';
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
      const pacient = this.pacientForm.getRawValue(); // Obtenha os valores mesmo que o CPF esteja desabilitado
      console.log('Atualizando paciente:', pacient); // Verifique os dados do paciente
      await this.pacientService.updatePacient(pacient.cpf, pacient).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Dados do paciente atualizados com sucesso',
      });
      this.loadPacients(); // Recarregar a lista após atualização
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
      return !!pacient; // Retorna true se o paciente existir
    } catch (error) {
      return false; // Retorna false se o paciente não for encontrado
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
}
