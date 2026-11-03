# Unistágios

Plataforma web exclusiva para aproximar estudantes da UNITAU e empresas que oferecem oportunidades de estágio.

## Visão geral

O Unistágios possui experiências diferentes para estudantes e empresas. Estudantes criam perfis acadêmico-profissionais, consultam vagas, aplicam filtros e acompanham candidaturas. Empresas mantêm perfis institucionais, publicam vagas, filtram estudantes UNITAU e iniciam conversas com candidatos.

## Funcionalidades implementadas

- Autenticação e onboarding com escolha entre estudante e empresa.
- Perfil estudantil com curso, período, competências, biografia, objetivo e currículo por link.
- Perfil institucional para empresas parceiras.
- Publicação, filtro e encerramento de vagas direcionadas a cursos UNITAU.
- Candidaturas com histórico para estudantes e revisão de status para empresas.
- Diretório de estudantes UNITAU filtrável por curso, período, cidade e competência.
- Conversas persistidas entre empresas e estudantes, iniciadas pelo diretório.
- Layout responsivo em português brasileiro e identidade visual azulada com logo UNITAU.

## Organização do repositório

| Diretório | Conteúdo |
|---|---|
| `client/` | Interface React, páginas, componentes e ativos públicos. |
| `server/` | API tRPC, autenticação, regras de negócio e acesso ao banco. |
| `drizzle/` | Schema, relações e migrações do banco de dados. |
| `shared/` | Constantes, tipos e utilitários compartilhados. |
| `docs/academic/` | Relatório da Atividade Avaliativa 2, fonte Typst/Markdown e orientações acadêmicas. |
| `docs/validation/` | Roteiro para a validação com a comunidade UNITAU. |
| `docs/guides/` | Guia de execução e salvamento local. |

Arquivos de build, dependências, logs, configurações privadas, PDFs de exportação e pacotes ZIP não são mantidos na raiz do repositório.

## Stack

React, TypeScript, Tailwind CSS, Express, tRPC, Drizzle ORM, MySQL/TiDB e Vitest.

## Como executar localmente

1. Instale Node.js 20+ e pnpm.
2. Configure as variáveis de ambiente localmente, sem versionar arquivos `.env`.
3. Instale as dependências com `pnpm install`.
4. Gere/aplique as tabelas com `pnpm db:push`.
5. Inicie o modo de desenvolvimento com `pnpm dev`.

Comandos de validação:

```bash
pnpm check
pnpm test
pnpm build
```

## Documentação acadêmica

O relatório atualizado está em `docs/academic/Relatorio_Desenvolvimento_Validacao_Inicial.md`. A versão PDF pode ser gerada a partir de `docs/academic/Relatorio_Desenvolvimento_Validacao_Inicial.typ` com Typst. A seção de evidências obrigatórias foi deliberadamente excluída para ser preenchida posteriormente pelo grupo.

A validação externa ainda deve ser realizada com estudantes e empresas ou recrutadores reais. Depois da interação, registre os resultados em `docs/validation/Roteiro_Validacao_Externa.md` e atualize as seções de validação do relatório.
