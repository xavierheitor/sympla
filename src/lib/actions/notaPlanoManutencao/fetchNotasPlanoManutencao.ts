// lib/actions/notaPlanoManutencao/fetchNotasPlanoManutencao.ts

"use server";

import { prisma } from "@/lib/common/db/prisma";
import { verifySession } from "@/lib/common/server/session";
import { logger } from "@/lib/common/logger";
import { NotaPlanoManutencao } from "@/lib/definitions/models/NotaPlanoManutencao";

export async function fetchNotasPlanoManutencao(): Promise<
  NotaPlanoManutencao[]
> {
  const session = await verifySession();
  if (!session) {
    logger.error("Usuário não autenticado");
    return [];
  }

  logger.info(`Buscando notas PM para o usuário id: ${session.userId}`);
  try {
    const data = await prisma.notaPlanoManutencao.findMany({
      where: { deletedAt: null },
      include: {
        subestacao: true,
        kpi: true,
        tipoManutencao: true,
        equipamento: true,
      },
      orderBy: { id: "asc" },
    });

    logger.info(
      `Notas PM encontradas: ${data.length} para o usuário id: ${session.userId}`
    );

    return data.map((notaPM) => ({
      ...notaPM,

      subestacao: {
        ...notaPM.subestacao,
      },
      kpi: {
        ...notaPM.kpi,
      },
      tipoManutencao: {
        ...notaPM.tipoManutencao,
      },
      equipamento: {
        ...notaPM.equipamento,
      },
    }));
  } catch (error) {
    logger.error(
      `Erro ao buscar notas PM para o usuário id: ${session.userId}`,
      error
    );
    return [];
  }
}
