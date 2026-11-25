const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const db = new Database(path.join(__dirname, '..', '..', 'suporte.db'));
db.pragma('foreign_keys = ON');

function hashSenha(senha) {
  return crypto.createHash('sha256').update(senha).digest('hex');
}

db.exec(`
  CREATE TABLE IF NOT EXISTS tecnico (
    id_tecnico    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome          TEXT NOT NULL,
    especialidade TEXT,
    telefone      TEXT
  );

  CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome       TEXT NOT NULL,
    setor      TEXT,
    telefone   TEXT
  );

  CREATE TABLE IF NOT EXISTS tipo_atendimento (
    id_tipo   INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS chamado (
    id_chamado           INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente           INTEGER NOT NULL REFERENCES cliente(id_cliente),
    id_tipo              INTEGER NOT NULL REFERENCES tipo_atendimento(id_tipo),
    defeito              TEXT NOT NULL,
    configuracao_maquina TEXT,
    data_abertura        TEXT DEFAULT CURRENT_TIMESTAMP,
    status_solucao       TEXT NOT NULL DEFAULT 'ABERTO'
      CHECK (status_solucao IN ('ABERTO','EM ANDAMENTO','AGUARDANDO PECA','CONCLUIDO','CANCELADO'))
  );

  CREATE TABLE IF NOT EXISTS atendimento (
    id_atendimento    INTEGER PRIMARY KEY AUTOINCREMENT,
    id_chamado        INTEGER NOT NULL REFERENCES chamado(id_chamado),
    id_tecnico        INTEGER NOT NULL REFERENCES tecnico(id_tecnico),
    data_atendimento  TEXT DEFAULT CURRENT_TIMESTAMP,
    procedimento      TEXT NOT NULL,
    conclusao_entrega TEXT,
    data_entrega      TEXT
  );

  CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    login      TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    perfil     TEXT NOT NULL DEFAULT 'TECNICO' CHECK (perfil IN ('ADMIN','TECNICO')),
    id_tecnico INTEGER REFERENCES tecnico(id_tecnico)
  );
`);

function popularDadosDeTeste() {
  const total = db.prepare('SELECT COUNT(*) AS n FROM tecnico').get().n;
  if (total > 0) return;

  db.exec(`
    INSERT INTO tecnico (nome, especialidade, telefone) VALUES
      ('Carlos Silva', 'Computadores e redes', '(11) 99999-1111'),
      ('Mariana Souza', 'Impressoras', '(11) 99999-2222');

    INSERT INTO cliente (nome, setor, telefone) VALUES
      ('Ana Oliveira', 'Financeiro', '(11) 98888-1111'),
      ('Pedro Santos', 'Recursos Humanos', '(11) 98888-2222');

    INSERT INTO tipo_atendimento (descricao) VALUES ('Computador'), ('Impressora'), ('Internet');

    INSERT INTO chamado (id_cliente, id_tipo, defeito, configuracao_maquina, status_solucao) VALUES
      (1, 1, 'Computador nao liga', 'Intel Core i5, 8 GB de RAM e Windows 11', 'EM ANDAMENTO'),
      (2, 2, 'Impressora nao imprime', 'Impressora laser conectada pela rede', 'EM ANDAMENTO'),
      (1, 3, 'Computador sem acesso a internet', 'Notebook com Windows 10 e conexao Wi-Fi', 'ABERTO');

    INSERT INTO atendimento (id_chamado, id_tecnico, procedimento) VALUES
      (1, 1, 'Teste da fonte e limpeza dos componentes'),
      (2, 2, 'Reinstalacao do driver da impressora');
  `);

  const inserirUsuario = db.prepare(
    'INSERT INTO usuario (login, senha_hash, perfil, id_tecnico) VALUES (?, ?, ?, ?)'
  );
  inserirUsuario.run('admin', hashSenha('admin123'), 'ADMIN', null);
  inserirUsuario.run('carlos', hashSenha('carlos123'), 'TECNICO', 1);
}

popularDadosDeTeste();

module.exports = { db, hashSenha };