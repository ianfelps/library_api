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
        return res.status(400).json({ error: 'All fields are required!' });
    }
    if (password.length < 6) { // senha deve ter pelo menos 6 caracteres
        return res.status(400).json({ error: 'Password must be at least 6 characters long!' });
    }

    try {
        const password_hash = await bcrypt.hash(password, 10); // criptografia da senha
        const query = 'INSERT INTO User_TB (name, email, password) VALUES (?, ?, ?)';
        const [result] = await pool.query(query, [name, email, password_hash]);

        return res.status(201).json({ message: 'User created successfully!', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // email deve ser unico
            return res.status(400).json({ error: 'E-mail already exists!' });
        }
        return res.status(500).json({ error: 'Error creating user!', details: error.message });
    }
});

// rota POST para login de um usuario
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    // validacoes
    if (!email || !password) { // email e senha sao obrigatorios
        return res.status(400).json({ error: 'E-mail and password are required!' });
    }

    try {
        const query = 'SELECT * FROM User_TB WHERE email = ?';
        const [[user]] = await pool.query(query, [email]);

        if (!user) { // usuario nao encontrado
            return res.status(404).json({ error: 'User not found!' });
        }

        const password_match = await bcrypt.compare(password, user.password); // comparacao da senha

        if (password_match) { // senha correta
            const payload = {
                id_user: user.id_user,
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
                id_user: user.id_user,
                token: jwt_token
            }); // resposta

        } else { // senha incorreta
            return res.status(401).json({ error: 'Password is incorrect!' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error logging in!', details: error.message });
    }
});

// rota GET para obter informacoes do usuario logado
router.get('/me', auth.authMiddleware, async (req, res) => {
    try {
        const query = 'SELECT id_user, name, email, create_date FROM User_TB WHERE id_user = ?';
        const [[user]] = await pool.query(query, [req.user.id_user]);
        if (!user) { // usuario nao encontrado
            return res.status(404).json({ error: 'User not found!' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Error getting user info!', details: error.message });
    }
});

// rota PUT para atualizar informacoes do usuario logado
router.put('/edit', auth.authMiddleware, async (req, res) => {
    const { name, email, password } = req.body;

    // verificar informacoes recebidas
    const fields = [];
    const values = [];
    if (name) fields.push('name = ?') && values.push(name);
    if (email) fields.push('email = ?') && values.push(email);
    if (password){
        if (password.length < 6) { // senha deve ter pelo menos 6 caracteres
            return res.status(400).json({ error: 'Password must be at least 6 characters long!' });
        }
        fields.push('password = ?')
        const password_hash = await bcrypt.hash(password, 10); // criptografia da senha
        values.push(password_hash);
    }
    
    if (fields.length === 0) { // pelo menos um campo deve ser atualizado
        return res.status(400).json({ error: 'At least one field must be updated!' });
    }
    values.push(req.user.id_user);

    try {
        const query = 'UPDATE User_TB SET ' + fields.join(', ') + ' WHERE id_user = ?';
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) { // usuario nao encontrado
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        return res.status(200).json({ message: 'User info updated successfully!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // email deve ser unico
            return res.status(400).json({ error: 'E-mail already exists!' });
        }
        return res.status(500).json({ error: 'Error updating user info!', details: error.message });
    }
});

// rota DELETE para excluir o usuario logado e os dados relacionados
// - somente com o proprio perfil
// - deve estar logado
// - excluir/anonimar todos os dados relacionados ao usuario

module.exports = router;