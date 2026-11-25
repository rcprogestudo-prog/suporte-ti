const app = require('./app');

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`Servidor em http://localhost:${PORTA}/login.html`);
});
