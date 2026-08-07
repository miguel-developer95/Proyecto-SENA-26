const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, "node"res) => {
  res.send('Servidor Express funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
