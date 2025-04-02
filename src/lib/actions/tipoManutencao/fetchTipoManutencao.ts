
// fetchTipoManutencao.ts
'use server'

import { prisma } from '@/lib/common/db/prisma'
import { logger } from '@/lib/common/logger'
import { verifySession } from '@/lib/common/server/session'
import { TipoManutencao } from '@/lib/definitions/models/TipoManutencao'



export async function fetchTipoManutencao(): Promise<TipoManutencao[]> {
    const session = await verifySession()
    if (!session) {
        logger.error('Usuário não autenticado')
        return []
    }

    logger.info(`Buscando tipos de manutenção para o usuário id: ${session.userId}`)

    try{
        const data = await prisma.tipoManutencao.findMany({ where: { deletedAt: null } })

        logger.info(`Tipos de manutenção encontrados: ${data.length} para o usuário id: ${session.userId}`)

        return data.map(tipoManutencao => ({
            ...tipoManutencao,
            createdAt: tipoManutencao.createdAt.toISOString(),
        }))
    } catch (error) {
        logger.error(`Erro ao buscar tipos de manutenção para o usuário id: ${session.userId}`, error)
        return []
    }
}