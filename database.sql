CREATE DATABASE IF NOT EXISTS cantinhodospets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cantinhodospets;

CREATE TABLE orgs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefone VARCHAR(20),
  cidade VARCHAR(50),
  estado CHAR(2),
  api_key VARCHAR(64) UNIQUE,
  logo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE animals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  tipo ENUM('cachorro','gato','outros'),
  raca VARCHAR(100),
  idade INT,
  sexo ENUM('macho','femea'),
  porte ENUM('pequeno','medio','grande'),
  descricao TEXT,
  foto_url VARCHAR(255),
  org_id INT,
  status ENUM('ativo','adotado','em tratamento') DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES orgs(id)
);

CREATE TABLE interests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT,
  nome VARCHAR(100),
  email VARCHAR(100),
  telefone VARCHAR(20),
  mensagem TEXT,
  data_interesse TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('novo','contatado','adotado') DEFAULT 'novo',
  FOREIGN KEY (animal_id) REFERENCES animals(id)
);

-- INSERINDO DADOS DE TESTE
INSERT INTO orgs (nome, email, cidade, estado, api_key) VALUES
('Amigos da Rua', 'contato@amigosdarua.org', 'Criciúma', 'SC', MD5('apikey123'));

INSERT INTO animals (nome, tipo, raca, idade, sexo, porte, descricao, foto_url, org_id) VALUES
('Rex', 'cachorro', 'Vira-lata', 24, 'macho', 'medio', 'Brincalhão, ama crianças.', 'https://source.unsplash.com/random/600x400/?dog', 1),
('Luna', 'gato', 'Siamês', 18, 'femea', 'pequeno', 'Carinhosa, gosta de colo.', 'https://source.unsplash.com/random/600x400/?cat', 1),
('Bolinha', 'gato', 'Persa', 12, 'femea', 'pequeno', 'Muito calma, ideal para apartamento.', 'https://source.unsplash.com/random/600x400/?cat', 1);