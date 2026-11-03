# Guia de execução e salvamento local

## Executar o projeto

Na raiz do repositório:

```bash
pnpm install
pnpm check
pnpm test
pnpm build
pnpm dev
```

Configure as variáveis de ambiente do banco e da autenticação apenas no ambiente local. Arquivos `.env`, credenciais, logs, `node_modules` e `dist` não devem ser enviados ao GitHub.

## Estrutura principal

O código da interface está em `client/`, a API em `server/`, o schema e as migrações em `drizzle/` e os tipos compartilhados em `shared/`. Materiais acadêmicos ficam em `docs/academic/`, o roteiro de validação em `docs/validation/` e os guias em `docs/guides/`.

## PDF acadêmico

O arquivo final está em `docs/academic/Relatorio_Desenvolvimento_Validacao_Inicial.pdf`. Para regenerá-lo após editar o conteúdo, compile a fonte Typst:

```bash
cd docs/academic
typst compile Relatorio_Desenvolvimento_Validacao_Inicial.typ Relatorio_Desenvolvimento_Validacao_Inicial.pdf
```

As comprovações de evidências serão incluídas pelo grupo posteriormente; por isso, elas não fazem parte deste PDF-base.
