/*
  Warnings:

  - You are about to alter the column `status` on the `notas_plano_manutencao` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(8))`.

*/
-- AlterTable
ALTER TABLE `anomalias` MODIFY `tipoNota` ENUM('AA', 'TS', 'RSF') NOT NULL;

-- AlterTable
ALTER TABLE `notas_plano_manutencao` MODIFY `status` ENUM('PENDENTE', 'PROGRAMADO', 'EXECUTADO', 'BAIXADO_NO_SAP') NOT NULL DEFAULT 'PENDENTE',
    MODIFY `tipoNota` ENUM('AA', 'TS', 'RSF') NOT NULL;
