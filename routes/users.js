const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../database/pool');
const authMiddleware = require('./middleware/auth');

// rotas

// criar um usuario
// - email unico
// - senha criptografada (hash) com no minimo 6 caracteres

// login de um usuario
// - token de autenticacao expira em determinado tempo
// - autenticacao jwt

// ver o usuario logado
// - somente com o proprio perfil
// - deve estar logado

// atualizar o usuario logado
// - somente com o proprio perfil
// - deve estar logado

// excluir o usuario logado
// - somente com o proprio perfil
// - deve estar logado
// - excluir/anonimar todos os dados relacionados ao usuario