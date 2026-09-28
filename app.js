// ================================
// Japanese Sensei 🇯🇵
// Version 1
// ================================

const profiles = {
  me: {
    name: "Me",
    emoji: "👤"
  },
  mum: {
    name: "Mum",
    emoji: "👩"
  },
  nana: {
    name: "Nana",
    emoji: "👵"
  }
};

let currentProfile = localStorage.getItem("currentProfile");

// -------------------------------
// Lessons
// -------------------------------

const lessons = [
  {
    id: 1,
    title: "Numbers 1–5",
    vocabulary: [
      { japanese: "いち", romaji: "ichi", meaning: "one" },
      { japanese: "に", romaji: "ni", meaning: "two" },
      { japanese: "さん", romaji: "san", meaning: "three" },
      { japanese: "よん", romaji: "yon", meaning: "four" },
      { japanese: "ご", romaji: "go", meaning: "five" }
    ]
  },
  {
    id: 2,
    title: "Greetings",
    vocabulary: [
      { japanese: "こんにちは", romaji: "konnichiwa", meaning: "hello" },
      { japanese: "おはよう", romaji: "ohayou", meaning: "good morning" },
      { japanese: "こんばんは", romaji: "konbanwa", meaning: "good evening" }
    ]
  },
  {
    id: 3,
    title: "Useful Words",
    vocabulary: [
      { japanese: "はい", romaji: "hai", meaning: "yes" },
      { japanese: "いいえ", romaji: "iie", meaning: "no" },
      { japanese: "ありがとう", romaji: "arigatou", meaning: "thank you" },
      { japanese: "すみません", romaji: "sumimasen", meaning: "excuse me / sorry" }
    ]
  },
  {
    id: 4,
    title: "Simple Phrases",
    vocabulary: [
      {
        japanese: "わたしは",
        romaji: "watashi wa",
        meaning: "I am / as for me"
      },
      {
        japanese: "おげんきですか",
        romaji: "ogenki desu ka",
        meaning: "How are you?"
      },
      {
        japanese: "げんきです",
        romaji: "genki desu",
        meaning: "I am well"
      }
    ]
  }
];

// -------------------------------
// Get / save profile data
// -------------------------------

function getProfileData(id) {
  const key = `profile_${id}`;

  const saved = localStorage.getItem(key);

  if (saved) {
    return JSON.parse(saved);
  }

  const newProfile = {
    name: profiles[id].name,
    xp: 0,
    streak: 0,
    lessonsCompleted: 0,
    testsCompleted: 0,
    testScores: []
  };

  localStorage.setItem(key, JSON.stringify(newProfile));

  return newProfile;
}

function saveProfileData(id, data) {
  localStorage.setItem(`profile_${id}`, JSON.stringify(data));
}

function getCurrentData() {
  return getProfileData(currentProfile);
}

// -------------------------------
// Japanese voice
// -------------------------------

function speakJapanese(text) {
  if (!("speechSynthesis" in window)) {
    alert("Your browser does not support Japanese voice.");
    return;
  }

  speechSynthesis.cancel();

  const voices = speechSynthesis.getVoices();

  const japaneseVoice = voices.find(
    voice => voice.lang.toLowerCase().startsWith("ja")
  );

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "ja-JP";

  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }

  utterance.rate = 0.85;
  utterance.pitch = 1;

  speechSynthesis.speak(utterance);
}

// -------------------------------
// Main app
// -------------------------------

const app = document.getElementById("app");
const bottomNav = document.getElementById("bottom-nav");

function showProfileSelection() {
  bottomNav.classList.add("hidden");

  app.innerHTML = `
    <div class="profile-select">

      <div>
        <h1>Japanese Sensei 🇯🇵</h1>
        <p class="sub">Who is learning today?</p>
      </div>

      <div class="profile-buttons">

        <button class="profile-btn" onclick="selectProfile('me')">
          <span class="emoji">👤</span>
          <span>Me</span>
        </button>

        <button class="profile-btn" onclick="selectProfile('mum')">
          <span class="emoji">👩</span>
          <span>Mum</span>
        </button>

        <button class="profile-btn" onclick="selectProfile('nana')">
          <span class="emoji">👵</span>
          <span>Nana</span>
        </button>

      </div>

    </div>
  `;
}

function selectProfile(id) {
  currentProfile = id;
  localStorage.setItem("currentProfile", id);

  getProfileData(id);

  showScreen("home");
}

// -------------------------------
// Screen navigation
// -------------------------------

function showScreen(screen) {
  if (!currentProfile) {
    showProfileSelection();
    return;
  }

  bottomNav.classList.remove("hidden");

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.screen === screen
    );
  });

  if (screen === "home") showHome();
  if (screen === "lessons") showLessons();
  if (screen === "leaderboard") showLeaderboard();
  if (screen === "profile") showProfile();
}

// -------------------------------
// Home
// -------------------------------

function showHome() {
  const data = getCurrentData();
  const person = profiles[currentProfile];

  app.innerHTML = `
    <div>

      <div class="card text-center">
        <h1>Japanese Sensei 🇯🇵</h1>
        <p>Welcome back, ${person.emoji} ${person.name}!</p>
      </div>

      <div class="home-stats">

        <div class="stat-card">
          <div class="stat-label">XP</div>
          <div class="stat-value">${data.xp}</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Streak</div>
          <div class="stat-value">${data.streak} 🔥</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Lessons</div>
          <div class="stat-value">${data.lessonsCompleted}</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Tests</div>
          <div class="stat-value">${data.testsCompleted}</div>
        </div>

      </div>

      <div class="card">
        <h2>Today's Learning 📚</h2>
        <p class="mb-8">
          Keep learning Japanese and earn XP!
        </p>

        <button class="btn-primary" onclick="showScreen('lessons')">
          📚 Start a Lesson
        </button>

        <button class="btn-secondary" onclick="showTest()">
          📝 Take a Test
        </button>

        <button class="btn-secondary" onclick="showLeaderboard()">
          🏆 Family Leaderboard
        </button>
      </div>

    </div>
  `;
}

// -------------------------------
// Lessons list
// -------------------------------

function showLessons() {
  app.innerHTML = `
    <div>

      <div class="card">
        <h2>Japanese Lessons 📚</h2>
        <p>Choose a beginner lesson.</p>
      </div>

      ${lessons.map(lesson => `
        <div class="card">

          <h3>Lesson ${lesson.id}</h3>

          <p>${lesson.title}</p>

          <button
            class="btn-primary"
            onclick="startLesson(${lesson.id})">
            Start Lesson
          </button>

        </div>
      `).join("")}

    </div>
  `;
}

// -------------------------------
// Lesson player
// -------------------------------

let activeLesson = null;
let activeWord = 0;

function startLesson(id) {
  activeLesson = lessons.find(lesson => lesson.id === id);
  activeWord = 0;

  showLessonWord();
}

function showLessonWord() {
  const word = activeLesson.vocabulary[activeWord];

  app.innerHTML = `
    <div>

      <div class="card">

        <h2>${activeLesson.title}</h2>

        <div class="lesson-vocab">

          <div class="vocab-japanese">
            ${word.japanese}
          </div>

          <div class="vocab-romaji">
            ${word.romaji}
          </div>

          <div class="vocab-meaning">
            ${word.meaning}
          </div>

          <button
            class="btn-icon"
            onclick="speakJapanese('${word.japanese}')"
            aria-label="Hear Japanese">
            🔊
          </button>

        </div>

        <div class="lesson-nav">

          <button
            class="btn-small"
            onclick="showScreen('lessons')">
            ← Back
          </button>

          <span>
            ${activeWord + 1} / ${activeLesson.vocabulary.length}
          </span>

          <button
            class="btn-small"
            onclick="nextLessonWord()">
            Next →
          </button>

        </div>

      </div>

    </div>
  `;
}

function nextLessonWord() {
  activeWord++;

  if (activeWord >= activeLesson.vocabulary.length) {
    completeLesson();
    return;
  }

  showLessonWord();
}

// -------------------------------
// Complete lesson
// -------------------------------

function completeLesson() {
  const data = getCurrentData();

  data.lessonsCompleted++;
  data.xp += 10;

  saveProfileData(currentProfile, data);

  app.innerHTML = `
    <div class="card text-center">

      <h1>Lesson Complete! 🎉</h1>

      <p class="mt-16">
        Great job!
      </p>

      <p class="mt-16">
        You earned <strong>10 XP</strong> ⭐
      </p>

      <button
        class="btn-primary mt-16"
        onclick="showScreen('lessons')">
        Continue
      </button>

    </div>
  `;
}

// -------------------------------
// Leaderboard
// -------------------------------

function showLeaderboard() {
  const leaderboard = Object.keys(profiles)
    .map(id => ({
      id,
      ...profiles[id],
      data: getProfileData(id)
    }))
    .sort((a, b) => b.data.xp - a.data.xp);

  app.innerHTML = `
    <div>

      <div class="card text-center">
        <h2>🏆 Family Leaderboard</h2>
        <p>Keep learning and earn XP!</p>
      </div>

      <div class="card">

        ${leaderboard.map((person, index) => `
          <div class="leaderboard-item">

            <div class="leaderboard-rank">
              ${index + 1}
            </div>

            <div class="leaderboard-name">
              ${person.emoji} ${person.name}
            </div>

            <div class="leaderboard-xp">
              ${person.data.xp} XP
            </div>

          </div>
        `).join("")}

      </div>

      <div class="card">
        <p>
          ℹ️ Version 1 saves scores on this device.
          Scores do not yet automatically sync between phones.
        </p>
      </div>

    </div>
  `;
}

// -------------------------------
// Test
// -------------------------------

const testQuestions = [
  {
    question: "What does いち mean?",
    options: ["One", "Two", "Three", "Five"],
    answer: "One"
  },
  {
    question: "What does さん mean?",
    options: ["One", "Two", "Three", "Four"],
    answer: "Three"
  },
  {
    question: "What does ありがとう mean?",
    options: ["Hello", "Thank you", "Goodbye", "Yes"],
    answer: "Thank you"
  },
  {
    question: "What does はい mean?",
    options: ["No", "Sorry", "Yes", "Hello"],
    answer: "Yes"
  },
  {
    question: "What does こんにちは mean?",
    options: ["Hello", "Thank you", "Good morning", "No"],
    answer: "Hello"
  }
];

let testIndex = 0;
let testScore = 0;

function showTest() {
  testIndex = 0;
  testScore = 0;

  showTestQuestion();
}

function showTestQuestion() {
  const q = testQuestions[testIndex];

  app.innerHTML = `
    <div class="card">

      <h2>📝 Japanese Test</h2>

      <p>
        Question ${testIndex + 1} of ${testQuestions.length}
      </p>

      <div class="mt-16">
        <h3>${q.question}</h3>
      </div>

      <div class="quiz-options">

        ${q.options.map(option => `
          <button
            class="quiz-option"
            onclick="answerTest('${option}')">
            ${option}
          </button>
        `).join("")}

      </div>

    </div>
  `;
}

function answerTest(answer) {
  const correct = testQuestions[testIndex].answer;

  if (answer === correct) {
    testScore++;
    alert("Great job! 🎉");
  } else {
    alert(`Almost! The answer was ${correct}. Keep practising 💪`);
  }

  testIndex++;

  if (testIndex >= testQuestions.length) {
    finishTest();
  } else {
    showTestQuestion();
  }
}

function finishTest() {
  const data = getCurrentData();

  data.testsCompleted++;
  data.testScores.push(testScore);

  data.xp += testScore * 4;

  saveProfileData(currentProfile, data);

  app.innerHTML = `
    <div class="card text-center">

      <h1>Test Complete! 🎉</h1>

      <p class="mt-16">
        Score:
      </p>

      <h1>
        ${testScore}/${testQuestions.length}
      </h1>

      <p class="mt-16">
        XP earned:
        <strong>${testScore * 4} XP</strong>
      </p>

      <button
        class="btn-primary mt-16"
        onclick="showScreen('home')">
        Back Home
      </button>

    </div>
  `;
}

// -------------------------------
// Profile
// -------------------------------

function showProfile() {
  const data = getCurrentData();
  const person = profiles[currentProfile];

  app.innerHTML = `
    <div>

      <div class="card text-center">

        <h1>${person.emoji}</h1>

        <h2>${person.name}</h2>

        <p>${data.xp} XP</p>

      </div>

      <div class="card">

        <h2>Switch Learner</h2>

        <button
          class="btn-secondary"
          onclick="changeProfile()">
          Change Profile
        </button>

      </div>

      <div class="card">

        <h2>Settings ⚙️</h2>

        <button
          class="btn-secondary"
          onclick="setTestDay()">
          📅 Set Test Day
        </button>

        <button
          class="btn-secondary"
          onclick="resetProgress()">
          🗑️ Reset My Progress
        </button>

      </div>

      <div class="card">

        <h2>About</h2>

        <p>
          Japanese Sensei 🇯🇵
        </p>

        <p>
          A family Japanese learning app.
        </p>

      </div>

    </div>
  `;
}

function changeProfile() {
  currentProfile = null;
  localStorage.removeItem("currentProfile");
  showProfileSelection();
}

function resetProgress() {
  const sure = confirm(
    "Are you sure you want to reset your progress?"
  );

  if (!sure) return;

  localStorage.removeItem(`profile_${currentProfile}`);

  getProfileData(currentProfile);

  alert("Your progress has been reset.");

  showScreen("profile");
}

// -------------------------------
// Test day
// -------------------------------

function setTestDay() {
  const current = localStorage.getItem("testDay") || "";

  const date = prompt(
    "Enter your test date as YYYY-MM-DD:",
    current
  );

  if (!date) return;

  localStorage.setItem("testDay", date);

  alert(`Test day saved: ${date}`);
}

// -------------------------------
// Bottom navigation
// -------------------------------

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.screen);
  });
});

// -------------------------------
// Service worker
// -------------------------------

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch(error => {
        console.log("Service worker registration failed:", error);
      });
  });
}

// -------------------------------
// Start app
// -------------------------------

if (currentProfile) {
  getProfileData(currentProfile);
  showScreen("home");
} else {
  showProfileSelection();
}
