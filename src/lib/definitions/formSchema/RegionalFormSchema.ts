import z from "zod";

export const RegionalFormSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, { message: "Nome é obrigatório" }),
    empresaId: z
        .number({
            invalid_type_error: "Empresa é obrigatório",
            required_error: "Empresa é obrigatório",
        })
        .int()
        .positive("Empresa é obrigatório"),
});