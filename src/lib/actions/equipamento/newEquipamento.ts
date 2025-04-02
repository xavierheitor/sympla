// src/lib/actions/equipamento/newEquipamento.ts
"use server"

import { prisma } from "@/lib/common/db/prisma"
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session"
import { ActionResult } from "@/lib/definitions/default/ActionResult";
import { FormState } from "@/lib/definitions/default/FormState";
import { EquipamentoFormSchema } from "@/lib/definitions/formSchema/EquipamentoFormSchema"



/**
 * Cria um novo equipamento
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 */
export async function newEquipamento(
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
    logger.info(`Criando novo equipamento para o usuário id: ${session.userId}`);

    const nome = formData.get('nome') as string;
    const subestacaoIdString = formData.get('subestacaoId') as string;
    const subestacaoId = Number(subestacaoIdString);

    const validatedFields = EquipamentoFormSchema.safeParse({ nome, subestacaoId });

    if (!validatedFields.success) {
        logger.error("Erro ao validar campos");
        logger.error(validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            message: "Erro ao validar campos"
        }
    }

    //** Cria o equipamento */
    try {
        const equipamento = await prisma.equipamentos.create({
            data: {
                nome: nome,
                subestacaoId: subestacaoId,
                createdBy: 1
            }
        })
        logger.info(`Equipamento criado com sucesso: ${equipamento.id} para o usuário id: ${session.userId}`);

        //** Retorna o resultado */
        return {
            success: true,
            message: "Equipamento criado com sucesso",
            data: equipamento
        }
    } catch (error: unknown) {
        logger.error("Erro ao criar equipamento:", error);
        return {
            success: false,
            message: "Erro ao criar equipamento"
        }
    }
}
