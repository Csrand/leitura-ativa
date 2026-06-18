# Documentação da Stack Tecnológica — leitura-onn

## 1. Visão Geral

Aplicativo mobile/web de leitura com reflexões. Desenvolvido em **JavaScript puro** com **React Native + Expo**, seguindo uma arquitetura simples baseada em telas com roteamento manual e estado global via **Zustand**.

---

## 2. Linguagens

| Linguagem | Uso |
|---|---|
| **JavaScript (ES6+)** | 100% do código fonte |
| **SQL** | Consultas embarcadas em `database.js` |
| **JSON** | Configuração (`package.json`, `app.json`) |

---

## 3. Frontend

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **React** | 19.1.0 | Biblioteca de UI (componentes, hooks) |
| **React Native** | 0.81.5 | Framework mobile cross-platform |
| **Expo** | ~54.0.35 | Plataforma de build e desenvolvimento gerenciado |
| **React Native Paper** | 4.9.2 | Componentes Material Design prontos |
| **@expo/vector-icons** | ^15.0.3 | Conjunto de ícones |
| **expo-status-bar** | ~3.0.9 | Gerenciamento da status bar |
| **StyleSheet.create()** | — | Estilização inline nativa do RN (sem CSS-in-JS externo) |

### Navegação / Roteamento

- **Nenhuma biblioteca de navegação** (ex: React Navigation ou Expo Router)
- Roteamento manual via estado `currentScreen` no Zustand:
  - `HOME` → `Home.js`
  - `SETUP` / `ACTIVE` → `Reading.js`
  - `REFLECTION` → `Reflection.js`
  - `HISTORY` → `History.js`

---

## 4. Gerenciamento de Estado

| Biblioteca | Versão | Finalidade |
|---|---|---|
| **Zustand** | `*` (última) | Estado global (tela atual, livro selecionado, dados da sessão) |
| **Immer** | ^9.0.6 | Updates imutáveis no estado (declarado, mas não usado ativamente) |
| **use-sync-external-store** | ^1.2.0 | Shim React para subscrição em stores externas |

---

## 5. Banco de Dados

| Ambiente | Tecnologia | Detalhes |
|---|---|---|
| **Mobile (iOS/Android)** | **SQLite** via `expo-sqlite` ~16.0.10 | Arquivo `leitura.db` criado em runtime |
| **Web** | **localStorage** | Polyfill customizado em `database.js` que espelha operações SQLite com arrays JSON |

### Schema (3 tabelas)

```sql
CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    email    TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title   TEXT NOT NULL,
    author  TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS reflections (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    book_id         INTEGER NOT NULL,
    mode            TEXT NOT NULL,
    read_time       INTEGER NOT NULL,
    reflection_time INTEGER NOT NULL,
    text            TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (book_id) REFERENCES books (id)
);
```

- **Sem ORM** — queries SQL raw com `getAllAsync()` e `runAsync()`
- Usuário autenticado está **stubado**: hardcoded `DEFAULT_USER_ID = 1`, tabela `users` existe mas não é utilizada na UI

---

## 6. Ferramentas de Build e Dev

| Ferramenta | Finalidade |
|---|---|
| **npm** | Gerenciador de pacotes |
| **Expo CLI** | Build e dev server (`expo start`) |
| **Metro Bundler** | Bundler JavaScript do React Native (implícito) |

### Scripts disponíveis

```bash
npm start       # expo start
npm run android # expo start --android
npm run ios     # expo start --ios
npm run web     # expo start --web
```

---

## 7. Configuração do Projeto

| Arquivo | Conteúdo |
|---|---|
| `package.json` | Dependências, scripts, `"private": true`, licença 0BSD |
| `app.json` | Expo: nome "leitura-on", orientação portrait, tema light, New Architecture ativado, splash screen, suporte a tablet no iOS, edge-to-edge no Android, favicon web |
| `.gitignore` | `node_modules/`, `.expo/`, `dist/`, `web-build/`, pastas nativas (`/ios`, `/android`), arquivos de keystore/certificado, `.env*.local`, `.DS_Store`, builds TypeScript |

**Não inclui:** TypeScript config (`tsconfig.json`), linter (`eslint`, `prettier`), Docker, CI/CD, ou variáveis de ambiente.

---

## 8. Arquitetura

Padrão: **Roteamento manual por tela (Screen-based custom routing)**

```
index.js
  └── registerRootComponent(App)
        └── App.js
              ├── database.initDB()
              ├── useStore() → Zustand
              └── currentScreen (switch):
                    ├── HOME       → Home.js
                    ├── SETUP      ─┐
                    ├── ACTIVE      ┤→ Reading.js
                    ├── REFLECTION → Reflection.js
                    └── HISTORY    → History.js
```

### Camadas

| Camada | Arquivos | Responsabilidade |
|---|---|---|
| **Entry Point** | `index.js` | Bootstrap do Expo |
| **App Shell** | `App.js` | Raiz, init DB, roteamento |
| **Telas** | `Home.js`, `Reading.js`, `Reflection.js`, `History.js` | UI por tela |
| **Estado Global** | `store.js` | Zustand (currentScreen, selectedBook, sessionData) |
| **Persistência** | `database.js` | SQLite (mobile) / localStorage (web) |
| **Assets** | `assets/` | Ícones, splash, favicon |

### Fluxo de Dados

1. Usuário cadastra livro em `Home.js` → `database.runAsync()` → tabela `books`
2. Seleciona livro → Zustand `setBook()` → transição para `SETUP`
3. Configura modo de leitura (cronômetro/timer) → inicia sessão
4. Finaliza leitura → `finishReading()` salva `sessionData` → transição para `REFLECTION`
5. Escreve reflexão → `database.runAsync()` → tabela `reflections`
6. Histórico lê `reflections` + `books` via JOIN para exibição

---

## 9. Resumo em Tabela

| Categoria | Tecnologia | Versão |
|---|---|---|
| **Linguagem** | JavaScript (ES6+) | — |
| **UI Framework** | React | 19.1.0 |
| **Mobile Framework** | React Native | 0.81.5 |
| **Plataforma** | Expo | ~54.0.35 |
| **UI Kit** | React Native Paper | 4.9.2 |
| **Estado Global** | Zustand + Immer | \* / ^9.0.6 |
| **BD Mobile** | expo-sqlite (SQLite) | ~16.0.10 |
| **BD Web** | localStorage (mock) | — |
| **Ícones** | @expo/vector-icons | ^15.0.3 |
| **Gerenciador** | npm | — |
| **Bundler** | Metro | — |
| **Build** | Expo CLI | — |
