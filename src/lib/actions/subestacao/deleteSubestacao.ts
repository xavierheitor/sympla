
// deleteSubestacao.ts
'use server'

import { prisma } from '@/lib/common/db/prisma'
import { logger } from '@/lib/common/logger'
import { verifySession } from '@/lib/common/server/session'
import { ActionResult } from '@/lib/definitions/default/ActionResult'

/**
 * Deleta uma subestação
 * @param _ - O estado do formulário
 * @param id - O id da subestação
 * @returns O resultado da ação
 */
export async function deleteSubestacao(_: unknown, id: number): Promise<ActionResult> {
    const session = await verifySession()
    if (!session) {
        logger.error('Usuário não autenticado')
        return { success: false, message: 'Usuário não autenticado' }
    }

    logger.info(`Deletando subestação para o usuário id: ${session.userId}`)

    try {
        await prisma.subestacoes.update({
            where: { id },
            data: { deletedAt: new Date(), deletedBy: session.userId },
        })
        logger.info(`Subestação deletada com sucesso: ${id} por usuario id: ${session.userId}`)
        return { success: true, message: 'Subestação deletada com sucesso' }
    } catch (error) {
        logger.error('Erro ao deletar subestação:', error)
        return { success: false, message: 'Erro ao deletar subestação' }
    }
}
