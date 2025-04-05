// lib/actions/empresa/editEmpresa.ts
'use server'

import { prisma } from '@/lib/common/db/prisma'
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import { EmpresaFormSchema } from '@/lib/definitions/formSchema/EmpresaFormSchema'
import { FormState } from '@/lib/definitions/default/FormState'
import { logger } from '@/lib/common/logger'
import { verifySession } from '@/lib/common/server/session'

/**
 * Edita uma empresa
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */
export async function editEmpresa(
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
    logger.info(`Editando empresa com id ${formData.get('id')} por usuario id: ${session.userId}`);

    //** Obtemos o id, nome e cnpj do FormData */
    const idStr = formData.get('id') as string
    const id = parseInt(idStr, 10)
    const nome = formData.get('nome') as string
    const cnpj = formData.get('cnpj') as string

    //** Validamos os campos */
    const validatedFields = EmpresaFormSchema.safeParse({ nome, cnpj })

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

    //** Atualizamos a empresa */
    try {
        const empresa = await prisma.empresa.update({
            where: { id },
            data: {
                nome,
                updatedAt: new Date(),
                updatedBy: session.userId,
                // cnpj,
            },
        })

        logger.info(`Empresa atualizada com sucesso: ${empresa.id} por usuario id: ${session.userId}`);

        //** Retorna o resultado */
        return {
            success: true,
            message: "Empresa atualizada com sucesso",
            data: empresa,
        }
    } catch (error) {
        //** Retorna o erro */
        logger.error(`Erro ao atualizar empresa: ${error}`);
        return {
            success: false,
            message: "Erro ao atualizar empresa",
        }
    }
}