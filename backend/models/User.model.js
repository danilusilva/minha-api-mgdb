// models/User.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório.'], // Validação básica
    trim: true // Remove espaços em branco antes e depois
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório.'],
    unique: true, // Garante que o e-mail não se repita
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Por favor, insira um e-mail válido.'] // Validação de formato
  },
  idade: {
    type: Number,
    required: [true, 'A idade é obrigatória.'],
    min: [0, 'A idade não pode ser negativa.'] // Validação de valor
  }
}, {
  // Adiciona 'createdAt' e 'updatedAt' automaticamente
  timestamps: true
});

// 'User' será o nome da "collection" (tabela) no MongoDB (automaticamente pluralizado para 'users')
module.exports = mongoose.model('User', userSchema);