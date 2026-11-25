const express = require('express');
const { db } = require('../db/banco');

const router = express.Router();

router.get('/clientes', (req, res) => {
  res.json(db.prepare('SELECT id_cliente, nome FROM cliente ORDER BY nome').all());
});

router.get('/tipos', (req, res) => {
  res.json(db.prepare('SELECT id_tipo, descricao FROM tipo_atendimento ORDER BY descricao').all());
});

router.get('/tecnicos', (req, res) => {
  res.json(db.prepare('SELECT id_tecnico, nome FROM tecnico ORDER BY nome').all());
});

module.exports = router;