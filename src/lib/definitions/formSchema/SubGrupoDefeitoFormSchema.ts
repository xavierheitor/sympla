import { z } from "zod"

export const SubGrupoDefeitoFormSchema = z.object({
    nome: z.string().min(1),
    grupoDefeitoEquipamentoId: z.number().min(1),
})
