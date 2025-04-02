// lib/actions/regional/editRegional.ts
'use server'

import { prisma } from '@/lib/common/db/prisma'
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import { RegionalFormSchema } from '@/lib/definitions/formSchema/RegionalFormSchema'
import { FormState } from '@/lib/definitions/default/FormState'
import { verifySession } from '@/lib/common/server/session'
import { logger } from '@/lib/common/logger'


/**
 * Edita uma regional
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */

export async function editRegional(
    formState: FormState,
    formData: FormData
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

    //** Loga a ação */
    logger.info(`Editando regional com id ${formData.get('id')} por usuario id: ${session.userId}`);

    //** Obtemos o id, nome e cnpj do FormData */
    const idStr = formData.get('id') as string
    const id = parseInt(idStr, 10)
    const nome = formData.get('nome') as string
    const empresaIdStr = formData.get('empresaId') as string
    const empresaId = parseInt(empresaIdStr, 10)
    const validatedFields = RegionalFormSchema.safeParse({ nome, empresaId })

    //** Se houver erros, retornamos eles */
    if (!validatedFields.success) {
        logger.error("Erro ao validar campos");
        logger.error(validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            message: "Erro ao validar campos",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    //** Atualizamos a regional */
    try {
        const regional = await prisma.regional.update({
            where: { id },
            data: {
                nome,
                empresaId,
                updatedAt: new Date(),
                updatedBy: session.userId,
            },
        })

        logger.info(`Regional atualizada com sucesso: ${regional.id} por usuario id: ${session.userId}`);

        //** Retorna o resultado */
        return {
            success: true,
            message: "Regional atualizada com sucesso",
            data: regional,
        }
    } catch (error) {
        //** Retorna o erro */
        logger.error("Erro ao atualizar regional", error)
        return {
            success: false,
            message: "Erro ao atualizar regional",
            errors: {
                nome: ["Erro ao atualizar regional: " + error],
            },
        }
    }
}
