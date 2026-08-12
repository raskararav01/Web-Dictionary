const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");
const languageSelector = document.getElementById("language-select");
const sound = document.getElementById("sound"); // 🔊 Audio element

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value;
    let selectedLanguage = languageSelector.value;

    fetch(`${url}${inpWord}`)
        .then((response) => response.json())
        .then((data) => {
            if (data && data[0]) {
                let wordMeaning = data[0].meanings[0].definitions[0].definition;
                let wordExample = data[0].meanings[0].definitions[0].example || "";
                let audioSrc = data[0].phonetics[0]?.audio;

                translateWord(wordMeaning, selectedLanguage).then((translatedMeaning) => {
                    result.innerHTML = `
                        <div class="word">
                            <h3>${inpWord}</h3>
                            ${audioSrc ? `<button onclick="playSound()"><i class="fas fa-volume-up"></i></button>` : ""}
                        </div>
                        <div class="details">
                            <p>${data[0].meanings[0].partOfSpeech}</p>
                            <p>/${data[0].phonetic}/</p>
                        </div>
                        <p class="word-meaning">
                            <strong>English:</strong> ${wordMeaning}
                        </p>
                        <p class="word-meaning">
                            <strong>${selectedLanguage === 'hi' ? 'Hindi' : 'Marathi'}:</strong> ${translatedMeaning}
                        </p>
                        <p class="word-example">
                            ${wordExample}
                        </p>
                    `;
                    if (audioSrc) {
                        sound.setAttribute("src", audioSrc.startsWith("https") ? audioSrc : `https:${audioSrc}`);
                    }
                }).catch(() => {
                    result.innerHTML = `<h3 class="error">Error Translating Word</h3>`;
                });
            } else {
                result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
            }
        })
        .catch(() => {
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        });
});

// 👇 Translation Function (no changes here)
function translateWord(meaning, language) {
    return new Promise((resolve, reject) => {
        const translationAPIUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(meaning)}&langpair=en|${language}`;

        fetch(translationAPIUrl)
            .then(response => response.json())
            .then(data => {
                if (data.responseData && data.responseData.translatedText) {
                    resolve(data.responseData.translatedText);
                } else {
                    reject('Translation failed');
                }
            })
            .catch(() => reject('Translation API error'));
    });
}

// 🔊 Play Sound Function
function playSound() {
    sound.play();
}
