
// newTipoManutencao.ts
'use server'

import { prisma } from '@/lib/common/db/prisma'
import { logger } from '@/lib/common/logger'
import { verifySession } from '@/lib/common/server/session'
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import { FormState } from '@/lib/definitions/default/FormState'
import { TipoManutencaoFormSchema } from '@/lib/definitions/formSchema/TipoManutencaoFormSchema'



/**
 * Cria um novo tipo de manutenção
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */
export async function newTipoManutencao(
    formState: FormState,
    formData: FormData
): Promise<ActionResult> {
    const session = await verifySession()
    if (!session) {
        logger.error("Usuário não autenticado")
        return { success: false, message: "Usuário não autenticado" }
    }

    logger.info(`Criando tipo de manutenção para o usuário id: ${session.userId}`)

    const data = {
        nome: formData.get('nome') as string,
    }

    const validated = TipoManutencaoFormSchema.safeParse(data)
    if (!validated.success) {
        logger.error("Erro ao validar tipo de manutenção")
        logger.error(validated.error.flatten().fieldErrors)
        return { success: false, message: "Erro ao validar campos", errors: validated.error.flatten().fieldErrors }
    }

    try {
        const tipoManutencao = await prisma.tipoManutencao.create({
            data: {
                nome: validated.data.nome,
                createdBy: session.userId,
            },
        })

        logger.info(`Tipo de manutenção criado com sucesso: ${tipoManutencao.id}`)
        return { success: true, message: "Tipo de manutenção criado com sucesso" }
    } catch (error) {
        logger.error(`Erro ao criar tipo de manutenção para o usuário id: ${session.userId}`, error)
        return {
            success: false, 
            message: "Erro ao criar tipo de manutenção"
        }
    }
}