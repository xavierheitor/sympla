import { GrupoDeDefeito } from "./GrupoDeDefeito";

export interface GrupoDefeitoEquipamento {
    id?: number;
    equipamento: string;
    grupoDeDefeitosId: number;
    grupoDeDefeitos?: GrupoDeDefeito;
}