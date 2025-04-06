/*
  Warnings:

  - Added the required column `grupoDefeitosEquipamentoId` to the `defeitos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `defeitos` ADD COLUMN `grupoDefeitosEquipamentoId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `defeitos` ADD CONSTRAINT `defeitos_grupoDefeitosEquipamentoId_fkey` FOREIGN KEY (`grupoDefeitosEquipamentoId`) REFERENCES `grupos_defeitos_equipamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
