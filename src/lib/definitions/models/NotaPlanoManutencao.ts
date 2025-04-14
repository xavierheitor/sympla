import { Equipamento } from "./Equipamento";
import { Kpi } from "./Kpi";
import { Subestacao } from "./Subestacao";
import { TipoManutencao } from "./TipoManutencao";

export type StatusNota =
  | "PENDENTE"
  | "PROGRAMADO"
  | "EXECUTADO"
  | "BAIXADO_NO_SAP";
export type TipoNota = "AA" | "TS" | "RSF";

export interface NotaPlanoManutencao {
  id?: number;
  nome: string;
  numeroSAP?: string;
  status: StatusNota;
  tipoNota: TipoNota;
  subestacaoId: number;
  subestacao?: Subestacao;
  equipamentoId: number;
  equipamento?: Equipamento;
  tipoManutencaoId: number;
  tipoManutencao?: TipoManutencao;
  kpiId: number;
  kpi?: Kpi;
}
