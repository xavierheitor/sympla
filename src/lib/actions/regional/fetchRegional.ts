
// lib/actions/regional/fetchRegional.ts
"use server"

import { prisma } from "@/lib/common/db/prisma"
import { Regional } from "@/lib/definitions/models/Regional"
import { verifySession } from "@/lib/common/server/session"
import { logger } from "@/lib/common/logger"

/**
 * Busca todas as regionais
 * @returns Todas as regionais
 */
export async function fetchRegionais(): Promise<Regional[]> {

    //** Verifica se o usuário está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return []
    }

    //** Loga a ação */
    logger.info(`Buscando regionais por usuario id: ${session.userId}`);

    //** Busca todas as regionais */
    try {
        const regionais = await prisma.regional.findMany({
            where: {
                deletedAt: null
            },
            include: {
                empresa: true
            }
        })
        logger.info(`Encontradas ${regionais.length} regionais`);

        //** Retorna as regionais */
        return regionais.map((regional) => ({
            id: regional.id,
            nome: regional.nome,
            empresaId: regional.empresaId,
            empresa: regional.empresa,
        }))
    } catch (error: unknown) {
        logger.error("Erro ao buscar regionais:", error)
        return []
    }
}
