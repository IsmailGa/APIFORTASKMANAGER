require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const boardRoutes = require('./routes/board');
const columnRoutes = require('./routes/column');
const cors = require('cors');

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Замените на ваш фронтенд URL
  credentials: true
}));

// API routes
app.use('/api/user', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 