'use server'

import { prisma } from "@/lib/common/db/prisma";
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult";

/**
 * Deleta um defeito
 * @param _ - O estado do formulário
 * @param id - O id do defeito
 * @returns O resultado da ação
 */
export async function deleteDefeito(_: unknown, id: number): Promise<ActionResult> {
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return { success: false, message: "Usuário não autenticado" }
    }

    logger.info(`Deletando defeito para o usuário id: ${session.userId}`);

    try {
        await prisma.defeitos.update({
            where: { id },
            data: { deletedAt: new Date(), deletedBy: session.userId },
        })
        logger.info(`Defeito deletado com sucesso: ${id} para o usuário id: ${session.userId}`);
        return { success: true, message: "Defeito deletado com sucesso" }
    } catch (error) {
        logger.error("Erro ao deletar defeito:", error);
        return { success: false, message: "Erro ao deletar defeito" }
    }
}