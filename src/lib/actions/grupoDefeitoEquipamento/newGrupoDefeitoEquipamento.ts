'use server'

import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult";
import { FormState } from "@/lib/definitions/default/FormState";
import { GrupoDefeitoEquipamentoFormSchema } from "@/lib/definitions/formSchema/GrupoDefeitoEquipamentoFormSchema";


/**
 * Cria um novo grupo de defeito de equipamento
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */
export async function newGrupoDefeitoEquipamento(
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

    //**Loga a ação */
    logger.info(`Criando o novo grupo de defeito de equipamento para o usuário id: ${session.userId}`);

    const equipamento = formData.get('equipamento') as string;
    const grupoDeDefeitosIdStr = formData.get('grupoDeDefeitosId') as string;
    const grupoDeDefeitosId = parseInt(grupoDeDefeitosIdStr, 10);

    //** Validamos os campos */
    const validatedFields = GrupoDefeitoEquipamentoFormSchema.safeParse({ equipamento, grupoDeDefeitosId });

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
        const grupoDefeitoEquipamento = await prisma.grupoDeDefeitosEquipamento.create({
            data: {
                equipamento,
                grupoDeDefeitosId,
                createdBy: session.userId,
            }
        })

        logger.info(`Grupo de defeito de equipamento criado com sucesso: ${grupoDefeitoEquipamento.id}`);

        return {
            success: true,
            message: "Grupo de defeito de equipamento criado com sucesso",
            data: grupoDefeitoEquipamento
        }
    } catch (error) {
        logger.error(`Erro ao criar grupo de defeito de equipamento: ${error}`);
        return {
            success: false,
            message: "Erro ao criar grupo de defeito de equipamento",
        }
    }
}