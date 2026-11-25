process.env.DB_PATH = ':memory:';

const test = require('node:test');
const assert = require('node:assert');
const app = require('../app');

let servidor;
let base;

async function chamar(rota, metodo = 'GET', corpo) {
  const resposta = await fetch(base + rota, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined
  });
  const dados = await resposta.json();
  return { status: resposta.status, dados };
}

test.before(() => new Promise((resolve) => {
  servidor = app.listen(0, () => {
    base = `http://localhost:${servidor.address().port}`;
    resolve();
  });
}));

test.after(() => servidor.close());

test('login com credenciais corretas retorna o usuario', async () => {
  const { status, dados } = await chamar('/api/login', 'POST', { login: 'admin', senha: 'admin123' });
  assert.strictEqual(status, 200);
  assert.strictEqual(dados.login, 'admin');
});

test('login com senha errada retorna 401', async () => {
  const { status } = await chamar('/api/login', 'POST', { login: 'admin', senha: 'errada' });
  assert.strictEqual(status, 401);
});

test('lista os chamados de teste com JOIN', async () => {
  const { status, dados } = await chamar('/api/chamados');
  assert.strictEqual(status, 200);
  assert.ok(dados.length >= 3);
});

test('abrir chamado sem defeito retorna 400', async () => {
  const { status } = await chamar('/api/chamados', 'POST', { id_cliente: 1, id_tipo: 1 });
  assert.strictEqual(status, 400);
});

test('status invalido retorna 400', async () => {
  const { status } = await chamar('/api/chamados/1/status', 'PUT', { status: 'INVENTADO' });
  assert.strictEqual(status, 400);
});

test('excluir chamado remove detalhe e mestre', async () => {
  const { status } = await chamar('/api/chamados/2', 'DELETE');
  assert.strictEqual(status, 200);

  const { dados } = await chamar('/api/chamados');
  assert.ok(!dados.some((c) => c.id_chamado === 2));
});