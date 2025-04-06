'use server'

import { prisma } from "@/lib/common/db/prisma"
import { SubGrupoDefeito } from "@/lib/definitions/models/SubGrupoDefeito"
import { verifySession } from "@/lib/common/server/session"
import { logger } from "@/lib/common/logger"
import { GrupoDefeitoEquipamento } from "@/lib/definitions/models/GrupoDefeitoEquipamento"

/**
 * Busca todos os subgrupos de defeito
 * @returns Todos os subgrupos de defeito
 */
export const fetchSubgrupoDefeito = async (): Promise<SubGrupoDefeito[]> => {

    //** Verifica se o usuário está autenticado */
    const session = await verifySession()
    if (!session) {
        logger.error("Usuário não autenticado");
        return []
    }

    //** Loga a ação */
    logger.info(`Buscando subgrupos de defeito para o usuário ${session.userId}`);

    //** Busca todos os subgrupos de defeito */
    try {
        const subgrupoDefeito = await prisma.subGrupoDefeitos.findMany({
            where: {
                deletedAt: null
            },
            include: {
                grupoDefeitoEquipamento: {
                    include: {
                        grupoDeDefeitos: true
                    }
                }
            }
        });
        logger.info(`Encontrados ${subgrupoDefeito.length} subgrupos de defeito para o usuário ${session.userId}`);
        //** Retorna os subgrupos de defeito */
        return subgrupoDefeito.map((subgrupoDefeito) => ({
            id: subgrupoDefeito.id,
            nome: subgrupoDefeito.nome,
            grupoDefeitoEquipamentoId: subgrupoDefeito.grupoDefeitoEquipamentoId,
            grupoDefeitoEquipamento: {
                ...subgrupoDefeito.grupoDefeitoEquipamento,
                grupoDeDefeitos: subgrupoDefeito.grupoDefeitoEquipamento.grupoDeDefeitos
            }
        }));

    } catch (error: unknown) {
        logger.error("Erro ao buscar subgrupos de defeito:", error)
        return []
    }
}
