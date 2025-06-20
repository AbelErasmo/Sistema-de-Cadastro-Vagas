CREATE DATABASE IF NOT EXISTS Portal_Vagas;
USE Portal_Vagas;

CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'recrutador', 'candidato') NOT NULL
);

CREATE TABLE IF NOT EXISTS Administrador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT UNIQUE NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Recrutador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT UNIQUE NOT NULL,
    empresaId INT NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    endereco TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (empresaId) REFERENCES Empresa(id) ON DELETE CASCADE
);

CREATE TABLE Recrutador_Empresa (
    recruiterId INT NOT NULL,
    empresaId INT NOT NULL,
    PRIMARY KEY (recruiterId, empresaId),
    FOREIGN KEY (recruiterId) REFERENCES Recrutador(id) ON DELETE CASCADE,
    FOREIGN KEY (empresaId) REFERENCES Empresa(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Candidato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco TEXT NOT NULL,
    experiencia TEXT NOT NULL,
    habilidades TEXT NOT NULL,
    cv LONGBLOB,  -- Armazena o currículo em formato binário (PDF, DOC, etc.)
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE Vaga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresaId INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    salario DECIMAL(10,2) NOT NULL CHECK (salario > 0),
    localizacao VARCHAR(255) NOT NULL,
    tipo ENUM('CLT', 'Freelancer', 'Estágio', 'Voluntário') NOT NULL,
    status ENUM('aberta', 'fechada', 'pausada', 'em andamento') NOT NULL DEFAULT 'aberta',
    categoria VARCHAR(255) NOT NULL,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataExpiracao TIMESTAMP GENERATED ALWAYS AS (DATE_ADD(dataCriacao, INTERVAL 15 DAY)) VIRTUAL, -- Expira em 30 dias
    visualizacoes INT DEFAULT 0,
    FOREIGN KEY (empresaId) REFERENCES Empresa(id) ON DELETE CASCADE
);

ALTER TABLE Vaga ADD COLUMN contadorVisualizacoes INT DEFAULT 0;
ALTER TABLE Empresa ADD COLUMN ativo BOOLEAN DEFAULT TRUE;

CREATE TABLE Candidato_Vaga (
    candidatoId INT NOT NULL,
    vagaId INT NOT NULL,
    PRIMARY KEY (candidatoId, vagaId),
    FOREIGN KEY (candidatoId) REFERENCES Candidato(userId),
    FOREIGN KEY (vagaId) REFERENCES Vaga(id)
);

CREATE TABLE Historico_Vaga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vagaId INT,
    usuarioId INT,
    descricao TEXT,
    dataAlteracao DATETIME,
    FOREIGN KEY (vagaId) REFERENCES Vaga(id),
    FOREIGN KEY (usuarioId) REFERENCES User(id)
);

CREATE TABLE Historico_Empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresaId INT NOT NULL,
    usuarioId INT NOT NULL,
    alteracao TEXT NOT NULL,
    dataAlteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresaId) REFERENCES Empresa(id) ON DELETE CASCADE,
    FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE CASCADE
);


CREATE TABLE Empresa_Categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresaId INT,
    categoria VARCHAR(255),
    FOREIGN KEY (empresaId) REFERENCES Empresa(id)
);

CREATE TABLE Favoritos_Vaga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidatoId INT NOT NULL,
    vagaId INT NOT NULL,
    dataAdicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidatoId) REFERENCES Candidato(userId) ON DELETE CASCADE,
    FOREIGN KEY (vagaId) REFERENCES Vaga(id) ON DELETE CASCADE
);




