
// fetchSubestacoes.ts
'use server'

import { prisma } from '@/lib/common/db/prisma'
import { verifySession } from '@/lib/common/server/session'
import { Subestacao } from '@/lib/definitions/models/Subestacao'
import { logger } from '@/lib/common/logger'

export async function fetchSubestacoes(): Promise<Subestacao[]> {
  const session = await verifySession()
  if (!session) {
    logger.error('Usuário não autenticado')
    return []
  }

  logger.info(`Buscando subestações para o usuário id: ${session.userId}`)

  const data = await prisma.subestacoes.findMany({
    where: { deletedAt: null },
    include: { regional: true },
    orderBy: { nome: 'asc' },
  })

  logger.info(`Subestações encontradas: ${data.length} para o usuário id: ${session.userId}`)

  return data.map(subestacao => ({
    ...subestacao,
    createdAt: subestacao.createdAt.toISOString(),
    updatedAt: subestacao.updatedAt.toISOString(),
    deletedAt: subestacao.deletedAt?.toISOString() || null,
    regional: {
      ...subestacao.regional,
      createdAt: subestacao.regional.createdAt.toISOString(),
      updatedAt: subestacao.regional.updatedAt.toISOString(),
      deletedAt: subestacao.regional.deletedAt?.toISOString() || null
    }
  }))
}
