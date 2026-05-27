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

  function createButton(label, onClick, className = "answer-option") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
  }

  function initQuiz() {
    const questions = [
      {
        prompt: "Qual palavra está escrita corretamente?",
        options: ["Excessão", "Exceção", "Eceção", "Esceção"],
        answer: "Exceção",
        help: "Exceção se escreve com x e ç."
      },
      {
        prompt: "Complete: Eu trouxe meu ___ para a aula.",
        options: ["caderno", "cadernu", "cadernoo", "cadeno"],
        answer: "caderno",
        help: "Caderno termina com -no."
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
        help: "Lápis tem acento agudo no a."
      },
      {
        prompt: "Qual palavra usa ç?",
        options: ["coraçao", "coração", "corassão", "corasão"],
        answer: "coração",
        help: "Coração usa ç e ão."
      }
    ];

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
      setText("quiz-question", item.prompt);
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
            if (child.textContent === item.answer) child.classList.add("correct");
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
    const phrases = [
      {
        text: "A menina ___ um livro na biblioteca.",
        options: ["leu", "leram", "lendo", "ler"],
        answer: "leu",
        help: "A menina leu: ação no passado."
      },
      {
        text: "Nós gostamos de ___ histórias.",
        options: ["contar", "contou", "contam", "contei"],
        answer: "contar",
        help: "Depois de 'gostamos de', usamos contar."
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
        help: "Ba-na-na tem três sílabas."
      },
      {
        text: "Use uma vírgula em: Sim ___ eu aceito.",
        options: [",", ".", "?", "!"],
        answer: ",",
        help: "A vírgula separa o 'Sim' do restante da frase."
      }
    ];

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
      setText("phrase-question", item.text);
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
            if (child.textContent === item.answer) child.classList.add("correct");
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
    const pairs = [
      { id: "livro", values: ["LIVRO", "objeto para ler"] },
      { id: "casa", values: ["CASA", "lugar de morar"] },
      { id: "feliz", values: ["FELIZ", "sentimento bom"] },
      { id: "chuva", values: ["CHUVA", "água do céu"] },
      { id: "amigo", values: ["AMIGO", "pessoa querida"] },
      { id: "escola", values: ["ESCOLA", "lugar de aprender"] }
    ];

    const grid = document.getElementById("memory-grid");
    const restart = document.getElementById("memory-restart");
    let firstCard = null;
    let lock = false;
    let matches = 0;

    function shuffle(items) {
      return items
        .map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
    }

    function buildCards() {
      return shuffle(pairs.flatMap((pair) => pair.values.map((value) => ({
        pair: pair.id,
        value
      }))));
    }

    function render() {
      firstCard = null;
      lock = false;
      matches = 0;
      grid.innerHTML = "";
      setText("memory-status", "0 de 6 pares encontrados");
      setText("memory-feedback", "Escolha duas cartas.");

      buildCards().forEach((card, position) => {
        const button = createButton(card.value, () => flip(button), "memory-card is-hidden");
        button.dataset.pair = card.pair;
        button.dataset.value = card.value;
        button.setAttribute("aria-label", `Carta ${position + 1}, escondida`);
        grid.appendChild(button);
      });
    }

    function flip(card) {
      if (lock || card.classList.contains("is-matched") || card === firstCard) return;

      card.classList.remove("is-hidden");
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
  window.addEventListener("load", initVLibras);

  if (page === "quiz") initQuiz();
  if (page === "frase") initPhraseGame();
  if (page === "memoria") initMemoryGame();
})();
