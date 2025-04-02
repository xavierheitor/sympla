import { z } from 'zod'

export const KpiFormSchema = z.object({
    nome: z.string().min(1),
    descricao: z.string().min(1),
    tipoManutencaoId: z.number().min(1),
})