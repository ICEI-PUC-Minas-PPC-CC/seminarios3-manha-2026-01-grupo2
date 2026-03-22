# 02 — Documento de Requisitos do Software

**Grupo:** Grupo 2
**Aplicação:** Plataforma Web de Jogos Educativos de Língua Portuguesa
**Comunidade:** Centro Dr. Tarso de Coimbra

---

# 1. Visão Geral

A aplicação consiste em um site educativo com jogos interativos voltados ao ensino da língua portuguesa. O sistema será destinado às crianças atendidas pelo Centro Dr. Tarso de Coimbra, com o objetivo de auxiliar no desenvolvimento de habilidades de leitura, escrita e interpretação.

O projeto busca oferecer uma ferramenta digital simples, visual e acessível, que torne o aprendizado mais dinâmico e motivador para os usuários.

---

# 2. Público-Alvo

| Campo                                 | Informação                                                    |
| ------------------------------------- | ------------------------------------------------------------- |
| Perfil dos usuários                   | Crianças atendidas pelo Centro Dr. Tarso de Coimbra           |
| Faixa etária                          | Aproximadamente entre 7 e 14 anos                             |
| Necessidades de acessibilidade        | Interface visual, com pouco texto e elementos gráficos claros |
| Nível de familiaridade com tecnologia | Básico a intermediário                                        |

**Observação:**
Como parte dos usuários pode possuir deficiência auditiva ou surdez, a aplicação priorizará comunicação visual, com uso de ícones, cores e imagens, evitando dependência de áudio.

---

# 3. Requisitos Funcionais

| ID   | Requisito                                                                  | Prioridade | Origem da demanda        |
| ---- | -------------------------------------------------------------------------- | ---------- | ------------------------ |
| RF01 | O sistema deve apresentar jogos educativos de língua portuguesa            | Alta       | Reunião com a comunidade |
| RF02 | O usuário deve poder escolher entre diferentes tipos de jogos              | Alta       | Reunião com a comunidade |
| RF03 | O sistema deve apresentar perguntas ou desafios interativos                | Alta       | Definição do grupo       |
| RF04 | O sistema deve informar se a resposta do usuário está correta ou incorreta | Alta       | Definição do grupo       |
| RF05 | O sistema deve apresentar a pontuação ao final do jogo                     | Média      | Definição do grupo       |

---

# 4. Requisitos Não Funcionais

| ID    | Requisito                                                      | Categoria       |
| ----- | -------------------------------------------------------------- | --------------- |
| RNF01 | A aplicação deve ser acessível via navegador web               | Acessibilidade  |
| RNF02 | A interface deve ser simples e intuitiva                       | Usabilidade     |
| RNF03 | A aplicação deve funcionar em dispositivos móveis              | Compatibilidade |
| RNF04 | A aplicação deve carregar rapidamente mesmo em conexões lentas | Desempenho      |
| RNF05 | A aplicação deve possuir layout responsivo                     | Interface       |

---

# 5. Requisitos de Acessibilidade

* Interface predominantemente visual (ícones, cores, imagens)
* Textos curtos e objetivos
* Botões grandes e identificáveis
* Contraste adequado de cores
* Compatível com Libras (quando possível)
* Sem dependência de áudio para funcionalidades essenciais
* Feedback visual para indicar acertos ou erros durante os jogos

---

# 6. Tecnologias Escolhidas

| Componente                 | Tecnologia                       |
| -------------------------- | -------------------------------- |
| Front-end                  | HTML, CSS e JavaScript           |
| Back-end (se houver)       | Não aplicável na versão inicial  |
| Banco de dados (se houver) | Não aplicável na versão inicial  |
| Hospedagem                 | GitHub Pages                     |
| Outras ferramentas         | Visual Studio Code, Git e GitHub |

---

# 7. Protótipo / Wireframes

Serão desenvolvidos wireframes representando as principais telas da aplicação, incluindo:

* Tela inicial
* Tela de seleção de jogos
* Tela de jogo
* Tela de resultado

Os protótipos serão armazenados na pasta:

evidencias/prints/

Os wireframes poderão ser criados utilizando ferramentas de prototipação ou esboços simples.

---

# 8. Escopo Mínimo Viável (MVP)

O MVP da aplicação incluirá as seguintes funcionalidades:

* Tela inicial com botão para iniciar
* Tela de seleção de jogos
* Pelo menos um jogo educativo de língua portuguesa
* Feedback visual para respostas corretas ou incorretas
* Exibição de pontuação ao final do jogo

---

# 9. Funcionalidades Desejáveis (se houver tempo)

* Inclusão de múltiplos jogos educativos
* Sistema de níveis de dificuldade
* Feedback visual mais interativo
* Inclusão de elementos gráficos e animações educativas
