import { z } from "zod";

export const GrupoDefeitoEquipamentoFormSchema = z.object({
    equipamento: z.string().min(1),
    grupoDeDefeitosId: z.number().min(1),
});
