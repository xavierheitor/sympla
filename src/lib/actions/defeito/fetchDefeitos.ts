'use server'

import { prisma } from "@/lib/common/db/prisma";
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { Defeito } from "@/lib/definitions/models/Defeito";


/**
 * Busca todos os defeitos
 * @returns Todos os defeitos
 */
export async function fetchDefeitos(): Promise<Defeito[]> {
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return []
    }

    logger.info(`Buscando defeitos para o usuário id: ${session.userId}`);

    try {
        const defeitos = await prisma.defeitos.findMany({
            where: {
                deletedAt: null
            },
            include: {
                subGrupoDefeitos: true,
                grupoDefeitosEquipamento: true
            }
        })

        logger.info(`Defeitos encontrados: ${defeitos.length} para o usuário id: ${session.userId}`);

        return defeitos.map(defeito => ({
            ...defeito,
            createdAt: defeito.createdAt.toISOString(),
            updatedAt: defeito.updatedAt.toISOString(),
            deletedAt: defeito.deletedAt?.toISOString() || null,
            subGrupoDefeitos: {
                ...defeito.subGrupoDefeitos,

            },
            grupoDefeitosEquipamento: {
                ...defeito.grupoDefeitosEquipamento,

            }
        }));
    } catch (error) {
        logger.error(`Erro ao buscar defeitos para o usuário id: ${session.userId}`, error);
        return []
    }
}
