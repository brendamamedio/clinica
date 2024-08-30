import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Prescription } from '../../models/prescription';
import { PrescriptionService } from '../../services/prescription.service';
import { Disease } from '../../models/disease';
import { Pacient } from '../../models/pacient';
import { PacientService } from '../../services/pacient.service';
import { DiseaseService } from '../../services/disease.service';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
  providers: [MessageService]
})
export class PrescriptionComponent implements OnInit {
  prescriptions: Prescription[] = [];
  patients: Pacient[] = [];
  diseases: Disease[] = [];
  prescriptionForm!: FormGroup;
  displayModal: boolean = false;
  statusOptions = [
    { label: 'Em andamento', value: 'em andamento' },
    { label: 'Concluída', value: 'concluída' },
    { label: 'Atrasada', value: 'atrasada' }
  ];

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private pacientService: PacientService,
    private diseaseService: DiseaseService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadPrescriptions();
    this.loadPatients();
    this.loadDisease();
  }

  initForm() {
    this.prescriptionForm = this.fb.group({
      numero: ['', Validators.required],
      paciente: ['', Validators.required],
      doenca: ['', Validators.required],
      nomeRemedio: ['', Validators.required],
      dataConsulta: ['', Validators.required],
      tratamento: [{ value: '', disabled: true }, Validators.required],
      dataRevisao: [{ value: '', disabled: true }, Validators.required],
      status: ['em andamento', Validators.required]
    });
  }



  onNewPrescription() {
    this.prescriptionForm.reset();
    this.prescriptionForm.patchValue({ status: 'em andamento' });
    this.displayModal = true;
  }

  savePrescription() {
    if (this.prescriptionForm.valid) {
      this.calculateTreatmentAndRevision();
      const prescription = this.prescriptionForm.getRawValue() as Prescription; // getRawValue to include disabled fields
      this.prescriptionService.addPrescription(prescription).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Prescrição salva com sucesso' });
          this.loadPrescriptions();
          this.displayModal = false;
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar prescrição' });
        }
      );
    }
  }

  concludePrescription(numero: string) {
    this.prescriptionService.concludePrescription(numero).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Prescrição concluída com sucesso' });
        this.loadPrescriptions();
      },
      () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao concluir prescrição' });
      }
    );
  }

  calculateTreatmentAndRevision() {
    const dataConsulta = new Date(this.prescriptionForm.get('dataConsulta')?.value);
    const idadePaciente = this.getPacienteAge(this.prescriptionForm.get('paciente')?.value);

    let tratamento = '';
    if (idadePaciente < 10) {
      tratamento = 'Medicação 1 vez ao dia';
    } else if (idadePaciente >= 11 && idadePaciente <= 40) {
      tratamento = 'Medicação 2 vezes ao dia';
    } else if (idadePaciente >= 41 && idadePaciente <= 60) {
      tratamento = 'Medicação 3 vezes ao dia';
    } else {
      tratamento = 'Medicação 1 vez ao dia';
    }

    const dataRevisao = new Date(dataConsulta);
    dataRevisao.setDate(dataRevisao.getDate() + 30);

    this.prescriptionForm.patchValue({
      tratamento: tratamento,
      dataRevisao: dataRevisao
    });
  }

  getPacienteAge(pacienteId: string): number {
    // Substitua isso pela lógica real para obter a idade do paciente
    return 30; // Exemplo de idade
  }

  onDialogHide() {
    this.prescriptionForm.reset();
  }

  loadPatients() {
    this.pacientService.getPacients().subscribe(
      (data: Pacient[]) => {
        console.log(data)
        this.patients = data;
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pacientes' });
      }
    );
  }

  loadDisease() {
    this.diseaseService.getDiseases().subscribe(
      (data: Disease[]) => {
        this.diseases = data;
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar doenças' });
      }
    );
  }

  loadPrescriptions() {
    this.prescriptionService.getPrescriptions().subscribe(
      data => {
        this.prescriptions = data;
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar prescrições' });
      }
    );
  }

}
