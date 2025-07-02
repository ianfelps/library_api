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

    // validacoes de entrada
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
        // validacoes de banco de dados
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

// rota GET para listar todos os livros do usuario
router.get('/list', auth.authMiddleware, async (req, res) => {
    try {
        // listar todos os livros
        const query = 'SELECT id_book, title, author, year, genre, status, create_date FROM Book_TB WHERE user_id = ?';
        const [result] = await pool.query(query, [req.user.id_user]);
        if (result.length === 0) { // nenhum livro encontrado
            return res.status(404).json({ error: 'No books found!' });
        }

        return res.status(200).json(result);
        
    } catch (error) {
        return res.status(500).json({ error: 'Error listing books!', details: error.message });
    }
});

// rota PUT para editar um livro
router.put('/edit/:id_book', auth.authMiddleware, async (req, res) => {
    const { id_book } = req.params;
    const { title, author, year, genre, status } = req.body;

    // verificar informacoes recebidas
    const fields = [];
    const values = [];

    // validacoes de entrada
    if (title) {
        if (title.length < 2) { // titulo deve ter pelo menos 2 caracteres
            return res.status(400).json({ error: 'Title must be at least 2 characters long!' });
        }
        fields.push('title = ?')
        values.push(title);
    }

    if (author) fields.push('author = ?') && values.push(author);
    
    if (year) {
        if (year > new Date().getFullYear()) { // ano de publicacao nao pode ser futuro
            return res.status(400).json({ error: 'Year cannot be in the future!' });
        }
        fields.push('year = ?')
        values.push(year);
    }

    if (genre) fields.push('genre = ?') && values.push(genre);
    
    if (status) fields.push('status = ?') && values.push(status);

    if (fields.length === 0) { // pelo menos um campo deve ser atualizado
        return res.status(400).json({ error: 'At least one field must be updated!' });
    }

    values.push(id_book);
    values.push(req.user.id_user);

    try {
        // validacoes de banco de dados
        const cur_query = 'SELECT genre FROM Book_TB WHERE id_book = ? AND user_id = ?';
        const [[cur_result]] = await pool.query(cur_query, [id_book, req.user.id_user]);
        if (!cur_result) { // livro nao encontrado
            return res.status(404).json({ error: 'Book not found!' });
        }

        const val_query = `
            SELECT
            SUM(CASE WHEN genre = 'Biography' THEN 1 ELSE 0 END) AS biography_count,
            SUM(CASE WHEN genre = 'Science Fiction' THEN 1 ELSE 0 END) AS science_fiction_count
            FROM Book_TB
            WHERE user_id = ?;
        `;
        const [[val_result]] = await pool.query(val_query, [req.user.id_user]);

        let biography_count = val_result.biography_count || 0;
        let science_fiction_count = val_result.science_fiction_count || 0;

        // se o livro atual for Biography ou Science Fiction, subtrai 1 da respectiva contagem
        if (cur_result.genre === 'Biography') {
            biography_count -= 1;
        }

        if (cur_result.genre === 'Science Fiction') {
            science_fiction_count -= 1;
        }

        if (genre === 'Biography' && biography_count >= 2) {
            return res.status(400).json({ error: 'You can only register 2 books with the genre *Biography* per user!' });
        }

        if (genre === 'Science Fiction' && science_fiction_count >= 3) {
            return res.status(400).json({ error: 'You can only register 3 books with the genre *Science Fiction* per user!' });
        }

        // editar livro
        const query = 'UPDATE Book_TB SET ' + fields.join(', ') + ' WHERE id_book = ? AND user_id = ?';
        const [result] = await pool.query(query, values);
        if (result.affectedRows === 0) { // livro nao encontrado
            return res.status(404).json({ error: 'Book not found!' });
        }

        return res.status(200).json({ message: 'Book edited successfully!' });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // livro deve ser unico
            return res.status(400).json({ error: 'Book already exists!' });
        }

        return res.status(500).json({ error: 'Error editing book!', details: error.message });
    }
});

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