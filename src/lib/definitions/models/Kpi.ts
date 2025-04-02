import { TipoManutencao } from "./TipoManutencao"

export interface Kpi {
    id: number
    nome: string
    descricao: string
    tipoManutencaoId: number
    tipoManutencao?: TipoManutencao
}
