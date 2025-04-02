import z from "zod";

export const SubestacaoFormSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, { message: "Nome é obrigatório" }),
    sigla: z.string().min(1, { message: "Sigla é obrigatória" }),
    localSAP: z.string().min(1, { message: "Local SAP é obrigatório" }),

    propriedade: z.nativeEnum({
        PROPRIA: "PROPRIA",
        COMPARTILHADA: "COMPARTILHADA",
    }, { message: "Propriedade inválida" }),

    tipo: z.nativeEnum({
        MT: "MT",
        AT: "AT",
    }, { message: "Tipo inválido" }),

    categoria: z.nativeEnum({
        DISTRIBUICAO: "DISTRIBUICAO",
        SUBTRANSMISSAO: "SUBTRANSMISSAO",
        TRANSMISSAO: "TRANSMISSAO",
    }, { message: "Categoria inválida" }),

    tensao: z.nativeEnum({
        KV_34: "KV_34",
        KV_69: "KV_69",
        KV_138: "KV_138",
        KV_230: "KV_230",
    }, { message: "Tensão inválida" }),

    status: z.nativeEnum({
        ATIVA: "ATIVA",
        INATIVA: "INATIVA",
        EM_MANUTENCAO: "EM_MANUTENCAO",
    }).default("ATIVA"),

    regionalId: z
        .number({
            required_error: "Regional é obrigatória",
            invalid_type_error: "Regional inválida",
        })
        .int()
        .positive("Regional é obrigatória"),
});