const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random?minLength=250&maxLength=450'
const quoteDisplayElement = document.querySelector('.quote-display')
const quoteInputElement = document.querySelector('.container .quote-input')
const timerElement = document.querySelector('.timer')
const mistakesElement = document.querySelector('.mistake span')
const wpmElement = document.querySelector('.WordPerMin span')
const cpsElement = document.querySelector('.CharPerSec span')
let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = mistakes = isTyping = 0;
function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}
async function renderNewQuote() {
  const quote = await getRandomQuote()
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach(char => {
      console.log(char);
      let span = `<span>${char}</span>`
      quoteDisplayElement.innerHTML += span;
  });
  quoteDisplayElement.querySelectorAll("span")[0].classList.add("active");
  document.addEventListener("keydown", () => quoteInputElement.focus());
  quoteDisplayElement.addEventListener("click", () => quoteInputElement.focus());
}
function initTyping() {
  let characters = quoteDisplayElement.querySelectorAll("span");
  let typedChar = quoteInputElement.value.split("")[charIndex];
  if (charIndex < characters.length - 1 && timeLeft > 0) {
      if (!isTyping) {
          timer = setInterval(startTimer, 1000);
          isTyping = true;
      }
      if (typedChar == null) {
          if (charIndex > 0) {
              charIndex--;
              if (characters[charIndex].classList.contains("incorrect")) {
                  mistakes--;
              }
              characters[charIndex].classList.remove("correct", "incorrect");
          }
      } else {
          if (characters[charIndex].innerText == typedChar) {
              characters[charIndex].classList.add("correct");
          } else {
              mistakes++;
              characters[charIndex].classList.add("incorrect");
          }
          charIndex++;
      }
      characters.forEach(span => span.classList.remove("active"));
      characters[charIndex].classList.add("active");

      let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
      wpm = wpm < 0 || !wpm || wpm === Infinity ? 0: wpm;

      wpmElement.innerText = wpm;
      mistakesElement.innerText = mistakes;
      cpsElement.innerText = charIndex - mistakes;
  } else {
      clearInterval(timer);
      quoteInputElement.value = "";
  }
}
function startTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timerElement.innerText = timeLeft;
    let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
    wpmElement.innerText = wpm;
  } else {
    clearInterval(timer);
  }
}
function resetGame() {
  renderNewQuote();
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  quoteInputElement.value = "";
  timerElement.innerText = timeLeft;
  wpmElement.innerText = 0;
  mistakesElement.innerText = 0;
  cpsElement.innerText = 0;
}

renderNewQuote();
quoteInputElement.addEventListener("input", initTyping);

