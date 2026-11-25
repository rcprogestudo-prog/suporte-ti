# Log de prompts

## 1. Modelagem do banco
- **Contexto:** requisitos da AV2 de Banco de Dados (CREATE, INSERT, UPDATE, DELETE, SELECT, JOIN, mestre-detalhe).
- **Prompt:** pedi um sistema em SQL para um suporte de TI com esses requisitos.
- **Resposta da IA:** modelo com técnicos, clientes, chamados e itens do chamado, em Oracle.
- **Ajuste manual:** o professor já havia aprovado um script Oracle meu, com `chamado` e `atendimento`; usamos essa estrutura e não a da IA.

## 2. Banco para a interface web
- **Contexto:** o sistema com login e tela precisava de um banco mais simples que o Oracle.
- **Prompt:** pedi a adaptação do script do professor para MySQL, uma tabela por vez.
- **Resposta da IA:** tabelas em MySQL, com AUTO_INCREMENT no lugar das sequences.
- **Ajuste manual:** digitei e testei cada comando no terminal do MySQL e corrigi a ordem de criação (tipo_atendimento antes de chamado).

## 3. Troca para SQLite
- **Contexto:** o deploy exigia MySQL na nuvem, e o prazo era curto.
- **Prompt:** perguntei se havia banco mais simples; a IA sugeriu SQLite e adaptou o servidor.
- **Resposta da IA:** `banco.js` com as tabelas e dados de teste, e as rotas separadas em módulos.
- **Ajustes manuais:** o `npm install` foi parar em outra pasta por falta de `package.json`; corrigimos com `npm init`. Também corrigi o nome do arquivo `chamdos.html` e sua pasta, e conferi o `chamados.html` linha por linha.

## 4. Git e GitHub
- **Prompt:** pedi o passo a passo de repositório, branches e Pull Requests.
- **Ajuste manual:** a pasta estava dentro de outro repositório; criei um repositório próprio com `git init` e confirmei com `git rev-parse --show-toplevel`.