/*
  Warnings:

  - Added the required column `createdBy` to the `defeitos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `defeitos` ADD COLUMN `createdBy` INTEGER NOT NULL,
    ADD COLUMN `deletedBy` INTEGER NULL,
    ADD COLUMN `updatedBy` INTEGER NULL;

-- CreateIndex
CREATE INDEX `defeitos_nome_idx` ON `defeitos`(`nome`);
