import { loadWords } from "./loadWords.js";

const words = await loadWords();
if (!words) throw new Error("Failed to load word list");

const filtered = words.filter(word => word.length > 3);
let target, guesses;
reset();

document.querySelector(".replay").addEventListener("click", reset);
document.querySelector(".add").addEventListener("click", ev => {
    const guess = document.querySelector(".guess").value;
    addToDict(guess);
    ev.target.style.display = "none";
});

function play() {
    guesses.sort();

    const divs = guesses.map(word => {
        const div = document.createElement("div");
        div.textContent = word;
        div.className = "guess";
        return {word, div};
    })

    const before = divs.filter(({word}) => word < target).map(elem => elem.div);
    const after = divs.filter(({word}) => word > target).map(elem => elem.div);
    const input = document.createElement("input");
    input.className = "guess";
    input.onkeydown = ev => {
        if (ev.key === "Enter") {
            const guess = ev.target.value;
            if (guess === target) {
                const win = document.querySelector(".win");
                win.firstElementChild.textContent = `Well done! The word was ${target}!`
                win.style.display = "unset";
            }
            else if (filtered.includes(guess)) {
                guesses.push(guess);
                play();
            }
            else {
                const div = document.querySelector(".badGuess");
                div.firstElementChild.textContent = `${guess} is not in my dictionary!`
                div.style.display = "unset";
                setTimeout(()=>{div.style.display = "none"}, 3000)
            }
        }
    }

    const main = document.querySelector("main");
    main.replaceChildren(...before, input, ...after);
    input.focus();
}

function reset() {
    target = filtered[
        Math.min(
            Math.max(Math.floor(Math.random() * filtered.length), 1), filtered.length - 2)
    ];
    console.log(target);
    guesses = [filtered[0], filtered[filtered.length - 1]];
    document.querySelector(".win").style.display = "none";
    play();
}

function addToDict(word){
    words.push(word);
    localStorage.setItem("words", words.join(","));
}