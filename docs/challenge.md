# 🚀 Desafio API com Node.js, Express  
## Funcionalidades: Gestão de Usuários e Biblioteca Pessoal de Livros

---

## 👤 Usuário

### User Stories
- Como usuário, quero me registrar com nome, e-mail e senha para acessar a plataforma.  
- Como usuário, quero fazer login com meu e-mail e senha para acessar minha conta de forma segura.  
- Como usuário autenticado, quero visualizar meus dados pessoais (nome, e-mail).  
- Como usuário autenticado, quero atualizar minhas informações pessoais para mantê-las corretas.  
- Como usuário, quero poder excluir minha conta para sair da plataforma definitivamente.

### Regras de Negócio
- O e-mail deve ser único no sistema.  
- A senha deve ser armazenada com hash seguro e ter no mínimo 6 caracteres.  
- Apenas usuários autenticados podem acessar, editar ou excluir seus dados.  
- O usuário só pode modificar ou excluir seu próprio perfil.  
- Ao excluir a conta, os dados pessoais devem ser removidos ou anonimizados.  
- O token de autenticação deve expirar após um período definido.

---

## 📚 Livros

### User Stories
- Como usuário autenticado, quero cadastrar livros na minha biblioteca para organizar minha coleção pessoal.  
- Como usuário, quero listar todos os livros que cadastrei para acompanhar minha coleção.  
- Como usuário, quero editar informações dos meus livros para mantê-las atualizadas.  
- Como usuário, quero excluir livros da minha biblioteca quando desejar.  
- Como usuário, quero filtrar meus livros por título, autor ou status de leitura.

### Regras de Negócio
- Apenas usuários autenticados podem cadastrar, visualizar, editar ou excluir livros.  
- Cada livro deve ter título, autor, ano de publicação e gênero obrigatórios.  
- O título deve ter pelo menos 2 caracteres e o ano não pode ser futuro.  
- O mesmo usuário não pode cadastrar dois livros com o mesmo título e autor.  
- Cada usuário pode ter no máximo 5 livros cadastrados no total.  
- Desses 5 livros, no máximo 2 podem ser do gênero **“biografia”**.  
- Desses 5 livros, no máximo 3 podem ser do gênero **“ficção científica”**.  
- Os demais gêneros não têm limite específico, respeitando o teto geral de 5 livros.  
- Um usuário só pode editar ou excluir os livros que ele cadastrou.  
- O sistema deve impedir o acesso aos livros de outros usuários.  
- Ao tentar cadastrar um livro que ultrapasse qualquer limite (total ou por gênero), o sistema deve recusar a operação com mensagem clara.

---

## Casos de Uso Importantes

- **Cadastro de novo usuário:** validação de dados, hash da senha, garantir e-mail único.  
- **Login (opcional):** validação de credenciais e geração de token JWT.  
- **Visualização e edição do perfil:** acesso restrito ao próprio usuário.  
- **Exclusão da conta:** remoção segura dos dados.  
- **Cadastro de livro:** validação dos campos, verificação dos limites totais e por gênero antes da inserção.  
- **Listagem e filtragem:** retornar somente livros do usuário, com filtros opcionais.  
- **Edição e exclusão de livro:** somente pelo dono do livro, respeitando as regras de unicidade.

---

## 💾 Armazenamento de Dados

Você pode utilizar **qualquer banco de dados** (relacional ou não-relacional) ou **estratégia de persistência** que preferir (como arquivos JSON, SQLite, PostgreSQL, MongoDB, etc.).

---

## 🌟 Recursos Opcionais (Valem Pontos Adicionais)

- Implementar **autenticação com JWT**.  
- Utilizar **Docker** para containerização da aplicação.  
- Realizar **deploy** da API em alguma plataforma de nuvem, como a **Vercel**, **Render**, **Railway** ou similar.

---
