const express = require('express');
const router = express.Router();

const pool = require('../database/pool');
const auth = require('../middleware/auth');

// rota GET para obter informacoes da rota
router.get('/', auth.authMiddleware, (req, res) => {
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
        // validacoes
        const val_query = `
            SELECT
                COUNT(*) AS total_count,
                SUM(CASE WHEN genre = 'Biography' THEN 1 ELSE 0 END) AS biography_count,
                SUM(CASE WHEN genre = 'Science Fiction' THEN 1 ELSE 0 END) AS science_fiction_count
            FROM Book_TB
            WHERE user_id = ?;
        `;
        const [[val_result]] = await pool.query(val_query, [req.user.id_user]);
        if (val_result.total_count >= 5) { // nao pode registrar mais de 5 livros
            return res.status(400).json({ error: 'You can only register 5 books per user!' });
        }
        if (genre === 'Biography' && val_result.biography_count >= 2) { // nao pode registrar mais de 2 livros com o genero "Biography"
            return res.status(400).json({ error: 'You can only register 2 books with the genre *Biography* per user!' });
        }
        if (genre === 'Science Fiction' && val_result.science_fiction_count >= 3) { // nao pode registrar mais de 3 livros com o genero "Science Fiction"
            return res.status(400).json({ error: 'You can only register 3 books with the genre *Science Fiction* per user!' });
        }

        // registrar livro
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