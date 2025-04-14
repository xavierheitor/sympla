"use server";

import { prisma } from "@/lib/common/db/prisma";
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult";

/**
 * Deleta uma nota do Plano de Manutenção
 * @param _ - O estado fo formulário
 * @param id - O id da NotaPM
 * @returns O resultado da ação
 */

export async function deleteNotaPlanoManutencao(
  _: unknown,
  id: number
): Promise<ActionResult> {
  const session = await verifySession();
  if (!session) {
    logger.error("Usuário não autenticado");
    return { success: false, message: "Usuário não autenticado" };
  }

  logger.info(`Deletando nota PM para o usuário id: ${session.userId}`);

  try {
    await prisma.notaPlanoManutencao.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: session.userId },
    });

    logger.info(
      `Nota PM deletada com sucesso: ${id} por usuário id: ${session.userId}`
    );

    return {
      success: true,
      message: "Nota PM deletada com sucesso!",
    };
  } catch (error) {
    logger.error("Erro ao deletar nota PM", error);
    return { success: false, message: "Erro ao deletar Nota PM" };
  }
}
