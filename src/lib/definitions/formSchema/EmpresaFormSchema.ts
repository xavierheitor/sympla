import { z } from "zod";

export const EmpresaFormSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, { message: "Nome é obrigatório" }),
    cnpj: z.string().min(1, { message: "CNPJ é obrigatório" }),

})