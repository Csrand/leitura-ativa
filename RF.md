# Especificação de Requisitos do Sistema

Este documento apresenta a especificação de Requisitos Funcionais (RF) e Não Funcionais (RNF) para o sistema de leitura e reflexão.

---

## 1. Requisitos Funcionais (RF)

### 1.1 Autenticação e Controle de Acesso

| ID | Descrição |
| :--- | :--- |
| **RF-01** | O sistema deve permitir que um visitante crie uma nova conta de usuário fornecendo um endereço de e-mail válido e uma senha. |
| **RF-02** | O sistema deve permitir que um usuário registrado autentique-se na plataforma utilizando seu e-mail e senha. |
| **RF-03** | O sistema deve bloquear o acesso às telas principais (*Home, Leitura, Reflexão e Histórico*) para usuários que não possuam uma sessão ativa (*Auth Guard*). |

### 1.2 Gestão de Livros

| ID | Descrição |
| :--- | :--- |
| **RF-04** | O sistema deve permitir que um usuário autenticado cadastre um novo livro, sendo obrigatório fornecer o "Título" e opcional o "Autor". |
| **RF-05** | O sistema deve exibir na tela inicial (*Home*) uma lista de todos os livros cadastrados pelo usuário autenticado. |

### 1.3 Sessão de Leitura

| ID | Descrição |
| :--- | :--- |
| **RF-06** | O sistema deve exigir que o usuário selecione um livro da sua lista antes de iniciar uma sessão. |
| **RF-07** | O sistema deve permitir que o usuário escolha entre os modos de leitura "Timer" ou "Cronômetro" antes de iniciar a sessão. |
| **RF-08** | Quando o modo "Timer" for selecionado, o sistema deve fornecer um campo numérico para o usuário definir o tempo desejado de leitura em minutos. |
| **RF-09** | O sistema deve exibir de forma contínua o tempo decorrido (modo Cronômetro) ou o tempo restante (modo Timer) durante a sessão de leitura ativa. |
| **RF-10** | O sistema deve disponibilizar um controle acionável a qualquer momento para o usuário encerrar a sessão de leitura manualmente. |

### 1.4 Reflexão e Registro

| ID | Descrição |
| :--- | :--- |
| **RF-11** | Imediatamente após o encerramento da sessão de leitura, o sistema deve calcular automaticamente um "Tempo de Reflexão", equivalente a 20% do tempo total de leitura registrado. |
| **RF-12** | O sistema deve exibir uma tela de espera instruindo o usuário a refletir, acompanhada de um contador regressivo correspondente ao Tempo de Reflexão calculado no **RF-11**. |
| **RF-13** | Após o término do contador de reflexão, o sistema deve liberar um campo de texto para que o usuário digite seus pensamentos e insights. |
| **RF-14** | O sistema deve permitir que o usuário salve o texto da reflexão. Ao salvar, o sistema deve registrar no banco de dados: ID do usuário, ID do livro, modo da sessão, tempo lido (segundos), tempo de reflexão (segundos) e o texto digitado. |

### 1.5 Histórico e Visualização

| ID | Descrição |
| :--- | :--- |
| **RF-15** | O sistema deve exibir uma tela de histórico listando as reflexões salvas do usuário, ordenadas cronologicamente da mais recente para a mais antiga. |
| **RF-16** | O sistema deve permitir que o usuário filtre os registros do histórico, exibindo apenas as reflexões associadas a um livro específico. |

---

## 2. Requisitos Não Funcionais (RNF)

Estes requisitos definem as restrições, padrões de qualidade, tecnologias e diretrizes arquiteturais do sistema (como o sistema deve se comportar).

### 2.1 Portabilidade e Ambiente

| ID | Requisito Não Funcional |
| :--- | :--- |
| **RNF-01** | O aplicativo deve ser integralmente compatível e executável no ambiente web do **Expo Snack**, sendo estritamente proibido o uso de módulos nativos (*Native Modules*) que exijam builds customizadas. |

### 2.2 Segurança e Privacidade

| ID | Requisito Não Funcional |
| :--- | :--- |
| **RNF-02** | A autenticação e a gestão de credenciais devem ser delegadas e processadas exclusivamente pelo **Supabase Auth**. |
| **RNF-03** | **Isolamento de Dados:** O sistema deve garantir, via banco de dados (por exemplo, aplicando *Row Level Security* no PostgreSQL do Supabase), que um usuário tenha acesso de leitura e escrita única e exclusivamente aos seus próprios registros na tabela `books` e `reflections`. |

### 2.3 Usabilidade e Interface

| ID | Requisito Não Funcional |
| :--- | :--- |
| **RNF-04** | A interface do usuário deve seguir uma abordagem minimalista e livre de distrações, implementada utilizando os componentes da biblioteca **React Native Elements**. |
| **RNF-05** | A navegação entre as telas deve ser gerenciada pelo **Expo Router**, utilizando a arquitetura *file-based routing*. |

### 2.4 Confiabilidade e Gestão de Estado

| ID | Requisito Não Funcional |
| :--- | :--- |
| **RNF-06** | O estado da sessão ativa de leitura e os dados de autenticação do usuário devem ser gerenciados globalmente utilizando a biblioteca **Zustand**, garantindo que os dados do contador não sejam perdidos caso ocorra uma re-renderização do componente. |
