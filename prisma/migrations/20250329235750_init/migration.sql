-- CreateTable
CREATE TABLE `empresas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    INDEX `empresas_nome_idx`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regionais` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `empresaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    INDEX `regionais_empresaId_idx`(`empresaId`),
    INDEX `regionais_nome_idx`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subestacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `sigla` VARCHAR(3) NOT NULL,
    `localSAP` VARCHAR(255) NOT NULL,
    `propriedade` ENUM('PROPRIA', 'COMPARTILHADA') NOT NULL,
    `tipo` ENUM('MT', 'AT') NOT NULL,
    `categoria` ENUM('DISTRIBUICAO', 'SUBTRANSMISSAO', 'TRANSMISSAO') NOT NULL,
    `tensao` ENUM('KV_34', 'KV_69', 'KV_138', 'KV_230') NOT NULL,
    `status` ENUM('ATIVA', 'INATIVA', 'EM_MANUTENCAO') NOT NULL DEFAULT 'ATIVA',
    `regionalId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    INDEX `subestacoes_regionalId_idx`(`regionalId`),
    INDEX `subestacoes_sigla_idx`(`sigla`),
    UNIQUE INDEX `subestacoes_sigla_regionalId_key`(`sigla`, `regionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `subestacaoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    INDEX `equipamentos_subestacaoId_idx`(`subestacaoId`),
    INDEX `equipamentos_nome_idx`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_manutencao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    UNIQUE INDEX `tipos_manutencao_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `tipoManutencaoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    INDEX `kpis_tipoManutencaoId_idx`(`tipoManutencaoId`),
    UNIQUE INDEX `kpis_nome_tipoManutencaoId_key`(`nome`, `tipoManutencaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anomalias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `notificador` VARCHAR(255) NOT NULL,
    `status` ENUM('ABERTA', 'EM_ANALISE', 'EM_CORRECAO', 'CONCLUIDA', 'CANCELADA') NOT NULL DEFAULT 'ABERTA',
    `equipamentoId` INTEGER NOT NULL,
    `defeitoId` INTEGER NOT NULL,
    `tipoNota` ENUM('AA', 'TS') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    INDEX `anomalias_equipamentoId_idx`(`equipamentoId`),
    INDEX `anomalias_defeitoId_idx`(`defeitoId`),
    INDEX `anomalias_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupos_defeitos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    UNIQUE INDEX `grupos_defeitos_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupos_defeitos_equipamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grupoDeDefeitosId` INTEGER NOT NULL,
    `equipamento` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    INDEX `grupos_defeitos_equipamentos_grupoDeDefeitosId_idx`(`grupoDeDefeitosId`),
    INDEX `grupos_defeitos_equipamentos_equipamento_idx`(`equipamento`),
    UNIQUE INDEX `grupos_defeitos_equipamentos_grupoDeDefeitosId_equipamento_key`(`grupoDeDefeitosId`, `equipamento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subgrupos_defeitos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `grupoDeDefeitosId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    INDEX `subgrupos_defeitos_grupoDeDefeitosId_idx`(`grupoDeDefeitosId`),
    UNIQUE INDEX `subgrupos_defeitos_nome_grupoDeDefeitosId_key`(`nome`, `grupoDeDefeitosId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `defeitos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `codigo` VARCHAR(50) NOT NULL,
    `prioridade` ENUM('A', 'P1', 'P2', 'P3') NOT NULL,
    `subGrupoDefeitosId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `defeitos_subGrupoDefeitosId_idx`(`subGrupoDefeitosId`),
    UNIQUE INDEX `defeitos_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notas_plano_manutencao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `numeroSAP` VARCHAR(50) NOT NULL,
    `status` ENUM('RASCUNHO', 'EM_APROVACAO', 'APROVADA', 'REJEITADA', 'CANCELADA') NOT NULL DEFAULT 'RASCUNHO',
    `tipoNota` ENUM('AA', 'TS') NOT NULL,
    `subestacaoId` INTEGER NOT NULL,
    `equipamentoId` INTEGER NOT NULL,
    `tipoManutencaoId` INTEGER NOT NULL,
    `kpiId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    INDEX `notas_plano_manutencao_subestacaoId_idx`(`subestacaoId`),
    INDEX `notas_plano_manutencao_equipamentoId_idx`(`equipamentoId`),
    INDEX `notas_plano_manutencao_tipoManutencaoId_idx`(`tipoManutencaoId`),
    INDEX `notas_plano_manutencao_kpiId_idx`(`kpiId`),
    INDEX `notas_plano_manutencao_status_idx`(`status`),
    UNIQUE INDEX `notas_plano_manutencao_numeroSAP_key`(`numeroSAP`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,

    UNIQUE INDEX `usuarios_username_key`(`username`),
    UNIQUE INDEX `usuarios_email_key`(`email`),
    INDEX `usuarios_username_idx`(`username`),
    INDEX `usuarios_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `contas_userId_idx`(`userId`),
    UNIQUE INDEX `contas_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessoes_sessionToken_key`(`sessionToken`),
    INDEX `sessoes_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens_verificacao` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tokens_verificacao_token_key`(`token`),
    UNIQUE INDEX `tokens_verificacao_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `regionais` ADD CONSTRAINT `regionais_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subestacoes` ADD CONSTRAINT `subestacoes_regionalId_fkey` FOREIGN KEY (`regionalId`) REFERENCES `regionais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipamentos` ADD CONSTRAINT `equipamentos_subestacaoId_fkey` FOREIGN KEY (`subestacaoId`) REFERENCES `subestacoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kpis` ADD CONSTRAINT `kpis_tipoManutencaoId_fkey` FOREIGN KEY (`tipoManutencaoId`) REFERENCES `tipos_manutencao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anomalias` ADD CONSTRAINT `anomalias_equipamentoId_fkey` FOREIGN KEY (`equipamentoId`) REFERENCES `equipamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anomalias` ADD CONSTRAINT `anomalias_defeitoId_fkey` FOREIGN KEY (`defeitoId`) REFERENCES `defeitos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grupos_defeitos_equipamentos` ADD CONSTRAINT `grupos_defeitos_equipamentos_grupoDeDefeitosId_fkey` FOREIGN KEY (`grupoDeDefeitosId`) REFERENCES `grupos_defeitos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subgrupos_defeitos` ADD CONSTRAINT `subgrupos_defeitos_grupoDeDefeitosId_fkey` FOREIGN KEY (`grupoDeDefeitosId`) REFERENCES `grupos_defeitos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `defeitos` ADD CONSTRAINT `defeitos_subGrupoDefeitosId_fkey` FOREIGN KEY (`subGrupoDefeitosId`) REFERENCES `subgrupos_defeitos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas_plano_manutencao` ADD CONSTRAINT `notas_plano_manutencao_subestacaoId_fkey` FOREIGN KEY (`subestacaoId`) REFERENCES `subestacoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas_plano_manutencao` ADD CONSTRAINT `notas_plano_manutencao_equipamentoId_fkey` FOREIGN KEY (`equipamentoId`) REFERENCES `equipamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas_plano_manutencao` ADD CONSTRAINT `notas_plano_manutencao_tipoManutencaoId_fkey` FOREIGN KEY (`tipoManutencaoId`) REFERENCES `tipos_manutencao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas_plano_manutencao` ADD CONSTRAINT `notas_plano_manutencao_kpiId_fkey` FOREIGN KEY (`kpiId`) REFERENCES `kpis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contas` ADD CONSTRAINT `contas_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessoes` ADD CONSTRAINT `sessoes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
