// src/lib/actions/equipamento/deleteEquipamento.ts
"use server"

import { prisma } from "@/lib/common/db/prisma"
import { logger } from "@/lib/common/logger"
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult";
import { FormState } from "@/lib/definitions/default/FormState";



/**
 * Deleta um equipamento
 * @param formState - O estado do formulário
 * @param id - O id do equipamento
 * @returns O resultado da ação
 */

export async function deleteEquipamento(
    formState: FormState,
    id: number
): Promise<ActionResult> {

    //** Verifica se o usuario está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return {
            success: false,
            message: "Usuário não autenticado",
        }
    }

    //** Deleta o equipamento */
    logger.info(`Deletando equipamento com id ${id} por usuario id: ${session.userId}`);
    try {
        const equipamento = await prisma.equipamentos.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        })

        //** Retorna o resultado */
        logger.info(`Equipamento deletado com sucesso: ${equipamento.id} por usuario id: ${session.userId}`);
        return {
            success: true,
            message: "Equipamento deletado com sucesso",
            data: equipamento,
        }
    } catch (error) {
        logger.error("Erro ao deletar equipamento:", error);
        return {
            success: false,
            message: "Erro ao deletar equipamento",
        }
    }
}