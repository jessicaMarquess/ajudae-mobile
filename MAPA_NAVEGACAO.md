# 🗺️ Mapa de Navegação e Estrutura do Projeto

## 📱 Fluxo de Navegação

```
┌──────────────────────────────────────────────────────────────┐
│                 AJUDAÉ - PLATAFORMA DE ENSINO               │
└──────────────────────────────────────────────────────────────┘

    ┌───────────────────────┐
    │   Login / Signup      │
    │        (Auth)         │
    └────────────┬──────────┘
           │
      (autenticação bem-sucedida)
           │
       ┌───────────────┴───────────────┐
       │           Tabs Principal       │
       └───────┬───────────────┬───────┘
         │               │
     ┌─────────▼────────┐  ┌──▼─────────────┐
     │   Home (Posts)   │  │   Admin/Menu   │
     │ - Lista posts    │  │ - Posts Admin  │
     │ - Buscar         │  │ - Professores  │
     │ - Criar post     │  │ - Estudantes   │
     └────────┬─────────┘  └───────────────┘
        │
  ┌───────────▼───────────┬───────────────┐
  │                       │               │
  ┌─────▼─────┐          ┌──────▼─────┐  ┌─────▼─────┐
  │  Ver Post │          │  Editar    │  │  Criar    │
  │ - Detalhe │          │  Post      │  │  Post     │
  │ - Editar  │          │  - Form    │  │  - Form   │
  │ - Deletar │          │  - Salvar  │  │  - Submeter│
  └───────────┘          └────────────┘  └───────────┘

  ┌─────────────────────────────────────────┐
  │               Admin Section             │
  └──────────┬──────────────┬──────────────┘
       │              │
     ┌───────▼──────┐ ┌────▼───────┐ ┌────▼──────┐
     │ Professores  │ │ Estudantes │ │   Posts   │
     │ - Listar     │ │ - Listar   │ │ - Listar  │
     │ - Criar      │ │ - Criar    │ │ - Editar  │
     │ - Editar     │ │ - Editar   │ │ - Deletar │
     │ - Deletar    │ │ - Deletar  │ │           │
     └──────────────┘ └────────────┘ └───────────┘
```

Observações

- Rotas da seção Admin são protegidas e exigem role de professor.
- Ações de editar/deletar no detalhe do post são permitidas ao autor do post ou a professores.

## 📂 Estrutura de Arquivos

```
ajudae-mobile/
│
├── 📄 Documentação
│   ├── README.md                    ← Guia de setup e execução
│   ├── ENDPOINTS.md                 ← Endpoints da API
│   └── MAPA_NAVEGACAO.md            ← Este arquivo
│
├── 🚀 Configuração
│   ├── package.json                 ← Dependências
│   ├── tsconfig.json                ← TypeScript config
│   ├── app.json                     ← Expo config
│   └── eslint.config.js             ← Linter config
│
├── 📱 Código Principal
│   │
│   ├── 📦 app/                      ← Páginas (Expo Router)
│   │   ├── _layout.tsx              ← Root Layout com Providers
│   │   ├── modal.tsx                ← Modal exemplo
│   │   │
│   │   ├── 🔐 (auth)/               ← Stack de autenticação
│   │   │   ├── _layout.tsx          ← Auth Stack
│   │   │   ├── login.tsx            ← Página de Login
│   │   │   └── signup.tsx           ← Cadastro
│   │   │
│   │   ├── 📋 (tabs)/               ← Tabs Navigator
│   │   │   ├── _layout.tsx          ← Tabs config
│   │   │   ├── index.tsx            ← Home (Lista de Posts)
│   │   │   └── explore.tsx          ← Admin Menu
│   │   │
│   │   ├── 🛠️ (admin)/              ← Páginas Administrativas
│   │   │   ├── _layout.tsx          ← Admin Stack
│   │   │   │
│   │   │   ├── 👨‍🏫 teachers/
│   │   │   │   ├── index.tsx        ← Listar Professores
│   │   │   │   ├── create.tsx       ← Criar Professor
│   │   │   │   └── edit/[id].tsx    ← Editar Professor
│   │   │   │
│   │   │   ├── 👨‍🎓 students/
│   │   │   │   ├── index.tsx        ← Listar Estudantes
│   │   │   │   ├── create.tsx       ← Criar Estudante
│   │   │   │   └── edit/[id].tsx    ← Editar Estudante
│   │   │   │
│   │   │   └── 📰 posts/
│   │   │       └── index.tsx        ← Admin de Posts
│   │   │
│   │   └── 📄 post/                 ← Páginas de Posts
│   │       ├── [id].tsx             ← Ver Post Completo
│   │       ├── create.tsx           ← Criar Post
│   │       └── edit/[id].tsx        ← Editar Post
│   │
│   └── 🔗 src/                      ← Lógica de negócio
│       │
│       ├── 🌐 services/             ← APIs
│       │   ├── api.ts               ← Cliente HTTP (Axios + JWT)
│       │   ├── posts.ts             ← Serviço de Posts
│       │   ├── teachers.ts          ← Serviço de Professores
│       │   └── students.ts          ← Serviço de Estudantes
│       │
│       ├── 🎯 contexts/             ← Context API
│       │   └── AuthContext.tsx      ← Contexto de Autenticação
│       │
│       ├── ⚙️ hooks/                ← Custom Hooks
│       │   └── useQueries.ts        ← React Query Hooks
│       │
│       ├── 🏷️ types/                ← TypeScript Types
│       │   └── index.ts             ← Interfaces do projeto
│       │
│       └── 🛠️ utils/                ← Utilitários
│           └── (em desenvolvimento)
│
├── 📦 components/                   ← Componentes Reutilizáveis
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/
│       ├── collapsible.tsx
│       ├── icon-symbol.ios.tsx
│       ├── icon-symbol.tsx
│       └── ...
│
├── 🎨 constants/                    ← Constantes do Projeto
│   └── theme.ts                     ← Cores e temas
│
├── 🎬 hooks/                        ← Hooks fornecidos pelo projeto
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── 🖼️ assets/                       ← Imagens e recursos
│   └── images/
│       ├── icon.png
│       ├── splash.png
│       └── ...
│
└── scripts/                         ← Scripts úteis
    └── reset-project.js             ← Reset do projeto
```

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAMADAS DA APLICAÇÃO                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  📱 APRESENTAÇÃO (Components/Pages)                              │
│  ├── Login Screen                                                │
│  ├── Post List (Home)                                            │
│  ├── Post Detail, Create, Edit                                  │
│  └── Admin Pages (Teachers, Students, Posts)                    │
└────────────────┬─────────────────────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────────────────────┐
│  ⚙️ LÓGICA DE ESTADO (Contexts + React Query)                    │
│  ├── AuthContext → Gerencia autenticação                         │
│  ├── React Query → Caching e sincronização de dados              │
│  └── Hooks customizados → Lógica reutilizável                   │
└────────────────┬─────────────────────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────────────────────┐
│  🔗 SERVIÇOS (Services)                                           │
│  ├── api.ts → Cliente HTTP com autenticação JWT                  │
│  ├── posts.ts → Operações de Posts                               │
│  ├── teachers.ts → Operações de Professores                      │
│  └── students.ts → Operações de Estudantes                       │
└────────────────┬─────────────────────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────────────────────┐
│  📡 API EXTERNA                                                   │
│  └── REST API (localhost:3000/api)                               │
│      ├── Auth (login, refresh)                                   │
│      ├── Posts (CRUD)                                            │
│      ├── Teachers (CRUD)                                         │
│      └── Students (CRUD)                                         │
└──────────────────────────────────────────────────────────────────┘
```

## 🎯 Fluxo de Autenticação

```
┌──────────────┐
│ Usuário      │
│ entra no app │
└──────┬───────┘
       │
       ▼
┌─────────────────────┐
│ AuthProvider verifica│
│ se há token         │
│ armazenado          │
└──────┬──────────────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌─────┐  ┌──────────┐
│ Sim │  │ Não      │
└──┬──┘  └────┬─────┘
   │          │
   ▼          ▼
┌──────────┐  ┌────────────┐
│ Redireciona │ Redireciona│
│ para Home   │ para Login │
└──────┬──────┘ └────┬──────┘
       │             │
       │             ▼
       │        ┌──────────────┐
       │        │ Usuário faz  │
       │        │ login        │
       │        └──────┬───────┘
       │               │
       │               ▼
       │        ┌──────────────┐
       │        │ POST /auth/  │
       │        │ login        │
       │        └──────┬───────┘
       │               │
       │               ▼
       │        ┌──────────────────┐
       │        │ Token armazenado │
       │        │ (secure storage) │
       │        └──────┬───────────┘
       │               │
       └───────┬───────┘
               │
               ▼
        ┌──────────────┐
        │ Token incluído
        │ em cada request
        │ (Authorization)
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │ Se expirar   │
        │ → Refresh    │
        │ automático   │
        └──────────────┘

      Proteções adicionais
      - Rotas de Admin são restritas a usuários com `role = professor`.
      - Ações de editar/deletar post no detalhe são permitidas ao autor do post ou a professores.
```

## 📊 Componentes Principais

### Páginas

| Página      | Arquivo                       | Propósito           |
| ----------- | ----------------------------- | ------------------- |
| Login       | `app/(auth)/login.tsx`        | Autenticação        |
| Signup      | `app/(auth)/signup.tsx`       | Cadastro            |
| Home        | `app/(tabs)/index.tsx`        | Lista de posts      |
| Admin Menu  | `app/(tabs)/explore.tsx`      | Menu administrativo |
| Ver Post    | `app/post/[id].tsx`           | Detalhe do post     |
| Criar Post  | `app/post/create.tsx`         | Criar novo post     |
| Editar Post | `app/post/edit/[id].tsx`      | Editar post         |
| Posts Admin | `app/(admin)/posts/index.tsx` | Gerenciar posts     |
| Teachers    | `app/(admin)/teachers/*`      | CRUD professores    |
| Students    | `app/(admin)/students/*`      | CRUD estudantes     |

### Serviços

| Serviço       | Função       | Método |
| ------------- | ------------ | ------ |
| `api.ts`      | Cliente HTTP | Axios  |
| `posts.ts`    | Posts API    | REST   |
| `teachers.ts` | Teachers API | REST   |
| `students.ts` | Students API | REST   |

### Hooks

| Hook                               | Uso                              |
| ---------------------------------- | -------------------------------- |
| `useAuth()`                        | Acessar contexto de autenticação |
| `useGetPosts()`                    | Listar posts                     |
| `useGetPost()`                     | Obter post específico            |
| `useCreatePost()`                  | Criar post                       |
| `useUpdatePost()`                  | Atualizar post                   |
| `useDeletePost()`                  | Deletar post                     |
| (similar para teachers e students) | ...                              |

## 🔐 Segurança

```
Request
│
├─ Incluir token JWT
│  (interceptador automático)
│
├─ Enviar para API
│  (Authorization: Bearer <token>)
│
└─ Se 401 (token expirado)
   └─ Tentar refresh automático
      ├─ Se sucesso → repetir request
      └─ Se falha → redirecionar para login
```

## 🚀 Como Adicionar Novas Funcionalidades

### 1. Nova Página

```typescript
// 1. Crie arquivo em app/nova-pagina.tsx
export default function NovaPageScreen() {
  // sua lógica aqui
}

// 2. Use no router.push() para navegar
router.push("/nova-pagina");
```

### 2. Novo Serviço

```typescript
// 1. Crie src/services/novo-servico.ts
export const novoService = {
  async buscar() {
    return api.get("/endpoint");
  },
};

// 2. Crie hooks em useQueries.ts
export const useNovoServico = () => {
  return useQuery({
    queryKey: ["novo"],
    queryFn: () => novoService.buscar(),
  });
};

// 3. Use nos componentes
const { data } = useNovoServico();
```

### 3. Novo Type

```typescript
// src/types/index.ts
export interface NovoType {
  id: string;
  nome: string;
  // ...
}
```

## 📚 Recursos Úteis

- **Documentação**: Veja `README.md` para setup e scripts
- **API**: Consulte `ENDPOINTS.md` para chamadas e autenticação
- **Estrutura**: Este arquivo `MAPA_NAVEGACAO.md`

---

**Projeto estruturado e pronto para desenvolvimento! 🎉**
