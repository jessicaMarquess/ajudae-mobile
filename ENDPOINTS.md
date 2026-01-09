# Documentação de Endpoints - Ajudae API

## Autenticação

Todos os endpoints (exceto `/` e `/auth/*`) requerem **UM** dos seguintes:

- **API Key**: Header `x-api-key: ak_test_12345_permanent_key_for_frontend_testing`
- **JWT Bearer**: Header `Authorization: Bearer <token>`

---

## 🏠 Saúde da API

### GET `/`

Retorna mensagem de boas-vindas

- **Autenticação**: Nenhuma
- **Response**: String

```bash
curl http://localhost:3000/
```

---

## 🔐 Autenticação (sem proteção)

### POST `/auth/register`

Registra um novo usuário

- **Autenticação**: Nenhuma
- **Body**:

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "role": "ALUNO" // ou "PROFESSOR"
}
```

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"novo@escola.com",
    "password":"123456",
    "name":"Novo Usuário",
    "role":"ALUNO"
  }'
```

### POST `/auth/login`

Faz login e retorna JWT token

- **Autenticação**: Nenhuma
- **Body**:

```json
{
  "email": "prof.silva@escola.com",
  "password": "123456"
}
```

- **Response**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"prof.silva@escola.com","password":"123456"}'
```

---

## 👥 Usuários

### GET `/users`

Lista todos os usuários (ou filtra por role)

- **Autenticação**: API Key ou JWT
- **Query Params**:
  - `role` (opcional): `ALUNO` ou `PROFESSOR`

```bash
# Todos os usuários
curl -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  http://localhost:3000/users

# Apenas professores
curl -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  http://localhost:3000/users?role=PROFESSOR
```

### GET `/users/professores`

Lista apenas professores

- **Autenticação**: API Key ou JWT

```bash
curl -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  http://localhost:3000/users/professores
```

### GET `/users/alunos`

Lista apenas alunos

- **Autenticação**: API Key ou JWT

```bash
curl -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  http://localhost:3000/users/alunos
```

### GET `/users/:id`

Obtém um usuário específico

- **Autenticação**: API Key ou JWT
- **Params**: `id` (número do usuário)

```bash
curl -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  http://localhost:3000/users/1
```

### POST `/users`

Cria um novo usuário

- **Autenticação**: API Key ou JWT
- **Body**:

```json
{
  "email": "novo.usuario@escola.com",
  "password": "senha123",
  "name": "Novo Usuário",
  "role": "ALUNO"
}
```

```bash
curl -X POST http://localhost:3000/users \
  -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"novo@escola.com",
    "password":"123456",
    "name":"Novo",
    "role":"ALUNO"
  }'
```

### PATCH `/users/:id`

Atualiza um usuário

- **Autenticação**: API Key ou JWT
- **Params**: `id` (número do usuário)
- **Body** (todos opcionais):

```json
{
  "email": "novo.email@escola.com",
  "password": "nova_senha",
  "name": "Novo Nome"
}
```

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  -H "Content-Type: application/json" \
  -d '{"name":"Nome Atualizado"}'
```

### DELETE `/users/:id`

Deleta um usuário

- **Autenticação**: API Key ou JWT
- **Params**: `id` (número do usuário)

```bash
curl -X DELETE http://localhost:3000/users/1 \
  -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing"
```

---

## 📝 Posts

### GET `/posts`

Lista todos os posts

- **Autenticação**: API Key ou JWT

```bash
curl -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  http://localhost:3000/posts
```

### GET `/posts/:id`

Obtém um post específico

- **Autenticação**: API Key ou JWT
- **Params**: `id` (número do post)

```bash
curl -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  http://localhost:3000/posts/1
```

### POST `/posts`

Cria um novo post

- **Autenticação**: API Key ou JWT
- **Body**:

```json
{
  "title": "Título do Post",
  "content": "Conteúdo do post aqui"
}
```

```bash
curl -X POST http://localhost:3000/posts \
  -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Novo Post",
    "content":"Conteúdo aqui"
  }'
```

### PATCH `/posts/:id`

Atualiza um post

- **Autenticação**: API Key ou JWT
- **Params**: `id` (número do post)
- **Body** (todos opcionais):

```json
{
  "title": "Novo Título",
  "content": "Novo Conteúdo"
}
```

```bash
curl -X PATCH http://localhost:3000/posts/1 \
  -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  -H "Content-Type: application/json" \
  -d '{"title":"Título Atualizado"}'
```

### DELETE `/posts/:id`

Deleta um post

- **Autenticação**: API Key ou JWT
- **Params**: `id` (número do post)

```bash
curl -X DELETE http://localhost:3000/posts/1 \
  -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing"
```

---

## 🔌 API (Endpoints Alternativos)

Mesmos endpoints dos usuários, mas prefixados com `/api`:

### GET `/api/users`

### GET `/api/users/professores`

### GET `/api/users/alunos`

### GET `/api/users/:id`

### POST `/api/users`

### PATCH `/api/users/:id`

### DELETE `/api/users/:id`

### GET `/api/health`

### GET `/api/health`

Health check da API

- **Autenticação**: API Key ou JWT

```bash
curl -H "x-api-key: ak_test_12345_permanent_key_for_frontend_testing" \
  http://localhost:3000/api/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2026-01-08T01:40:57.000Z",
  "message": "API funcionando com API Key"
}
```

---

## 📋 Roles

- **PROFESSOR**: Professor
- **ALUNO**: Aluno

---

## 🔑 Credenciais de Teste

**Professor:**

- Email: `prof.silva@escola.com`
- Password: `123456`

**API Key:**

- `ak_test_12345_permanent_key_for_frontend_testing`

**JWT Secret:**

- `sua_chave_secreta_aqui`

---

## Exemplo Completo com JWT

```bash
# 1. Fazer login para obter token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"prof.silva@escola.com","password":"123456"}' | jq -r '.access_token')

echo "Token: $TOKEN"

# 2. Usar token para acessar endpoints protegidos
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/posts

# 3. Criar um novo post
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Meu Post","content":"Conteúdo aqui"}'
```

---

## Exemplo Completo com API Key

```bash
# Tudo funciona com apenas um header
API_KEY="ak_test_12345_permanent_key_for_frontend_testing"

# Listar posts
curl -H "x-api-key: $API_KEY" http://localhost:3000/posts

# Criar post
curl -X POST http://localhost:3000/posts \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title":"Novo","content":"Conteúdo"}'

# Listar usuários
curl -H "x-api-key: $API_KEY" http://localhost:3000/users
```
