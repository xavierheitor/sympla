import { StatusNota, TipoNota } from "@prisma/client";
import { z } from "zod";

export const NotaPlanoManutencaoFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  numeroSAP: z.string().min(1, "Número SAP é obrigatório"),
  dataLimiteExecucao: z.date(),
  status: z.nativeEnum(StatusNota),
  tipoNota: z.nativeEnum(TipoNota),
  subestacaoId: z.number().int().positive(),
  equipamentoId: z.number().int().positive(),
  tipoManutencaoId: z.number().int().positive(),
  kpiId: z.number().int().positive(),
});
