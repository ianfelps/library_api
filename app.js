const express = require('express');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const banner = require('./utils/banner');
const swaggerDocument = require('./utils/swagger.json');

// importar rotas
const userRoutes = require('./routes/users');
// const bookRoutes = require('./routes/books');

// inicializar o express
const app = express();
const port = process.env.PORT;

// configurar o swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// configurar o express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rota raiz
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Library API!',
        timestamp: new Date().toISOString()
    });
});

// importar rotas
app.use('/api/users', userRoutes);
// app.use('/api/books', bookRoutes);

// tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something got wrong!');
});

// iniciar o servidor
app.listen(port, () => {
    console.clear();
    console.log(banner);
    console.log(`Server started on port ${port} !`);
    console.log(`API available at: http://localhost:${port}/api !`);
    console.log(`Swagger Docs available at: http://localhost:${port}/api-docs !`);
});