import { z} from 'zod';

export const GrupoDeDefeitoFormSchema = z.object({
    nome: z.string().min(1, {message: "Nome obrigatório"})
})