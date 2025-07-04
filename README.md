# 📚 Library API - API para Gestão de Usuários e Biblioteca Pessoal de Livros

<pre>
██╗     ██╗██████╗ ██████╗  █████╗ ██████╗ ██╗   ██╗     █████╗ ██████╗ ██╗
██║     ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝    ██╔══██╗██╔══██╗██║
██║     ██║██████╔╝██████╔╝███████║██████╔╝ ╚████╔╝     ███████║██████╔╝██║
██║     ██║██╔══██╗██╔══██╗██╔══██║██╔══██╗  ╚██╔╝      ██╔══██║██╔═══╝ ██║
███████╗██║██████╔╝██║  ██║██║  ██║██║  ██║   ██║       ██║  ██║██║     ██║
╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝  ╚═╝╚═╝     ╚═╝
</pre>

API REST completa, desenvolvida com Node.js e Express, para a criação e gerenciamento de uma biblioteca de livros pessoal. A aplicação utiliza MySQL para persistência de dados e possui um sistema de autenticação seguro baseado em tokens JWT para proteger as rotas.

## 🚀 Funcionalidades

### Gerenciamento de Usuários
-   **Registro:** Criação de novos usuários com nome, e-mail e senha. O e-mail é único e a senha é armazenada de forma segura com hash (bcryptjs).
-   **Autenticação:** Login de usuários com e-mail e senha, retornando um token JWT com expiração de 1 hora.
-   **Gerenciamento de Perfil:** Usuários autenticados podem visualizar, atualizar e excluir suas próprias contas.
-   **Segurança:** Acesso a rotas de perfil e livros protegido por middleware de autenticação JWT.

### Gerenciamento de Livros
-   **CRUD Completo:** Usuários autenticados podem cadastrar, listar, editar e excluir seus livros.
-   **Validações e Regras de Negócio:**
    -   Campos obrigatórios: `título`, `autor`, `ano` e `gênero`.
    -   O título do livro deve ter no mínimo 2 caracteres e o ano de publicação não pode ser no futuro.
    -   Um usuário não pode cadastrar o mesmo livro (título e autor) duas vezes.
    -   **Limite total:** Máximo de 5 livros por usuário.
    -   **Limite por gênero:** Máximo de 2 livros de "Biography" e 3 de "Science Fiction".
-   **Listagem Avançada:** A rota de listagem de livros suporta:
    -   **Filtros:** por `autor`, `gênero`, `ano` e `status`.
    -   **Ordenação:** por qualquer campo principal, em ordem ascendente (`asc`) ou descendente (`desc`).

*O projeto utiliza um banco de dados MySQL para armazenar os dados dos usuários e livros. A estrutura do banco de dados pode ser visualizada [aqui](docs/diagram.png).*

*Este projeto atende a todas as funcionalidades descritas no arquivo de [desafio](docs/challenge.md).*

## 🛠️ Tecnologias Utilizadas

-   **Backend:** Node.js
-   **Framework:** Express.js
-   **Banco de Dados:** MySQL
-   **Autenticação:** JSON Web Tokens (JWT)
-   **Criptografia de Senhas:** BcryptJS
-   **Driver MySQL:** mysql2
-   **Documentação da API:** Swagger (via `swagger-ui-express`)
-   **Variáveis de Ambiente:** Dotenv


## ⚙️ Configuração e Execução

### Pré-requisitos
-   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
-   [npm](https://www.npmjs.com/)
-   Um servidor MySQL em execução.

### Passos para Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/ianfelps/library_api.git
    cd library_api
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Banco de Dados:**
    -   Acesse seu servidor MySQL.
    -   Execute o script SQL para criar o schema e as tabelas: `database/Library_DB.sql`.
    -   O script já inclui a relação `ON DELETE CASCADE`, que remove os livros de um usuário quando a conta é excluída.

4.  **Configure as Variáveis de Ambiente:**
    -   Crie um arquivo `.env` na raiz do projeto.
    -   Use o exemplo abaixo como modelo e preencha com suas credenciais:

    ```env

    # Configurações do Servidor
    PORT=3000

    # Configurações do Banco de Dados
    DB_HOST=localhost
    DB_USER=seu_usuario_mysql
    DB_PASSWORD=sua_senha_mysql
    DB_NAME=Library_DB

    # Segredo para o JWT
    JWT_SECRET=seu_segredo_super_secreto_aqui

    # Configurações de URL
    URL=http://localhost:3000
    ```

5.  **Adicione o script de "start" (Recomendado):**
    -   No seu arquivo `package.json`, adicione a linha `"start": "node app.js"` dentro do objeto `"scripts"`:
    ```json
    "scripts": {
      "start": "node app.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    ```

6.  **Inicie o servidor:**
    ```bash
    npm start
    ```

7.  **Acesse a API:**
    -   **Servidor:** `http://localhost:3000/api`
    -   **Documentação Interativa (Swagger):** `http://localhost:3000/api-docs`

## 📖 Endpoints da API

A documentação completa e interativa, com todos os detalhes sobre os endpoints, schemas e exemplos, está disponível através do [Swagger UI](docs/swagger.png).

### Principais Rotas

| Método | Endpoint                    | Descrição                                 | Requer Autenticação |
| :----- | :-------------------------- | :---------------------------------------- | :------------------ |
| `POST` | `/users/register`           | Registra um novo usuário.                 | Não                 |
| `POST` | `/users/login`              | Realiza o login e obtém um token JWT.     | Não                 |
| `GET`  | `/users/me`                 | Obtém os dados do usuário logado.         | **Sim** |
| `PUT`  | `/users/edit`               | Atualiza os dados do usuário logado.      | **Sim** |
| `DELETE`| `/users/delete`             | Deleta o usuário e todos os seus dados.   | **Sim** |
| `POST` | `/books/register`           | Cadastra um novo livro.                   | **Sim** |
| `GET`  | `/books/list`               | Lista e filtra os livros do usuário.      | **Sim** |
| `PUT`  | `/books/edit/{id_book}`     | Edita um livro específico.                | **Sim** |
| `DELETE`| `/books/delete/{id_book}`   | Deleta um livro específico.               | **Sim** |

## 🌐 Deploy

O deploy desta aplicação foi realizado utilizando os seguintes serviços:

-   **Backend (Node.js/Express):** Hospedado na plataforma **[Render](https://render.com/)**, que gerencia o deploy contínuo a partir do repositório no GitHub.
-   **Banco de Dados (MySQL):** Hospedado na **[Clever Cloud](https://www.clever-cloud.com/)**, garantindo um banco de dados relacional estável e seguro.

*As variáveis de ambiente (`DB_HOST`, `JWT_SECRET`, etc.) foram configuradas diretamente nos painéis de serviço da Render para garantir a segurança das credenciais.*

### Acesse a API

A API está disponível publicamente e pode ser acessada através dos seguintes links:

- **URL Base da API:** [`https://library-api-t563.onrender.com/api`](https://library-api-t563.onrender.com/api)
- **Documentação Interativa (Swagger):** [`https://library-api-t563.onrender.com/api-docs`](https://library-api-t563.onrender.com/api-docs)
