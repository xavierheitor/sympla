
// deleteTipoManutencao.ts
'use server'

import { prisma } from '@/lib/common/db/prisma'
import { logger } from '@/lib/common/logger'
import { verifySession } from '@/lib/common/server/session'
import { ActionResult } from '@/lib/definitions/default/ActionResult'


/**
 * Deleta um tipo de manutenção
 * @param _ - O estado do formulário
 * @param id - O id do tipo de manutenção
 * @returns O resultado da ação
 */
export async function deleteTipoManutencao(_: unknown, id: number): Promise<ActionResult> {
    const session = await verifySession()
    if (!session) {
        logger.error('Usuário não autenticado')
        return { success: false, message: 'Usuário não autenticado' }
    }

    logger.info(`Deletando tipo de manutenção para o usuário id: ${session.userId}`)

    try {
        await prisma.tipoManutencao.update({ where: { id }, data: { deletedAt: new Date(), deletedBy: session.userId } })
        logger.info(`Tipo de manutenção deletado com sucesso: ${id} por usuario id: ${session.userId}`)
        return { success: true, message: 'Tipo de manutenção deletado com sucesso' }
    } catch (error) {
        logger.error(`Erro ao deletar tipo de manutenção para o usuário id: ${session.userId}`, error)
        return { success: false, message: 'Erro ao deletar tipo de manutenção' }
    }
}