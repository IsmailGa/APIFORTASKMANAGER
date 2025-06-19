require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');

app.use(express.json());

// TODO: добавить роуты
app.use('/api/user', userRoutes);
app.use('/api/cards', cardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 