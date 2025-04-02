// src/lib/actions/equipamento/editEquipamento.ts
"use server"

import { prisma } from "@/lib/common/db/prisma"
import { logger } from "@/lib/common/logger"
import { verifySession } from "@/lib/common/server/session"
import { ActionResult } from "@/lib/definitions/default/ActionResult"
import { FormState } from "@/lib/definitions/default/FormState"
import { EquipamentoFormSchema } from "@/lib/definitions/formSchema/EquipamentoFormSchema"


/**
 * Edita um equipamento
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */

export async function editEquipamento(
    formState: FormState,
    formData: FormData
): Promise<ActionResult> {

    //** Verifica se o usuario está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return {
            success: false,
            message: "Usuário não autenticado"
        }
    }

    //** Loga a ação */
    logger.info(`Editando equipamento com id ${formData.get('id')} para o usuário id: ${session.userId}`);

    //** Obtemos o id, nome e subestacaoId do FormData */
    const idStr = formData.get('id') as string;
    const id = parseInt(idStr, 10);
    const nome = formData.get('nome') as string;
    const subestacaoIdStr = formData.get('subestacaoId') as string;
    const subestacaoId = Number(subestacaoIdStr);

    const validatedFields = EquipamentoFormSchema.safeParse({ nome, subestacaoId });

    //** Se houver erros, retornamos eles */
    if (!validatedFields.success) {
        logger.error("Erro ao validar campos");
        logger.error(validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            message: "Erro ao validar campos",
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    //** Atualizamos o equipamento */
    try {
        const equipamento = await prisma.equipamentos.update({
            where: { id },
            data: { nome, subestacaoId, updatedAt: new Date(), updatedBy: session.userId }
        })

        logger.info(`Equipamento atualizado com sucesso: ${equipamento.id} para o usuário id: ${session.userId}`);

        //** Retorna o resultado */
        return {
            success: true,
            message: "Equipamento atualizado com sucesso",
            data: equipamento
        }
    } catch (error: unknown) {
        logger.error("Erro ao atualizar equipamento:", error);
        return {
            success: false,
            message: "Erro ao atualizar equipamento",
            errors: {
                nome: ["Erro ao atualizar equipamento: " + error],
            },
        }
    }
}