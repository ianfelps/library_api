const express = require('express');
const router = express.Router();

const pool = require('../database/pool');
const authMiddleware = require('./middleware/auth');

// rotas

// cadastrar um livro
// - deve estar logado
// - titulo, autor, ano de publicacao e genero obrigatorios
// - titulo deve ter no minimo 2 caracteres
// - ano de publicacao nao pode ser futuro
// - nao pode cadastrar livros duplicados (mesmo titulo e autor)
// - maximo de 5 livros por usuario
// - - somente 2 livros com o genero "biografia"
// - - somente 3 livros com o genero "ficção científica"
// - - outros generos não possuem limites
// - mensagem de erro clara ao usuario

// listar todos os livros
// - somente os proprios livros
// - deve estar logado

// editar um livro
// - somente os proprios livros
// - deve estar logado

// excluir um livro
// - somente os proprios livros
// - deve estar logado

// filtrar livros por titulo
// - somente os proprios livros
// - deve estar logado

// filtrar livros por autor
// - somente os proprios livros
// - deve estar logado

// filtrar livros por genero
// - somente os proprios livros
// - deve estar logado

// filtrar livros por status
// - somente os proprios livros
// - deve estar logado