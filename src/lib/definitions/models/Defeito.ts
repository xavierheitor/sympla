import { SubGrupoDefeito } from "./SubGrupoDefeito";
import { GrupoDefeitoEquipamento } from "./GrupoDefeitoEquipamento";
import { PrioridadeDefeito } from "@prisma/client";

export interface Defeito {
    id?: number;
    nome: string;
    descricao: string;
    codigoSAP: string;
    prioridade: PrioridadeDefeito;
    subGrupoDefeitosId: number;
    subGrupoDefeitos?: SubGrupoDefeito;
    grupoDefeitosEquipamentoId: number;
    grupoDefeitosEquipamento?: GrupoDefeitoEquipamento;
}
