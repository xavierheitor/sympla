"use server"

import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { GrupoDeDefeito } from "@/lib/definitions/models/GrupoDeDefeito";
import { prisma } from "@/lib/common/db/prisma";


/**
 * Busca todos os grupos de defeito
 * @returns Todos os grupos de defeito
 */
export async function fetchGrupoDeDefeito(): Promise<GrupoDeDefeito[]>{
    //* Verifica se o usuário está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return []
    }

    //**Loga a ação *
    logger.info(`Buscando grupos de defeito por usuário id: ${session.userId}`);

    //**Busca todos os grupos de defeito */
    try{
        const gruposDeDefeito = await prisma.grupoDeDefeitos.findMany({
            where: {
                deletedAt: null
            }
        })

        logger.info(`Encontrados ${gruposDeDefeito.length} grupos de defeito`);

        return gruposDeDefeito.map((grupoDeDefeito: GrupoDeDefeito) => ({
            id: grupoDeDefeito.id,
            nome: grupoDeDefeito.nome
        }))
    } catch(error: unknown){
        //**retorna o erro  */
        logger.error("Erro ao buscar grupos de defeito: ", error)
        return []
    }

}