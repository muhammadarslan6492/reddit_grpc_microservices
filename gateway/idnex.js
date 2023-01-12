const express = require('express');

const { requiresAuth } = require('./auth');

const app = express();
const PORT = 5001;

app.use(requiresAuth);
app.use(express.json());

app.listen(PORT, () => {
  console.log(`server at ${PORT}`);
});
