// lib/actions/empresa/editEmpresa.ts
'use server'

import { prisma } from '@/lib/common/db/prisma'
import { logger } from '@/lib/common/logger'
import { verifySession } from '@/lib/common/server/session'
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import { FormState } from '@/lib/definitions/default/FormState'


/**
 * Deleta uma empresa
 * @param formState - O estado do formulário
 * @param id - O id da empresa
 * @returns O resultado da ação
 */
export async function deleteEmpresa(
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

    //** Deleta a empresa */
    logger.info(`Deletando empresa com id ${id} por usuario id: ${session.userId}`);
    try {

        //** Deleta a empresa */
        const empresa = await prisma.empresa.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        })

        //** Retorna o resultado */
        logger.info(`Empresa deletada com sucesso: ${empresa.id} por usuario id: ${session.userId}`);
        return {
            success: true,
            message: "Empresa removida com sucesso",
            data: empresa,
        }
    } catch (error) {
        //** Retorna o erro */
        logger.error(`Erro ao deletar empresa: ${error}`);
        return {
            success: false,
            message: "Erro ao remover empresa",
        }
    }
}