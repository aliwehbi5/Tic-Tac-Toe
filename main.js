const choices = document.querySelectorAll(".player .logo > div");
const btns = document.querySelectorAll("main .btns button");
const spaces = document.querySelectorAll(".game .space");
const restartBtn = document.querySelector(".restart");
const restartPopUp = document.querySelector(".restart-pop-up");
const resultPopUp = document.querySelector(".result-pop-up");
const backBtn = document.querySelector(".back-btn");
const restBtn = document.querySelector(".rest-btn");
const turnImg = document.querySelector(".player-turn img");
const turns = ["x", "o"];
let oScore = document.querySelector(".o-score").textContent;
let xScore = document.querySelector(".x-score").textContent;
let tieScore = document.querySelector(".tie-score").textContent;
let gameover = false;
let winner = null;
let counter = 0;
let filled = 0;
let turn;
let opTurn;
let link;
let gameType;

activeChoice();
changeTurn();

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    choices.forEach((choice) => {
      choice.classList.remove("active");
    });
    choice.classList.add("active");
  });
});

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("main").classList.add("d-none");
    document.querySelector("section").classList.remove("d-none");
    gameType = btn.dataset.type;
    activeChoice();
    if (gameType == "cpu") {
      cpuTurn(turn);
    }
  });
});

restartBtn.addEventListener("click", () => {
  restartPopUp.classList.remove("d-none");
  document.body.classList.add("poped");
});

backBtn.addEventListener("click", () => {
  restartPopUp.classList.add("d-none");
  document.body.classList.remove("poped");
});

spaces.forEach((space) => {
  space.addEventListener("click", () => {
    filled = document.querySelectorAll(".filled").length;
    if (filled === spaces.length) {
      gameover = true;
    }
    if (!space.classList.contains("filled") && !gameover) {
      let img = document.createElement("img");
      if (gameType == "player") {
        let index = counter % 2;
        img.src = `https://mrfinesse47.github.io/tic-tac-toe/assets/icon-${turns[index]}.svg`;
      } else {
        img.src = `https://mrfinesse47.github.io/tic-tac-toe/assets/icon-${turn}.svg`;
      }
      space.appendChild(img);
      space.classList.add("filled");
      counter++;
      if (checkWin(turn)) {
        gameover = true;
      } else if (checkWin(opTurn)) {
        gameover = true;
      } else if (counter < spaces.length) {
        changeTurn();
        if (gameType == "cpu") {
          cpuFill(opTurn);
        }
      }
      if (filled == spaces.length - 1) {
        if (winner === null) {
          tieScore = +tieScore + 1;
          document.querySelector(".tie-score").textContent = tieScore;
          setTimeout(() => {
            result(winner);
          }, 1000);
        }
        filled = 0;
      }
    }
  });
});

function restartGame() {
  filled = 0;
  counter = 0;
  winner = null;
  gameover = false;
  spaces.forEach((space) => {
    space.classList.remove("filled");
    space.classList.remove("o-winning");
    space.classList.remove("x-winning");
    if (space.querySelector("img")) {
      space.querySelector("img").remove();
    }
  });
  turnImg.src = `https://mrfinesse47.github.io/tic-tac-toe/assets/icon-x-silver.svg`;
  restartPopUp.classList.add("d-none");
  resultPopUp.classList.add("d-none");
  document.body.classList.remove("poped");

  if (gameType == "cpu" && turn == "o") {
    cpuFill(opTurn);
  } else if (gameType == "player") {
    activeChoice();
  }
}

function activeChoice() {
  let choice = document.querySelector(".active");
  turn = choice.classList[0];
  turns.forEach((ele) => {
    if (turn.charAt(0) == ele) {
      turn = ele;
    } else {
      opTurn = ele;
    }
  });
  if (gameType === "cpu") {
    turn === "x"
      ? (link =
          "https://mrfinesse47.github.io/tic-tac-toe/assets/icon-x-outline.svg")
      : (link =
          "https://mrfinesse47.github.io/tic-tac-toe/assets/icon-o-outline.svg");
  } else if (gameType === "player") {
    link =
      "https://mrfinesse47.github.io/tic-tac-toe/assets/icon-x-outline.svg";
    link =
      counter % 2 === 1 && counter > 0
        ? (link =
            "https://mrfinesse47.github.io/tic-tac-toe/assets/icon-o-outline.svg")
        : (link =
            "https://mrfinesse47.github.io/tic-tac-toe/assets/icon-x-outline.svg");
    document.querySelector(".player-2 p").textContent = "O (Player 2)";
    document.querySelector(".player-1 p").textContent = "X (Player 1)";
  }
  document.documentElement.style.setProperty("--img-url", link);
  const styleElement = document.createElement("style");
  styleElement.textContent = `
            .game .space:not(.filled):hover::before {
              background-image: url(${link});
            }
          `;
  document.head.appendChild(styleElement);
}

function changeTurn() {
  turnImg.src =
    counter % 2 === 1 && counter > 0
      ? "https://mrfinesse47.github.io/tic-tac-toe/assets/icon-o-silver.svg"
      : "https://mrfinesse47.github.io/tic-tac-toe/assets/icon-x-silver.svg";
  if (gameType == "player") {
    activeChoice();
  }
}

function cpuTurn(turn) {
  if (turn === "o") {
    cpuFill("x");
    turnImg.src =
      "https://mrfinesse47.github.io/tic-tac-toe/assets/icon-o-silver.svg";
    document.querySelector(".player-1 p").textContent = "X (cpu)";
    document.querySelector(".player-2 p").textContent = "O (u)";
  } else {
    if (document.querySelectorAll(".filled").length % 2 === 1) {
      cpuFill("o");
    }
    turnImg.src =
      "https://mrfinesse47.github.io/tic-tac-toe/assets/icon-x-silver.svg";
    document.querySelector(".player-2 p").textContent = "O (cpu)";
    document.querySelector(".player-1 p").textContent = "X (u)";
  }
}

function cpuFill(turn) {
  if (gameover) {
    return;
  }
  let emptySpaces = Array.from(spaces).filter(
    (space) => !space.classList.contains("filled")
  );
  if (emptySpaces.length === 0) {
    return;
  }
  let index = getRandomIndex(emptySpaces.length);
  let space = emptySpaces[index];
  counter++;
  setTimeout(() => {
    let img = document.createElement("img");
    img.src = `https://mrfinesse47.github.io/tic-tac-toe/assets/icon-${turn}.svg`;
    space.appendChild(img);
    space.classList.add("filled");
    changeTurn();
    if (checkWin(turn)) {
      gameover = true;
    }
    filled = document.querySelectorAll(".filled").length;
    if (filled === spaces.length) {
      if (winner === null) {
        tieScore = +tieScore + 1;
        document.querySelector(".tie-score").textContent = tieScore;
        setTimeout(() => {
          result(winner);
        }, 1000);
      }
      filled = 0;
    }
  }, 200);
}

function checkWin(winnerPlayer) {
  const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6], // Diagonal from top-right to bottom-left
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    const spaceA = spaces[a];
    const spaceB = spaces[b];
    const spaceC = spaces[c];

    if (
      spaceA.classList.contains("filled") &&
      spaceB.classList.contains("filled") &&
      spaceC.classList.contains("filled")
    ) {
      const imgA = spaceA.querySelector("img");
      const imgB = spaceB.querySelector("img");
      const imgC = spaceC.querySelector("img");

      if (
        imgA.src.includes(`icon-${winnerPlayer}`) &&
        imgB.src.includes(`icon-${winnerPlayer}`) &&
        imgC.src.includes(`icon-${winnerPlayer}`)
      ) {
        spaceA.classList.add("winning");
        spaceB.classList.add("winning");
        spaceC.classList.add("winning");

        const winningSpaces = [spaceA, spaceB, spaceC];
        const spaces = Array.from(document.querySelectorAll(".space"));
        const nonWinningSpaces = spaces.filter(
          (space) => !winningSpaces.includes(space)
        );

        nonWinningSpaces.forEach((space) => {
          space.classList.remove("winning");
        });

        winner = winnerPlayer;
        if (winnerPlayer) {
          addWinning(winnerPlayer);
        }
        return true;
      }
    }
  }

  return false;
}

function addWinning(winner) {
  let winnings = document.querySelectorAll(".winning");
  if (winnings.length > 3) {
    winnings = Array.from(winnings).filter((ele) => {
      let img = ele.querySelector("img");
      return img && img.src.includes(`icon-${winner}`);
    });
  }
  winnings.forEach((ele) => {
    let img = ele.querySelector("img");
    if (img && img.src.includes(`icon-${winner}`)) {
      ele.classList.add(`${winner}-winning`);
      img.src = `https://mrfinesse47.github.io/tic-tac-toe/assets/icon-${winner}-dark-navy.svg`;
    }
  });
  checkWinner(winner);
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function checkWinner(winner) {
  if (winner === "x") {
    xScore = +xScore + 1;
    document.querySelector(".x-score").textContent = xScore;
    setTimeout(() => {
      result(winner);
    }, 1000);
  } else if (winner === "o") {
    oScore = +oScore + 1;
    document.querySelector(".o-score").textContent = oScore;
    setTimeout(() => {
      result(winner);
    }, 1000);
  }
  return;
}

function result(winner) {
  resultPopUp.classList.remove("d-none");
  document.body.classList.add("poped");
  let p = document.querySelector(".result-pop-up > p");
  let img = document.querySelector(".result-pop-up  img");
  let h1 = document.querySelector(".result-pop-up h1");
  h1.textContent = "TAKES THE ROUND";
  h1.classList.forEach((clas) => {
    if (clas !== "fw-bold" && clas !== "m-0") {
      h1.classList.remove(clas);
    }
  });
  if (gameType == "cpu") {
    if (winner == turn) {
      p.textContent = "Player 1 wins!";
      img.src = `https://mrfinesse47.github.io/tic-tac-toe/assets/icon-${winner}.svg`;
      h1.classList.add(`${winner}-wins`);
    } else if (winner == opTurn) {
      p.textContent = "OH NO, YOU LOST...";
      img.src = `https://mrfinesse47.github.io/tic-tac-toe/assets/icon-${winner}.svg`;
      h1.classList.add(`${winner}-wins`);
    } else {
      h1.classList.add(`tied`);
      h1.textContent = "ROUND TIED";
      p.textContent = "";
      img.src = ``;
    }
  } else {
    if (winner == "x") {
      p.textContent = "Player 1 wins!";
      img.src = `https://mrfinesse47.github.io/tic-tac-toe/assets/icon-${winner}.svg`;
      h1.classList.add(`${winner}-wins`);
    } else if (winner == "o") {
      p.textContent = "player 2 wins!";
      img.src = `https://mrfinesse47.github.io/tic-tac-toe/assets/icon-${winner}.svg`;
      h1.classList.add(`${winner}-wins`);
    } else {
      h1.classList.add(`tied`);
      h1.textContent = "ROUND TIED";
      p.textContent = "";
      img.src = ``;
    }
  }
}
