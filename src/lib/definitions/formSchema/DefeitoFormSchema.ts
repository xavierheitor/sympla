import { PrioridadeDefeito } from "@prisma/client";
import { z } from "zod";

export const DefeitoFormSchema = z.object({
    nome: z.string().min(1),
    descricao: z.string().min(1),
    codigoSAP: z.string().min(1),
    prioridade: z.nativeEnum(PrioridadeDefeito),
    subGrupoDefeitosId: z.number().min(1),
    grupoDefeitosEquipamentoId: z.number().min(1),
})