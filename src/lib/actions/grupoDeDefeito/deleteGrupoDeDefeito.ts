// lib/actions/grupoDeDefeito/deleteGrupoDeDefeito.ts

'use server'

import { ActionResult } from '@/lib/definitions/default/ActionResult';
import { FormState } from './../../definitions/default/FormState';
import { verifySession } from '@/lib/common/server/session';
import { logger } from '@/lib/common/logger';
import { prisma } from '@/lib/common/db/prisma';

/**
 * Deleta um grupo de defeito
 * @param FormState - O estado do formulário
 * @param id - O id do grupo de defeito
 * @returns - O resultado da ação
 */
export async function deleteGrupoDeDefeito(
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

    logger.info(`Deletando o grupo de defeito com id: ${id} por usuario id: ${session.userId}`);
    //**Deletando o grupo de defeito */
    try {
        const grupoDeDefeito = await prisma.grupoDeDefeitos.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            }
        })

        logger.info(`Grupo de defeito id: ${grupoDeDefeito.id} deletado com sucesso por usuário id: ${session.userId}`);

        return {
            success: true,
            message: "Grupo de defeito deletado com sucesso!"
        }
    } catch (error) {
        logger.error("Erro ao deletar grupo de defeito", error);
        return {
            success: false,
            message: "Erro ao deletar grupo de defeito"
        }
    }
}