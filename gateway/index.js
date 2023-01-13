const express = require('express');

const userRouter = require('./user');

// const { requiresAuth } = require('./auth');

const app = express();
const PORT = 5001;

// app.use(requiresAuth);

app.use(express.json());

app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`server at ${PORT}`);
});
