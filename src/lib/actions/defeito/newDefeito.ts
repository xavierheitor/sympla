'use server'

import { prisma } from "@/lib/common/db/prisma";
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { ActionResult } from "@/lib/definitions/default/ActionResult";
import { FormState } from "@/lib/definitions/default/FormState";
import { DefeitoFormSchema } from "@/lib/definitions/formSchema/DefeitoFormSchema";
import { PrioridadeDefeito } from "@prisma/client";


/**
 * Cria um novo defeito
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */
export async function newDefeito(
    formState: FormState,
    formData: FormData): Promise<ActionResult> {
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return { success: false, message: "Usuário não autenticado" }
    }

    logger.info(`Criando defeito para o usuário id: ${session.userId}`);

    const data = {
        nome: formData.get('nome') as string,
        descricao: formData.get('descricao') as string,
        codigoSAP: formData.get('codigoSAP') as string,
        prioridade: formData.get('prioridade') as PrioridadeDefeito,
        subGrupoDefeitosId: Number(formData.get('subGrupoDefeitosId')),
        grupoDefeitosEquipamentoId: Number(formData.get('grupoDefeitosEquipamentoId')),
    }

    const validated = DefeitoFormSchema.safeParse(data);
    if (!validated.success) {
        logger.error("Erro ao validar defeito");
        logger.error(validated.error.flatten().fieldErrors);
        return {
            success: false,
            message: "Erro ao validar campos",
            errors: validated.error.flatten().fieldErrors,
        }
    }

    try {
        const defeito = await prisma.defeitos.create({
            data: {
                ...validated.data,
                createdBy: session.userId,
            },
        })

        logger.info(`Defeito criado com sucesso: ${defeito.id} para o usuário id: ${session.userId}`);
        return {
            success: true,
            message: "Defeito criado com sucesso",
            data: defeito,
        }
    } catch (error) {
        logger.error("Erro ao criar defeito:", error);
        return {
            success: false,
            message: "Erro ao criar defeito",
        }
    }
}