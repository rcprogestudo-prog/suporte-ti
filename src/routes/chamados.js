const express = require('express');
const { db } = require('../db/banco');

const router = express.Router();

const STATUS_VALIDOS = ['ABERTO', 'EM ANDAMENTO', 'AGUARDANDO PECA', 'CONCLUIDO', 'CANCELADO'];

router.get('/', (req, res) => {
  const linhas = db.prepare(`
    SELECT c.id_chamado, cl.nome AS cliente, ta.descricao AS tipo,
           c.defeito, c.status_solucao, c.data_abertura,
           t.nome AS tecnico, a.procedimento
    FROM chamado c
    INNER JOIN cliente cl ON cl.id_cliente = c.id_cliente
    INNER JOIN tipo_atendimento ta ON ta.id_tipo = c.id_tipo
    LEFT JOIN atendimento a ON a.id_chamado = c.id_chamado
    LEFT JOIN tecnico t ON t.id_tecnico = a.id_tecnico
    ORDER BY c.id_chamado DESC
  `).all();
  res.json(linhas);
});

router.post('/', (req, res) => {
  const { id_cliente, id_tipo, defeito, configuracao_maquina } = req.body;
  if (!defeito) {
    return res.status(400).json({ erro: 'Informe o defeito' });
  }
  db.prepare(
    'INSERT INTO chamado (id_cliente, id_tipo, defeito, configuracao_maquina) VALUES (?, ?, ?, ?)'
  ).run(id_cliente, id_tipo, defeito, configuracao_maquina);
  res.json({ ok: true });
});

router.post('/atendimentos', (req, res) => {
  const { id_chamado, id_tecnico, procedimento } = req.body;
  if (!procedimento) {
    return res.status(400).json({ erro: 'Informe o procedimento' });
  }

  const atribuir = db.transaction(() => {
    db.prepare(
      'INSERT INTO atendimento (id_chamado, id_tecnico, procedimento) VALUES (?, ?, ?)'
    ).run(id_chamado, id_tecnico, procedimento);
    db.prepare(
      "UPDATE chamado SET status_solucao = 'EM ANDAMENTO' WHERE id_chamado = ? AND status_solucao = 'ABERTO'"
    ).run(id_chamado);
  });

  atribuir();
  res.json({ ok: true });
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ erro: 'Status inválido' });
  }
  db.prepare('UPDATE chamado SET status_solucao = ? WHERE id_chamado = ?').run(status, req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  const excluir = db.transaction((id) => {
    db.prepare('DELETE FROM atendimento WHERE id_chamado = ?').run(id);
    db.prepare('DELETE FROM chamado WHERE id_chamado = ?').run(id);
  });

  excluir(req.params.id);
  res.json({ ok: true });
});

module.exports = router;