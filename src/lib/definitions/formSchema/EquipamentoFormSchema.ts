import { z } from "zod";

export const EquipamentoFormSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, { message: "Nome é obrigatório" }),
    subestacaoId: z.number().int().positive("Subestação é obrigatório"),
});