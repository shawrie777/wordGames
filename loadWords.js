export async function loadWords() {
    const wordString = localStorage.getItem("words");
    if (wordString) return wordString.split(",");
    else return await fetch("WordList.txt").then(words => words.text()).then(words => {
        const arr = words.split("\n");
        localStorage.setItem("words", arr.join(","));
        return arr;
    })
}