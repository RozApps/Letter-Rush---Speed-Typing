(function(){
  // ===== Screen refs =====
  const home = document.getElementById('homeScreen');
  const game = document.getElementById('gameScreen');
  const how  = document.getElementById('instructionsScreen');

  // ===== Controls (home) =====
  const topicSelect = document.getElementById('topicSelect');
  const gameModeSelect = document.getElementById('gameModeSelect');
  const letterModeSelect = document.getElementById('letterModeSelect');
  const difficultySelect = document.getElementById('difficultySelect');

  // ===== Game UI refs =====
  const topicDisplay = document.getElementById('topicDisplay');
  const currentLetterEl = document.getElementById('currentLetter');
  const wordInput = document.getElementById('wordInput');
  const feedback = document.getElementById('feedback');
  const scoreEl = document.getElementById('score');
  const streakEl = document.getElementById('streak');
  const letterProgressEl = document.getElementById('letterProgress');
  const timerEl = document.getElementById('timer');
  const hintDisplay = document.getElementById('hintDisplay');
  const comboDisplay = document.getElementById('comboDisplay');

  const skipBtn = document.getElementById('skipButton');
  const timeBtn = document.getElementById('timeButton');
  const hintBtn = document.getElementById('hintButton');

  const gameOver = document.getElementById('gameOver');
  const finalScore = document.getElementById('finalScore');
  const wordsCompletedEl = document.getElementById('wordsCompleted');
  const bestStreakEl = document.getElementById('bestStreak');
  const wordsList = document.getElementById('wordsList');

  // ===== A11y on both screens =====
  if (window.A11y) {
    A11y.bindControls(home);
    A11y.bindControls(game);
    A11y.applyFromStorage();
  }

  // ===== State =====
  let currentTopic = '';
  let currentLetter = 'A';
  let currentLetterIndex = 0;
  let letterSequence = [];

  let score = 0, streak = 0, bestStreak = 0;
  let gameRunning = false; 
  let timeLeft = 60; 
  let timer = null;

  let completedWords = [];
  let hintActive = false; 
  let fireMode = false; 
  let fireModeEnd = 0;

  let gameMode = 'classic', letterMode = 'all', difficulty = 'normal';
  let powerUps = { skip:3, extraTime:2, hint:3 };
  let lastLetterShownAt = 0;

  // NEW: Track duplicates for the current session
  let usedWords = new Set();

  // ===== Init =====
  function populateTopics(){
    topicSelect.innerHTML = '<option value="">Choose a topic</option>';
    (window.TOPICS || []).forEach(t => {
      const o = document.createElement('option');
      o.value = t; o.textContent = t;
      topicSelect.appendChild(o);
    });
  }
  populateTopics();

  // ===== Screen routing =====
  function goto(el){
    [home, game, how].forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('randomBtn').addEventListener('click', () => {
    const list = window.TOPICS || [];
    if (!list.length) return;
    topicSelect.value = list[Math.floor(Math.random() * list.length)];
  });
  document.getElementById('howBtn').addEventListener('click', () => goto(how));
  document.getElementById('closeHowBtn').addEventListener('click', () => goto(home));
  document.getElementById('backBtn').addEventListener('click', () => { resetGame(); goto(home); });
  document.getElementById('homeFromOverBtn').addEventListener('click', () => { resetGame(); goto(home); });
  document.getElementById('playAgainBtn').addEventListener('click', () => { startGame(); });

  // ===== Game helpers =====
  function createLetterSequence(){
    let letters;
    letterMode = letterModeSelect.value;
    switch (letterMode) {
      case 'all': letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); break;
      case 'no-qx': letters = 'ABCDEFGHIJKLMNOPRSTUVWYZ'.split(''); break; // removed Q & X
      case 'vowels': letters = 'AEIOU'.split(''); break;
      case 'consonants': letters = 'BCDFGHJKLMNPQRSTVWXYZ'.split(''); break;
      case 'backwards': letters = 'ZYXWVUTSRQPONMLKJIHGFEDCBA'.split(''); break;
    }
    if (letterMode !== 'backwards') {
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
    }
    return letters;
  }

  function getInitialTime(){
    gameMode = gameModeSelect.value;
    difficulty = difficultySelect.value;
    let base = (gameMode === 'classic') ? 60 : (gameMode === 'sudden-death' ? 999 : 30);
    if (difficulty === 'beginner') base += 30;
    else if (difficulty === 'expert') base -= 15;
    else if (difficulty === 'master') base -= 30;
    return base;
  }

  function updateComboDisplay(){
    if (streak >= 10 && fireMode) {
      comboDisplay.innerHTML = '<span class="combo-text">🔥 FIRE MODE! 3x</span>';
    } else if (streak >= 5) {
      comboDisplay.innerHTML = '<span class="combo-text">⚡ 2x</span>';
    } else {
      comboDisplay.innerHTML = '';
    }
  }

  function updatePowerUpButtons(){
    skipBtn.textContent = `⏭️ Skip (${powerUps.skip})`;
    timeBtn.textContent = `⏰ +10s (${powerUps.extraTime})`;
    hintBtn.textContent = `💡 Hint (${powerUps.hint})`;
    skipBtn.disabled = powerUps.skip <= 0;
    timeBtn.disabled = powerUps.extraTime <= 0;
    hintBtn.disabled = powerUps.hint <= 0;
  }

  function updateDisplay(){
    currentLetterEl.textContent = currentLetter;
    scoreEl.textContent = score;
    streakEl.textContent = streak;
    letterProgressEl.textContent = `${currentLetterIndex + 1}/${letterSequence.length}`;
    wordInput.value = '';
    feedback.textContent = '';
    hintDisplay.textContent = '';
    updateComboDisplay();
    lastLetterShownAt = Date.now();
  }

  function nextLetter(){
    currentLetterIndex++;
    if (currentLetterIndex >= letterSequence.length) currentLetterIndex = 0;
    currentLetter = letterSequence[currentLetterIndex];
    updateDisplay();
  }

  // ===== Validation =====
  function isValidWord(raw, letter, topic){
    if (!raw) return { valid:false, reason:'Too short' };
    if (!/^[a-zA-Z\s'\-]+$/.test(raw)) return { valid:false, reason:"Letters, spaces, - and ' only" };
    const clean = raw.toLowerCase().trim().replace(/\s+/g,' ');
    if (clean.length < 2) return { valid:false, reason:'Too short' };
    if (difficulty === 'expert' && (raw !== raw.trim() || /\s{2,}/.test(raw))) {
      return { valid:false, reason:'No extra spaces in Expert mode' };
    }
    if (clean[0] !== letter.toLowerCase()) return { valid:false, reason:'Wrong letter' };

    const words = (window.WORD_LISTS && window.WORD_LISTS[topic]) || [];
    if (words.includes(clean)) {
      if (difficulty === 'master') {
        const letterWords = words.filter(w => w[0].toLowerCase() === letter.toLowerCase());
        const common = letterWords.slice(0, Math.min(3, letterWords.length));
        if (common.includes(clean)) {
          return { valid:false, reason:'Too common for Master mode', allowReport:false };
        }
      }
      return { valid:true, quality:'great', reason:'Perfect answer!' };
    }
    return { valid:false, reason:'Not recognized', allowReport:true };
  }

  // ===== Core =====
  function startGame(){
    if (!topicSelect.value) { alert('Choose a topic first!'); return; }

    currentTopic = topicSelect.value;
    topicDisplay.textContent = `Topic: ${currentTopic}`;

    letterSequence = createLetterSequence();
    currentLetterIndex = 0;
    currentLetter = letterSequence[0];

    score = 0; streak = 0; bestStreak = 0;
    timeLeft = getInitialTime();
    completedWords = [];
    gameRunning = true;
    powerUps = { skip:3, extraTime:2, hint:3 };
    hintActive = false; fireMode = false;

    // NEW: reset duplicates store
    usedWords.clear();

    updatePowerUpButtons();
    updateDisplay();
    goto(game);
    wordInput.focus();

    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft = Math.max(0, +(timeLeft - 0.1).toFixed(1));
      timerEl.textContent = timeLeft.toFixed(1) + 's';

      if (timeLeft <= 10) timerEl.classList.add('urgent');
      else timerEl.classList.remove('urgent');

      if (fireMode && Date.now() > fireModeEnd) {
        fireMode = false;
        updateComboDisplay();
      }
      if (timeLeft <= 0) endGame();
    }, 100);
  }

  function endGame(){
    gameRunning = false; 
    clearInterval(timer);

    finalScore.textContent = score;
    wordsCompletedEl.textContent = completedWords.length;
    bestStreakEl.textContent = bestStreak;

    wordsList.innerHTML = '<h4>Your Words:</h4>';
    completedWords.forEach(e => {
      const d = document.createElement('div');
      d.className = 'word-entry';
      const bonus = e.points > 3 ? ` (+${e.points - 3} bonus)` : '';
      d.innerHTML = `<strong>${e.letter}</strong>: ${e.word} — ${e.points} pts${bonus}`;
      wordsList.appendChild(d);
    });

    document.getElementById('gameContent').classList.add('hidden');
    gameOver.classList.remove('hidden');
  }

  function resetGame(){
    gameRunning = false;
    clearInterval(timer);
    timerEl.classList.remove('urgent');
    gameOver.classList.add('hidden');
    document.getElementById('gameContent').classList.remove('hidden');
  }

  // ===== Power-ups =====
  skipBtn.addEventListener('click', () => {
    if (!gameRunning || powerUps.skip <= 0) return;
    powerUps.skip--;
    nextLetter();
    updatePowerUpButtons();
  });

  timeBtn.addEventListener('click', () => {
    if (!gameRunning || powerUps.extraTime <= 0) return;
    powerUps.extraTime--;
    timeLeft += 10;
    updatePowerUpButtons();
  });

  hintBtn.addEventListener('click', () => {
    if (!gameRunning || powerUps.hint <= 0) return;
    powerUps.hint--;
    hintActive = true;
    const list = (window.WORD_LISTS[currentTopic] || [])
      .filter(w => w[0].toLowerCase() === currentLetter.toLowerCase());
    hintDisplay.textContent = list.length
      ? `💡 Hint: ${list[Math.floor(Math.random() * list.length)].slice(0, 2)}...`
      : '💡 No hints for this letter';
    updatePowerUpButtons();
  });

  // ===== Input / Submit =====
  wordInput.addEventListener('keypress', e => {
    if (e.key === 'Enter' && gameRunning) submitWord();
  });

  function submitWord(){
    const raw = wordInput.value;
    const res = isValidWord(raw, currentLetter, currentTopic);
    const word = raw.trim().replace(/\s+/g,' '); // normalized

    if (res.valid) {
      // NEW: duplicate check for current session
      const key = word.toLowerCase();
      if (usedWords.has(key)) {
        // Duplicate -> reject and do NOT advance letter or award points
        if (gameMode === 'sudden-death') { endGame(); return; }
        streak = 0; fireMode = false;
        feedback.textContent = 'Already used!';
        feedback.className = 'feedback error';
        wordInput.value = '';
        setTimeout(() => { feedback.textContent = ''; }, 1500);
        return;
      }
      usedWords.add(key);

      // Scoring
      let pts = 3;
      if (word.length >= 6) pts += 2;
      else if (word.length >= 4) pts += 1;
      if ('QXZ'.includes(currentLetter)) pts += 5;
      if (hintActive || Date.now() - lastLetterShownAt < 3000) pts += 1;
      if (fireMode) pts *= 3;
      else if (streak >= 5) pts *= 2;

      score += pts;
      streak++;
      bestStreak = Math.max(bestStreak, streak);

      if (streak === 10) {
        fireMode = true;
        fireModeEnd = Date.now() + 15000;
      }

      completedWords.push({ letter: currentLetter, word, points: pts });

      if (gameMode === 'lightning') timeLeft += 5;
      else if (gameMode === 'endurance') timeLeft += 3;

      feedback.textContent = res.reason;
      feedback.className = 'feedback success';

      // reflect counters
      scoreEl.textContent = score;
      streakEl.textContent = streak;

      // move on
      setTimeout(nextLetter, 450);

    } else {
      if (gameMode === 'sudden-death') { endGame(); return; }
      streak = 0; fireMode = false;
      feedback.textContent = res.reason;
      feedback.className = 'feedback error';
      setTimeout(() => { feedback.textContent = ''; }, 1500);
    }

    hintActive = false;
    wordInput.value = '';
  }

  // Keyboard: Escape to go home
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && game.classList.contains('active')) {
      resetGame(); goto(home);
    }
  });

})();
