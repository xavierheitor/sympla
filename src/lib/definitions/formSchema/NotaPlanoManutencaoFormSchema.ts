import { StatusNota, TipoNota } from "@prisma/client";
import { z } from "zod";

export const NotaPlanoManutencaoFormSchema = z.object({
  nome: z.string().min(1, { message: "Nome obrigatório" }),
  numeroSAP: z.string().optional(),
  status: z.nativeEnum(StatusNota),
  tipoNota: z.nativeEnum(TipoNota),
  subestacaoId: z
    .number({
      required_error: "Subestacao é obrigatório",
      invalid_type_error: "Subestacao é inválido˝",
    })
    .int()
    .positive("Subestacao é obrigatória"),
  equipamentoId: z
    .number({
      required_error: "Equipamento é obrigatório",
      invalid_type_error: "Equipamento é invalido",
    })
    .int()
    .positive("Equipamento é obrigatório"),
  tipoManutencaoId: z
    .number({
      required_error: "Tipo Manutenção é obrigatório",
      invalid_type_error: "Tipo Manutencao inválido",
    })
    .int()
    .positive("Tipo Manutenção é obrigatório"),
  kpiId: z
    .number({
      required_error: "Kpi é obrigatório",
      invalid_type_error: "Kpi invalido",
    })
    .int()
    .positive("Kpi é obrigatório"),
});
