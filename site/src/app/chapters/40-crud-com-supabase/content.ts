import type { ChapterContent } from '../types';

export const CHAPTER_40: ChapterContent = {
  summary: [
    'O Supabase oferece uma API REST para cada tabela: POST cria, GET lê, PATCH atualiza e DELETE apaga, em `/rest/v1/<tabela>`.',
    'Filtros vão nos parâmetros: `id=eq.7` diz qual linha; `select` escolhe as colunas e `order` ordena.',
    'Cada pedido leva o `apikey` (o projeto) e o `Authorization` (quem pede); o interceptor põe os dois.',
    'O RLS liga as regras por linha, e as políticas dizem quem alcança o quê: `auth.uid() = user_id`. É o banco que protege os dados, e não a tela.',
    '`Prefer: return=representation` devolve a linha criada; `Prefer: resolution=merge-duplicates` faz o POST virar upsert.',
  ],
  essentials: ['40/etapa/supabase/passaporte.sql', '40/etapa/src/app/core/passport.ts'],
  stage: '40-crud-com-supabase',
  questions: [
    {
      prompt: 'A tabela tem o RLS ligado, mas nenhuma política. O que um GET de quem entrou recebe?',
      alternatives: [
        { text: 'Um erro 403.', explanation: 'O 403 vem na escrita. Na leitura, a política só filtra as linhas, e nenhuma passa.' },
        { text: 'Todas as linhas da tabela.', explanation: 'Isso aconteceria com o RLS desligado.' },
        {
          text: '`200 OK` com uma lista vazia, sem erro nenhum.',
          correct: true,
          explanation: 'Isso: e é por isso que esse erro engana. O app mostra "nenhuma viagem", como se estivesse tudo certo.',
        },
      ],
    },
    {
      prompt: 'Qual requisição muda os dias da viagem de id 7?',
      alternatives: [
        { text: '`PUT /rest/v1/trips/7` com a viagem inteira.', explanation: 'O Supabase não usa o id no caminho: a linha se escolhe por filtro.' },
        {
          text: '`PATCH /rest/v1/trips?id=eq.7` com `{ "days": 12 }`.',
          correct: true,
          explanation: 'Isso: o filtro diz qual linha, e o corpo leva só o que muda.',
        },
        { text: '`PATCH /rest/v1/trips` com `{ "id": 7, "days": 12 }`.', explanation: 'Sem filtro, o Supabase recusa ("UPDATE requires a WHERE clause"); e o id não pode ir no corpo.' },
      ],
    },
    {
      prompt: 'Por que o `addTrip` manda o cabeçalho `Prefer: return=representation`?',
      alternatives: [
        { text: 'Para o Supabase aceitar o POST.', explanation: 'Ele aceita sem o cabeçalho: cria a linha e responde 201, só que com o corpo vazio.' },
        {
          text: 'Para receber a linha criada, com o id que o banco deu.',
          correct: true,
          explanation: 'Isso: sem o id, a viagem nova não poderia ser editada nem apagada.',
        },
        { text: 'Para o POST virar um upsert.', explanation: 'Quem faz isso é o resolution=merge-duplicates.' },
      ],
    },
    {
      prompt: 'O que impede o Bruno de ler as viagens da Ana?',
      alternatives: [
        { text: 'O guard da rota `/passaporte`.', explanation: 'O guard protege a tela, e qualquer um chama a API sem passar por ela.' },
        { text: 'A chave publicável, que só o app conhece.', explanation: 'Ela vai no código do app: qualquer um a encontra no navegador.' },
        {
          text: 'A política do banco, que só deixa passar as linhas em que `user_id` é o `auth.uid()` de quem pede.',
          correct: true,
          explanation: 'Isso: a regra está no banco, e vale para qualquer pedido, venha de onde vier.',
        },
      ],
    },
    {
      prompt: 'Sem ninguém logado, a função do `httpResource` do passaporte devolve `undefined`. O que acontece?',
      alternatives: [
        {
          text: 'Nenhuma requisição sai, e o resource fica `idle`; quando alguém entra, ele pede sozinho.',
          correct: true,
          explanation: 'Isso: a função depende do signedIn(), e o resource roda de novo quando ele muda.',
        },
        { text: 'O resource vai para o estado de erro.', explanation: 'undefined não é erro: é o jeito de dizer "agora, não peça nada".' },
        { text: 'O GET sai sem token, e volta vazio.', explanation: 'Com undefined, não sai GET nenhum.' },
      ],
    },
  ],
  links: [
    { label: 'A API REST do Supabase', url: 'https://supabase.com/docs/guides/api' },
    { label: 'Row Level Security (Supabase)', url: 'https://supabase.com/docs/guides/database/postgres/row-level-security' },
    { label: 'Tabelas, filtros e upsert (PostgREST)', url: 'https://docs.postgrest.org/en/stable/references/api/tables_views.html' },
    { label: 'O cabeçalho Prefer (PostgREST)', url: 'https://docs.postgrest.org/en/stable/references/api/preferences.html' },
    { label: 'httpResource', url: 'https://angular.dev/guide/http/http-resource' },
  ],
};
