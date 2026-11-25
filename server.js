const express = require('express');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const apoioRoutes = require('./src/routes/apoio');
const chamadosRoutes = require('./src/routes/chamados');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', authRoutes);
app.use('/api', apoioRoutes);
app.use('/api/chamados', chamadosRoutes);

// Tratamento central de erros
app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).json({ erro: 'Erro no servidor' });
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`Servidor em http://localhost:${PORTA}/login.html`);
});