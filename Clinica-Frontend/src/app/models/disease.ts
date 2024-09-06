import { Prescription } from "./prescription";

export interface Disease {
  cid: string;
  nome: string;
  descricao: string;
  prescriptions?: Prescription[];
}
