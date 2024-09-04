export class Prescription {
  numero: number;
  paciente: {
    cpf: string;
    nome: string;
    idade: number;
    endereco: string;
    telefone: string;
  };
  doenca: {
    cid: string;
    nome: string;
    descricao: string;
  };
  nomeRemedio: string;
  dataConsulta: string;
  dataRevisao: string;
  status: string;
  tratamento: string;
  nomePaciente?: string;

  constructor() {
    this.numero = 0;
    this.paciente = {
      cpf: '',
      nome: '',
      idade: 0,
      endereco: '',
      telefone: ''
    };
    this.doenca = {
      cid: '',
      nome: '',
      descricao: ''
    };
    this.nomeRemedio = '';
    this.dataConsulta = '';
    this.dataRevisao = '';
    this.status = '';
    this.tratamento = '';
  }
}
