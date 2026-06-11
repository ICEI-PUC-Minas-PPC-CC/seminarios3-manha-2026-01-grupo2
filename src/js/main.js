(function () {
  const page = document.body.dataset.page;

  // Small-screen navigation: one button, one menu, no framework dependency.
  function initMenu() {
    const button = document.querySelector(".menu-button");
    const menu = document.querySelector("#main-menu");
    if (!button || !menu) return;

    button.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function initVLibras() {
    if (window.VLibras) {
      new window.VLibras.Widget("https://vlibras.gov.br/app");
    }
  }

  // Shared helper keeps the game render functions short and readable.
  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  // O VLibras descarta "___" ao traduzir, então a frase perderia a posição
  // da lacuna para quem usa Libras. O span oculto "(lacuna)" entra no
  // innerText capturado pelo widget e vira o sinal LACUNA no lugar certo,
  // sem mudar o visual. Leitores de tela também se beneficiam.
  function setQuestionText(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = "";
    value.split("___").forEach((part, index) => {
      if (index > 0) {
        const blank = document.createElement("span");
        blank.className = "gap-mark";
        blank.setAttribute("aria-hidden", "true");
        blank.textContent = "___";
        const hint = document.createElement("span");
        hint.className = "sr-only";
        hint.textContent = " (lacuna) ";
        element.append(blank, hint);
      }
      element.append(document.createTextNode(part));
    });
  }

  // Pontuação isolada não gera tradução no VLibras nem leitura em leitores
  // de tela; o nome por extenso fica oculto dentro do botão.
  const punctuationNames = {
    ",": "vírgula",
    ".": "ponto final",
    "?": "ponto de interrogação",
    "!": "ponto de exclamação",
    ":": "dois pontos",
    ";": "ponto e vírgula"
  };

  function createButton(label, onClick, className = "answer-option") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.value = label;
    const spokenName = punctuationNames[label];
    if (spokenName) {
      const symbol = document.createElement("span");
      symbol.setAttribute("aria-hidden", "true");
      symbol.textContent = label;
      const name = document.createElement("span");
      name.className = "sr-only";
      name.textContent = spokenName;
      button.append(symbol, name);
    } else {
      button.textContent = label;
    }
    button.addEventListener("click", onClick);
    return button;
  }

  // Embaralha um array sem alterar o original. Usado para variar
  // a ordem das perguntas e das opcoes a cada partida.
  function shuffle(items) {
    return items
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

  function initQuiz() {
    const questionBank = [
      {
        prompt: "Qual palavra está escrita corretamente?",
        options: ["Excessão", "Exceção", "Eceção", "Esceção"],
        answer: "Exceção",
        help: "Exceção se escreve com xis e cê-cedilha."
      },
      {
        prompt: "Complete: Eu trouxe meu ___ para a aula.",
        options: ["caderno", "cadernu", "cadernoo", "cadeno"],
        answer: "caderno",
        help: "Caderno termina com ene e ó."
      },
      {
        prompt: "Qual forma combina com a frase: Eles ___ cedo.",
        options: ["chegou", "cheguei", "chegaram", "chega"],
        answer: "chegaram",
        help: "Eles combina com chegaram."
      },
      {
        prompt: "Escolha a palavra com acento correto.",
        options: ["lapis", "lápis", "lapís", "làpis"],
        answer: "lápis",
        help: "Lápis tem acento agudo na letra A."
      },
      {
        prompt: "Qual palavra usa cê-cedilha?",
        options: ["coraçao", "coração", "corassão", "corasão"],
        answer: "coração",
        help: "Coração se escreve com cê-cedilha e termina com ão."
      },
      {
        prompt: "Qual é o plural de 'cidadão'?",
        options: ["cidadões", "cidadãos", "cidadãoes", "cidadans"],
        answer: "cidadãos",
        help: "Cidadão faz plural cidadãos."
      },
      {
        prompt: "Qual palavra está escrita corretamente?",
        options: ["pesquisa", "pesquiza", "peskisa", "pescuisa"],
        answer: "pesquisa",
        help: "Pesquisa não se escreve com a letra Z."
      },
      {
        prompt: "Complete: A professora ___ o livro para nós.",
        options: ["leu", "leeu", "lê-o", "leuo"],
        answer: "leu",
        help: "Leu mostra que a ação já aconteceu."
      },
      {
        prompt: "Qual palavra tem o som de x como em táxi?",
        options: ["enxame", "exame", "enxada", "enxergar"],
        answer: "exame",
        help: "Em exame, o x tem som de z, igual a táxi."
      },
      {
        prompt: "Qual frase está correta?",
        options: ["Houveram problemas.", "Houve problemas.", "Ouve problemas.", "Houvi problemas."],
        answer: "Houve problemas.",
        help: "O verbo haver no sentido de existir fica no singular."
      },
      {
        prompt: "Qual é o sinônimo de 'rápido'?",
        options: ["lento", "veloz", "calmo", "parado"],
        answer: "veloz",
        help: "Veloz significa o mesmo que rápido."
      },
      {
        prompt: "Qual palavra está escrita corretamente?",
        options: ["privilégio", "previlégio", "priviléjio", "previléjio"],
        answer: "privilégio",
        help: "Privilégio se escreve com a letra i depois do v."
      },
      {
        prompt: "Complete: Se eu ___ tempo, eu iria à praia.",
        options: ["tivesse", "tinha", "ter", "tiver"],
        answer: "tivesse",
        help: "Para indicar condição, a forma certa é tivesse."
      },
      {
        prompt: "Qual palavra é paroxítona (sílaba tônica na penúltima)?",
        options: ["café", "fácil", "Brasil", "papel"],
        answer: "fácil",
        help: "A palavra fácil tem a sílaba forte na penúltima sílaba."
      }
    ];

    // Embaralha o banco e prepara cada pergunta com opcoes tambem embaralhadas.
    const questions = shuffle(questionBank).map((item) => ({
      ...item,
      options: shuffle(item.options)
    }));

    let index = 0;
    let score = 0;
    let answered = false;
    let finished = false;
    const options = document.getElementById("quiz-options");
    const next = document.getElementById("quiz-next");

    function render() {
      answered = false;
      const item = questions[index];
      setText("quiz-progress", `Pergunta ${index + 1} de ${questions.length}`);
      setText("quiz-score", `${score} pontos`);
      setQuestionText("quiz-question", item.prompt);
      setText("quiz-feedback", "Escolha uma opção.");
      document.getElementById("quiz-feedback").className = "feedback";
      options.innerHTML = "";

      item.options.forEach((option) => {
        options.appendChild(createButton(option, (event) => {
          if (answered) return;
          answered = true;
          const isCorrect = option === item.answer;
          if (isCorrect) score += 1;

          Array.from(options.children).forEach((child) => {
            child.disabled = true;
            if (child.dataset.value === item.answer) child.classList.add("correct");
          });

          if (!isCorrect) event.currentTarget.classList.add("wrong");
          setText("quiz-score", `${score} pontos`);
          setText("quiz-feedback", isCorrect ? `Correto! ${item.help}` : `Quase. ${item.help}`);
          document.getElementById("quiz-feedback").classList.add(isCorrect ? "success" : "error");
        }));
      });
    }

    next.addEventListener("click", () => {
      if (finished) {
        window.location.reload();
        return;
      }

      if (index < questions.length - 1) {
        index += 1;
        render();
      } else {
        finished = true;
        setText("quiz-question", "Fim do quiz!");
        options.innerHTML = "";
        setText("quiz-feedback", `Você fez ${score} de ${questions.length} pontos. Para jogar de novo, volte para a primeira pergunta.`);
        next.textContent = "Jogar novamente";
      }
    });

    render();
  }

  function initPhraseGame() {
    const phraseBank = [
      {
        text: "A menina ___ um livro na biblioteca.",
        options: ["leu", "leram", "lendo", "ler"],
        answer: "leu",
        help: "Leu mostra que a ação já aconteceu."
      },
      {
        text: "Nós gostamos de ___ histórias.",
        options: ["contar", "contou", "contam", "contei"],
        answer: "contar",
        help: "A frase certa é: nós gostamos de contar histórias."
      },
      {
        text: "O cachorro correu pelo ___.",
        options: ["jardim", "janela", "caderno", "chuva"],
        answer: "jardim",
        help: "Jardim é um lugar por onde se pode correr."
      },
      {
        text: "A palavra ___ tem três sílabas.",
        options: ["banana", "sol", "paz", "mar"],
        answer: "banana",
        help: "A palavra banana tem três sílabas."
      },
      {
        text: "Use uma vírgula em: Sim ___ eu aceito.",
        options: [",", ".", "?", "!"],
        answer: ",",
        help: "A vírgula separa o Sim do restante da frase."
      },
      {
        text: "O sol ___ todas as manhãs.",
        options: ["nasce", "nasceu", "nascendo", "nascer"],
        answer: "nasce",
        help: "Usamos nasce para uma ação que se repete sempre."
      },
      {
        text: "Eu gostaria de ___ um café, por favor.",
        options: ["tomar", "tomei", "tomo", "tomava"],
        answer: "tomar",
        help: "A frase certa é: eu gostaria de tomar um café."
      },
      {
        text: "Ontem nós ___ ao cinema com os amigos.",
        options: ["fomos", "vamos", "iremos", "vai"],
        answer: "fomos",
        help: "Ontem mostra que a ação já aconteceu: nós fomos."
      },
      {
        text: "O céu está ___ depois da chuva.",
        options: ["azul", "rápido", "alegre", "doce"],
        answer: "azul",
        help: "Azul é uma cor, adequada para descrever o céu."
      },
      {
        text: "A professora ___ a lição no quadro.",
        options: ["escreveu", "escrevendo", "escrever", "escrevo"],
        answer: "escreveu",
        help: "Escreveu mostra que a ação já aconteceu."
      },
      {
        text: "Coloque o ponto final em: Hoje vai chover ___",
        options: [".", ",", ":", ";"],
        answer: ".",
        help: "O ponto final encerra uma frase declarativa."
      },
      {
        text: "Eles ___ muito felizes com a notícia.",
        options: ["ficaram", "ficou", "fica", "ficando"],
        answer: "ficaram",
        help: "Eles combina com ficaram."
      },
      {
        text: "A palavra 'cachorro' começa com a letra ___.",
        options: ["C", "K", "Q", "S"],
        answer: "C",
        help: "Cachorro começa com a letra C."
      },
      {
        text: "Eu ___ português todos os dias.",
        options: ["estudo", "estuda", "estudam", "estudei"],
        answer: "estudo",
        help: "Com eu, usamos a forma estudo."
      }
    ];

    // Embaralha o banco e tambem a ordem das opcoes de cada frase.
    const phrases = shuffle(phraseBank).map((item) => ({
      ...item,
      options: shuffle(item.options)
    }));

    let index = 0;
    let score = 0;
    let answered = false;
    let finished = false;
    const options = document.getElementById("phrase-options");
    const next = document.getElementById("phrase-next");

    function render() {
      answered = false;
      const item = phrases[index];
      setText("phrase-progress", `Frase ${index + 1} de ${phrases.length}`);
      setText("phrase-score", `${score} pontos`);
      setQuestionText("phrase-question", item.text);
      setText("phrase-feedback", "Escolha uma palavra.");
      document.getElementById("phrase-feedback").className = "feedback";
      options.innerHTML = "";

      item.options.forEach((option) => {
        options.appendChild(createButton(option, (event) => {
          if (answered) return;
          answered = true;
          const isCorrect = option === item.answer;
          if (isCorrect) score += 1;

          Array.from(options.children).forEach((child) => {
            child.disabled = true;
            if (child.dataset.value === item.answer) child.classList.add("correct");
          });

          if (!isCorrect) event.currentTarget.classList.add("wrong");
          setText("phrase-score", `${score} pontos`);
          setText("phrase-feedback", isCorrect ? `Muito bem! ${item.help}` : `Tente observar a frase. ${item.help}`);
          document.getElementById("phrase-feedback").classList.add(isCorrect ? "success" : "error");
        }));
      });
    }

    next.addEventListener("click", () => {
      if (finished) {
        window.location.reload();
        return;
      }

      if (index < phrases.length - 1) {
        index += 1;
        render();
      } else {
        finished = true;
        setText("phrase-question", "Atividade concluída!");
        options.innerHTML = "";
        setText("phrase-feedback", `Você acertou ${score} de ${phrases.length} frases.`);
        next.textContent = "Jogar novamente";
      }
    });

    render();
  }

  function initMemoryGame() {
    const allPairs = [
      { id: "livro", values: ["LIVRO", "objeto para ler"] },
      { id: "casa", values: ["CASA", "lugar de morar"] },
      { id: "feliz", values: ["FELIZ", "sentimento bom"] },
      { id: "chuva", values: ["CHUVA", "água do céu"] },
      { id: "amigo", values: ["AMIGO", "pessoa querida"] },
      { id: "escola", values: ["ESCOLA", "lugar de aprender"] },
      { id: "sol", values: ["SOL", "estrela do dia"] },
      { id: "flor", values: ["FLOR", "nasce no jardim"] },
      { id: "musica", values: ["MÚSICA", "som que se canta"] },
      { id: "professor", values: ["PROFESSOR", "quem ensina"] }
    ];

    // A cada partida sorteia 6 pares dentro do banco maior.
    const pairs = shuffle(allPairs).slice(0, 6);

    const grid = document.getElementById("memory-grid");
    const restart = document.getElementById("memory-restart");
    let firstCard = null;
    let lock = false;
    let matches = 0;
    let currentPairs = pairs;

    function buildCards(pairList) {
      return shuffle(pairList.flatMap((pair) => pair.values.map((value) => ({
        pair: pair.id,
        value
      }))));
    }

    function render() {
      // Sorteia um novo conjunto de pares ao reiniciar para dar variedade.
      currentPairs = shuffle(allPairs).slice(0, 6);
      firstCard = null;
      lock = false;
      matches = 0;
      grid.innerHTML = "";
      setText("memory-status", "0 de 6 pares encontrados");
      setText("memory-feedback", "Escolha duas cartas.");

      buildCards(currentPairs).forEach((card, position) => {
        // A carta fechada não pode ter a palavra no DOM: o VLibras traduz o
        // innerText do elemento clicado e revelaria a resposta (cor
        // transparente não esconde texto do innerText).
        const button = createButton("", () => flip(button), "memory-card is-hidden");
        button.dataset.pair = card.pair;
        button.dataset.value = card.value;
        button.setAttribute("aria-label", `Carta ${position + 1}, escondida`);
        grid.appendChild(button);
      });
    }

    function flip(card) {
      if (lock || card.classList.contains("is-matched") || card === firstCard) return;

      card.classList.remove("is-hidden");
      card.textContent = card.dataset.value;
      card.setAttribute("aria-label", `Carta aberta: ${card.dataset.value}`);

      if (!firstCard) {
        firstCard = card;
        setText("memory-feedback", "Agora escolha a segunda carta.");
        return;
      }

      const secondCard = card;
      const isMatch = firstCard.dataset.pair === secondCard.dataset.pair;

      if (isMatch) {
        firstCard.classList.add("is-matched");
        secondCard.classList.add("is-matched");
        firstCard.disabled = true;
        secondCard.disabled = true;
        matches += 1;
        setText("memory-status", `${matches} de 6 pares encontrados`);
        setText("memory-feedback", matches === 6 ? "Parabéns! Todos os pares foram encontrados." : "Par encontrado!");
        firstCard = null;
      } else {
        lock = true;
        setText("memory-feedback", "Essas cartas não formam par. Elas vão virar de novo.");
        const cardToHide = firstCard;
        setTimeout(() => {
          if (!cardToHide || !secondCard) return;
          cardToHide.classList.add("is-hidden");
          secondCard.classList.add("is-hidden");
          cardToHide.textContent = "";
          secondCard.textContent = "";
          cardToHide.setAttribute("aria-label", "Carta escondida");
          secondCard.setAttribute("aria-label", "Carta escondida");
          firstCard = null;
          lock = false;
        }, 900);
      }
    }

    restart.addEventListener("click", render);
    render();
  }

  initMenu();
  // O plugin do VLibras adia a montagem do widget para window.onload,
  // então o construtor precisa ser chamado antes de a página terminar
  // de carregar — nunca dentro de um listener de "load".
  initVLibras();

  if (page === "quiz") initQuiz();
  if (page === "frase") initPhraseGame();
  if (page === "memoria") initMemoryGame();
})();
