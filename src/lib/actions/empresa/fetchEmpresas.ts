"use server"

import { prisma } from "@/lib/common/db/prisma"
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { Empresa } from "@/lib/definitions/models/Empresa"

/**
 * Busca todas as empresas
 * @returns Todas as empresas
 */
export async function fetchEmpresas(): Promise<Empresa[]> {

    //** Verifica se o usuário está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return []
    }

    //** Loga a ação */
    logger.info(`Buscando empresas por usuario id: ${session.userId}`);

    //** Busca todas as empresas */
    try {
        const empresas = await prisma.empresa.findMany({
            where: {
                deletedAt: null
            }
        })
        logger.info(`Encontradas ${empresas.length} empresas`);

        //** Retorna as empresas */
        return empresas.map((empresa) => ({
            id: empresa.id,
            nome: empresa.nome,
            cnpj: "00.000.000/0000-00",
        }))
    } catch (error: unknown) {
        //** Retorna o erro */
        logger.error("Erro ao buscar empresas:", error)
        return [];
    }
}