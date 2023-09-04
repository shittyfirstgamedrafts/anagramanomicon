// Helper function to generate a seedable random
function seedableRandom(seed) {
    // Constants for the LCG algorithm (change these for different sequences)
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
  
    // Internal state variable
    let state = seed;
  
    // Function to generate the next random number
    function random() {
      state = (a * state + c) % m;
      return state / m; // Return a value between 0 and 1
    }
  
    // Return the random function to be used with the same seed
    return random;
  }

// Helper function to generate a random sentence
function generateRandomSentence() {
  const sentences = [
    "It's not rocket science",
    "A blessing in disguise",
    "A dime a dozen",
    "Beat around the bush",
    "Better late than never",
    "Bite the bullet",
    "Break a leg",
    "Call it a day",
    "Cutting corners",
    "Easy does it",
    "Get out of hand",
    "Get your act together",
    "Go back to the drawing board",
    "Hang in there",
    "To make a long story short",
    "No pain no gain",
    "On the ball",
    "So far so good",
    "Speak of the devil",
    "That's the last straw",
    "The best of both worlds",
    "Time flies when you're having fun",
    "Under the weather",
    "Your guess is as good as mine",
    // Add more sentences as needed
  ];

  const seed = Math.floor(Date.now() / (60 * 1000));
  const index = seed % sentences.length;
  return sentences[index].toLowerCase();
}

// Helper function to scramble a string
function scrambleString(str, addToSeed = 0) {
  const seed = Math.floor(Date.now() / (60 * 1000)) + addToSeed;
  const randomGenerator = seedableRandom(seed);
  const chars = str.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(randomGenerator() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

// Elements
const scrambledLettersEl = document.getElementById("scrambled-letters");
const userGuessEl = document.getElementById("user-guess");
const submitGuessBtn = document.getElementById("submit-guess");
const scrambleBtn = document.getElementById("scramble-letters");
const foundWordsEl = document.getElementById("found-words");
const wrongWordsEl = document.getElementById("wrong-words");

// Variables
const originalSentence = generateRandomSentence();
const scrambledLetters = scrambleString(originalSentence.replace(/ /g, ""));
const words = originalSentence.split(" ");
const foundWords = [];
const wrongWords = new Set();

console.log(words);

// Display scrambled letters
scrambledLettersEl.textContent = scrambledLetters;

// Remove word from scrambled letters
const removeWord = (word) => {
    const chars = scrambledLettersEl.textContent.split("");
    for (let i = 0; i < word.length; i++) {
        const index = chars.indexOf(word[i]);
        //remove index from chars
        chars.splice(index, 1);
    }
    scrambledLettersEl.textContent = chars.join("");

}

let scrambleCount = 0;

const scrambleLetters = () => {
    const letters = scrambledLettersEl.textContent;
    
    scrambledLettersEl.textContent = scrambleString(letters, scrambleCount++);
}

const guessWord = () => {
// Event listeners
    const guess = userGuessEl.value.toLowerCase().trim();
    userGuessEl.value = "";

    // Check if the guess is in the words list and not already found
    if (words.includes(guess) && foundWords.indexOf(guess) === -1) {
        foundWords.push(guess);
        foundWords.sort((left, right) => words.indexOf(left) > words.indexOf(right));

        //delete all children of foundWordsEl
        foundWordsEl.innerHTML = "";
        foundWords.forEach((word) => {
            const wordEl = document.createElement("span");
            wordEl.textContent = word;
            wordEl.style.margin = "0.5rem";
            // insert word into foundWordsEl at the right spot
            foundWordsEl.appendChild(wordEl);
        });

        removeWord(guess);
    }
    else {
        if (wrongWords.has(guess)) {
            return;
        }
        wrongWords.add(guess);

        const wordEl = document.createElement("span");
        wordEl.classList.add("wrong-word");

        wordEl.textContent = guess;
        wordEl.style.margin = "0.5rem";
        wrongWordsEl.appendChild(wordEl);
    }

    // Check if all words have been found
    if (foundWords.length === words.length) {
        // Display current exact time to user
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        const time = `${hours}:${minutes}:${seconds}`;

        // Fill the end-game div
        const endGameEl = document.getElementById("end-game");
        endGameEl.innerHTML = `
        <h1>Well Done!</h1>
        <p>${time}.</p>
        <p>Refresh the page to play again.</p>
        `;
        endGameEl.style.display = "block";
    }
};

submitGuessBtn.addEventListener("click", guessWord);
scrambleBtn.addEventListener("click", scrambleLetters);
// Event listener for enter key
userGuessEl.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        guessWord();
    }
});