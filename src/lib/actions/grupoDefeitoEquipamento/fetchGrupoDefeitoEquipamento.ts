"use server"

import { prisma } from "@/lib/common/db/prisma";
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { GrupoDefeitoEquipamento } from "@/lib/definitions/models/GrupoDefeitoEquipamento";


/**
 * Busca todos os grupos de defeito de um equipamento
 * @param equipamento - O equipamento a ser buscado
 * @returns Todos os grupos de defeito de um equipamento
 */
export async function fetchGrupoDefeitoEquipamento(): Promise<GrupoDefeitoEquipamento[]> {
    //* Verifica se o usuário está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return []
    }

    //**Loga a ação */
    logger.info(`Buscando grupos de defeito de equipamento por usuário id: ${session.userId}`);

    //**Busca todos os grupos de defeito de um equipamento */
    try{
        const gruposDeDefeito = await prisma.grupoDeDefeitosEquipamento.findMany({
            where: {
                deletedAt: null
            },
            include: {
                grupoDeDefeitos: true
            }
        })

        logger.info(`Encontrados ${gruposDeDefeito.length} grupos de defeito de equipamento para o usuário id: ${session.userId}`);

        return gruposDeDefeito.map((grupoDeDefeito: GrupoDefeitoEquipamento) => ({
            id: grupoDeDefeito.id,
            equipamento: grupoDeDefeito.equipamento,
            grupoDeDefeitosId: grupoDeDefeito.grupoDeDefeitosId,
            grupoDeDefeitos: grupoDeDefeito.grupoDeDefeitos
        }))
    } catch (error) {
        logger.error(`Erro ao buscar grupos de defeito de equipamento: ${error}`);
        return []
    }
}