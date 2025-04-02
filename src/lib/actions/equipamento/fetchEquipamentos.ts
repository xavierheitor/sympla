// src/lib/actions/equipamento/fetchEquipamentos.ts
"use server"

import { prisma } from "@/lib/common/db/prisma"
import { logger } from "@/lib/common/logger";
import { verifySession } from "@/lib/common/server/session";
import { Equipamento } from "@/lib/definitions/models/Equipamento"



/**
 * Busca todos os equipamentos
 * @returns Todos os equipamentos
 */
export async function fetchEquipamentos(): Promise<Equipamento[]> {

    //** Verifica se o usuário está autenticado */
    const session = await verifySession();
    if (!session) {
        logger.error("Usuário não autenticado");
        return []
    }

    //** Loga a ação */
    logger.info(`Buscando equipamentos para o usuário id: ${session.userId}`);


    //** Busca todos os equipamentos */
    try {
        const equipamentos = await prisma.equipamentos.findMany({
            where: {
                deletedAt: null
        },
        include: {
            subestacao: true
            }
        })
        logger.info(`Encontrados ${equipamentos.length} equipamentos para o usuário id: ${session.userId}`);

        //** Retorna os equipamentos */
    return equipamentos.map((equipamento) => ({
        id: equipamento.id,
        nome: equipamento.nome,
        subestacaoId: equipamento.subestacaoId,
        subestacao: {
            ...equipamento.subestacao,
            createdAt: equipamento.subestacao.createdAt.toISOString(),
            updatedAt: equipamento.subestacao.updatedAt.toISOString(),
            deletedAt: equipamento.subestacao.deletedAt?.toISOString() || null
        }
    }))
    } catch (error: unknown) {
        logger.error("Erro ao buscar equipamentos:", error)
        return []
    }
}