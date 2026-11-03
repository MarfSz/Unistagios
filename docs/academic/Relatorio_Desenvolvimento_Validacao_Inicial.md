# Projeto Integrador IV — Atividade Avaliativa 2

## Relatório de Desenvolvimento e Validação Inicial

**Projeto:** Unistágios  
**Curso:** Análise e Desenvolvimento de Sistemas — Universidade de Taubaté (UNITAU)  
**Disciplina:** Projeto Integrador IV — Curricularização da Extensão  
**Percurso:** B — Projeto em andamento  
**Comunidade beneficiada:** estudantes da UNITAU e empresas interessadas em contratar estagiários da universidade  
**Integrantes:** Vicenzo Burti, Pedro Falsetti, Gustavo Ramiro, Marco Antonio e Romar
**Data:** outubro de 2026

## 1. Identificação

O Unistágios é uma plataforma web exclusiva para a comunidade UNITAU. O projeto conecta estudantes que procuram estágio a empresas que desejam encontrar talentos por curso, período, cidade e competências. A responsabilidade pelo contato com estudantes, empresas, recrutadores e parceiros externos pertence ao grupo inteiro.

O desenvolvimento é realizado pelos quatro integrantes. Vicenzo Burti coordena o levantamento de requisitos em conjunto com o grupo; Pedro Falsetti atua na arquitetura, backend, API e integração com o banco; Gustavo Ramiro concentra frontend, experiência do usuário, responsividade e acessibilidade; Marco Antônio atua na modelagem de dados, testes, documentação e apoio à validação. As decisões de produto e os contatos externos são discutidos coletivamente.

## 2. Síntese do projeto

### Problema

Estudantes da UNITAU encontram oportunidades de estágio espalhadas por redes sociais, grupos de mensagens, páginas institucionais e plataformas genéricas. Essa dispersão dificulta encontrar vagas compatíveis com formação, período, localização e modalidade. Ao mesmo tempo, empresas locais e organizações parceiras têm dificuldade de descobrir estudantes da universidade com perfis alinhados às suas necessidades.

### Público

O público primário é formado por estudantes de graduação da UNITAU, especialmente aqueles em busca da primeira experiência profissional. O público secundário reúne empresas, startups, escritórios, comércios e instituições que oferecem estágios e desejam filtrar estudantes por curso, período, cidade e competências.

### Objetivo

Desenvolver um ambiente confiável e organizado para aproximar estudantes UNITAU e empresas, reduzindo a dispersão das oportunidades e facilitando a descoberta de talentos dentro da própria comunidade universitária.

### Solução proposta

O Unistágios oferece dois percursos complementares. O estudante cria um perfil com curso, período, cidade, biografia, objetivo, competências e currículo; consulta vagas, aplica filtros e acompanha candidaturas. A empresa cria seu perfil, publica vagas com cursos-alvo, consulta o diretório de estudantes e inicia conversas com perfis de interesse. O sistema também registra o histórico das candidaturas e permite revisar seus status.

## 3. Evolução desde a primeira atividade

Na Atividade Avaliativa 1, o projeto estava descrito como uma proposta de plataforma e possuía uma base inicial de frontend, backend e banco de dados. Desde então, a evolução deixou de ser apenas conceitual: foi construída uma versão parcial funcional, com autenticação, onboarding persistido, perfis distintos para estudante e empresa, publicação de vagas, filtros, candidaturas, diretório de estudantes e conversas.

O escopo foi ajustado para reforçar a exclusividade UNITAU. A proposta deixou de tratar uma rede ampla ou nacional e passou a concentrar estudantes da universidade, empresas parceiras e cursos relacionados. A identidade visual também foi revisada para uma linguagem azulada associada à UNITAU, com logo institucional no cabeçalho.

Outra alteração importante foi a inclusão de mensagens persistidas. Na primeira atividade, o contato entre empresa e estudante era uma evolução planejada. Na versão atual, a empresa pode iniciar uma conversa pelo diretório e as duas partes podem trocar mensagens dentro do portal. Também foram incluídos encerramento de vagas e revisão do status das candidaturas pela empresa.

As modificações foram justificadas pela necessidade de demonstrar um produto coerente com o problema: não basta listar vagas; é necessário estruturar perfis, descoberta ativa de estudantes e comunicação entre as partes. A validação com representantes externos ainda será incorporada pelo grupo após a aplicação do roteiro específico, sem atribuir resultados não coletados.

## 4. Requisitos principais

### Requisitos funcionais

| Código | Requisito |
|---|---|
| RF01 | Permitir autenticação e escolha do tipo de perfil: estudante ou empresa. |
| RF02 | Permitir que o estudante mantenha curso, período, cidade, biografia, objetivo, competências e currículo. |
| RF03 | Permitir que a empresa mantenha seu perfil institucional e área de atuação. |
| RF04 | Permitir publicar, consultar, filtrar e encerrar vagas de estágio. |
| RF05 | Permitir definir cursos-alvo, área, cidade, modalidade e prazo da vaga. |
| RF06 | Permitir que estudantes consultem vagas e registrem candidaturas. |
| RF07 | Permitir que empresas consultem e filtrem o diretório de estudantes UNITAU. |
| RF08 | Permitir que empresas revisem o status de candidaturas. |
| RF09 | Permitir iniciar e manter conversas entre empresa e estudante. |
| RF10 | Manter os registros relacionados em banco de dados relacional. |

### Requisitos não funcionais

A solução deve ser responsiva e utilizável em computadores e dispositivos móveis; apresentar linguagem clara em português brasileiro; respeitar a separação de permissões entre estudante e empresa; proteger dados pessoais e permitir a revisão das informações fornecidas; manter contratos tipados entre frontend e backend; oferecer estados vazios e mensagens de orientação; e preservar desempenho adequado para uma primeira comunidade de usuários. O código deve ser testável, organizado e passível de evolução.

## 5. Desenvolvimento realizado

A aplicação foi construída com React 19, TypeScript e Tailwind CSS no frontend. O servidor utiliza Node.js, Express e tRPC para disponibilizar uma API tipada. A persistência utiliza Drizzle ORM com MySQL/TiDB. O modelo de dados contém usuários, perfis estudantis, perfis empresariais, vagas, candidaturas, conversas e mensagens.

A autenticação conduz o usuário ao onboarding e mantém a escolha entre estudante e empresa. No espaço estudantil, o usuário edita seu perfil, filtra vagas e acompanha candidaturas. No espaço empresarial, o usuário publica ou encerra vagas, consulta estudantes por filtros, revisa candidaturas e inicia conversas. A página inicial comunica a proposta exclusiva da UNITAU e apresenta as vagas publicadas pela comunidade.

A qualidade técnica foi verificada com TypeScript, Vitest e build de produção. O projeto possui testes automatizados para autenticação, regras de vagas, candidaturas, proteções por papel e fluxos de mensagens. Na última verificação, foram aprovados o type-check, a suíte com 14 testes e a compilação de produção.

O estágio atual é de versão parcial funcional. A aplicação já permite demonstrar os principais fluxos, mas ainda depende de usuários e empresas reais para validar linguagem, privacidade, critérios de moderação, clareza dos filtros e utilidade da comunicação.

## 6. Integração com os conhecimentos do curso

O projeto aplica análise de sistemas na identificação do problema, definição dos atores e levantamento dos requisitos. A engenharia de software aparece na separação por camadas, na organização do monorepo, nos contratos tRPC, no controle de permissões, nas migrações e nos testes automatizados.

Os conteúdos de desenvolvimento web são aplicados na construção da interface React responsiva, nos componentes reutilizáveis e na experiência distinta para estudante e empresa. Banco de dados e modelagem são aplicados nas tabelas relacionais e nas relações entre perfis, vagas, candidaturas e mensagens. Segurança da informação é considerada na autenticação, na separação de papéis e na proteção de dados pessoais.

A acessibilidade e a ética profissional orientam a linguagem, o contraste, o uso em diferentes telas e a necessidade de evitar discriminação por critérios não relacionados ao estágio. A escolha tecnológica foi feita por coerência com o problema e com a capacidade de manutenção do grupo, não pela adoção indiscriminada de todas as tecnologias do curso.

## 7. Aspectos éticos, legais e de segurança

O sistema trata dados pessoais e acadêmicos, como nome, e-mail, curso, período, cidade, biografia, competências e currículo. A coleta deve ser limitada ao necessário para a finalidade de aproximar estudantes e empresas. O estudante deve compreender quais informações ficam visíveis para empresas e poder revisar ou retirar dados do perfil.

A plataforma deve seguir princípios da Lei Geral de Proteção de Dados, especialmente finalidade, necessidade, transparência, segurança e responsabilização. O grupo não deve compartilhar dados de teste como se fossem dados reais, nem divulgar currículos ou contatos fora do contexto autorizado. Empresas e recrutadores deverão usar as informações apenas para processos de estágio e respeitar a privacidade dos estudantes.

No aspecto técnico, a autenticação e os procedimentos protegidos impedem operações incompatíveis com o papel do usuário. O banco não deve armazenar arquivos em colunas de texto ou bytes; o currículo atualmente é referenciado por link, e uma evolução futura poderá utilizar armazenamento de arquivos com controle de acesso. Também serão necessárias moderação de empresas e vagas, denúncias, bloqueio de contatos abusivos e registro de ações relevantes.

O projeto não utiliza algoritmo de decisão automática para classificar ou eliminar candidatos. Os filtros são informados pelos próprios usuários e devem ser apresentados de forma transparente. A interface deverá ser revisada para reduzir barreiras de acesso e evitar linguagem discriminatória.

## 8. Validação com o público externo

A versão parcial foi preparada para ser apresentada a estudantes da UNITAU e a representantes de empresas ou recrutadores que possam avaliar a proposta. A interação será realizada por demonstração remota ou presencial, acompanhada de entrevista curta e formulário. O grupo utilizará o roteiro separado de validação para investigar hábitos atuais, utilidade dos filtros, clareza do cadastro, confiança nas vagas, privacidade e funcionamento das conversas.

No momento da elaboração deste relatório, a etapa de contato externo ainda está pendente de registro formal. Por isso, não são apresentados depoimentos, números ou conclusões inventadas. A aplicação já está tecnicamente preparada para a demonstração, e a seção de resultados deverá ser atualizada pelo grupo depois que a interação ocorrer.

## 9. Resultados da validação

Os resultados desta seção serão preenchidos após a primeira interação documentada com a comunidade externa. O registro deverá organizar os pontos positivos, problemas identificados, sugestões recebidas, necessidades não contempladas e alterações incorporadas ao backlog.

A análise será feita comparando as tarefas previstas com as dificuldades observadas. Entre as tarefas estão criar um perfil, localizar uma vaga, publicar uma oportunidade, filtrar estudantes, iniciar uma conversa e acompanhar uma candidatura. A intenção é demonstrar que a participação da comunidade modifica decisões do produto, em vez de limitar o parceiro à condição de receptor de uma solução pronta.

Até que a etapa ocorra, o resultado técnico verificável é a existência de uma versão navegável e funcional, com os fluxos principais implementados e testes automatizados aprovados. Essa informação não substitui a validação externa e será complementada pelo grupo.

## 10. Planejamento da ação extensionista

A ação extensionista principal será uma demonstração orientada do Unistágios para estudantes UNITAU e empresas ou recrutadores convidados. O formato previsto é uma oficina remota ou presencial, com duração aproximada de 60 a 90 minutos. O grupo apresentará o problema, demonstrará os dois percursos da plataforma, conduzirá tarefas simples e reservará tempo para perguntas e sugestões.

A ação será organizada pelo grupo inteiro. Vicenzo fará a abertura e contextualização; Pedro explicará a arquitetura e os fluxos de backend; Gustavo conduzirá a navegação de estudante e empresa, com atenção à usabilidade; Marco apresentará os testes, o roteiro de avaliação e o registro dos aprendizados. Os quatro integrantes participarão do contato com a comunidade e da análise das respostas.

Serão necessários computador, conexão à internet, ambiente de demonstração, roteiro de tarefas, formulário de avaliação e material breve de orientação. Espera-se que os participantes compreendam a proposta, consigam realizar tarefas básicas e indiquem ajustes para uma versão mais segura, clara e útil.

## 11. Indicadores de avaliação

| Indicador | Forma de avaliação |
|---|---|
| Conclusão de tarefas | Percentual de participantes que conseguem concluir cadastro, filtro, candidatura ou mensagem sem ajuda. |
| Percepção de utilidade | Nota média atribuída por estudantes e empresas ao valor da plataforma para localizar ou divulgar estágios. |
| Clareza da interface | Avaliação dos participantes sobre entendimento dos campos, filtros, status e mensagens. |
| Intenção de utilização | Percentual de participantes que afirmam que usariam ou recomendariam a plataforma. |
| Ajustes incorporados | Quantidade de sugestões da comunidade transformadas em alterações no backlog ou no produto. |

## 12. Próximas etapas

1. Realizar a demonstração e a entrevista com estudantes e empresas ou recrutadores.
2. Registrar as respostas de forma anonimizada e revisar os requisitos com base nos achados.
3. Ajustar privacidade, moderação, acessibilidade, linguagem e filtros conforme as necessidades identificadas.
4. Testar o fluxo de mensagens e candidaturas com usuários convidados.
5. Preparar a oficina de devolutiva e o guia de uso para a comunidade.
6. Consolidar os indicadores, as alterações realizadas e o planejamento da conclusão do projeto.

O projeto não precisa estar concluído nesta etapa. O objetivo do Marco 2 é demonstrar evolução concreta, coerência entre problema e solução, integração dos conhecimentos do curso e preparação responsável para a validação e a ação extensionista final.
