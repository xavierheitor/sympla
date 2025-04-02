import { z } from 'zod';

export const TipoManutencaoFormSchema = z.object({
    nome: z.string().min(1, { message: 'Nome é obrigatório' }),
});

