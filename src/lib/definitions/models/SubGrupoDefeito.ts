import { GrupoDefeitoEquipamento } from "./GrupoDefeitoEquipamento"

export interface SubGrupoDefeito {
    id?: number
    nome: string
    grupoDefeitoEquipamentoId: number
    grupoDefeitoEquipamento?: GrupoDefeitoEquipamento
}