interface data {
  easy: level[];
  medium: level[];
  hard: level[];
}
interface level {
  id: string;
  text: string;
}

let easyBtn = document.getElementById("easy") as HTMLButtonElement;
let medBtn = document.getElementById("medium") as HTMLButtonElement;
let hardBtn = document.getElementById("hard") as HTMLButtonElement;
let words = document.getElementById("words") as HTMLElement;
let time = document.getElementById("Time") as HTMLElement;
let startDiv = document.getElementById('start-div') as HTMLDivElement
let start = document.getElementById("start") as HTMLButtonElement;
let startTitle =document.getElementById('start-title') as HTMLParagraphElement
let timer = 60;
let acc;
time.textContent = String(timer);

function format(element: string) {
  let letter = document.createElement("span");
  letter.textContent = element;
  letter.classList.add("letter-format");
  return letter;
}

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

function easy(data: data) {
  let rondom = Math.floor(Math.random() * 10);
  let essay: any = data.easy[rondom]?.text;
  return essay?.split("");
}

function medium(data: data) {
  let rondom = Math.floor(Math.random() * 10);
  let essay: any = data.medium[rondom]?.text;
  return essay?.split("");
}

function hard(data: data) {
  let rondom = Math.floor(Math.random() * 10);
  let essay: any = data.hard[rondom]?.text;
  return essay?.split("");
}

function wpm(startTime: number, endTime: number) {
  const elapsedSeconds = (endTime - startTime) / 1000;
  const wpm = 0;
}
let startTime: number;
let endTime: number;
let currentLetter: Element | undefined;
let typedChar: number = 0;
let interval: any;
function startGame() {
  timer = 60;
  startTime = Date.now();
  currentLetter = words.children[0];
  currentLetter?.classList.add("curser");

  interval = setInterval(() => {
    timer--;
    time.textContent = `0:${timer}`;
    if (timer <= 0) {
      clearInterval(interval);
      endGame(typedChar);
    }
  }, 1000);
  window.addEventListener("keyup", handleTyping);
}

function endGame(count: number) {
  window.removeEventListener("keyup", handleTyping);
  clearInterval(interval);
  options.classList.replace("d-flex", "d-none");
  result.classList.replace("d-none", "d-flex");
  words.classList.add("d-none");
  words.style = `filter : blur(4px)`;

  resultPage();
}

function handleTyping(e: KeyboardEvent) {
  if (
    e.key === "Shift" ||
    e.key === "Control" ||
    e.key === "Alt" ||
    e.key === "Meta"
  ) {
    return;
  }
  typedChar++;
  console.log(e.key);
  if (e.key === currentLetter?.textContent) {
    currentLetter.classList.add("correct");
  } else {
    currentLetter?.classList.add("incorrect");
  }
  currentLetter?.classList.remove("curser");
  currentLetter = currentLetter?.nextElementSibling ?? undefined;

  if (!currentLetter) {
    endGame(typedChar);
    return;
  }

  currentLetter?.classList.add("curser");
}

words.addEventListener('mouseup', () => {
  words.style = `filter : blur(0)`;
  startDiv.classList.add('d-none')
  startGame();
});
start.addEventListener("click", () => {
  words.style = `filter : blur(0)`;
  startDiv.classList.add("d-none");
  startGame();
});

let options = document.getElementById("options") as HTMLDivElement;
let result = document.getElementById("result") as HTMLDivElement;
let resultImg = document.getElementById("result-img") as HTMLImageElement;
let resultTitle = document.getElementById("result-title") as HTMLHeadingElement;
let resultText = document.getElementById("result-text") as HTMLParagraphElement;
let resultbtn = document.getElementById("restart") as HTMLButtonElement;

function resultPage() {
  resultImg.src = "./assets/images/icon-completed.svg";
  resultTitle.style = `color : white`;
  resultTitle.textContent = "Test Complete!";
  resultText.innerText = "Solid run. Keep pushing to beat your high score.";

  resultbtn.addEventListener("click", () => {
    result.classList.replace("d-flex", "d-none");
    options.classList.replace("d-none", "d-flex");
    words.classList.replace("d-none", "d-block");
    startDiv.classList.remove('d-none')
    location.reload();
  });
}

let spinner = document.getElementById("loading") as HTMLDivElement;
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    spinner.classList.add("d-none");
    startDiv.classList.remove("d-none");

    easyBtn.addEventListener("click", () => {
      easy(data);
      display(data, "easy");
    });
    medBtn.addEventListener("click", () => {
      medium(data);
      display(data, "medium");
    });
    hardBtn.addEventListener("click", () => {
      hard(data);
      display(data, "hard");
    });
    resultbtn.addEventListener("click", () => {
      display(data, "hard");
    });
    hardBtn.click();
  });
