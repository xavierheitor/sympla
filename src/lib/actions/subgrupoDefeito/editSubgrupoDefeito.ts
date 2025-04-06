"use server"

import { prisma } from "@/lib/common/db/prisma"
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult"
import { FormState } from "@/lib/definitions/default/FormState"
import { SubGrupoDefeitoFormSchema } from "@/lib/definitions/formSchema/SubGrupoDefeitoFormSchema";

/**
 * Edita um subgrupo de defeito
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */
export async function editSubgrupoDefeito(
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
    logger.info(`Editando subgrupo de defeito com id ${formData.get('id')} por usuario id: ${session.userId}`);

    //** Pega os dados do formulário */
    const idStr = formData.get('id') as string;
    const id = parseInt(idStr, 10);
    const nome = formData.get('nome') as string;
    const grupoDefeitoEquipamentoIdString = formData.get('grupoDefeitoEquipamentoId') as string;
    const grupoDefeitoEquipamentoId = Number(grupoDefeitoEquipamentoIdString);

    //** Valida os dados */
    const validatedFields = SubGrupoDefeitoFormSchema.safeParse({ nome, grupoDefeitoEquipamentoId });

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

    //** Edita o subgrupo de defeito */
    try {
        const subgrupoDefeito = await prisma.subGrupoDefeitos.update({
            where: { id },
            data: {
                nome,
                grupoDefeitoEquipamentoId,
                updatedBy: session.userId,
                updatedAt: new Date()
            },
        })
        logger.info(`Subgrupo de defeito editado com sucesso: ${subgrupoDefeito.id}`);
        return {
            success: true,
            message: "Subgrupo de defeito editado com sucesso",
            data: subgrupoDefeito,
        }
    } catch (error: unknown) {
        logger.error("Erro ao editar subgrupo de defeito", error);
        return {
            success: false,
            message: "Erro ao editar subgrupo de defeito",
        }
    }
}
