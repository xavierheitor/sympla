'use server'

import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult";
import { FormState } from "@/lib/definitions/default/FormState";
import { GrupoDefeitoEquipamentoFormSchema } from "@/lib/definitions/formSchema/GrupoDefeitoEquipamentoFormSchema";


/**
 * Edita um grupo de defeito de equipamento
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */
export async function editGrupoDefeitoEquipamento(
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
    logger.info(`Editando grupo de defeito de equipamento com o id ${formData.get('id')} por usuário id: ${session.userId}`);

    const idStr = formData.get('id') as string;
    const id = parseInt(idStr, 10);
    const equipamento = formData.get('equipamento') as string;
    const grupoDeDefeitosIdStr = formData.get('grupoDeDefeitosId') as string;
    const grupoDeDefeitosId = parseInt(grupoDeDefeitosIdStr, 10);

    //** Validamos os campos */
    const validatedFields = GrupoDefeitoEquipamentoFormSchema.safeParse({
        equipamento,
        grupoDeDefeitosId
    })

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

    try {
        const grupoDefeitoEquipamento = await prisma.grupoDeDefeitosEquipamento.update({
            where: { id },
            data: {
                equipamento,
                grupoDeDefeitosId,
                updatedBy: session.userId,
                updatedAt: new Date(),
            }
        })

        logger.info(`Grupo de defeito de equipamento atualizado com sucesso: ${grupoDefeitoEquipamento.id} por usuário id: ${session.userId}`);

        return {
            success: true,
            message: "Grupo de defeito de equipamento atualizado com sucesso",
            data: grupoDefeitoEquipamento
        }

    } catch (error) {
        logger.error(`Erro ao atualizar grupo de defeito de equipamento: ${error}`);
        return {
            success: false,
            message: "Erro ao atualizar grupo de defeito de equipamento",
        }
    }
}





