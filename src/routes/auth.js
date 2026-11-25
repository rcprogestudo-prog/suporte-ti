const express = require('express');
const { db, hashSenha } = require('../db/banco');

const router = express.Router();

router.post('/login', (req, res) => {
  const { login, senha } = req.body;
  const usuario = db
    .prepare('SELECT id_usuario, login, perfil FROM usuario WHERE login = ? AND senha_hash = ?')
    .get(login, hashSenha(senha || ''));

  if (!usuario) {
    return res.status(401).json({ erro: 'Login ou senha inválidos' });
  }
  res.json(usuario);
});

module.exports = router;
