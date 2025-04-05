// lib/actions/grupoDeDefeito/editGrupoDeDefeito.ts
'use server'

import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult";
import { FormState } from "@/lib/definitions/default/FormState";
import { GrupoDeDefeitoFormSchema } from "@/lib/definitions/formSchema/GrupoDeDefeitoFormSchema";
import { prisma } from "@/lib/common/db/prisma";

/**
 * Edita um grupo de defeito
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns - O resultado da ação
 */
export async function editGrupoDeDefeito(
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
    logger.info(`Editando grupo de defeito com o id ${formData.get('id')} por usuário id: ${session.userId}`);

    const idStr = formData.get('id') as string;
    const id = parseInt(idStr, 10)
    const nome = formData.get('nome') as string;

    //** Validamos os campos
    const validatedFields = GrupoDeDefeitoFormSchema.safeParse({
        nome
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

    //**Atualizamos o grupo de defeito */
    try {
        const grupoDeDefeito = await prisma.grupoDeDefeitos.update({
            where: { id },
            data: {
                nome,
                updatedAt: new Date(),
                updatedBy: session.userId
            }
        })

        logger.info(`Grupo de Defeito atualizado com sucesso: ${grupoDeDefeito.id} por usuário: ${session.userId}`);

        return {
            success: true,
            message: "Grupo de Defeito atualizado com sucesso!",
            data: grupoDeDefeito
        }
    }catch(error){
        //**Retorna o erro */
        logger.error("Erro ao atualizar emmpresa: ", error)
        return{
            success: false,
            message: "Erro ao atualizar grupo de defeito!"
        }
    }
}