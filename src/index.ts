// ==================== Interfaces ====================

interface data {
  easy: level[];
  medium: level[];
  hard: level[];
}

interface level {
  id: string;
  text: string;
}

// ==================== DOM Elements ====================

let easyBtn = document.getElementById("easy") as HTMLButtonElement;
let medBtn = document.getElementById("medium") as HTMLButtonElement;
let hardBtn = document.getElementById("hard") as HTMLButtonElement;

let timeBtn = document.getElementById("timeBtn") as HTMLButtonElement;
let passageBtn = document.getElementById("passageBtn") as HTMLButtonElement;
let mobileBtn =document.querySelectorAll('.dropdown-item')

let words = document.getElementById("words") as HTMLElement;
let time = document.getElementById("Time") as HTMLElement;

let startDiv = document.getElementById("start-div") as HTMLDivElement;
let start = document.getElementById("start") as HTMLButtonElement;
let startTitle = document.getElementById("start-title") as HTMLParagraphElement;

let accuracy = document.querySelectorAll(".Accuracy");
let WPM = document.querySelectorAll(".WPM");
let PB = document.getElementById("PB") as HTMLSpanElement;

let options = document.getElementById("options") as HTMLDivElement;
let result = document.getElementById("result") as HTMLDivElement;

let resultImg = document.getElementById("result-img") as HTMLImageElement;
let resultTitle = document.getElementById("result-title") as HTMLHeadingElement;
let resultText = document.getElementById("result-text") as HTMLParagraphElement;

let resultbtn = document.getElementById("restart") as HTMLButtonElement;

let spinner = document.getElementById("loading") as HTMLDivElement;

let restartDiv = document.getElementById("restart-div") as HTMLDivElement;
let restartBtn = document.getElementById("restart-btn") as HTMLButtonElement;

// ==================== Variables ====================

let totalChars: number;
let difficulty: string;

let timer = 60;
time.textContent = String(timer);

let startTime: number;
let endTime: number;

let currentLetter: Element | undefined;

let typedChar: number = 0;
let correctChar: number = 0;

let accuracyValue: number = 100;

let interval: any;

let keySound = new Audio("./assets/audio/key-press.mp3");

let best: number;

// ==================== Helper Functions ====================

function format(element: string) {
  let letter = document.createElement("span");

  letter.textContent = element;
  letter.classList.add("letter-format");

  return letter;
}

function wpm() {
  const elapsedSeconds = (performance.now() - startTime) / 1000;

  if (elapsedSeconds <= 0) return 0;

  const elapsedMinutes = elapsedSeconds / 60;

  return Math.round(typedChar / 5 / elapsedMinutes);
}

function disableBtn() {
  easyBtn.classList.add("disabled");
  medBtn.classList.add("disabled");
  hardBtn.classList.add("disabled");

  timeBtn.classList.add("disabled");
  passageBtn.classList.add("disabled");

  mobileBtn.forEach((element: Element) => {
    const button = element as HTMLButtonElement;
    button.disabled = true;
  });
}

// ==================== Get Random Passage ====================

function easy(data: data) {
  let rondom = Math.floor(Math.random() * 10);

  let essay: any = data.easy[rondom]?.text;

  totalChars = essay.length;

  return essay?.split("");
}

function medium(data: data) {
  let rondom = Math.floor(Math.random() * 10);

  let essay: any = data.medium[rondom]?.text;

  totalChars = essay.length;

  return essay?.split("");
}

function hard(data: data) {
  let rondom = Math.floor(Math.random() * 10);

  let essay: any = data.hard[rondom]?.text;

  totalChars = essay.length;

  return essay?.split("");
}

// ==================== Display Passage ====================

let display = (data: data, level: string) => {
  if (level === "easy") {
    let essay = easy(data);

    words.innerHTML = "";

    essay.forEach((element: string) => {
      words.appendChild(format(element));
    });
  } else if (level === "medium") {
    let essay = medium(data);

    words.innerHTML = "";

    essay.forEach((element: string) => {
      words.appendChild(format(element));
    });
  } else if (level === "hard") {
    let essay = hard(data);

    words.innerHTML = "";

    essay.forEach((element: string) => {
      words.appendChild(format(element));
    });
  }
};

// ==================== Start Game ====================

function startGame() {
  clearInterval(interval);
  startTime = performance.now();

  typedChar = 0;
  correctChar = 0;

  restartDiv.classList.replace("d-none", "d-flex");

  disableBtn();

  console.log(totalChars);

  words.removeEventListener("mouseup", showWords);

  if (timeBtn.classList.contains("active")) {
    interval = setInterval(() => {
      timer--;

      time.textContent = `0:${timer}`;

      if (timer <= 0) {
        clearInterval(interval);
        endGame(typedChar);
      }
    }, 1000);
  } else if (passageBtn.classList.contains("active")) {
    interval = setInterval(() => {
      timer++;

      time.textContent = `${timer}S`;
    }, 1000);
  }

  currentLetter = words.children[0];

  currentLetter?.classList.add("curser");

  window.addEventListener("keyup", handleTyping);
}

// ==================== Time Mode ====================

timeBtn.addEventListener("click", () => {
  timer = 60;

  time.textContent = `${timer}`;

  timeBtn.classList.add("active");

  passageBtn.classList.remove("active");

  // time.classList.remove("d-none");
});



// ==================== Passage Mode ====================

passageBtn.addEventListener("click", () => {
  timer = 0;

  time.textContent = `${timer}`;

  timeBtn.classList.remove("active");

  passageBtn.classList.add("active");

  // time.classList.add("d-none");
});


// ==================== Typing ====================

function handleTyping(e: KeyboardEvent) {
  if (e.key.length !== 1) {
    return;
  }

  keySound.currentTime = 0;
  keySound.play();

  typedChar++;

  WPM.forEach((Element) => {
    Element.textContent = `${wpm()}`;
  });

  // Check Character

  if (e.key === currentLetter?.textContent) {
    currentLetter.classList.add("correct");

    correctChar++;
  } else {
    currentLetter?.classList.add("incorrect");
  }

  // Calculate Accuracy

  accuracyValue = Math.round((correctChar / typedChar) * 100);

  // Display Accuracy

  accuracy.forEach((element) => {
    if (accuracyValue >= 97) {
      element.classList.replace("color-red", "correct");
    } else {
      element.classList.replace("correct", "color-red");
    }

    element.textContent = `${accuracyValue}%`;
  });

  // Move Cursor

  currentLetter?.classList.remove("curser");

  currentLetter = currentLetter?.nextElementSibling ?? undefined;

  // End Game

  if (!currentLetter) {
    endGame(typedChar);

    return;
  }

  currentLetter?.classList.add("curser");
}

// ==================== End Game ====================

function endGame(count: number) {
  window.removeEventListener("keyup", handleTyping);

  clearInterval(interval);

  best = Number(localStorage.getItem("personal best") ?? 0);
  console.log(best);

  const currentWPM = wpm();

  if (currentWPM > best) {
    PB.textContent = `${currentWPM} WPM`;
    localStorage.setItem("personal best", `${currentWPM}`);
  }

  options.classList.replace("d-flex", "d-none");

  result.classList.replace("d-none", "d-flex");

  words.classList.add("d-none");

  words.style = `filter : blur(4px)`;

  restartDiv.classList.replace("d-flex", "d-none");

  resultPage();
}

// ==================== Show Words / Start ====================

function showWords() {
  words.style = `filter : blur(0)`;

  startDiv.classList.add("d-none");

  startGame();
}

words.addEventListener("mouseup", showWords);

start.addEventListener("click", showWords);

// ==================== Result Page ====================

function resultPage() {
  resultImg.src = "./assets/images/icon-completed.svg";

  resultTitle.style = `color : white`;

  resultTitle.textContent = "Test Complete!";

  resultText.innerText = "Solid run. Keep pushing to beat your high score.";

  resultbtn.addEventListener("click", () => {
    result.classList.replace("d-flex", "d-none");

    options.classList.replace("d-none", "d-flex");

    words.classList.replace("d-none", "d-block");

    startDiv.classList.remove("d-none");

    location.reload();
  });
}

// ==================== Fetch Data ====================

fetch("./data.json")
  .then((response) => response.json())

  .then((data) => {
    spinner.classList.add("d-none");

    startDiv.classList.remove("d-none");
    PB.textContent = `${localStorage.getItem("personal best")} WPM`;

    // Easy

    easyBtn.addEventListener("click", () => {
      easy(data);

      difficulty = "easy";
      display(data, difficulty);

      easyBtn.classList.add("active");

      medBtn.classList.remove("active");

      hardBtn.classList.remove("active");
    });

    // Medium

    medBtn.addEventListener("click", () => {
      medium(data);

      difficulty = "medium";

      display(data, difficulty);

      easyBtn.classList.remove("active");

      medBtn.classList.add("active");

      hardBtn.classList.remove("active");
    });

    // Hard

    hardBtn.addEventListener("click", () => {
      hard(data);

      difficulty = "hard";

      display(data, difficulty);

      easyBtn.classList.remove("active");

      medBtn.classList.remove("active");

      hardBtn.classList.add("active");
    });

    // Restart

    resultbtn.addEventListener("click", () => {
      display(data, "hard");
    });
    restartBtn.addEventListener("mouseup", () => {
      // Reset game values
      typedChar = 0;
      correctChar = 0;
      accuracyValue = 100;

      display(data, difficulty);
      // Reset Accuracy
      accuracy.forEach((element) => {
        element.textContent = "100%";
      });

      // Reset WPM
      WPM.forEach((element) => {
        element.textContent = "0";
      });

      // Reset timer
      if (timeBtn.classList.contains("active")) {
        timer = 60;
        time.textContent = "60";
      } else {
        timer = 0;
        time.textContent = "0";
      }
      startGame();
    });

    // Default Level

    hardBtn.click();
  });
