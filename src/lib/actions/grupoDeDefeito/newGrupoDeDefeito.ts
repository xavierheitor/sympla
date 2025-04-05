// lib/actions/grupoDeDefeito/newGrupoDeDefeito.ts

'use server'

import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult";
import { FormState } from "@/lib/definitions/default/FormState";
import { GrupoDeDefeitoFormSchema } from "@/lib/definitions/formSchema/GrupoDeDefeitoFormSchema";
import { prisma } from "@/lib/common/db/prisma";
/**
 * Cria um novo grupo de defeito
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */

export async function newGrupoDeDefeito(
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
    logger.info(`Criando o novo grupo de defeito para o usuário id: ${session.userId}`);

    const nome = formData.get('nome') as string;

    //** Validamos os campos */
    const validatedFields = GrupoDeDefeitoFormSchema.safeParse({ nome });

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

    try{
        const grupoDeDefeito = await prisma.grupoDeDefeitos.create({
            data: {
                nome,
                createdBy: session.userId,
            }
        })
        logger.info(`Grupo de Defeito criado com sucesso: ${grupoDeDefeito.id} por usuário id: ${session.userId}`);

        //** Retorna o resultado */
        return {
            success: true,
            message: "Grupo de defeito criado com sucesso!",
            data: grupoDeDefeito
        }
    }catch(error: unknown){
        //**Retorna o erro */
        logger.error("Erro ao criar grupo de defeito: ", error)
        return{
            success: false,
            message: "Erro ao criar grupo de defeito"
        }
    }
}