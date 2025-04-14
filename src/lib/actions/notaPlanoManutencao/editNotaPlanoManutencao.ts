"use server";

import { prisma } from "@/lib/common/db/prisma";
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult";
import { FormState } from "@/lib/definitions/default/FormState";
import { NotaPlanoManutencaoFormSchema } from "@/lib/definitions/formSchema/NotaPlanoManutencaoFormSchema";
import {
  StatusNota,
  TipoNota,
} from "@/lib/definitions/models/NotaPlanoManutencao";

/**
 * Edita uma nota do Plano de Manutenção
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */
export async function editNotaPlanoManutencao(
  formState: FormState,
  formData: FormData
): Promise<ActionResult> {
  const session = await verifySession();
  if (!session) {
    logger.error("Usuário não autenticado");
    return { success: false, message: "Usuário não autenticado" };
  }

  logger.info(`Editando nota PM para o usuário id: ${session.userId}`);

  const id = Number(formData.get("id"));

  const data = {
    nome: formData.get("nome") as string,
    numeroSAP: formData.get("numeroSAP") as string,
    status: formData.get("status") as StatusNota,
    tipoNota: formData.get("tipoNota") as TipoNota,
    subestacaoId: Number(formData.get("subestacaoId")),
    equipamentoId: Number(formData.get("equipamentoId")),
    tipoManutencaoId: Number(formData.get("tipoManutencaoId")),
    kpiId: Number(formData.get("kpiId")),
    dataLimiteExecucao: new Date(formData.get("dataLimiteExecucao") as string),
  };

  const validated = NotaPlanoManutencaoFormSchema.safeParse(data);

  if (!validated.success) {
    logger.error("Erro ao validar nota PM");
    logger.error(validated.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Erro ao validar campos",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const notaPM = await prisma.notaPlanoManutencao.update({
      where: { id },
      data: {
        nome: validated.data.nome,
        numeroSAP: validated.data.numeroSAP || "",
        status: validated.data.status as StatusNota,
        tipoNota: validated.data.tipoNota as TipoNota,
        subestacaoId: validated.data.subestacaoId,
        equipamentoId: validated.data.equipamentoId,
        tipoManutencaoId: validated.data.tipoManutencaoId,
        kpiId: validated.data.kpiId,
        dataLimiteExecucao: validated.data.dataLimiteExecucao,
        updatedAt: new Date(),
        updatedBy: session.userId,
      },
    });

    logger.info(
      `Nota PM atualizada com sucesso: ${notaPM.id} por usuário id: ${session.userId}`
    );

    return {
      success: true,
      message: "Nota PM atualizada com sucesso!",
      data: notaPM,
    };
  } catch (error) {
    logger.error("Erro ao atualizar nota PM", error);
    return {
      success: false,
      message: "Erro ao atualizar Nota PM",
    };
  }
}
