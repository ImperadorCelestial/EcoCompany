-- EcoCompany

CREATE DATABASE IF NOT EXISTS eco_company
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE eco_company;

CREATE TABLE IF NOT EXISTS maquinas (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    setor VARCHAR(80) NOT NULL,
    tipo VARCHAR(80) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'parada',
    consumo_energia_kwh DECIMAL(12, 2) NOT NULL DEFAULT 0,
    temperatura_celsius DECIMAL(6, 2) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL
        DEFAULT CURRENT_TIMESTAMP(6)
        ON UPDATE CURRENT_TIMESTAMP(6),

    PRIMARY KEY (id),
    INDEX idx_maquinas_status (status),

    CONSTRAINT chk_maquinas_status
        CHECK (status IN ('em_operacao', 'em_manutencao', 'parada', 'desativada')),
    CONSTRAINT chk_maquinas_consumo_energia
        CHECK (consumo_energia_kwh >= 0),
    CONSTRAINT chk_maquinas_temperatura
        CHECK (
            temperatura_celsius IS NULL
            OR temperatura_celsius BETWEEN -100 AND 500
        )
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS producoes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    produto VARCHAR(120) NOT NULL,
    quantidade_produzida DECIMAL(14, 2) NOT NULL,
    quantidade_esperada DECIMAL(14, 2) NOT NULL,
    data_hora DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    maquina_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL
        DEFAULT CURRENT_TIMESTAMP(6)
        ON UPDATE CURRENT_TIMESTAMP(6),

    PRIMARY KEY (id),
    INDEX idx_producoes_maquina_id (maquina_id),
    INDEX idx_producoes_data_hora (data_hora),

    CONSTRAINT fk_producoes_maquina
        FOREIGN KEY (maquina_id)
        REFERENCES maquinas (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_producoes_quantidade_produzida
        CHECK (quantidade_produzida >= 0),
    CONSTRAINT chk_producoes_quantidade_esperada
        CHECK (quantidade_esperada > 0)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS sustentabilidade (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    consumo_energia_kwh DECIMAL(14, 2) NOT NULL DEFAULT 0,
    consumo_agua_litros DECIMAL(14, 2) NOT NULL DEFAULT 0,
    residuos_kg DECIMAL(14, 2) NOT NULL DEFAULT 0,
    quantidade_reciclada_kg DECIMAL(14, 2) NOT NULL DEFAULT 0,
    data_hora DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL
        DEFAULT CURRENT_TIMESTAMP(6)
        ON UPDATE CURRENT_TIMESTAMP(6),

    PRIMARY KEY (id),
    INDEX idx_sustentabilidade_data_hora (data_hora),

    CONSTRAINT chk_sustentabilidade_energia
        CHECK (consumo_energia_kwh >= 0),
    CONSTRAINT chk_sustentabilidade_agua
        CHECK (consumo_agua_litros >= 0),
    CONSTRAINT chk_sustentabilidade_residuos
        CHECK (residuos_kg >= 0),
    CONSTRAINT chk_sustentabilidade_reciclagem
        CHECK (
            quantidade_reciclada_kg >= 0
            AND quantidade_reciclada_kg <= residuos_kg
        )
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS ocorrencias (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(120) NOT NULL,
    descricao TEXT NOT NULL,
    nivel_risco VARCHAR(10) NOT NULL,
    local VARCHAR(120) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'aberta',
    data_hora DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    medida_preventiva TEXT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL
        DEFAULT CURRENT_TIMESTAMP(6)
        ON UPDATE CURRENT_TIMESTAMP(6),

    PRIMARY KEY (id),
    INDEX idx_ocorrencias_data_hora (data_hora),
    INDEX idx_ocorrencias_status (status),
    INDEX idx_ocorrencias_nivel_risco (nivel_risco),

    CONSTRAINT chk_ocorrencias_nivel_risco
        CHECK (nivel_risco IN ('baixo', 'medio', 'alto', 'critico')),
    CONSTRAINT chk_ocorrencias_status
        CHECK (status IN ('aberta', 'em_analise', 'resolvida'))
) ENGINE = InnoDB;
