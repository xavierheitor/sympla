
// editTipoManutencao.ts
'use server'

import { prisma } from '@/lib/common/db/prisma'
import { logger } from '@/lib/common/logger'
import { verifySession } from '@/lib/common/server/session'
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import { FormState } from '@/lib/definitions/default/FormState'
import { TipoManutencaoFormSchema } from '@/lib/definitions/formSchema/TipoManutencaoFormSchema'



/**
 * Edita um tipo de manutenção
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */
export async function editTipoManutencao(
    formState: FormState,
    formData: FormData
): Promise<ActionResult> {
    const session = await verifySession()
    if (!session) {
        logger.error("Usuário não autenticado")
        return { success: false, message: "Usuário não autenticado" }
    }

    logger.info(`Editando tipo de manutenção para o usuário id: ${session.userId}`)

    const id = Number(formData.get('id'))

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
        const tipoManutencao = await prisma.tipoManutencao.update({
            where: { id },
            data: {
                nome: validated.data.nome,
                updatedBy: session.userId,
                updatedAt: new Date(),
            },
        })

        logger.info(`Tipo de manutenção editado com sucesso: ${tipoManutencao.id}`)
        return { success: true, message: "Tipo de manutenção editado com sucesso" }
    } catch (error) {
        logger.error(`Erro ao editar tipo de manutenção para o usuário id: ${session.userId}`, error)
        return { success: false, message: "Erro ao editar tipo de manutenção" }
    }
}
