// ============================================
// DATA - All 32 letters
// ============================================
const letters = [
    { id: "alfa",    img: "1.png",  label: "Ⲁ",  name: "Alfa" },
    { id: "beta",    img: "2.png",  label: "Ⲃ",  name: "Beta" },
    { id: "gama",    img: "3.png",  label: "Ⳉ",  name: "Gama" },
    { id: "delta",   img: "4.png",  label: "Ⲇ",  name: "Delta" },
    { id: "eai",     img: "5.png",  label: "Ⲉ",  name: "Eai" },
    { id: "fota",    img: "6.png",  label: "Ⲋ",  name: "Sou" },
    { id: "zeta",    img: "7.png",  label: "Ⲍ",  name: "Zeta" },
    { id: "eta",     img: "8.png",  label: "Ⲏ",  name: "Eta" },
    { id: "theta",   img: "9.png",  label: "Ⲑ",  name: "Theta" },
    { id: "iota",    img: "10.png", label: "Ⲓ",  name: "Iota" },
    { id: "kappa",   img: "11.png", label: "Ⲕ",  name: "Kappa" },
    { id: "lambda",  img: "12.png", label: "Ⲗ",  name: "Lambda" },
    { id: "mu",      img: "13.png", label: "Ⲙ",  name: "Mu" },
    { id: "nu",      img: "14.png", label: "Ⲛ",  name: "Nu" },
    { id: "xi",      img: "15.png", label: "Ⲝ",  name: "Xi" },
    { id: "omicron", img: "16.png", label: "Ⲟ",  name: "Omicron" },
    { id: "pi",      img: "17.png", label: "Ⲡ",  name: "Pi" },
    { id: "rho",     img: "18.png", label: "Ⲣ",  name: "Rho" },
    { id: "sigma",   img: "19.png", label: "Ⲥ",  name: "Sigma" },
    { id: "tau",     img: "20.png", label: "Ⲧ",  name: "Tau" },
    { id: "upsilon", img: "21.png", label: "Ⲩ",  name: "Upsilon" },
    { id: "phi",     img: "22.png", label: "Ⲫ",  name: "Phi" },
    { id: "chi",     img: "23.png", label: "Ⲭ",  name: "Chi" },
    { id: "psi",     img: "24.png", label: "Ⲯ",  name: "Psi" },
    { id: "omega",   img: "25.png", label: "Ⲱ",  name: "Omega" },
    { id: "fo",      img: "26.png", label: "Ⳁ",  name: "Shai" },
    { id: "ze",      img: "27.png", label: "Ⳃ",  name: "Fai" },
    { id: "et",      img: "28.png", label: "Ⳅ",  name: "Khei" },
    { id: "th",      img: "29.png", label: "Ϩ",  name: "Hori" },
    { id: "io",      img: "30.png", label: "Ϫ",  name: "Janja" },
    { id: "ka",      img: "31.png", label: "Ϭ",  name: "Chima" },
    { id: "la",      img: "32.png", label: "Ϯ",  name: "Ti" }
];

// ============================================
// AUDIO
// ============================================
const sounds = {};
letters.forEach((letter, index) => {
    const audio = new Audio(`audio/${index + 1}.mp3`);
    audio.preload = "auto";
    sounds[letter.id] = audio;
});

// Sound Effects for Quiz
const sfxCorrect = new Audio('audio/correct.mp3');
const sfxWrong = new Audio('audio/wrong.mp3');
const sfxClap = new Audio('audio/clap.mp3');

let currentAudio = null;

function playSound(id) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = sounds[id];
    if (currentAudio) {
        currentAudio.currentTime = 0;
        currentAudio.play().catch(e => {
            console.log("Audio play failed:", e);
        });
    }
}

// Helper function to play sound effects
function playSFX(sfx) {
    sfx.currentTime = 0;
    sfx.play().catch(e => console.log("SFX play failed:", e));
}

// ============================================
// SOUNDBOARD
// ============================================
function buildSoundboard() {
    const grid = document.getElementById("soundboard-grid");
    grid.innerHTML = "";
    
    letters.forEach(letter => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="images/${letter.img}" class="icon" alt="${letter.name}" onerror="this.src='https://via.placeholder.com/160x160?text=${letter.label}'">
            <span class="label">${letter.label}</span>
        `;
        card.addEventListener("click", () => {
            playSound(letter.id);
        });
        grid.appendChild(card);
    });
}

// ============================================
// QUIZ
// ============================================
let quizQuestions = [];
let currentQ = 0;
let answered = false;

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateQuiz() {
    const shuffledLetters = shuffle(letters);
    quizQuestions = shuffledLetters.slice(0, 5).map(correct => {
        const wrongs = shuffle(letters.filter(l => l.id !== correct.id)).slice(0, 2);
        const options = shuffle([correct, ...wrongs]);
        return {
            correct: correct,
            options: options
        };
    });
    currentQ = 0;
    answered = false;
}

function openQuiz() {
    generateQuiz();
    document.getElementById("soundboard-page").style.display = "none";
    document.getElementById("quiz-page").style.display = "block";
    document.getElementById("quizBtn").style.display = "none";
    showQuestion();
}

function closeQuiz() {
    document.getElementById("quiz-page").style.display = "none";
    document.getElementById("soundboard-page").style.display = "block";
    document.getElementById("quizBtn").style.display = "block";
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

function showQuestion() {
    const q = quizQuestions[currentQ];
    answered = false;
    
    document.getElementById("qNumber").textContent = `Question ${currentQ + 1} of 5`;
    document.getElementById("resultMsg").textContent = "";
    document.getElementById("resultMsg").className = "result-message";
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("playSoundBtn").style.display = "inline-block";
    document.querySelector(".sound-instruction").textContent = "Listen carefully, then choose the correct letter:";
    
    const grid = document.getElementById("choicesGrid");
    grid.innerHTML = "";
    
    q.options.forEach(opt => {
        const card = document.createElement("div");
        card.className = "choice-card";
        card.innerHTML = `
            <img src="images/${opt.img}" alt="${opt.name}" onerror="this.src='https://via.placeholder.com/150x150?text=${opt.label}'">
            <div class="choice-label">${opt.label}</div>
        `;
        card.onclick = () => selectAnswer(opt, card);
        grid.appendChild(card);
    });
    
    setTimeout(() => playCurrentSound(), 400);
}

function playCurrentSound() {
    if (quizQuestions[currentQ]) {
        playSound(quizQuestions[currentQ].correct.id);
    }
}

function selectAnswer(selected, cardElement) {
    if (answered) return;
    
    const correct = quizQuestions[currentQ].correct;
    const resultMsg = document.getElementById("resultMsg");
    const allCards = document.querySelectorAll(".choice-card");
    
    if (selected.id === correct.id) {
        // CORRECT
        answered = true;
        cardElement.classList.add("correct");
        resultMsg.textContent = "🎉 Good job! 🎉";
        resultMsg.className = "result-message good";
        playSFX(sfxCorrect);
        
        // Disable all cards
        allCards.forEach(c => c.style.pointerEvents = "none");
        
        // Show Next button
        document.getElementById("nextBtn").style.display = "inline-block";
        
        if (currentQ === 4) {
            document.getElementById("nextBtn").textContent = "Finish Quiz 🏁";
        } else {
            document.getElementById("nextBtn").textContent = "Next Question →";
        }
        
    } else {
        // WRONG
        cardElement.classList.add("wrong");
        resultMsg.textContent = "❌ Try again!";
        resultMsg.className = "result-message bad";
        playSFX(sfxWrong);
        
        // Remove the wrong highlight after animation so they can try again
        setTimeout(() => {
            cardElement.classList.remove("wrong");
            resultMsg.textContent = "";
        }, 1400);
    }
}

function nextQuestion() {
    if (currentQ < 4) {
        currentQ++;
        showQuestion();
    } else {
        // Quiz finished
        playSFX(sfxClap);
        
        document.getElementById("choicesGrid").innerHTML = `
            <div style="grid-column:1/-1; padding:40px 20px;">
                <div style="font-size:3rem;">🏆</div>
                <div style="font-size:2rem; color:#16a34a; font-weight:bold; margin:15px 0;">
                    You finished the quiz!
                </div>
                <div style="font-size:1.3rem; color:#374151;">
                    Great job learning the Coptic letters!
                </div>
            </div>
        `;
        document.getElementById("resultMsg").textContent = "";
        document.getElementById("nextBtn").style.display = "none";
        document.getElementById("playSoundBtn").style.display = "none";
        document.querySelector(".sound-instruction").textContent = "";
    }
}

// ============================================
// START
// ============================================
buildSoundboard();