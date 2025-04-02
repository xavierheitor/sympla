import { Empresa } from "./Empresa";

export interface Regional {
    id?: number;
    nome: string;
    empresaId: number;
    empresa?:  Empresa
}