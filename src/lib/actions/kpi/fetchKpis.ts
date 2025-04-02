
// lib/actions/kpi/fetchKpis.ts
"use server"

import { prisma } from "@/lib/common/db/prisma"
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { Kpi } from "@/lib/definitions/models/Kpi"

/**
 * Busca todos os KPIs
 * @returns Todos os KPIs
 */
export async function fetchKpis(): Promise<Kpi[]> {

    //** Verifica se o usuário está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return []
    }

    //** Loga a ação */
    logger.info(`Buscando KPIs por usuario id: ${session.userId}`);

    //** Busca todos os KPIs */
    try {
        const kpis = await prisma.kpi.findMany({
            where: {
                deletedAt: null
            },
            include: {
                tipoManutencao: true
            }
        })
        logger.info(`Encontrados ${kpis.length} KPIs`);
        return kpis.map((kpi) => ({
            id: kpi.id,
            nome: kpi.nome,
            descricao: kpi.descricao,
            tipoManutencaoId: kpi.tipoManutencaoId,
            tipoManutencao: kpi.tipoManutencao
        }))
    } catch (error) {
        logger.error("Erro ao buscar KPIs:", error)
        return []
    }
}