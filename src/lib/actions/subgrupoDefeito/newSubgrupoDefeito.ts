'use server'

import { prisma } from '@/lib/common/db/prisma'
import { logger } from '@/lib/common/logger';
import { verifySession } from '@/lib/common/server/session';
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import { FormState } from '@/lib/definitions/default/FormState'



/**
 * Cria um novo subgrupo de defeito
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */
export async function newSubgrupoDefeito(
    formState: FormState,
    formData: FormData): Promise<ActionResult> {

    //** Verifica se o usuário está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return {
            success: false,
            message: "Usuário não autenticado",
        }
    }

    //** Loga a ação */
    logger.info(`Criando novo subgrupo de defeito para o usuário ${session.userId}`);

    //** Pega os dados do formulário */
    const nome = formData.get('nome') as string;
    const grupoDefeitoEquipamentoIdString = formData.get('grupoDefeitoEquipamentoId') as string;
    const grupoDefeitoEquipamentoId = Number(grupoDefeitoEquipamentoIdString);

    //** Cria o novo subgrupo de defeito */
    try {
        const subgrupoDefeito = await prisma.subGrupoDefeitos.create({
            data: {
                nome,
                grupoDefeitoEquipamentoId,
                createdBy: session.userId,
            }
        })
        logger.info(`Novo subgrupo de defeito criado com sucesso: ${subgrupoDefeito.id}`);
        return {
            success: true,
            message: "Subgrupo de defeito criado com sucesso",
        }
    } catch (error: unknown) {
        logger.error("Erro ao criar novo subgrupo de defeito:", error);
        return {
            success: false,
            message: "Erro ao criar novo subgrupo de defeito",
        }
    }
}
