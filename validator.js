const p_word = document.getElementById("word"),
  p_input = document.getElementById("translation"),
  result = document.getElementById("result");

p_input.addEventListener("keypress", (ev) => {
  if (ev.key === "Enter") validateAnswer(ev.target.value);
});

class WordList {
  all_words;
  constructor(list) {
    this.passed_wrong_before = false;
    this.all_words = list.splice(0,10);
    this.correct = [];
    this.wrong = [];
    this.current_id = 0;
    this.english_answer = true;
  }

  #validateID() {
    return !(this.current_id >= 0 && this.current_id < this.all_words.length);
  }

  validateWord(text) {
    if (this.#validateID()) {
      alert("Nie zainicjowane dane");
      return;
    }

    let correct_anwser =
      this.all_words[this.current_id][this.english_answer ? "eng" : "pl"];
    console.log({ text, correct_anwser });

    //Gdy zła odp
    if (text !== correct_anwser) {
      this.wrong.push(this.current_id);
      updateProgressBars();
      this.passed_wrong_before = true;
      return false;
    }

    //gdy dobra odp
    if (!this.passed_wrong_before) this.correct.push(this.current_id);
    this.passed_wrong_before = false;

    setTimeout(() => setWord(this.current_id + 1), 3 * 1000);
    return true;
  }

  getWord(id, anwser) {
    if (anwser == this.english_answer) return this.all_words[id].eng;
    return this.all_words[id].pl;
  }

  getCurrentWord(anwser) {
    return this.getWord(this.current_id, anwser);
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
  let all = wordList.all_words.length;
  let master = document.querySelector("#status-wrapper > div");
  master
    .querySelector(".all span")
    .setAttribute("data-amount", `: ${wordList.current_id}/${all}`);
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
      `${Math.round((100 * wordList.current_id) / all)}%`
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
      `${Math.round(
        (100 * wordList.wrong.length) / wordList.all_words.length
      )}%`
    );
}

function setWord(id) {
  wordList.current_id = id || wordList.current_id;
  if (wordList.current_id >= wordList.all_words.length) {
    let anwser = confirm(
      "Czy chcesz powtórzyć słówka, które były źle rozwiązane? Jeśli nie, powtórzysz ten sam zakres materiału."
    );
    if (anwser) wordList = new WordList(wordList.wrong.map((id)=>wordList.all_words[id]));
    else {
      wordList.current_id = 0;
      wordList.correct = [];
      wordList.wrong = [];
    }
  }
  p_word.innerText = wordList.getCurrentWord();
  p_input.value = "";
  result.className = "hidden";
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
  setWord(0);
  updateProgressBars();
}
