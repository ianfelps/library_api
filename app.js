const express = require('express');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// importar rotas
// const userRoutes = require('./routes/users');
// const bookRoutes = require('./routes/books');

// inicializar o express
const app = express();
const port = process.env.PORT;

// configurar o swagger
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// configurar o express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rota raiz
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'Bem vindo a API de biblioteca pessoal!',
        timestamp: new Date().toISOString()
    });
});

// importar rotas
// app.use('/api/users', userRoutes);
// app.use('/api/books', bookRoutes);

// tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

const banner = `
██╗     ██╗██████╗ ██████╗  █████╗ ██████╗ ██╗   ██╗     █████╗ ██████╗ ██╗
██║     ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝    ██╔══██╗██╔══██╗██║
██║     ██║██████╔╝██████╔╝███████║██████╔╝ ╚████╔╝     ███████║██████╔╝██║
██║     ██║██╔══██╗██╔══██╗██╔══██║██╔══██╗  ╚██╔╝      ██╔══██║██╔═══╝ ██║
███████╗██║██████╔╝██║  ██║██║  ██║██║  ██║   ██║       ██║  ██║██║     ██║
╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝  ╚═╝╚═╝     ╚═╝`;

// iniciar o servidor
app.listen(port, () => {
    console.clear();
    console.log(banner);
    console.log(`Server started on port ${port} !`);
    console.log(`API available at: http://localhost:${port}/api !`);
    console.log(`Swagger Docs available at: http://localhost:${port}/api-docs !`);
});