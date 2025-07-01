const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../database/pool');
const auth = require('../middleware/auth');

// rota POST para criar um usuario
router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    // validacoes
    if (!name || !email || !password) { // todos os campos sao obrigatorios
        return res.status(400).json({ error: 'Todos os campos obrigatorios devem ser preenchidos!' });
    }
    if (password.length < 6) { // senha deve ter pelo menos 6 caracteres
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres!' });
    }

    // criacao do usuario
    try {
        const password_hash = await bcrypt.hash(password, 10); // criptografia da senha
        const query = 'INSERT INTO User_TB (name, email, password) VALUES (?, ?, ?)';
        const [result] = await pool.query(query, [name, email, password_hash]);

        return res.status(201).json({ message: 'Usuario cadastrado com sucesso!', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // email deve ser unico
            return res.status(400).json({ error: 'E-mail ja cadastrado!' });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar usuario!' });
    }
});

// rota POST para login de um usuario
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    // validacoes
    if (!email || !password) { // email e senha sao obrigatorios
        return res.status(400).json({ error: 'E-mail e senha obrigatorios!' });
    }

    // login do usuario
    try {
        const query = 'SELECT * FROM User_TB WHERE email = ?';
        const [[user]] = await pool.query(query, [email]);

        if (!user) { // usuario nao encontrado
            return res.status(404).json({ error: 'Usuario nao encontrado!' });
        }

        const password_match = await bcrypt.compare(password, user.password); // comparacao da senha

        if (password_match) { // senha correta
            const payload = {
                id: user.id_user,
                name: user.name,
                email: user.email
            }; // payload para geracao do token

            const jwt_token = jwt.sign(
                payload,
                auth.JWT_SECRET,
                { expiresIn: '1h' } // token expira em 1 hora
            ); // geracao do token de autenticacao

            return res.status(200).json({
                message: 'Login realizado com sucesso!',
                id: user.id_user,
                token: jwt_token
            }); // resposta

        } else { // senha incorreta
            return res.status(401).json({ error: 'Senha incorreta!' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao realizar login!' });
    }
});

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

module.exports = router;