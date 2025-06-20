CREATE DATABASE IF NOT EXISTS Portal_Vagas;
USE Portal_Vagas;

CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    categoria ENUM('admin', 'recrutador', 'candidato') NOT NULL
);

CREATE TABLE IF NOT EXISTS Administrador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoriaEmpresa VARCHAR(255) NOT NULL,
    enderecoEmpresa TEXT NOT NULL,
    emailEmpresa VARCHAR(255) NOT NULL,
    websiteEmpresa VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Recrutador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT UNIQUE NOT NULL,
    empresaId INT UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    endereco TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (empresaId) REFERENCES Empresa(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Recrutador_Empresa (
    recruiterId INT NOT NULL,
    empresaId INT NOT NULL,
    PRIMARY KEY (recruiterId, empresaId),
    FOREIGN KEY (recruiterId) REFERENCES Recrutador(id) ON DELETE CASCADE,
    FOREIGN KEY (empresaId) REFERENCES Empresa(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Candidato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco TEXT NOT NULL,
    experiencia TEXT NOT NULL,
    habilidades TEXT NOT NULL,
    cv LONGBLOB,  -- Armazena o currículo em formato binário (PDF, DOC, etc.)
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Vaga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresaId INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricaocandidatoempresa TEXT NOT NULL,
    salario DECIMAL(10,2) NOT NULL CHECK (salario > 0),
    localizacao VARCHAR(255) NOT NULL,
    tipo ENUM('CLT', 'Freelancer', 'Estágio', 'Voluntário') NOT NULL,
    status_vaga ENUM('aberta', 'fechada', 'pausada', 'em andamento') NOT NULL DEFAULT 'aberta',
    categoria VARCHAR(255) NOT NULL,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataExpiracao TIMESTAMP GENERATED ALWAYS AS (DATE_ADD(dataCriacao, INTERVAL 15 DAY)) VIRTUAL, -- Expira em 30 dias
    visualizacoes INT DEFAULT 0,
    FOREIGN KEY (empresaId) REFERENCES Empresa(id) ON DELETE CASCADE
);

ALTER TABLE Vaga ADD COLUMN contadorVisualizacoes INT DEFAULT 0;
ALTER TABLE Empresa ADD COLUMN ativo BOOLEAN DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS Candidato_Vaga (
    candidatoId INT NOT NULL,
    vagaId INT NOT NULL,
    PRIMARY KEY (candidatoId, vagaId),
    FOREIGN KEY (candidatoId) REFERENCES Candidato(userId),
    FOREIGN KEY (vagaId) REFERENCES Vaga(id)
);

CREATE TABLE IF NOT EXISTS Recrutador_Vaga (
    recrutadorId INT NOT NULL,
    vagaId INT NOT NULL,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (vagaId, recrutadorId),
    FOREIGN KEY (recrutadorId) REFERENCES Recrutador(id) ON DELETE CASCADE,
    FOREIGN KEY (vagaId) REFERENCES Vaga(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Historico_Vaga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vagaId INT,
    usuarioId INT,
    descricao TEXT,
    dataAlteracao DATETIME,
    FOREIGN KEY (vagaId) REFERENCES Vaga(id),
    FOREIGN KEY (usuarioId) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS Historico_Empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresaId INT NOT NULL,
    usuarioId INT NOT NULL,
    alteracao TEXT NOT NULL,
    dataAlteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresaId) REFERENCES Empresa(id) ON DELETE CASCADE,
    FOREIGN KEY (usuarioId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE Historico_Candidato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    descricao TEXT NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Empresa_Categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresaId INT,
    categoria VARCHAR(255),
    FOREIGN KEY (empresaId) REFERENCES Empresa(id)
);

CREATE TABLE IF NOT EXISTS Favoritos_Vaga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidatoId INT NOT NULL,
    vagaId INT NOT NULL,
    dataAdicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidatoId) REFERENCES Candidato(userId) ON DELETE CASCADE,
    FOREIGN KEY (vagaId) REFERENCES Vaga(id) ON DELETE CASCADE
);

ADD FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    CREATE TABLE Aplicacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    vagaId INT NOT NULL,
    status ENUM('pendente', 'entrevista', 'rejeitado', 'contratado') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    OREIGN KEY (vagaId) REFERENCES Vagas(id) ON DELETE CASCADE
);