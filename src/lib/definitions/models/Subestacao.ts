import { Regional } from "./Regional";

export type PropriedadeSubestacao = "PROPRIA" | "COMPARTILHADA";
export type CategoriaSubestacao =
  | "DISTRIBUICAO"
  | "SUBTRANSMISSAO"
  | "TRANSMISSAO";
export type TipoSubestacao = "MT" | "AT";
export type TensaoSubestacao = "KV_34" | "KV_69" | "KV_138" | "KV_230";
export type StatusSubestacao = "ATIVA" | "INATIVA" | "EM_MANUTENCAO";

export interface Subestacao {
  id?: number;
  nome: string;
  sigla: string;
  localSAP: string;

  propriedade: PropriedadeSubestacao;
  tipo: TipoSubestacao;
  categoria: CategoriaSubestacao;
  tensao: TensaoSubestacao;
  status: StatusSubestacao;

  regionalId: number;
  regional?: Regional;
}
