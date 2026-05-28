# PRD: Leitura Ativa — App de Leitura com Reflexão

## Problem Statement

Pessoas que praticam leitura ativa (estudo, pesquisa, aprendizado) não têm um registro sistemático das reflexões que fazem durante a leitura. O conteúdo é consumido, mas os insights se perdem. Falta um app simples que una cronometragem da leitura com registro de reflexões pós-leitura.

## Solution

App mobile (Expo Snack) para leitura ativa em dois modos:
- **Timer:** Usuário define o tempo de leitura antes de começar
- **Cronômetro:** Usuário lê sem tempo definido e finaliza quando quiser

Ao final, 20% do tempo lido é reservado para reflexão. Depois, o usuário escreve e salva seu texto de reflexão, associado a um livro e ao modo da sessão.

## User Stories

1. Como usuário, quero me cadastrar com email e senha, para que minhas reflexões sejam pessoais e seguras.
2. Como usuário, quero fazer login, para acessar minhas reflexões salvas.
3. Como usuário, quero cadastrar um livro (título + autor), para associar minhas sessões de leitura a ele.
4. Como usuário, quero ver a lista de livros cadastrados na Home, para escolher qual livro vou ler.
5. Como usuário, quero escolher entre modo Timer ou Cronômetro antes de começar, para decidir como quero ler.
6. Como usuário no modo Timer, quero definir o tempo de leitura (em minutos), para planejar minha sessão.
7. Como usuário, quero ver o timer/cronômetro rodando durante a leitura, para acompanhar o tempo.
8. Como usuário, quero finalizar a sessão de leitura a qualquer momento, para parar quando quiser.
9. Como usuário, ao finalizar a leitura, quero ver uma tela com "reflita sobre o que leu" por 20% do tempo lido, para processar o conteúdo.
10. Como usuário, após o período de reflexão, quero ver um campo de texto com "escreva sobre o que refletiu", para registrar meu pensamento.
11. Como usuário, quero salvar minha reflexão, para que ela fique armazenada.
12. Como usuário, quero ver o histórico de reflexões ordenado por data, para revisitar meus insights.
13. Como usuário, quero visualizar reflexões por livro, para navegar pelo histórico.

## Implementation Decisions

| Decisão | Escolha |
|---|---|
| Framework | Expo (Snack) |
| Navegação | Expo Router (file-based routing) |
| UI | React Native Elements |
| Estado | Zustand |
| Auth | Supabase Auth (email + senha) |
| Banco | Supabase PostgreSQL |
| Deploy | Expo Snack |

### Modelo de Dados

```sql
books (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) NOT NULL,
  title       text NOT NULL,
  author      text,
  created_at  timestamptz DEFAULT now()
);

reflections (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid REFERENCES auth.users(id) NOT NULL,
  book_id                uuid REFERENCES books(id) NOT NULL,
  mode                   text CHECK (mode IN ('timer', 'cronometro')) NOT NULL,
  reading_time_seconds   int NOT NULL,
  reflection_time_seconds int NOT NULL,
  text                   text,
  created_at             timestamptz DEFAULT now()
);
```

### Estrutura do App

```
app/
  _layout.tsx        (layout com auth guard + navegação)
  index.tsx          (Home: lista livros + +novo livro + modo + iniciar)
  leitura.tsx        (Tela de leitura: timer/cronômetro rodando)
  reflexao.tsx       (Tela de reflexão: 20% tempo → campo texto → salvar)
  historico.tsx      (Histórico: reflexões por livro)
  login.tsx          (Tela de login)
  cadastro.tsx       (Tela de cadastro)
components/
  timer.tsx
  book-list.tsx
  reflection-card.tsx
  book-form.tsx
stores/
  auth-store.ts      (Zustand: sessão do usuário)
  reading-store.ts   (Zustand: sessão atual de leitura)
lib/
  supabase.ts        (Cliente Supabase inicializado)
  db.ts              (Helpers: getBooks, saveReflection, etc.)
```

## Testing Decisions

A definir após início da implementação. Recomenda-se começar sem testes e adicionar conforme a arquitetura se estabiliza.

## Out of Scope

- Sincronização entre dispositivos
- Compartilhamento de reflexões
- Modo offline (requer sync complexo)
- Exportação de dados (PDF, CSV)
- Leitura de livros digitais dentro do app
- Anotações durante a leitura
- Notificações push
- Temas customizados (dark/light)

## Further Notes

- O app deve funcionar inteiramente no **Expo Snack**, sem módulos nativos customizados
- O fluxo de auth usa Supabase diretamente (sem provedores OAuth por enquanto)
- A UI deve ser minimalista — foco na experiência de leitura e reflexão, não em firulas visuais
