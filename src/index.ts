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
let timeBtn = document.getElementById("time-btn") as HTMLButtonElement;
let passageBtn = document.getElementById("passage-btn") as HTMLButtonElement;
let words = document.getElementById("words") as HTMLElement;
let time = document.getElementById("Time") as HTMLElement;
let startDiv = document.getElementById("start-div") as HTMLDivElement;
let start = document.getElementById("start") as HTMLButtonElement;
let startTitle = document.getElementById("start-title") as HTMLParagraphElement;
let accuracy = document.querySelectorAll(".Accuracy");
let WPM = document.querySelectorAll(".WPM");
let totalChars: number;
console.log(accuracy);
let timer = 60;
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
  // console.log(data.easy.length)
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

function wpm() {
  const elapsedSeconds = (performance.now() - startTime) / 1000;
  console.log(startTime)

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
}

let startTime: number;
let endTime: number;
let currentLetter: Element | undefined;
let typedChar: number = 0;
let interval: any;
function startGame() {
  startTime = performance.now();
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

timeBtn.addEventListener("click", () => {
  timer = 60;
  time.textContent = `${timer}`;
  timeBtn.classList.add("active");
  passageBtn.classList.remove("active");
  // time.classList.remove("d-none");
});
passageBtn.addEventListener("click", () => {
  timer = 0;
  time.textContent = `${timer}`;
  timeBtn.classList.remove("active");
  passageBtn.classList.add("active");
  // time.classList.add("d-none");
});

function endGame(count: number) {
  window.removeEventListener("keyup", handleTyping);
  clearInterval(interval);
  options.classList.replace("d-flex", "d-none");
  result.classList.replace("d-none", "d-flex");
  words.classList.add("d-none");
  words.style = `filter : blur(4px)`;

  resultPage();
}

let correctChar: number = 0;
let accuracyValue: number = 100;
let keySound = new Audio("./assets/audio/key-press.mp3");
function handleTyping(e: KeyboardEvent) {
  if (e.key.length !== 1) {
    return;
  }
  keySound.currentTime = 0;
  keySound.play();
  typedChar++;
  WPM.forEach((Element)=>{
    Element.textContent = `${wpm()}`
  })

  if (e.key === currentLetter?.textContent) {
    currentLetter.classList.add("correct");
    correctChar++;
  } else {
    currentLetter?.classList.add("incorrect");
  }

  accuracyValue = Math.round((correctChar / typedChar) * 100);

  accuracy.forEach((element) => {
    if (accuracyValue > 98) {
      element.classList.add("correct");
    } else {
      element.classList;
    }

    element.textContent = `${accuracyValue}%`;
  });

  currentLetter?.classList.remove("curser");
  currentLetter = currentLetter?.nextElementSibling ?? undefined;

  if (!currentLetter) {
    endGame(typedChar);
    return;
  }

  currentLetter?.classList.add("curser");
}
function showWords() {
  words.style = `filter : blur(0)`;
  startDiv.classList.add("d-none");
  startGame();
}
words.addEventListener("mouseup", showWords);
start.addEventListener("click", showWords);

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
    startDiv.classList.remove("d-none");
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
      easyBtn.classList.add("active");
      medBtn.classList.remove("active");
      hardBtn.classList.remove("active");
    });
    medBtn.addEventListener("click", () => {
      medium(data);
      display(data, "medium");
      easyBtn.classList.remove("active");
      medBtn.classList.add("active");
      hardBtn.classList.remove("active");
    });
    hardBtn.addEventListener("click", () => {
      hard(data);
      display(data, "hard");
      easyBtn.classList.remove("active");
      medBtn.classList.remove("active");
      hardBtn.classList.add("active");
    });
    resultbtn.addEventListener("click", () => {
      display(data, "hard");
    });
    hardBtn.click();
  });
