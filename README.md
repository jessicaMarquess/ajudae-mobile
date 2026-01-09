# Ajudaé Mobile

Aplicativo mobile em Expo/React Native para a plataforma Ajudaé, com fluxo de autenticação, gerenciamento de posts e área administrativa para professores e estudantes.

## Sumário

- Visão geral
- Requisitos
- Configuração rápida
- Variáveis de ambiente
- Scripts disponíveis
- Estrutura do projeto
- Integração com API
- Mapa de navegação
- Dicas de desenvolvimento

---

## Visão geral

Este projeto usa Expo Router (file-based routing) e `axios` para comunicação com a API. Tokens de autenticação são armazenados via `expo-secure-store` com renovação automática de `access_token` usando `refresh_token`.

## Requisitos

- Node.js LTS e npm
- Expo CLI (opcional, pode usar `npx expo`)
- Android Studio (emulador Android) ou Xcode (simulador iOS)

## Configuração rápida

1. Instale dependências

   ```bash
   npm install
   ```

2. Configure a URL da API (opcional, padrão: `http://localhost:3000`)

   ```bash
   # Linux/macOS (temporário para a sessão)
   export REACT_APP_API_URL="http://localhost:3000"

   # Emulador Android acessando API local do host
   # Use 10.0.2.2 em vez de localhost
   export REACT_APP_API_URL="http://10.0.2.2:3000"
   ```

3. Inicie o app

   ```bash
   npm run start
   ```

   Opções úteis:

   ```bash
   npm run android       # abre no emulador Android
   npm run ios           # abre no simulador iOS
   npm run web           # abre no navegador
   npm run start:tunnel  # túnel para dispositivos reais
   ```

## Variáveis de ambiente

Gerenciadas em `src/config/env.ts`.

- `REACT_APP_API_URL`: base da API (ex.: `http://localhost:3000`). Se não definido, usa `http://localhost:3000`.
- `NODE_ENV`: `development` (padrão) ou `production`.
- `DEBUG`: se `true`, ativa logs extras.

Defina no shell antes de iniciar o Metro bundler:

```bash
export REACT_APP_API_URL="http://10.0.2.2:3000"  # Android emulador
export NODE_ENV=development
export DEBUG=true
```

> Dica: ao usar dispositivo físico, garanta que o backend esteja acessível na rede (IP da máquina ou túnel).

## Scripts disponíveis

```bash
npm run start         # inicia o servidor do Expo
npm run start:tunnel  # inicia com túnel
npm run start:lan     # inicia em rede local
npm run android       # abre no emulador Android
npm run android:tunnel
npm run ios           # abre no simulador iOS
npm run ios:tunnel
npm run web
npm run lint          # executa ESLint
npm run reset-project # reseta o projeto (script auxiliar)
```

## Estrutura do projeto

Principais diretórios:

- `app/`: páginas e navegação com Expo Router (stacks, tabs, admin, auth, posts).
- `src/services/`: cliente HTTP e serviços (`api.ts`, `posts.ts`, `students.ts`, `teachers.ts`).
- `src/contexts/`: contexto de autenticação.
- `components/`: componentes reutilizáveis.
- `constants/`: tema e constantes.

Veja o mapa completo em `MAPA_NAVEGACAO.md`.

## Integração com API

- Base da API: configurável via `REACT_APP_API_URL`. Padrão: `http://localhost:3000`.
- Autenticação: JWT Bearer automático via interceptador (token no `SecureStore`).
- Renovação: 401 dispara `POST /auth/refresh` (se houver `refresh_token`).
- Exemplos de endpoints usados no app:
  - `GET /posts`, `POST /posts`, `PATCH /posts/:id`, `DELETE /posts/:id`
  - `GET /users`, `GET /users/professores`, `GET /users/alunos`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id`

Detalhes e exemplos estão em `ENDPOINTS.md`.

## Mapa de navegação

Fluxos completos (auth, tabs, admin e posts) com diagrama: `MAPA_NAVEGACAO.md`.

## Dicas de desenvolvimento

- Android emulador acessando `localhost`: use `http://10.0.2.2:3000`.
- Dispositivo físico: use `npm run start:tunnel` e exponha o backend (túnel ou IP acessível).
- Tokens: armazenados em `expo-secure-store`; em alguns ambientes, o armazenamento seguro pode falhar — o app mantém token em memória como fallback.
- Lint: `npm run lint` para manter o estilo consistente.

## Reset do projeto (opcional)

O script `npm run reset-project` move o código atual para `app-example/` e recria uma base mínima em `app/`. Use apenas se quiser começar do zero.

---

Feito com Expo, React Native e React Query.
# ajudae-mobile
