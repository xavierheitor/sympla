// lib/actions/kpi/deleteKpi.ts
"use server"

import { prisma } from "@/lib/common/db/prisma"
import { logger } from "@/lib/common/logger"
import { verifySession } from "@/lib/common/server/session"
import { ActionResult } from "@/lib/definitions/default/ActionResult"
import { FormState } from "@/lib/definitions/default/FormState"

/**
 * Deleta um KPI
 * @param formState - O estado do formulário
 * @param id - O id do KPI
 * @returns O resultado da ação
 */
export async function deleteKpi(
    formState: FormState,
    id: number): Promise<ActionResult> {

    //** Verifica se o usuário está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return {
            success: false,
            message: "Usuário não autenticado",
        }
    }

    //** Deleta o KPI */
    logger.info(`Deletando KPI com id ${id} por usuario id: ${session.userId}`);
    try {
        const kpi = await prisma.kpi.update({
            where: { id },
            data: { deletedAt: new Date() }
        })

        logger.info(`KPI deletado com sucesso: ${kpi.id} por usuario id: ${session.userId}`);
        return {
            success: true,
            message: "KPI deletado com sucesso",
            data: kpi
        }
    } catch (error) {
        logger.error("Erro ao deletar KPI:", error)
        return {
            success: false,
            message: "Erro ao deletar KPI",
        }
    }
}