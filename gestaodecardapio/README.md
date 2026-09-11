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
npm install
npm run dev
```

Abra o endereço exibido no terminal.

## Ambientes

O app roda 100% no navegador com dois ambientes separados:

- Desenvolvimento: usa namespace `gestao-cardapio-dev` no localStorage e mantém dados de demo iniciais.
- Produção: usa namespace `gestao-cardapio-prod` no localStorage e não semeia dados de exemplo.

Para trocar o ambiente, defina a variável:

```bash
VITE_APP_ENV=development
# ou
VITE_APP_ENV=production
```

Se não for definida, o Vite usa `development` por padrão.

## Usuário administrador mestre

O projeto sempre cria um perfil de administrador mestre na primeira execução no navegador, mesmo em produção:

- E-mail: `admin@escolaintegral.com`
- Senha: `admin123`

Esse usuário tem acesso à área de gestão do cardápio e pode adicionar/editar/excluir itens e avisos.

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
