# Gestão de Cardápio

Aplicação frontend para visualizar e gerenciar cardápios escolares.

## Prérequisitos

1. Clone o repositório.
2. Navegue até a pasta do projeto.
3. Instale dependências:

```bash
npm install
```

## Executar localmente

Inicie o servidor de desenvolvimento com Vite:

```bash
npm run dev
```

Abra o endereço exibido no terminal.

## Scripts úteis

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: gera build de produção
- `npm run preview`: pré-visualiza a build de produção
- `npm run lint`: verifica o código com ESLint
- `npm run lint:fix`: corrige problemas automaticamente
- `npm run typecheck`: valida tipos com TypeScript

## Estrutura do projeto

- `src/`: código-fonte da aplicação React
- `src/api/client.js`: cliente local de autenticação e entidades
- `src/lib/AuthContext.jsx`: provedor de autenticação e estado de usuário
- `src/pages/`: páginas da aplicação

## Notas

O projeto usa armazenamento local para simular usuários, sessões e dados do cardápio durante o desenvolvimento.
