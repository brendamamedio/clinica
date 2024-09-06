import { Prescription } from './../../models/prescription';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrescriptionService } from '../../services/prescription.service';
import { Disease } from '../../models/disease';
import { Pacient } from '../../models/pacient';
import { PacientService } from '../../services/pacient.service';
import { DiseaseService } from '../../services/disease.service';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class PrescriptionComponent implements OnInit {


  prescriptions: Prescription[] = [];
  selectedPrescription!: Prescription;
  error: string | null = null;
  displayModal: boolean = false;
  isNew: boolean = false;

  prescriptionForm!: FormGroup;
  pacients: Pacient[] = [];
  diseases: Disease[] = [];
  displayModalEdit: any;
  displayModalRelatorio: any;
searchTerm: string='';

  constructor(
    private prescriptionService: PrescriptionService,
    private pacientService: PacientService,
    private diseaseService: DiseaseService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadPacientes();
    this.loadDoencas();
    this.loadPrescriptions();
  }

  buildForm() {
    this.prescriptionForm = this.fb.group({
      pacienteCpf: ['', Validators.required],
      doencaCid: ['', Validators.required],
      nomeRemedio: ['', Validators.required],
      dataConsulta: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  async loadPrescriptions() {
    try {
        const data = await this.prescriptionService
            .getPrescriptions()
            .toPromise();
        console.log('Prescrições carregadas:', data);
        this.prescriptions = data || [];

        this.prescriptions.forEach((prescription) => {
            console.log('Processando prescrição:', prescription);
            if (!prescription.paciente || !prescription.paciente.cpf) {
                console.log(`CPF não definido para a prescrição: ${prescription.numero}`);
            } else {
                const paciente = this.pacients.find(
                    (p) => p.cpf === prescription.paciente.cpf
                );
                if (paciente) {
                    prescription.nomePaciente = paciente.nome;
                } else {
                    console.log(`Paciente não encontrado para CPF: ${prescription.paciente.cpf}`);
                }
            }
        });

        // Filtragem final para remover prescrições sem paciente válido
        this.prescriptions = this.prescriptions.filter(prescription => prescription.paciente && prescription.paciente.cpf);
    } catch (error) {
        this.error = 'Erro ao carregar prescrições';
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: this.error,
        });
    }
}

  loadPacientes() {
    this.pacientService.getPacients().subscribe(
      (data: Pacient[]) => {
        this.pacients = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar pacientes',
        });
      }
    );
  }

  loadDoencas() {
    this.diseaseService.getDiseases().subscribe(
      (data: Disease[]) => {
        this.diseases = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar pacientes',
        });
      }
    );
  }

  onNewPrescription() {
    this.prescriptionForm.reset();
    this.isNew = true;
    this.displayModal = true;
  }

  onSelectPrescription(prescription: Prescription) {
    this.selectedPrescription = { ...prescription };
    this.prescriptionForm.patchValue({
      numero: prescription.numero,
      pacienteCpf: prescription.paciente.cpf, 
      doencaCid: prescription.doenca.cid,
      nomeRemedio: prescription.nomeRemedio,
      dataConsulta: prescription.dataConsulta,
      status: prescription.status,
    });
    this.isNew = false;
    this.displayModal = true;
  }


  async onSavePrescription() {
    if (this.prescriptionForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos',
      });
      return;
    }

    const pacienteCpf = this.prescriptionForm.get('pacienteCpf')?.value;
    const diseaseCid = this.prescriptionForm.get('doencaCid')?.value;

    if (!pacienteCpf) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Paciente não foi selecionado',
      });
      return;
    }

    const pacienteSelecionado = this.pacients.find(
      (p) => p.cpf === pacienteCpf
    );
    if (!pacienteSelecionado) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Paciente selecionado não encontrado',
      });
      return;
    }

    if (!diseaseCid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Doença não foi selecionada',
      });
      return;
    }

    const doencaSelecionada = this.diseases.find((d) => d.cid === diseaseCid);
    if (!doencaSelecionada) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Doença selecionada não encontrada',
      });
      return;
    }

    try {
      const prescription = this.prescriptionForm.getRawValue();
      prescription.paciente = pacienteSelecionado;
      prescription.doenca = doencaSelecionada;

      if (this.isNew) {
        await this.prescriptionService
          .addPrescription(prescription)
          .toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Prescrição cadastrada com sucesso!',
        });
      } else {
        await this.prescriptionService
          .updatePrescription(prescription.number, prescription)
          .toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Prescrição atualizada com sucesso!',
        });
      }

      this.loadPrescriptions();
      this.displayModal = false;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.error = 'Erro ao salvar a prescrição: ' + error.message;
      } else {
        this.error =
          'Erro ao salvar a prescrição: Ocorreu um erro desconhecido';
      }
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: this.error,
      });
    }
  }

  onEditPrescription(prescription: Prescription) {
    this.selectedPrescription = { ...prescription };
    this.prescriptionForm.patchValue({
      numero: prescription.numero,
      pacienteCpf: prescription.paciente.cpf, 
      doencaCid: prescription.doenca.cid,     
      nomeRemedio: prescription.nomeRemedio,
      dataConsulta: prescription.dataConsulta,
      status: prescription.status
    });
    this.displayModalEdit = true;
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
      const prescription = this.prescriptionForm.getRawValue();
      console.log('Atualizando prescrição:', prescription); 
      await this.prescriptionService.updatePrescription(prescription.numero, prescription).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Dados da prescrição atualizados com sucesso',
      });
      this.loadPrescriptions(); 
      this.displayModalEdit = false;
    } catch (error: any) { 
      console.error('Erro ao atualizar a prescrição:', error); 
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao atualizar a prescrição: ' + (error.message || error),
      });
    }
  }

  filteredPrescriptions(): any[] {
    if (!this.searchTerm) {
      return this.prescriptions; 
    }

    return this.prescriptions.filter(prescription =>
      prescription.paciente &&
      prescription.paciente.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewPrescription(prescription: any) {
    this.selectedPrescription = prescription;
    this.displayModalRelatorio = true;
  }
}
