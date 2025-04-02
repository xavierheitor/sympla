// lib/actions/kpi/editKpi.ts
"use server"

import { prisma } from "@/lib/common/db/prisma"
import { KpiFormSchema } from "@/lib/definitions/formSchema/KpiFormSchema"
import { ActionResult } from "@/lib/definitions/default/ActionResult"
import { FormState } from "@/lib/definitions/default/FormState"
import { verifySession } from "@/lib/common/server/session"
import { logger } from "@/lib/common/logger"

/**
 * Edita um KPI
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 */
export async function editKpi(
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
    logger.info(`Editando KPI com id ${formData.get('id')} por usuario id: ${session.userId}`);

    //** Obtemos o id, nome e descricao do FormData */
    const id = formData.get('id') as string;
    const nome = formData.get('nome') as string;
    const descricao = formData.get('descricao') as string;
    const tipoManutencaoIdRaw = formData.get('tipoManutencaoId') as string;
    const tipoManutencaoId = Number(tipoManutencaoIdRaw); // aqui já vira número

    const validatedFields = KpiFormSchema.safeParse({ id, nome, descricao, tipoManutencaoId });

    if (!validatedFields.success) {
        logger.error("Erro ao validar campos");
        logger.error(validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            message: "Erro ao validar campos",
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    //** Edita o KPI */
    try {
        const kpi = await prisma.kpi.update({
            where: { id: Number(id) },
            data: {
                nome,
                descricao,
                tipoManutencaoId,
                updatedAt: new Date(),
                updatedBy: session.userId
            }
        })

        logger.info(`KPI atualizado com sucesso: ${kpi.id} por usuario id: ${session.userId}`);

        //** Retorna o resultado */
        return {
            success: true,
            message: "KPI atualizado com sucesso",
            data: kpi
        }
    } catch (error) {
        logger.error("Erro ao atualizar KPI:", error)
        return {
            success: false,
            message: "Erro ao atualizar KPI",
        }
    }
}