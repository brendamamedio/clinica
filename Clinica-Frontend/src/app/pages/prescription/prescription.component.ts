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
      numero: [{ value: '', disabled: false }],
      pacienteCpf: ['', Validators.required], // CPF do paciente como string
      doencaCid: ['', Validators.required], // CID da doença
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
          console.log(
            `CPF não definido para a prescrição: ${prescription.numero}`
          );
        } else {
          const paciente = this.pacients.find(
            (p) => p.cpf === prescription.paciente.cpf
          );
          if (paciente) {
            prescription.nomePaciente = paciente.nome;
          } else {
            console.log(
              `Paciente não encontrado para CPF: ${prescription.paciente.cpf}`
            );
          }
        }
      });
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
      pacienteCpf: prescription.paciente.cpf, // Defina o CPF do paciente
      doencaCid: prescription.doenca.cid, // Defina o CID da doença
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

    // Obtém o CPF do paciente selecionado e o CID da doença selecionada
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

    // Associa o CPF ao paciente correto
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

    // Associa o CID à doença correta
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
      pacienteCpf: prescription.paciente.cpf, // Defina o CPF do paciente
      doencaCid: prescription.doenca.cid,     // Defina o CID da doença
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
      const prescription = this.prescriptionForm.getRawValue(); // Obtenha os valores mesmo que o CPF esteja desabilitado
      console.log('Atualizando prescrição:', prescription); // Verifique os dados do paciente
      await this.prescriptionService.updatePrescription(prescription.numero, prescription).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Dados da prescrição atualizados com sucesso',
      });
      this.loadPrescriptions(); // Recarregar a lista após atualização
      this.displayModalEdit = false;
    } catch (error: any) { // Especificando o tipo 'any' para o erro
      console.error('Erro ao atualizar a prescrição:', error); // Log do erro detalhado
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao atualizar a prescrição: ' + (error.message || error),
      });
    }
  }



  // confirmDelete(number: number) {
  //   this.confirmationService.confirm({
  //     message: 'Você tem certeza que deseja deletar esta prescrição?',
  //     accept: () => {
  //       this.onDeletePrescription(number);
  //     },
  //   });
  // }
}
