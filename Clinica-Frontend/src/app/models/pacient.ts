import { Prescription } from './prescription';

export interface Pacient {
  cpf: string;
  nome: string;
  idade: number;
  endereco: string;
  telefone: string;
  prescriptions?: Prescription[]; // Lista opcional de prescrições associadas ao paciente
  revisao?: boolean; // Propriedade opcional que indica se a revisão foi realizada
}
