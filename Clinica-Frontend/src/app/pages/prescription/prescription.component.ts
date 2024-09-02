import { Prescription } from './../../models/prescription';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrescriptionService } from '../../services/prescription.service';
import { Disease } from '../../models/disease';
import { Pacient } from '../../models/pacient';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class PrescriptionComponent implements OnInit {
  prescriptions: Prescription[] = [];
  prescriptionsInTreatment: Prescription[] = [];
  searchForm!: FormGroup;
  prescriptionForm!: FormGroup;
  isNew: boolean = false;
  displayModalEdit: boolean = false;
  displayModalSave: boolean = false;
  searchOptions = [
    { label: 'CPF', value: 'number' },
    { label: 'Nome', value: 'nome' },
  ];

  defaultDisease: Disease = {
    cid: '',
    nome: '',
    descricao: ''
  };

  defaultPacient: Pacient = {
    cpf:'',
    nome: '',
    idade: 0,
    telefone:'',
    endereco: ''
  };

  selectedPrescription: Prescription = {
    numero: 0,
    paciente: this.defaultPacient,
    doenca: this.defaultDisease,
    nomeRemedio: '',
    dataConsulta: new Date(),
    tratamento: '',
    dataRevisao: new Date(),
    status: 'em andamento',
    revisao: false

  };

  error: string | null = null;

  constructor(
    private prescriptionService: PrescriptionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _buildForm: FormBuilder
  ) {}

  ngOnInit() {
    this.loadPrescriptions();
    console.log(this.prescriptions)
    this.buildPrescription();
  }

  buildPrescription() {
    this.prescriptionForm = this._buildForm.group({
      numero: [{ value: '', disabled: true }, Validators.required],
      paciente: ['', Validators.required],
      doenca: ['', Validators.required],
      nomeRemedio: ['', Validators.required],
      dataConsulta: ['', Validators.required],
      tratamento: ['', Validators.required],
      status: ['', Validators.required],
    });
  }


  async loadPrescriptions() {
    try {
      const data = await this.prescriptionService.getPrescriptions().toPromise();
      this.prescriptions = data || [];
    } catch (error) {
      this.error = 'Erro ao carregar prescrições';
    }
  }

  onEditPrescription(prescription: Prescription) {
    this.selectedPrescription = { ...prescription };
    this.displayModalEdit = true;
    this.prescriptionForm.patchValue(prescription);
    this.prescriptionForm.controls['number'].disable();
  }
  onNewPrescription() {
    this.prescriptionForm.reset();
    this.prescriptionForm.controls['cpf'].enable();
    this.displayModalSave = true;
  }

  // async onDeletePrescription(cpf: string) {
  //   try {
  //     await this.prescriptionService.deletePrescription(cpf).toPromise();
  //     this.loadPrescriptions(); // Recarregar a lista após exclusão
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Deletado',
  //       detail: 'Cadastro deletado com sucesso',
  //     });
  //   } catch (error) {
  //     this.error = 'Erro ao excluir a prescrição';
  //   }
  // }


  async onSavePrescription() {
    if (this.prescriptionForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos',
      });
      return;
    }

    try {
      const prescription = this.prescriptionForm.getRawValue();
      const exists = await this.checkNumber(prescription.cpf);
      if (exists) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: 'Este prescrição já possui cadastro',
        });
        return;
      } else {
        await this.prescriptionService.addPrescription(prescription).toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cadastro realizado com sucesso!',
        });
      }

      this.loadPrescriptions();
      this.displayModalSave = false;
    } catch (error) {
      this.error = 'Erro ao salvar a prescrição';
    }
  }


  async onUpdatePrescription() {
    console.log('entrou em update');
    if (this.prescriptionForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos',
      });
      return;
    }
    try {
      const prescription = this.prescriptionForm.getRawValue(); // Obtenha os valores mesmo que o CPF esteja desabilitado
      console.log('Atualizando prescrição:', prescription); // Verifique os dados do prescrição
      await this.prescriptionService.updatePrescription(prescription.number, prescription).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Dados do prescrição atualizados com sucesso',
      });
      this.loadPrescriptions(); // Recarregar a lista após atualização
      this.displayModalEdit = false;
    } catch (error) {
      this.error = 'Erro ao atualizar a prescrição';
    }
  }

  // confirmDelete(number: string) {
  //   console.log('entrou em confirm')
  //   this.confirmationService.confirm({
  //     message: 'Você tem certeza que deseja deletar este prescrição?',
  //     accept: () => {
  //       this.onDeletePrescription(number);
  //     },
  //   });
  // }

  async checkNumber(number: number): Promise<boolean> {
    try {
      const prescription = await this.prescriptionService.getPrescriptionByNumber(number).toPromise();
      return !!prescription; // Retorna true se a prescrição existir
    } catch (error) {
      return false; // Retorna false se a prescrição não for encontrado
    }
  }


  async addPrescription(prescription: Prescription) {
    try {
      await this.prescriptionService.addPrescription(prescription);
    } catch (error) {
      this.error = 'Erro ao adicionar prescrição';
    }
  }

  async updatePrescription(prescription: Prescription) {
    try {
      await this.prescriptionService.updatePrescription(prescription.numero, prescription);
    } catch (error) {
      this.error = 'Erro ao atualizar prescrição';
    }
  }
}
