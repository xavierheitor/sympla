/*
  Warnings:

  - You are about to drop the column `codigo` on the `defeitos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codigoSAP]` on the table `defeitos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigoSAP` to the `defeitos` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `defeitos_codigo_key` ON `defeitos`;

-- AlterTable
ALTER TABLE `defeitos` DROP COLUMN `codigo`,
    ADD COLUMN `codigoSAP` VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `defeitos_codigoSAP_key` ON `defeitos`(`codigoSAP`);
