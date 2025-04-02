// lib/actions/regional/newRegional.ts
"use server"

import { prisma } from "@/lib/common/db/prisma"
import { RegionalFormSchema } from "@/lib/definitions/formSchema/RegionalFormSchema"
import { ActionResult } from "@/lib/definitions/default/ActionResult"
import { FormState } from "@/lib/definitions/default/FormState"
import { verifySession } from "@/lib/common/server/session"
import { logger } from "@/lib/common/logger"

/**
 * Cria uma nova regional
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 */
export async function newRegional(
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
    logger.info(`Criando nova regional por usuario id: ${session.userId}`);

    const empresaIdRaw = formData.get('empresaId') as string;
    const empresaId = Number(empresaIdRaw); // aqui já vira número
    const nome = formData.get('nome') as string;

    const validatedFields = RegionalFormSchema.safeParse({ nome, empresaId });

    if (!validatedFields.success) {
        logger.error("Erro ao validar campos");
        logger.error(validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            message: "Erro ao validar campos",
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    //** Cria a regional */
    try {
        const regional = await prisma.regional.create({
            data: {
                nome: nome,
                empresaId: Number(empresaId),
                createdBy: 1
            }
        })
        logger.info(`Regional criada com sucesso: ${regional.id} por usuario id: ${session.userId}`);

        //** Retorna o resultado */
        return {
            success: true,
            message: "Regional criada com sucesso",
            data: regional
        }
    } catch (error) {
        //** Retorna o erro */
        logger.error("Erro ao criar regional:", error)
        return {
            success: false,
            message: "Erro ao criar regional",
            errors: {
                nome: ["Erro ao criar regional: " + error],
            },
        }
    }
}