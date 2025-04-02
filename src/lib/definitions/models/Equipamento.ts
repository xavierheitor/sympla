import { Subestacao } from "./Subestacao"

export interface Equipamento {
    id: number
    nome: string
    subestacaoId: number
    subestacao?: Subestacao
}
