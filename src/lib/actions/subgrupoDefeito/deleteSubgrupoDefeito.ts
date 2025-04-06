'use server'

import { prisma } from "@/lib/common/db/prisma"
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult"
import { FormState } from "@/lib/definitions/default/FormState"

/**
 * Deleta um subgrupo de defeito
 * @param formState - O estado do formulário
 * @param id - O id do subgrupo de defeito
 * @returns O resultado da ação
 */
export async function deleteSubgrupoDefeito(
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

    //** Deleta o subgrupo de defeito */
    logger.info(`Deletando subgrupo de defeito com id ${id} por usuario id: ${session.userId}`);
    try {
        const subgrupoDefeito = await prisma.subGrupoDefeitos.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            }
        });

        logger.info(`Subgrupo de defeito deletado com sucesso: ${subgrupoDefeito.id} por usuario id: ${session.userId}`);
        return {
            success: true,
            message: "Subgrupo de defeito deletado com sucesso!"
        }
    } catch (error) {
        //**Retorna o erro */
        logger.error("Erro ao deletar subgrupo de defeito", error);
        return {
            success: false,
            message: "Erro ao deletar subgrupo de defeito",
        }
    }
}