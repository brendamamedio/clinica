import { Component, OnInit } from '@angular/core';
import { DiseaseService } from '../../services/disease.service';
import { Disease } from '../../models/disease';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class DiseaseComponent implements OnInit {

  diseases: Disease[] = [];
  selectedDisease: Disease = { cid: '', nome: '', descricao: '' };
  error: string | null = null;
  displayModal: boolean = false;
  isNew: boolean = false;

  constructor(
    private diseaseService: DiseaseService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadDiseases();
  }

  async loadDiseases() {
    try {
      const data = await this.diseaseService.getDiseases().toPromise();
      this.diseases = data || [];
    } catch (error) {
      this.error = 'Erro ao carregar doenças';
    }
  }

  async onNewDisease() {
    // Reseta o objeto para novo cadastro antes de qualquer verificação
    this.selectedDisease = { cid: '', nome: '', descricao: '' };
    this.isNew = true;

    // Se o CID não foi preenchido (novo cadastro), abre o modal diretamente
    this.displayModal = true;
  }

  onSelectDisease(disease: Disease) {
    this.selectedDisease = { ...disease };  // Clona o objeto para edição
    this.displayModal = true;  // Abre o modal
    this.isNew = false;
  }

  async onDeleteDisease(cid: string) {
    try {
      await this.diseaseService.deleteDisease(cid).toPromise();
      this.loadDiseases();  // Recarregar a lista após exclusão
      this.messageService.add({ severity: 'success', summary: 'Deletado', detail: 'Doença deletada com sucesso' });
    } catch (error) {
      this.error = 'Erro ao excluir a doença';
    }
  }

  async onSaveDisease() {
    try {
      // Verifica se o CID já existe
      const exists = await this.checkCid(this.selectedDisease.cid);
      if (exists && this.isNew) {
        this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Uma doença com este CID já está cadastrada' });
        return;
      }

      if (this.isNew) {
        await this.addDisease();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro Realizado!' });
      } else {
        await this.updateDisease();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro Atualizado!' });
      }

      this.loadDiseases();  // Recarregar a lista após salvar
      this.displayModal = false;  // Fecha o modal
    } catch (error) {
      this.error = 'Erro ao salvar a doença';
    }
  }

  confirmDelete(cid: string) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar esta doença?',
      accept: () => {
        this.onDeleteDisease(cid);
      }
    });
  }

  async checkCid(cid: string): Promise<boolean> {
    try {
      const disease = await this.diseaseService.getDisease(cid).toPromise();
      return !!disease;
    } catch {
      return false;
    }
  }

  async addDisease() {
    try {
      await this.diseaseService.addDisease(this.selectedDisease).toPromise();
    } catch (error) {
      this.error = 'Erro ao adicionar a doença';
    }
  }

  async updateDisease() {
    try {
      await this.diseaseService.updateDisease(this.selectedDisease.cid, this.selectedDisease).toPromise();
    } catch (error) {
      this.error = 'Erro ao atualizar a doença';
    }
  }
}
