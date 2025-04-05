// lib/actions/empresa/newEmpresa.ts
'use server'

import { prisma } from '@/lib/common/db/prisma'
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import { EmpresaFormSchema } from '@/lib/definitions/formSchema/EmpresaFormSchema'
import { FormState } from '@/lib/definitions/default/FormState'
import { logger } from '@/lib/common/logger'
import { verifySession } from '@/lib/common/server/session'

/**
 * Cria uma nova empresa
 * @param formState - O estado do formulário
 * @param formData - Os dados do formulário
 * @returns O resultado da ação
 */
export async function newEmpresa(
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
    logger.info(`Criando nova empresa por usuario id: ${session.userId}`);

    // Note: usamos 'nome' pois é o que nosso formulário envia
    const nome = formData.get('nome') as string
    const cnpj = formData.get('cnpj') as string

    //** Validamos os campos */
    const validatedFields = EmpresaFormSchema.safeParse({ nome, cnpj })

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

    //** Cria a empresa */
    try {
        const empresa = await prisma.empresa.create({
            data: {
                nome: nome,
                // cnpj: cnpj,
                createdBy: session.userId, // Exemplo: campo obrigatório
            },
        })
        logger.info(`Empresa criada com sucesso: ${empresa.id} por usuario id: ${session.userId}`);

        //** Retorna o resultado */
        return {
            success: true,
            message: "Empresa criada com sucesso",
            data: empresa,
        }
    } catch (error) {
        //** Retorna o erro */
        logger.error("Erro ao criar empresa:", error)
        return {
            success: false,
            message: "Erro ao criar empresa",
        }
    }
}