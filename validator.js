const p_word = document.getElementById("word"),
  p_input = document.getElementById("translation"),
  result = document.getElementById("result");

p_input.addEventListener("keypress", (ev) => {
  if (ev.key === "Enter") validateAnswer(ev.target.value);
});

class WordList {
  all_words;
  constructor(list) {
    this.all_words = list;
    this.correct = [];
    this.wrong = [];
    this.current_word = null;
    this.passed_wrong_before = false;
    this.amount_all_words = list.length;
    this.english_answer = true;
  }

  setRandomWord() {
    // console.log("Randomming", this.all_words)
    this.current_word = this.all_words[Math.floor(Math.random() * this.all_words.length)];
    // console.log("choosen word:", word);
    this.current_word=word;
    }

  setNextWord = () => this.setRandomWord();

  createCheckpoint() {
    const data = {
      all_words: this.all_words,
      correct: this.correct,
      wrong: this.wrong,
      current_word: this.current_word,
      // current_pos: this.current_pos,
      amount_all_words: this.amount_all_words,
      english_answer: this.english_answer,
      time: new Date().getTime(),
    };
    localStorage.setItem("progress_data", JSON.stringify(data));
  }

  loadCheckpoint() {
    const data = JSON.parse(localStorage.getItem("progress_data"));
    const time = new Date(data.time);
    let msg = `Ostatni zapis: ${time.toLocaleTimeString()} ${time.toLocaleDateString()}\nWgrać?`;
    if (!confirm(msg)) return false;
    this.correct = data.correct;
    this.wrong = data.wrong;
    this.english_answer = data.english_answer;
    this.all_words = data.all_words;
    this.current_word = data.current_word;
    // this.current_pos = data.current_pos;
    this.amount_all_words = data.amount_all_words;
    this.english_answer = data.english_answer;

    console.log(data);
    console.log(this);
    return true;
  }

  #validateID() {
    return 0 > this.all_words.length;
  }

  validateWord(text) {
    if (this.#validateID()) {
      alert("Nie zainicjowane dane");
      return;
    }

    let correct_anwser = this.current_word[this.english_answer ? "eng" : "pl"];
    console.log({ text, correct_anwser });

    //Gdy zła odp
    if (text !== correct_anwser) {
      if (!this.passed_wrong_before) this.wrong.push(this.current_word);
      updateProgressBars();
      this.passed_wrong_before = true;
      return false;
    }

    //gdy dobra odp
    if (!this.passed_wrong_before) this.correct.push(this.current_word);
    this.passed_wrong_before = false;
    this.all_words = this.all_words.filter((v) => v != this.current_word);
    console.log(this.all_words.length);
    this.setRandomWord();
    this.current_pos++;
    setTimeout(() => setWord(), 3 * 1000);
    return true;
  }

  #getWord(anwser) {
    if(this.current_word === null || this.current_word === undefined) {
      this.setRandomWord();
      console.log("WORLD WAS UNDEFINED")
    }
    if (anwser == this.english_answer) return this.current_word.eng;
    return this.current_word.pl;
  }

  getCurrentWord(anwser) {
    return this.#getWord(anwser);
  }
}

function validateAnswer(d) {
  d = d ? d : p_input.value;
  if (d == "") return;
  console.log({ d });
  if (!wordList.validateWord(d)) {
    result.className = "wrong";
    result.innerText = wordList.getCurrentWord(true);
    p_input.value = "";
    return false;
  }
  result.innerText = "Dobra odpowiedź!";
  result.className = "correct";
  console.log("Proper translation");
}

var wordList,
  handler = {};

function updateProgressBars() {
  let all = wordList.amount_all_words;
  let master = document.querySelector("#status-wrapper > div");
  master
    .querySelector(".all span")
    .setAttribute("data-amount", `: ${all - wordList.all_words.length}/${all}`);
  master
    .querySelector(".correct span")
    .setAttribute("data-amount", `: ${wordList.correct.length}/${all}`);
  master
    .querySelector(".wrong span")
    .setAttribute("data-amount", `: ${wordList.wrong.length}/${all}`);

  master
    .querySelector(".all .level")
    .style.setProperty(
      "--progress",
      `${Math.round((100 * (all - wordList.all_words.length)) / all)}%`
    );
  master
    .querySelector(".correct .level")
    .style.setProperty(
      "--progress",
      `${Math.round((100 * wordList.correct.length) / all)}%`
    );
  master
    .querySelector(".wrong .level")
    .style.setProperty(
      "--progress",
      `${Math.round((100 * wordList.wrong.length) / all)}%`
    );
}

function setWord() {
  if (wordList.all_words.length ===  0 || wordList.current_pos === wordList.amount_all_words) {
    let anwser = confirm(
      "Czy chcesz powtórzyć słówka, które były źle rozwiązane? Jeśli nie, powtórzysz ten sam zakres materiału."
    );
    if (anwser){
      wordList = new WordList(
        wordList.wrong
      );
    }
    else {
      wordList.correct = [];
      wordList.wrong = [];
    }
  }
  if(wordList.current_word === undefined) wordList.setRandomWord();
  p_input.value = "";
  result.className = "hidden";
  p_word.innerText = wordList.getCurrentWord();
  updateProgressBars();
  console.log(wordList.getCurrentWord());
}

const req = new XMLHttpRequest();
if (localStorage.getItem("key") == null) {
  req.open("GET", "output.json");
  req.addEventListener("load", (ev) => {
    let data = JSON.parse(ev.target.response);
    console.log("Data loaded:", data);
    localStorage.setItem("words", data);
    wordList = new WordList(data);
    wordList.current_id = 0;
    init();
  });
  req.send();
}

function init() {
  setWord();
  updateProgressBars();
}

function saveProgress(){
  msg = "Chcesz zapisać obecny progres? Poprzedni zapis zostanie usunięty"
  if (!confirm(msg)) return false;
  wordList.createCheckpoint();
}

function loadProgress(){
  if(wordList.loadCheckpoint());
    setWord();
}