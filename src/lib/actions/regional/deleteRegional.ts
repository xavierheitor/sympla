// lib/actions/regional/deleteRegional.ts
'use server'

import { prisma } from '@/lib/common/db/prisma'
import { logger } from '@/lib/common/logger'
import { verifySession } from '@/lib/common/server/session'
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import { FormState } from '@/lib/definitions/default/FormState'

/**
 * Deleta uma regional
 * @param formState - O estado do formulário
 * @param id - O id da regional
 * @returns O resultado da ação
 */
export async function deleteRegional(
    formState: FormState,
    id: number
): Promise<ActionResult> {

    //** Verifica se o usuário está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return {
            success: false,
            message: "Usuário não autenticado",
        }
    }

    //** Deleta a regional */
    logger.info(`Deletando regional com id ${id} por usuario id: ${session.userId}`);
    try {
        const regional = await prisma.regional.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        })

        //** Retorna o resultado */
        logger.info(`Regional deletada com sucesso: ${regional.id} por usuario id: ${session.userId}`);
        return {
            success: true,
            message: "Regional deletada com sucesso",
            data: regional,
        }
    } catch (error) {
        //** Retorna o erro */
        logger.error(`Erro ao deletar regional: ${error}`);
        return {
            success: false,
            message: "Erro ao deletar regional",
        }
    }
}