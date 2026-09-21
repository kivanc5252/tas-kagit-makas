// ===== SES DOSYALARI =====
const soundClick = new Audio('sounds/click.mp3');
const soundWin = new Audio('sounds/win.mp3');
const soundLose = new Audio('sounds/lose.mp3');

soundClick.volume = 0.5;
soundWin.volume = 0.7;
soundLose.volume = 0.7;

// ===== OYUN VERİLERİ =====
const CHOICES = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

const BEATS = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
};

// ===== SKORLAR =====
let playerScore = 0;
let cpuScore = 0;
let drawScore = 0;
let isPlaying = false;

// ===== HTML ELEMANLARI =====
const playerChoiceEl = document.getElementById('playerChoice');
const cpuChoiceEl = document.getElementById('cpuChoice');
const resultEl = document.getElementById('result');
const playerScoreEl = document.getElementById('playerScore');
const cpuScoreEl = document.getElementById('cpuScore');
const drawScoreEl = document.getElementById('drawScore');
const resetBtn = document.getElementById('resetBtn');
const themeBtn = document.getElementById('themeBtn');

// ===== EVENT LISTENER'LAR =====
document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => play(btn.dataset.choice));
});

resetBtn.addEventListener('click', resetGame);

// ===== ANA OYUN FONKSİYONU =====
function play(playerPick) {
    if (isPlaying) return;
    isPlaying = true;

    soundClick.currentTime = 0;
    soundClick.play().catch(err => console.log('❌ click sesi:', err));

    playerChoiceEl.classList.add('shake');
    cpuChoiceEl.classList.add('shake');
    playerChoiceEl.textContent = CHOICES[playerPick];
    cpuChoiceEl.textContent = '❔';
    resultEl.textContent = 'Düşünüyor...';
    resultEl.className = 'result';

    let count = 3;
    const countdown = setInterval(() => {
        resultEl.textContent = `${count}...`;
        count--;
    }, 300);

    setTimeout(() => {
        clearInterval(countdown);
        playerChoiceEl.classList.remove('shake');
        cpuChoiceEl.classList.remove('shake');

        const cpuPick = randomChoice();
        cpuChoiceEl.textContent = CHOICES[cpuPick];

        const result = getResult(playerPick, cpuPick);
        showResult(result);
        isPlaying = false;
    }, 900);
}

// ===== RASTGELE SEÇİM =====
function randomChoice() {
    const keys = Object.keys(CHOICES);
    return keys[Math.floor(Math.random() * keys.length)];
}

// ===== KAZANAN =====
function getResult(player, cpu) {
    if (player === cpu) return 'draw';
    return BEATS[player] === cpu ? 'win' : 'lose';
}

// ===== SONUCU GÖSTER =====
function showResult(result) {
    if (result === 'win') {
        playerScore++;
        resultEl.textContent = '🎉 Kazandın!';
        resultEl.className = 'result win';
        soundWin.currentTime = 0;
        soundWin.play().catch(err => console.log('❌ win sesi:', err));
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
    } else if (result === 'lose') {
        cpuScore++;
        resultEl.textContent = '😢 Kaybettin!';
        resultEl.className = 'result lose';
        soundLose.currentTime = 0;
        soundLose.play().catch(err => console.log('❌ lose sesi:', err));
    } else {
        drawScore++;
        resultEl.textContent = '🤝 Berabere!';
        resultEl.className = 'result draw';
    }
    updateScores();
}

// ===== SKORLARI GÜNCELLE =====
function updateScores() {
    playerScoreEl.textContent = playerScore;
    cpuScoreEl.textContent = cpuScore;
    drawScoreEl.textContent = drawScore;
}

// ===== SIFIRLA =====
function resetGame() {
    playerScore = cpuScore = drawScore = 0;
    playerChoiceEl.textContent = '❔';
    cpuChoiceEl.textContent = '❔';
    resultEl.textContent = 'Seçimini yap!';
    resultEl.className = 'result';
    updateScores();
}

// ===== TEMA DEĞİŞTİRME =====
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeBtn.textContent = '☀️';
    } else {
        themeBtn.textContent = '🌙';
    }
});