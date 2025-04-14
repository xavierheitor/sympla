/*
  Warnings:

  - Added the required column `dataLimiteExecucao` to the `notas_plano_manutencao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notas_plano_manutencao` ADD COLUMN `dataLimiteExecucao` DATETIME(3) NOT NULL;
