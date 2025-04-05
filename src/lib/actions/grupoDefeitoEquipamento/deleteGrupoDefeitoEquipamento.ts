'use server'

import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult";
import { FormState } from "@/lib/definitions/default/FormState";


/**
 * Deleta um grupo de defeito de equipamento
 * @param formState - O estado do formulário
 * @param id - O id do grupo de defeito de equipamento
 * @returns O resultado da ação
 */
export async function deleteGrupoDefeitoEquipamento(formState: FormState, id: number): Promise<ActionResult> {
    //** Verifica se o usuário está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return {
            success: false,
            message: "Usuário não autenticado",
        }
    }

    logger.info(`Deletando o grupo de defeito de equipamento com id: ${id} por usuário id: ${session.userId}`);

    //** Deletamos o grupo de defeito de equipamento */
    try {
        const grupoDefeitoEquipamento = await prisma.grupoDeDefeitosEquipamento.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: session.userId,
            }
        })

        logger.info(`Grupo de defeito de equipamento deletado com sucesso: ${grupoDefeitoEquipamento.id} por usuário id: ${session.userId}`);

        return {
            success: true,
            message: "Grupo de defeito de equipamento deletado com sucesso",
            data: grupoDefeitoEquipamento
        }
    } catch (error) {
        logger.error(`Erro ao deletar grupo de defeito de equipamento: ${error}`);
        return {
            success: false,
            message: "Erro ao deletar grupo de defeito de equipamento",
        }
    }
}