const express = require('express');
const router = express.Router();

const pool = require('../database/pool');
const auth = require('../middleware/auth');

// rota GET para obter informacoes da rota
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Books section of the Library API!',
        timestamp: new Date().toISOString()
    });
});

// rota POST para cadastrar um livro
router.post('/register', auth.authMiddleware, async (req, res) => {
    const { title, author, year, genre } = req.body;

    // validacoes
    if (!title || !author || !year || !genre) { // todos os campos sao obrigatorios
        return res.status(400).json({ error: 'All fields are required!' });
    }
    if (title.length < 2) { // titulo deve ter pelo menos 2 caracteres
        return res.status(400).json({ error: 'Title must be at least 2 characters long!' });
    }
    if (year > new Date().getFullYear()) { // ano de publicacao nao pode ser futuro
        return res.status(400).json({ error: 'Year cannot be in the future!' });
    }

    try {
        // validar limite de 5 livros por usuario
        const val_query = 'SELECT COUNT(*) AS count FROM Book_TB WHERE user_id = ?';
        const [[val_result]] = await pool.query(val_query, [req.user.id_user]);
        if (val_result.count >= 5) { // maximo de 5 livros por usuario
            return res.status(400).json({ error: 'You can only register 5 books per user!' });
        }

        // validar limite de 2 livros com o genero "biografia"
        const val_query2 = 'SELECT COUNT(*) AS count FROM Book_TB WHERE genre = "Biography" AND user_id = ?';
        const [[val_result2]] = await pool.query(val_query2, [req.user.id_user]);
        if (genre === 'Biography' && val_result2.count >= 2) {
            return res.status(400).json({ error: 'You can only register 2 books with the genre *Biography* per user!' });
        }

        // validar limite de 3 livros com o genero "ficcao cientifica"
        const val_query3 = 'SELECT COUNT(*) AS count FROM Book_TB WHERE genre = "Science Fiction" AND user_id = ?';
        const [[val_result3]] = await pool.query(val_query3, [req.user.id_user]);
        if (genre === 'Science Fiction' && val_result3.count >= 3) {
            return res.status(400).json({ error: 'You can only register 3 books with the genre *Science Fiction* per user!' });
        }

        const query = 'INSERT INTO Book_TB (title, author, year, genre, user_id) VALUES (?, ?, ?, ?, ?)';
        const [result] = await pool.query(query, [title, author, year, genre, req.user.id_user]);

        return res.status(201).json({
            message: 'Book created successfully!',
            id_book: result.insertId,
            id_user: req.user.id_user,
            create_date: new Date().toISOString()
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // livro deve ser unico
            return res.status(400).json({ error: 'Book already exists!' });
        }
        return res.status(500).json({ error: 'Error registering book!', details: error.message });
    }
});

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

module.exports = router;