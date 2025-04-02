'use server'

import { prisma } from '@/lib/common/db/prisma'
import { verifySession } from '@/lib/common/server/session'
import { SubestacaoFormSchema } from '@/lib/definitions/formSchema/SubestacaoFormSchema'
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import { logger } from '@/lib/common/logger'
import { FormState } from '@/lib/definitions/default/FormState'
import { CategoriaSubestacao, PropriedadeSubestacao, StatusSubestacao, TensaoSubestacao, TipoSubestacao } from '@prisma/client'

export async function editSubestacao(
    formState: FormState,
    formData: FormData
): Promise<ActionResult> {
    const session = await verifySession()
    if (!session) {
        logger.error("Usuário não autenticado")
        return { success: false, message: "Usuário não autenticado" }
    }

    logger.info(`Editando subestação para o usuário id: ${session.userId}`)

    const id = Number(formData.get('id'))

    const data = {
        nome: formData.get('nome') as string,
        sigla: formData.get('sigla') as string,
        localSAP: formData.get('localSAP') as string,
        propriedade: formData.get('propriedade') as string,
        tipo: formData.get('tipo') as string,
        categoria: formData.get('categoria') as string,
        tensao: formData.get('tensao') as string,
        status: (formData.get('status') as string) || 'ATIVA',
        regionalId: Number(formData.get('regionalId')),
    }

    const validated = SubestacaoFormSchema.safeParse(data)
    if (!validated.success) {
        logger.error("Erro ao validar subestação (edição)")
        logger.error(validated.error.flatten().fieldErrors)
        return {
            success: false,
            message: "Erro ao validar campos",
            errors: validated.error.flatten().fieldErrors,
        }
    }

    try {
        const subestacao = await prisma.subestacoes.update({
            where: { id },
            data: {
                nome: validated.data.nome,
                sigla: validated.data.sigla,
                localSAP: validated.data.localSAP,
                propriedade: validated.data.propriedade as PropriedadeSubestacao,
                tipo: validated.data.tipo as TipoSubestacao,
                categoria: validated.data.categoria as CategoriaSubestacao,
                tensao: validated.data.tensao as TensaoSubestacao,
                status: validated.data.status as StatusSubestacao,
                regionalId: validated.data.regionalId,
                updatedBy: session.userId,
            },
        })

        logger.info(`Subestação atualizada com sucesso: ${subestacao.id} por usuario id: ${session.userId}`)
        return {
            success: true,
            message: "Subestação atualizada com sucesso",
            data: subestacao,
        }
    } catch (error) {
        logger.error("Erro ao atualizar subestação:", error)
        return {
            success: false,
            message: "Erro ao atualizar subestação",
        }
    }
}