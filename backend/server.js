// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares (softwares que rodam entre requisições)
app.use(cors()); // Permite requisições de outras origens (frontend)
app.use(express.json()); // Permite que o express entenda JSON

// --- Conexão com o MongoDB ---
// 'cadastrodb' é o nome do banco de dados
const MONGO_URI = "mongodb://localhost:27017/cadastrodb";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch((err) => console.error('Erro ao conectar no MongoDB:', err));

// --- Rota de Teste ---
app.get('/', (req, res) => {
  res.send('API de Cadastro está funcionando!');
});

// --- Importando o Modelo ---
const User = require('./models/User.model');


// --- Rota para listar todos os usuários (GET) ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários.' });
  }
});

// --- Rota de Cadastro (POST) ---
app.post('/api/register', async (req, res) => {
  try {
    const { nome, email, idade } = req.body;

    if (!nome || !email || !idade) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const newUser = new User({ nome, email, idade });
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: savedUser });

  } catch (error) {
    console.error('Erro ao cadastrar:', error.message);

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});


// --- Rota de Atualização (PUT) ---
app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { nome, email, idade } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { nome, email, idade },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar o usuário.' });
  }
});


// --- Rota de Delete (DELETE) ---
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar o usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar o usuário.' });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});