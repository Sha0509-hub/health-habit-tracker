/* ==========================================================================
   AuraLife — Self-Care, Fitness, Focus & Habit OS Master Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'auralife_dashboard_state_v3';
  
  // Default Application State
  const defaultState = {
    theme: 'dark',
    xp: 1340,
    level: 3,
    steps: 8420,
    stepGoal: 10000,
    calories: 540,
    caloriesGoal: 800,
    sleepHours: 7.8,
    sleepScore: 88,
    activeMins: 45,
    activeMinsGoal: 60,
    waterLogged: 1500,
    waterGoal: 2500,
    totalStreak: 14,
    currentMood: 'Radiant',
    currentEmoji: '😁',
    pomoSessions: 2,
    moodHistory: [
      { date: 'Mon', mood: 'Calm', emoji: '🙂', val: 80 },
      { date: 'Tue', mood: 'Radiant', emoji: '😁', val: 100 },
      { date: 'Wed', mood: 'Neutral', emoji: '😐', val: 60 },
      { date: 'Thu', mood: 'Radiant', emoji: '😁', val: 100 },
      { date: 'Fri', mood: 'Calm', emoji: '🙂', val: 80 },
      { date: 'Sat', mood: 'Tired', emoji: '😴', val: 40 },
      { date: 'Sun', mood: 'Radiant', emoji: '😁', val: 100 }
    ],
    habits: [
      { id: 1, name: '💧 Drink 2.5L Water', category: 'Health', days: [true, true, true, true, true, false, false], streak: 12 },
      { id: 2, name: '🧘 15m Mindfulness / Breathwork', category: 'Mind', days: [true, true, true, false, true, true, false], streak: 8 },
      { id: 3, name: '🏃 10,000 Steps Walking', category: 'Fitness', days: [true, true, true, true, false, true, false], streak: 5 },
      { id: 4, name: '🍎 Whole Foods & No Sugar', category: 'Nutrition', days: [true, false, true, true, true, false, false], streak: 4 },
      { id: 5, name: '📖 Read 20 Pages', category: 'Mind', days: [true, true, true, true, true, true, false], streak: 14 }
    ],
    meals: [
      { id: 101, name: 'Avocado Toast & Eggs', category: 'Breakfast', calories: 420, protein: 22, carbs: 38, fats: 18 },
      { id: 102, name: 'Grilled Salmon Bowl', category: 'Lunch', calories: 680, protein: 48, carbs: 62, fats: 24 },
      { id: 103, name: 'Greek Yogurt & Berries', category: 'Snack', calories: 240, protein: 18, carbs: 28, fats: 5 }
    ],
    journal: {
      entry1: 'Morning sunlight during my 20-minute walk',
      entry2: 'Hit my daily step goal before dinner',
      entry3: 'Peaceful cup of chamomile tea'
    },
    routines: { r1: true, r2: true, r3: true, r4: false },
    unlockedBadges: ['b1', 'b2', 'b3'],
    activeCategory: 'all',
    journalEntries: [
      { id: 1, date: '2026-09-23', title: 'Peaceful Morning Walk', content: 'Enjoyed fresh air and sunlight while listening to calm soundscapes.', tag: '🌟 Joyful', emoji: '🌟' },
      { id: 2, date: '2026-09-22', title: 'Productive Habit Streak', content: 'Hit all habit targets and completed 3 focus sessions.', tag: '⚡ Energized', emoji: '⚡' }
    ],
    emotionLogs: [
      { date: '2026-09-23', emotion: 'Joyful', emoji: '🌟' },
      { date: '2026-09-22', emotion: 'Energized', emoji: '⚡' },
      { date: '2026-09-21', emotion: 'Calm', emoji: '🧘' }
    ]
  };

  let appState = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch (e) {
      console.warn('LocalStorage load error:', e);
      return defaultState;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }



  /* ==========================================================================
     Aura Wellness Score Formula Calculator
     ========================================================================== */
  function calculateAuraScore() {
    const stepsScore = Math.min(100, (appState.steps / 10000) * 100) * 0.25;
    const waterScore = Math.min(100, (appState.waterLogged / appState.waterGoal) * 100) * 0.25;

    const totalSlots = appState.habits.length * 7;
    let completedSlots = 0;
    appState.habits.forEach(h => {
      h.days.forEach(d => { if (d) completedSlots++; });
    });
    const habitScore = totalSlots > 0 ? (completedSlots / totalSlots) * 100 * 0.30 : 0;

    const sleepScore = 85 * 0.10;

    const moodMap = { 'Radiant': 100, 'Calm': 80, 'Neutral': 60, 'Anxious': 40, 'Tired': 40, 'Stressed': 20 };
    const moodVal = moodMap[appState.currentMood] || 80;
    const moodScore = moodVal * 0.10;

    return Math.min(100, Math.round(stepsScore + waterScore + habitScore + sleepScore + moodScore));
  }

  function updateAuraScoreUI() {
    const score = calculateAuraScore();
    const scoreVal = document.getElementById('auraScoreVal');
    const scoreRing = document.getElementById('auraScoreRing');
    const scoreTag = document.getElementById('auraScoreTag');

    const scoreStepsPill = document.getElementById('scoreStepsPill');
    const scoreWaterPill = document.getElementById('scoreWaterPill');
    const scoreHabitPill = document.getElementById('scoreHabitPill');

    const stepsPct = Math.min(100, Math.round((appState.steps / 10000) * 100));
    const waterPct = Math.min(100, Math.round((appState.waterLogged / appState.waterGoal) * 100));

    const totalSlots = appState.habits.length * 7;
    let completedSlots = 0;
    appState.habits.forEach(h => { h.days.forEach(d => { if (d) completedSlots++; }); });
    const habitPct = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

    if (scoreStepsPill) scoreStepsPill.textContent = `${stepsPct}%`;
    if (scoreWaterPill) scoreWaterPill.textContent = `${waterPct}%`;
    if (scoreHabitPill) scoreHabitPill.textContent = `${habitPct}%`;

    if (scoreVal) scoreVal.textContent = `${score}%`;
    if (scoreRing) scoreRing.setAttribute('stroke-dasharray', `${score}, 100`);

    if (scoreTag) {
      if (score >= 85) scoreTag.textContent = '🌟 Radiant Aura • Peak Energy';
      else if (score >= 70) scoreTag.textContent = '🌿 Balanced & Strong Aura';
      else if (score >= 50) scoreTag.textContent = '⚡ Steady Focus Aura';
      else scoreTag.textContent = '🔋 Battery Low • Recharge Needed';
    }
  }

  /* ==========================================================================
     Level Progression & Feature Gating Roadmap Data
     ========================================================================== */
  const levelsRoadmap = [
    { level: 1, rank: '🌱 Novice Adventurer', xpReq: 0, icon: '🌱', perks: ['Basic Health Dashboard', '10,000 Step Ring', 'Water Intake Tracker', 'Weekly Habit OS Matrix'] },
    { level: 2, rank: '🧘 Habit Practitioner', xpReq: 500, icon: '🧘', perks: ['4-7-8 Guided Mindful Breathing Tool', 'Dark/Light Glass Theme Switcher'] },
    { level: 3, rank: '⏱️ Mindful Focus Master', xpReq: 1000, icon: '⏱️', perks: ['25-min Focus Pomodoro Timer', 'Web Audio Ambient Soundscape Player (Rain, Lo-Fi, Ocean, White Noise, 432Hz)'] },
    { level: 4, rank: '🥗 Nutrition Architect', xpReq: 1500, icon: '🥗', perks: ['Macronutrient Distribution Tracker (Protein, Carbs, Fats)', 'Meal Logger & Daily Calorie Breakdown'] },
    { level: 5, rank: '👑 Aura Champion', xpReq: 2000, icon: '👑', perks: ['30-Day Monthly Consistency Heatmap', 'Data Backup & Export Center (JSON/CSV/PDF)'] }
  ];

  function getRankForLevel(lvl) {
    const found = levelsRoadmap.slice().reverse().find(l => lvl >= l.level);
    return found || levelsRoadmap[0];
  }

  function updateLevelGatedUI() {
    const lvl = appState.level;

    // Level 3 Check: Focus & Soundscapes
    const focusBanner = document.getElementById('focusLockedBanner');
    const focusContent = document.getElementById('focusContentWrap');
    const lockTagFocus = document.getElementById('lockTagFocus');

    if (lvl < 3) {
      if (focusBanner) focusBanner.style.display = 'flex';
      if (focusContent) focusContent.style.display = 'none';
      if (lockTagFocus) { lockTagFocus.textContent = '🔒 Lvl 3'; lockTagFocus.className = 'nav-lock-tag'; }
    } else {
      if (focusBanner) focusBanner.style.display = 'none';
      if (focusContent) focusContent.style.display = 'grid';
      if (lockTagFocus) { lockTagFocus.textContent = '✓'; lockTagFocus.className = 'nav-lock-tag unlocked'; }
    }

    // Level 4 Check: Nutrition Hub View
    const nutritionBanner = document.getElementById('nutritionLockedBanner');
    const nutritionContent = document.getElementById('nutritionContentWrap');
    const lockTagNutrition = document.getElementById('lockTagNutrition');

    if (lvl < 4) {
      if (nutritionBanner) nutritionBanner.style.display = 'flex';
      if (nutritionContent) nutritionContent.style.display = 'none';
      if (lockTagNutrition) { lockTagNutrition.textContent = '🔒 Lvl 4'; lockTagNutrition.className = 'nav-lock-tag'; }
    } else {
      if (nutritionBanner) nutritionBanner.style.display = 'none';
      if (nutritionContent) nutritionContent.style.display = 'block';
      if (lockTagNutrition) { lockTagNutrition.textContent = '✓'; lockTagNutrition.className = 'nav-lock-tag unlocked'; }
    }
  }

  let inspectLevel = null;

  function renderLevelRoadmap() {
    const grid = document.getElementById('levelRoadmapGrid');
    const rankTitle = document.getElementById('hubRankTitle');
    const badgeIcon = document.getElementById('rankBadgeIcon');
    const xpCount = document.getElementById('hubXpCount');
    const nextInfo = document.getElementById('hubNextLevelInfo');
    const subtitleEl = document.getElementById('hubRankSubtitle');

    if (inspectLevel === null) inspectLevel = appState.level;

    const currentRank = getRankForLevel(inspectLevel);
    const isInspectingCurrent = inspectLevel === appState.level;
    const isInspectingUnlocked = appState.level >= inspectLevel;

    if (rankTitle) {
      const statusTag = isInspectingCurrent ? ' (Current Level ✨)' : (isInspectingUnlocked ? ' (Unlocked ✔️)' : ' (Locked 🔒)');
      rankTitle.textContent = `Level ${inspectLevel} — ${currentRank.rank}${statusTag}`;
    }
    if (badgeIcon) badgeIcon.textContent = currentRank.icon;
    if (xpCount) xpCount.textContent = `${appState.xp.toLocaleString()} Total XP Earned`;

    if (subtitleEl) {
      subtitleEl.textContent = `Level Perks: ${currentRank.perks.join(' • ')}`;
    }

    const nextLevelData = levelsRoadmap.find(l => l.level === inspectLevel + 1);
    if (nextInfo) {
      if (nextLevelData) {
        const needed = nextLevelData.xpReq - appState.xp;
        nextInfo.textContent = `${needed > 0 ? needed : 0} XP to Level ${nextLevelData.level}`;
      } else {
        nextInfo.textContent = `MAX LEVEL REACHED 👑`;
      }
    }

    if (!grid) return;
    grid.innerHTML = '';

    levelsRoadmap.forEach(item => {
      const isUnlocked = appState.level >= item.level;
      const isSelected = inspectLevel === item.level;
      const card = document.createElement('div');
      card.className = `level-step-card ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected-inspect' : ''}`;
      card.style.cursor = 'pointer';

      const perksHTML = item.perks.map(p => `<div class="perk-item"><span>${isUnlocked ? '✨' : '🔒'}</span> <span>${p}</span></div>`).join('');

      card.innerHTML = `
        <div class="step-header">
          <span class="step-lvl-badge">Level ${item.level}</span>
          <span class="step-status-tag ${isUnlocked ? 'status-unlocked' : 'status-locked'}">
            ${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
          </span>
        </div>
        <span class="step-title">${item.icon} ${item.rank}</span>
        <span class="step-xp-req">Required: ${item.xpReq} XP</span>
        <div class="perks-list">${perksHTML}</div>
      `;

      card.addEventListener('click', () => {
        inspectLevel = item.level;
        renderLevelRoadmap();
      });

      grid.appendChild(card);
    });
  }

  const prevLvlBtn = document.getElementById('prevLevelBtn');
  const nextLvlBtn = document.getElementById('nextLevelBtn');

  if (prevLvlBtn) {
    prevLvlBtn.addEventListener('click', () => {
      if (inspectLevel > 1) {
        inspectLevel--;
        renderLevelRoadmap();
      }
    });
  }

  if (nextLvlBtn) {
    nextLvlBtn.addEventListener('click', () => {
      if (inspectLevel < levelsRoadmap.length) {
        inspectLevel++;
        renderLevelRoadmap();
      }
    });
  }

  /* ==========================================================================
     PWA Installation & Service Worker Logic
     ========================================================================== */
  let deferredPrompt = null;
  const installSidebarBtn = document.getElementById('installPwaBtnSidebar');
  const installHeaderBtn = document.getElementById('installPwaBtnHeader');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installSidebarBtn) installSidebarBtn.style.display = 'flex';
    if (installHeaderBtn) installHeaderBtn.style.display = 'inline-flex';
  });

  function triggerPwaInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('🎉 AuraLife App Installed Successfully!');
        }
        deferredPrompt = null;
      });
    } else {
      showToast('📲 Click browser menu & select "Add to Home Screen" / "Install App"!');
    }
  }

  if (installSidebarBtn) installSidebarBtn.addEventListener('click', triggerPwaInstall);
  if (installHeaderBtn) installHeaderBtn.addEventListener('click', triggerPwaInstall);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('ServiceWorker registered:', reg.scope))
      .catch((err) => console.warn('ServiceWorker registration error:', err));
  }

  /* ==========================================================================
     0. Section-by-Section Modular Navigation Router
     ========================================================================== */
  function switchView(targetView) {
    const validViews = ['dashboard', 'levels', 'habits', 'focus', 'nutrition', 'mindfulness', 'badges', 'calendar'];
    if (!validViews.includes(targetView)) targetView = 'dashboard';

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`view-${targetView}`);
    if (targetSec) {
      targetSec.classList.add('active');
    }

    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.view === targetView) {
        item.classList.add('active');
      }
    });

    if (window.location.hash !== `#${targetView}`) {
      history.pushState(null, null, `#${targetView}`);
    }

    if (targetView === 'dashboard') {
      setTimeout(renderActivityChart, 50);
      updateAuraScoreUI();
    } else if (targetView === 'levels') {
      renderLevelRoadmap();
    } else if (targetView === 'mindfulness') {
      setTimeout(renderMoodTrendChart, 50);
    } else if (targetView === 'calendar') {
      renderCalendarGrid();
      renderJournalHistory();
    }
  }

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) switchView(hash);
  });

  /* ==========================================================================
     1. Gamification Engine (XP, Dynamic Animation & Level Up Celebration)
     ========================================================================== */
  function addXP(amount, reason) {
    appState.xp += amount;
    const oldLevel = appState.level;
    const newLevel = Math.floor(appState.xp / 500) + 1;
    appState.level = newLevel;

    saveState();
    updateGamificationUI();
    updateLevelGatedUI();
    updateAuraScoreUI();

    if (newLevel > oldLevel) {
      const unlockedRank = getRankForLevel(newLevel);
      showLevelUpModal(newLevel, unlockedRank);
      launchConfetti();
      playLevelUpChime();
    } else {
      showToast(`+${amount} XP (${reason})`);
    }
    checkBadgesUnlock();
    checkStreakMilestones();
  }

  function updateGamificationUI() {
    const levelTitle = document.getElementById('userLevelTitle');
    const xpText = document.getElementById('xpProgressText');
    const xpFill = document.getElementById('xpBarFill');

    const currentLevelXP = appState.xp % 500;
    const pct = Math.min(100, Math.round((currentLevelXP / 500) * 100));

    if (levelTitle) levelTitle.textContent = `Level ${appState.level}`;
    if (xpText) xpText.textContent = `${currentLevelXP} / 500 XP`;
    if (xpFill) xpFill.style.width = `${pct}%`;
  }

  function showLevelUpModal(level, rankData) {
    const modal = document.getElementById('levelUpModal');
    const icon = document.getElementById('lvlUpIcon');
    const title = document.getElementById('lvlUpTitle');
    const sub = document.getElementById('lvlUpSubtitle');
    const perks = document.getElementById('lvlUpPerks');

    if (icon) icon.textContent = rankData.icon;
    if (title) title.textContent = `LEVEL ${level} UNLOCKED!`;
    if (sub) sub.textContent = `You reached Level ${level} — ${rankData.rank}! ✨`;
    if (perks) perks.textContent = `Unlocked Features: ${rankData.perks.join(' • ')}`;

    if (modal) modal.classList.add('active');
  }

  const closeLvlUpModalBtn = document.getElementById('closeLvlUpModalBtn');
  if (closeLvlUpModalBtn) {
    closeLvlUpModalBtn.addEventListener('click', () => {
      const modal = document.getElementById('levelUpModal');
      if (modal) modal.classList.remove('active');
    });
  }

  function playLevelUpChime() {
    try {
      initAudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.2, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
    } catch (e) {
      console.warn('Level Up chime error:', e);
    }
  }

  function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 - 50,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: Math.random() * 10 - 5
      });
    }

    let frame = 0;
    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rotation += p.rSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 120) {
        requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animateConfetti();
  }

  function checkStreakMilestones() {
    appState.habits.forEach(h => {
      if (h.streak >= 7 && !appState.unlockedBadges.includes('b3')) {
        appState.unlockedBadges.push('b3');
        saveState();
        launchConfetti();
        showToast('🏆 7-Day Warrior Badge Unlocked! 🔥 Outstanding consistency!');
      }
    });
  }

  const badgesData = [
    { id: 'b1', title: 'Hydration Hero 💧', desc: 'Log water intake 5 times.', icon: '💧' },
    { id: 'b2', title: 'Zen Master 🧘', desc: 'Complete 3 breathing sessions.', icon: '🧘' },
    { id: 'b3', title: '7-Day Warrior 🔥', desc: 'Maintain a 7+ day habit streak.', icon: '🔥' },
    { id: 'b4', title: 'Nutrition Guru 🥗', desc: 'Log 5 healthy meals.', icon: '🥗' },
    { id: 'b5', title: 'Focus Wizard ⏱️', desc: 'Complete 3 Pomodoro sessions.', icon: '⏱️' },
    { id: 'b6', title: 'Early Bird 🌅', desc: 'Complete morning routine.', icon: '🌅' }
  ];

  function checkBadgesUnlock() {
    if (appState.waterLogged >= 2000 && !appState.unlockedBadges.includes('b1')) {
      appState.unlockedBadges.push('b1');
    }
    if (appState.meals.length >= 3 && !appState.unlockedBadges.includes('b4')) {
      appState.unlockedBadges.push('b4');
    }
    if (appState.pomoSessions >= 3 && !appState.unlockedBadges.includes('b5')) {
      appState.unlockedBadges.push('b5');
    }
    saveState();
    renderBadges();
  }

  function renderBadges() {
    const grid = document.getElementById('badgesGrid');
    const countEl = document.getElementById('unlockedBadgesCount');
    if (!grid) return;

    grid.innerHTML = '';
    let unlockedCount = 0;

    badgesData.forEach(badge => {
      const isUnlocked = appState.unlockedBadges.includes(badge.id);
      if (isUnlocked) unlockedCount++;

      const card = document.createElement('div');
      card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-info">
          <span class="badge-title">${badge.title}</span>
          <span class="badge-desc">${badge.desc}</span>
        </div>
      `;
      grid.appendChild(card);
    });

    if (countEl) countEl.textContent = `${unlockedCount} / ${badgesData.length} Unlocked`;
  }

  /* ==========================================================================
     2. Web Audio Ambient Soundscapes & Multi-Track Mixer Synthesizer Engine
     ========================================================================== */
  let audioCtx = null;
  let isSoundPlaying = false;
  let isMixerPlaying = false;
  let activeSoundPreset = 'rain';
  let noiseNode = null;
  let masterGain = null;
  let lofiOscs = [];

  // Mixer Nodes
  let mixerRainGain = null;
  let mixerLofiGain = null;
  let mixerFireGain = null;
  let mixerRainSource = null;
  let mixerLofiSources = [];
  let mixerFireInterval = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
  }

  function playBreathingChime(freq = 528) {
    try {
      initAudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  function createWhiteNoiseBuffer() {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  function startSoundscape(preset) {
    initAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    stopSoundscape();

    masterGain = audioCtx.createGain();
    const volumeSlider = document.getElementById('soundVolumeSlider');
    const vol = volumeSlider ? parseFloat(volumeSlider.value) : 0.5;
    masterGain.gain.setValueAtTime(vol, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    const buffer = createWhiteNoiseBuffer();
    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;

    if (preset === 'rain') {
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
      noiseNode.connect(filter);
      filter.connect(masterGain);
      noiseNode.start();
    } else if (preset === 'ocean') {
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, audioCtx.currentTime);

      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.1, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(0.3, audioCtx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(masterGain.gain);
      lfo.start();

      noiseNode.connect(filter);
      filter.connect(masterGain);
      noiseNode.start();
    } else if (preset === 'forest') {
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      noiseNode.connect(filter);
      filter.connect(masterGain);
      noiseNode.start();
    } else if (preset === 'binaural') {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      osc1.frequency.setValueAtTime(432, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(438, audioCtx.currentTime);
      
      const binauralGain = audioCtx.createGain();
      binauralGain.gain.setValueAtTime(0.3, audioCtx.currentTime);

      osc1.connect(binauralGain);
      osc2.connect(binauralGain);
      binauralGain.connect(masterGain);

      osc1.start();
      osc2.start();
      lofiOscs.push(osc1, osc2);
    } else if (preset === 'lofi') {
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, audioCtx.currentTime);

      noiseNode.connect(filter);
      filter.connect(masterGain);
      noiseNode.start();

      const o1 = audioCtx.createOscillator();
      const o2 = audioCtx.createOscillator();
      o1.type = 'sine';
      o2.type = 'triangle';
      o1.frequency.setValueAtTime(174.61, audioCtx.currentTime);
      o2.frequency.setValueAtTime(261.63, audioCtx.currentTime);

      const chordGain = audioCtx.createGain();
      chordGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

      o1.connect(chordGain);
      o2.connect(chordGain);
      chordGain.connect(masterGain);

      o1.start();
      o2.start();
      lofiOscs.push(o1, o2);
    } else if (preset === 'whitenoise') {
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, audioCtx.currentTime);
      noiseNode.connect(filter);
      filter.connect(masterGain);
      noiseNode.start();
    }

    isSoundPlaying = true;
    updateSoundUI(true);
  }

  function stopSoundscape() {
    if (noiseNode) {
      try { noiseNode.stop(); } catch (e) {}
      noiseNode = null;
    }
    if (lofiOscs.length > 0) {
      lofiOscs.forEach(o => { try { o.stop(); } catch (e) {} });
      lofiOscs = [];
    }
    isSoundPlaying = false;
    updateSoundUI(false);
  }

  function updateSoundUI(playing) {
    const playBtn = document.getElementById('toggleSoundBtn');
    const eqBars = document.getElementById('eqVisualizer');

    if (playBtn) playBtn.textContent = playing ? 'Pause Soundscape ⏸️' : 'Play Soundscape 🔊';
    if (eqBars) eqBars.className = playing ? 'equalizer-bars playing' : 'equalizer-bars';
  }

  /* Custom Multi-Track Mixer Logic */
  function startCustomMixer() {
    initAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    stopCustomMixer();

    const volRain = parseFloat(document.getElementById('volRainSlider').value);
    const volLofi = parseFloat(document.getElementById('volLofiSlider').value);
    const volFire = parseFloat(document.getElementById('volFireSlider').value);

    // Rain Track
    const rainBuf = createWhiteNoiseBuffer();
    mixerRainSource = audioCtx.createBufferSource();
    mixerRainSource.buffer = rainBuf;
    mixerRainSource.loop = true;

    const rainFilter = audioCtx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(900, audioCtx.currentTime);

    mixerRainGain = audioCtx.createGain();
    mixerRainGain.gain.setValueAtTime(volRain, audioCtx.currentTime);

    mixerRainSource.connect(rainFilter);
    rainFilter.connect(mixerRainGain);
    mixerRainGain.connect(audioCtx.destination);
    mixerRainSource.start();

    // Lo-Fi Track
    const o1 = audioCtx.createOscillator();
    const o2 = audioCtx.createOscillator();
    o1.type = 'sine';
    o2.type = 'triangle';
    o1.frequency.setValueAtTime(174.61, audioCtx.currentTime);
    o2.frequency.setValueAtTime(261.63, audioCtx.currentTime);

    mixerLofiGain = audioCtx.createGain();
    mixerLofiGain.gain.setValueAtTime(volLofi * 0.2, audioCtx.currentTime);

    o1.connect(mixerLofiGain);
    o2.connect(mixerLofiGain);
    mixerLofiGain.connect(audioCtx.destination);
    o1.start();
    o2.start();
    mixerLofiSources = [o1, o2];

    // Fireplace Track (Crackle Pop Noise)
    mixerFireGain = audioCtx.createGain();
    mixerFireGain.gain.setValueAtTime(volFire * 0.25, audioCtx.currentTime);

    const fireNoiseBuf = createWhiteNoiseBuffer();
    const fireNoiseSource = audioCtx.createBufferSource();
    fireNoiseSource.buffer = fireNoiseBuf;
    fireNoiseSource.loop = true;

    const fireFilter = audioCtx.createBiquadFilter();
    fireFilter.type = 'bandpass';
    fireFilter.frequency.setValueAtTime(1200, audioCtx.currentTime);

    fireNoiseSource.connect(fireFilter);
    fireFilter.connect(mixerFireGain);
    mixerFireGain.connect(audioCtx.destination);
    fireNoiseSource.start();

    isMixerPlaying = true;
    const playBtn = document.getElementById('toggleMixerPlayBtn');
    if (playBtn) playBtn.textContent = 'Pause Custom Mix ⏸️';
  }

  function stopCustomMixer() {
    if (mixerRainSource) { try { mixerRainSource.stop(); } catch (e) {} mixerRainSource = null; }
    if (mixerLofiSources.length > 0) { mixerLofiSources.forEach(s => { try { s.stop(); } catch (e) {} }); mixerLofiSources = []; }
    if (mixerFireInterval) { clearInterval(mixerFireInterval); mixerFireInterval = null; }
    isMixerPlaying = false;
    const playBtn = document.getElementById('toggleMixerPlayBtn');
    if (playBtn) playBtn.textContent = 'Play Custom Mix 🎚️';
  }

  const toggleMixerBtn = document.getElementById('toggleMixerPlayBtn');
  if (toggleMixerBtn) {
    toggleMixerBtn.addEventListener('click', () => {
      if (isMixerPlaying) stopCustomMixer();
      else startCustomMixer();
    });
  }

  const volRainSlider = document.getElementById('volRainSlider');
  const volLofiSlider = document.getElementById('volLofiSlider');
  const volFireSlider = document.getElementById('volFireSlider');

  if (volRainSlider) {
    volRainSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      document.getElementById('volRainVal').textContent = `${Math.round(val * 100)}%`;
      if (mixerRainGain && audioCtx) mixerRainGain.gain.setValueAtTime(val, audioCtx.currentTime);
    });
  }

  if (volLofiSlider) {
    volLofiSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      document.getElementById('volLofiVal').textContent = `${Math.round(val * 100)}%`;
      if (mixerLofiGain && audioCtx) mixerLofiGain.gain.setValueAtTime(val * 0.2, audioCtx.currentTime);
    });
  }

  if (volFireSlider) {
    volFireSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      document.getElementById('volFireVal').textContent = `${Math.round(val * 100)}%`;
      if (mixerFireGain && audioCtx) mixerFireGain.gain.setValueAtTime(val * 0.25, audioCtx.currentTime);
    });
  }

  const soundBtns = document.querySelectorAll('.sound-preset-btn');
  soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      soundBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSoundPreset = btn.dataset.sound;
      if (isSoundPlaying) {
        startSoundscape(activeSoundPreset);
      }
    });
  });

  const toggleSoundBtn = document.getElementById('toggleSoundBtn');
  if (toggleSoundBtn) {
    toggleSoundBtn.addEventListener('click', () => {
      if (isSoundPlaying) {
        stopSoundscape();
      } else {
        startSoundscape(activeSoundPreset);
        showToast(`Playing ${activeSoundPreset.toUpperCase()} soundscape 🎵`);
      }
    });
  }

  const volSlider = document.getElementById('soundVolumeSlider');
  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
      }
    });
  }

  /* ==========================================================================
     3. Focus Pomodoro Timer Engine (With Soundscape Auto-play Trigger)
     ========================================================================== */
  let pomoTimer = null;
  let pomoSecondsLeft = 1500;
  let pomoTotalSeconds = 1500;
  let isPomoRunning = false;
  let pomoMode = 'Focus';

  const pomoDisplay = document.getElementById('pomoTimeDisplay');
  const pomoModeDisplay = document.getElementById('pomoModeDisplay');
  const pomoRing = document.getElementById('pomoProgressRing');
  const startPomoBtn = document.getElementById('startPomoBtn');
  const resetPomoBtn = document.getElementById('resetPomoBtn');
  const sessionCountEl = document.getElementById('pomoSessionCount');

  function updatePomoDisplay() {
    const mins = Math.floor(pomoSecondsLeft / 60);
    const secs = pomoSecondsLeft % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (pomoDisplay) pomoDisplay.textContent = formatted;

    const pct = Math.round((pomoSecondsLeft / pomoTotalSeconds) * 100);
    if (pomoRing) pomoRing.setAttribute('stroke-dasharray', `${pct}, 100`);
  }

  function startPomo() {
    if (isPomoRunning) {
      clearInterval(pomoTimer);
      isPomoRunning = false;
      if (startPomoBtn) startPomoBtn.textContent = 'Start Focus ▶';
      return;
    }

    isPomoRunning = true;
    if (startPomoBtn) startPomoBtn.textContent = 'Pause ⏸️';

    const autoPlayToggle = document.getElementById('autoPlaySoundToggle');
    if (autoPlayToggle && autoPlayToggle.checked && !isSoundPlaying && !isMixerPlaying) {
      startSoundscape(activeSoundPreset);
      showToast(`Auto-started ${activeSoundPreset.toUpperCase()} soundscape 🎵`);
    }

    pomoTimer = setInterval(() => {
      pomoSecondsLeft--;
      updatePomoDisplay();

      if (pomoSecondsLeft <= 0) {
        clearInterval(pomoTimer);
        isPomoRunning = false;
        if (startPomoBtn) startPomoBtn.textContent = 'Start Focus ▶';

        if (pomoMode === 'Focus') {
          appState.pomoSessions++;
          saveState();
          if (sessionCountEl) sessionCountEl.textContent = `Session: #${appState.pomoSessions} Completed`;
          addXP(50, 'Completed Pomodoro Focus Session');
        } else {
          showToast('Break finished! Ready to focus again? 💪');
        }
      }
    }, 1000);
  }

  function resetPomo() {
    clearInterval(pomoTimer);
    isPomoRunning = false;
    pomoSecondsLeft = pomoTotalSeconds;
    updatePomoDisplay();
    if (startPomoBtn) startPomoBtn.textContent = 'Start Focus ▶';
  }

  const pomoTabs = document.querySelectorAll('.pomo-tab');
  pomoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pomoTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      pomoTotalSeconds = parseInt(tab.dataset.time);
      pomoSecondsLeft = pomoTotalSeconds;
      pomoMode = tab.dataset.mode;

      if (pomoModeDisplay) pomoModeDisplay.textContent = pomoMode;
      resetPomo();
    });
  });

  if (startPomoBtn) startPomoBtn.addEventListener('click', startPomo);
  if (resetPomoBtn) resetPomoBtn.addEventListener('click', resetPomo);

  /* ==========================================================================
     4. Guided 4-7-8 Breathing Tool with Audio Chimes
     ========================================================================== */
  let breathingTimer = null;
  let isBreathingRunning = false;
  let breathPhase = 'Inhale';
  let breathCountdown = 4;

  const startBreathingBtn = document.getElementById('startBreathingBtn');
  const resetBreathingBtn = document.getElementById('resetBreathingBtn');
  const breathingCircle = document.getElementById('breathingCircle');
  const breathingStateText = document.getElementById('breathingStateText');
  const breathingTimerText = document.getElementById('breathingTimerText');
  const breathingSubtext = document.getElementById('breathingSubtext');

  function startBreathingSession() {
    if (isBreathingRunning) {
      clearInterval(breathingTimer);
      isBreathingRunning = false;
      if (startBreathingBtn) startBreathingBtn.textContent = 'Start Session';
      if (breathingCircle) breathingCircle.className = 'breathing-circle-inner';
      return;
    }

    isBreathingRunning = true;
    if (startBreathingBtn) startBreathingBtn.textContent = 'Pause ⏸️';

    breathPhase = 'Inhale';
    breathCountdown = 4;
    updateBreathingUI();
    playBreathingChime(528);

    breathingTimer = setInterval(() => {
      breathCountdown--;

      if (breathCountdown <= 0) {
        if (breathPhase === 'Inhale') {
          breathPhase = 'Hold';
          breathCountdown = 7;
          playBreathingChime(432);
        } else if (breathPhase === 'Hold') {
          breathPhase = 'Exhale';
          breathCountdown = 8;
          playBreathingChime(396);
        } else if (breathPhase === 'Exhale') {
          breathPhase = 'Inhale';
          breathCountdown = 4;
          playBreathingChime(528);
        }
      }

      updateBreathingUI();
    }, 1000);
  }

  function updateBreathingUI() {
    if (breathingStateText) breathingStateText.textContent = breathPhase;
    if (breathingTimerText) breathingTimerText.textContent = `${breathCountdown}s`;

    if (breathingCircle) {
      if (breathPhase === 'Inhale') breathingCircle.className = 'breathing-circle-inner pulsing-inhale';
      else if (breathPhase === 'Hold') breathingCircle.className = 'breathing-circle-inner pulsing-hold';
      else breathingCircle.className = 'breathing-circle-inner pulsing-exhale';
    }

    if (breathingSubtext) {
      if (breathPhase === 'Inhale') breathingSubtext.textContent = 'Breathe in slowly through your nose... 🫁';
      else if (breathPhase === 'Hold') breathingSubtext.textContent = 'Hold your breath gently... 🧘';
      else breathingSubtext.textContent = 'Exhale slowly through your mouth... 🌬️';
    }
  }

  function resetBreathingSession() {
    clearInterval(breathingTimer);
    isBreathingRunning = false;
    breathPhase = 'Inhale';
    breathCountdown = 4;
    if (startBreathingBtn) startBreathingBtn.textContent = 'Start Session';
    if (breathingStateText) breathingStateText.textContent = 'Inhale';
    if (breathingTimerText) breathingTimerText.textContent = '4s';
    if (breathingSubtext) breathingSubtext.textContent = 'Press Start for a 2-minute relaxation break (+40 XP).';
    if (breathingCircle) breathingCircle.className = 'breathing-circle-inner';
  }

  if (startBreathingBtn) startBreathingBtn.addEventListener('click', startBreathingSession);
  if (resetBreathingBtn) resetBreathingBtn.addEventListener('click', resetBreathingSession);

  /* ==========================================================================
     5. Smart AI Wellness Assistant ("Aura Bot")
     ========================================================================== */
  const toggleBotBtn = document.getElementById('toggleAuraBotBtn');
  const closeBotBtn = document.getElementById('closeAuraBotBtn');
  const botWindow = document.getElementById('auraBotWindow');
  const botMessages = document.getElementById('auraBotMessages');
  const botInput = document.getElementById('auraBotInput');
  const sendBotBtn = document.getElementById('sendAuraBotBtn');

  if (toggleBotBtn && botWindow) {
    toggleBotBtn.addEventListener('click', () => {
      botWindow.classList.toggle('active');
    });
  }

  if (closeBotBtn && botWindow) {
    closeBotBtn.addEventListener('click', () => {
      botWindow.classList.remove('active');
    });
  }

  function appendBotMsg(text, isUser = false, actionBtnHTML = '') {
    if (!botMessages) return;
    const msg = document.createElement('div');
    msg.className = `bot-msg ${isUser ? 'msg-user' : 'msg-ai'}`;
    msg.innerHTML = `<span>${escapeHTML(text)}</span>${actionBtnHTML}`;
    botMessages.appendChild(msg);
    botMessages.scrollTop = botMessages.scrollHeight;
  }

  function handleBotQuery(queryText) {
    if (!queryText.trim()) return;
    appendBotMsg(queryText, true);

    const text = queryText.toLowerCase();
    setTimeout(() => {
      if (text.includes('මහන්සියි') || text.includes('stress') || text.includes('tired') || text.includes('anxious')) {
        const actionHTML = `<br><button class="bot-msg-action-btn" id="botStartBreathing">Start 2-min Breathing 🧘</button>`;
        appendBotMsg("මම තේරුම් ගන්නවා ඔයාට මහන්සියි/Stressed කියලා 🧘! අපි තත්පර ගණන් කරලා Breathing Exercise එකක් කරමුද? මම Relaxation Soundscape එකකුත් Play කරන්නම්.", false, actionHTML);
        setTimeout(() => {
          const btn = document.getElementById('botStartBreathing');
          if (btn) {
            btn.addEventListener('click', () => {
              switchView('mindfulness');
              startBreathingSession();
              startSoundscape('rain');
            });
          }
        }, 100);
      } else if (text.includes('water') || text.includes('වතුර') || text.includes('hydration')) {
        const waterPct = Math.min(100, Math.round((appState.waterLogged / appState.waterGoal) * 100));
        if (waterPct < 70) {
          appendBotMsg(`💧 ඔයා අද වතුර බීලා මදි (${appState.waterLogged}ml / ${appState.waterGoal}ml — ${waterPct}%)! තව වතුර වීදුරුවක් (+250ml) බොන්න, ඔයාගේ Energy එක වැඩි වේවි! ✨`, false);
        } else {
          appendBotMsg(`🎉 නියමයි Alex! ඔයාගේ Hydration Target එක ${waterPct}% කම්ප්ලීට්! දිගටම මෙහෙම යමු 🥛!`, false);
        }
      } else if (text.includes('focus') || text.includes('work') || text.includes('study')) {
        appendBotMsg("⏱️ Deep Work එකට ready ද? මම 25-min Focus Pomodoro Timer එකත් එක්ක Lo-Fi Chill Beats Soundscape එක Play කරන්නම්! 💪", false);
      } else {
        appendBotMsg("🤖 මම ඔයාගේ Aura Wellness Assistant! ඔයාගේ daily habits, hydration, focus soundscapes හෝ sleep ගැන ඕනෑම දෙයක් මගෙන් අහන්න ✨.", false);
      }
    }, 400);
  }

  if (sendBotBtn && botInput) {
    sendBotBtn.addEventListener('click', () => {
      const q = botInput.value;
      botInput.value = '';
      handleBotQuery(q);
    });

    botInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = botInput.value;
        botInput.value = '';
        handleBotQuery(q);
      }
    });
  }

  document.querySelectorAll('.aura-bot-chips .chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleBotQuery(btn.dataset.query);
    });
  });

  /* ==========================================================================
     6. Monthly Aura Wrap Insta-Story Carousel
     ========================================================================== */
  let currentStorySlide = 0;
  const totalStorySlides = 4;
  const monthlyWrapModal = document.getElementById('monthlyWrapModal');
  const openWrapBtn = document.getElementById('openMonthlyWrapBtn');
  const closeWrapBtn = document.getElementById('closeMonthlyWrapBtn');
  const prevStoryBtn = document.getElementById('prevStoryBtn');
  const nextStoryBtn = document.getElementById('nextStoryBtn');

  function showStorySlide(idx) {
    currentStorySlide = (idx + totalStorySlides) % totalStorySlides;
    document.querySelectorAll('.story-slide').forEach((slide, i) => {
      slide.classList.toggle('active', i === currentStorySlide);
    });
    document.querySelectorAll('.story-step-bar').forEach((bar, i) => {
      bar.classList.toggle('active', i <= currentStorySlide);
    });
  }

  if (openWrapBtn && monthlyWrapModal) {
    openWrapBtn.addEventListener('click', () => {
      showStorySlide(0);
      monthlyWrapModal.classList.add('active');
    });
  }

  if (closeWrapBtn && monthlyWrapModal) {
    closeWrapBtn.addEventListener('click', () => {
      monthlyWrapModal.classList.remove('active');
    });
  }

  if (prevStoryBtn) prevStoryBtn.addEventListener('click', () => showStorySlide(currentStorySlide - 1));
  if (nextStoryBtn) nextStoryBtn.addEventListener('click', () => showStorySlide(currentStorySlide + 1));

  const shareWrapBtn = document.getElementById('shareWrapBtn');
  if (shareWrapBtn) {
    shareWrapBtn.addEventListener('click', () => {
      showToast('🚀 Monthly Aura Wrap report copied to clipboard!');
      launchConfetti();
    });
  }

  /* ==========================================================================
     7. 7-Day Mood Trend History Canvas Chart
     ========================================================================== */
  function renderMoodTrendChart() {
    const canvas = document.getElementById('moodTrendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    const historyData = appState.moodHistory.slice(-7);
    if (historyData.length === 0) return;

    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#ffffff15';
    ctx.lineWidth = 1;
    ctx.font = '500 10px sans-serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#94a3b8';

    const levels = [
      { lbl: '100', yVal: 100 },
      { lbl: '75', yVal: 75 },
      { lbl: '50', yVal: 50 },
      { lbl: '25', yVal: 25 }
    ];

    levels.forEach(lvl => {
      const y = paddingTop + chartH - (lvl.yVal / 100) * chartH;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();
      ctx.fillText(lvl.lbl, 10, y + 4);
    });

    const stepX = chartW / (historyData.length - 1 || 1);
    const points = historyData.map((item, idx) => {
      const x = paddingLeft + idx * stepX;
      const val = item.val || 80;
      const y = paddingTop + chartH - (val / 100) * chartH;
      return { x, y, item };
    });

    const areaGrad = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
    areaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    areaGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - paddingBottom);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height - paddingBottom);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#94a3b8';
      ctx.font = '600 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.item.date, p.x, height - 8);
    });
  }

  /* Mood Check-in Component */
  function renderMoodHistoryPills() {
    const container = document.getElementById('moodHistoryPills');
    if (!container) return;
    container.innerHTML = '';

    appState.moodHistory.slice(-5).reverse().forEach(log => {
      const pill = document.createElement('span');
      pill.className = 'mood-pill';
      pill.innerHTML = `${log.emoji} ${log.date}: <strong>${log.mood}</strong>`;
      container.appendChild(pill);
    });
  }

  const moodBtns = document.querySelectorAll('.mood-btn');
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mood = btn.dataset.mood;
      const emoji = btn.dataset.emoji;
      const moodMap = { 'Radiant': 100, 'Calm': 80, 'Neutral': 60, 'Anxious': 40, 'Tired': 40, 'Stressed': 20 };

      appState.currentMood = mood;
      appState.currentEmoji = emoji;

      const tag = document.getElementById('currentMoodTag');
      if (tag) tag.textContent = `Mood: ${mood}`;

      appState.moodHistory.push({
        date: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
        mood,
        emoji,
        val: moodMap[mood] || 80
      });

      saveState();
      addXP(30, 'Logged Daily Mood Check-in');
      renderMoodHistoryPills();
      updateAuraScoreUI();
      renderMoodTrendChart();
    });
  });

  /* Floating Quick Add Action Menu (FAB) */
  const fabBtn = document.getElementById('floatingQuickAddBtn');
  const fabMenu = document.getElementById('fabMenu');

  if (fabBtn && fabMenu) {
    fabBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fabBtn.classList.toggle('active');
      fabMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!fabMenu.contains(e.target) && e.target !== fabBtn) {
        fabBtn.classList.remove('active');
        fabMenu.classList.remove('active');
      }
    });
  }

  const fabAddWater = document.getElementById('fabAddWater');
  if (fabAddWater) {
    fabAddWater.addEventListener('click', () => {
      appState.waterLogged += 250;
      addXP(20, 'Quick Hydration Logged');
      updateHydrationUI();
      updateAuraScoreUI();
      if (fabMenu) fabMenu.classList.remove('active');
      if (fabBtn) fabBtn.classList.remove('active');
    });
  }

  const fabAddSteps = document.getElementById('fabAddSteps');
  if (fabAddSteps) {
    fabAddSteps.addEventListener('click', () => {
      appState.steps += 1000;
      appState.calories += 45;
      addXP(50, 'Quick 1,000 Steps Logged');
      updateMetricsUI();
      updateAuraScoreUI();
      renderActivityChart();
      if (fabMenu) fabMenu.classList.remove('active');
      if (fabBtn) fabBtn.classList.remove('active');
    });
  }

  const fabLogMood = document.getElementById('fabLogMood');
  if (fabLogMood) {
    fabLogMood.addEventListener('click', () => {
      switchView('mindfulness');
      if (fabMenu) fabMenu.classList.remove('active');
      if (fabBtn) fabBtn.classList.remove('active');
    });
  }

  const fabLogMeal = document.getElementById('fabLogMeal');
  if (fabLogMeal) {
    fabLogMeal.addEventListener('click', () => {
      switchView('nutrition');
      openMealM();
      if (fabMenu) fabMenu.classList.remove('active');
      if (fabBtn) fabBtn.classList.remove('active');
    });
  }

  /* Nutrition & Daily Macro Tracker Hub */
  function renderNutritionUI() {
    let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
    appState.meals.forEach(m => {
      totalCal += m.calories;
      totalP += m.protein;
      totalC += m.carbs;
      totalF += m.fats;
    });

    const calVal = document.getElementById('macroCalVal');
    const calFill = document.getElementById('macroCalFill');
    if (calVal) calVal.textContent = `${totalCal.toLocaleString()} / 2,200 kcal`;
    if (calFill) calFill.style.width = `${Math.min(100, (totalCal / 2200) * 100)}%`;

    const pVal = document.getElementById('macroProteinVal');
    const pFill = document.getElementById('macroProteinFill');
    if (pVal) pVal.textContent = `${totalP}g / 140g`;
    if (pFill) pFill.style.width = `${Math.min(100, (totalP / 140) * 100)}%`;

    const cVal = document.getElementById('macroCarbsVal');
    const cFill = document.getElementById('macroCarbsFill');
    if (cVal) cVal.textContent = `${totalC}g / 240g`;
    if (cFill) cFill.style.width = `${Math.min(100, (totalC / 240) * 100)}%`;

    const fVal = document.getElementById('macroFatsVal');
    const fFill = document.getElementById('macroFatsFill');
    if (fVal) fVal.textContent = `${totalF}g / 65g`;
    if (fFill) fFill.style.width = `${Math.min(100, (totalF / 65) * 100)}%`;

    const tbody = document.getElementById('mealsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    appState.meals.forEach(meal => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHTML(meal.name)}</strong></td>
        <td><span class="habit-cat-tag cat-Nutrition">${meal.category}</span></td>
        <td>${meal.calories} kcal</td>
        <td>${meal.protein}g</td>
        <td>${meal.carbs}g</td>
        <td>${meal.fats}g</td>
        <td class="text-right">
          <button class="btn-del-meal" data-id="${meal.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  const addMealModal = document.getElementById('addMealModal');
  const openMealBtn = document.getElementById('openAddMealBtn');
  const closeMealBtn = document.getElementById('closeMealModal');
  const cancelMealBtn = document.getElementById('cancelMealModal');
  const addMealForm = document.getElementById('addMealForm');

  function openMealM() { if (addMealModal) addMealModal.classList.add('active'); }
  function closeMealM() { if (addMealModal) addMealModal.classList.remove('active'); }

  if (openMealBtn) openMealBtn.addEventListener('click', openMealM);
  if (closeMealBtn) closeMealBtn.addEventListener('click', closeMealM);
  if (cancelMealBtn) cancelMealBtn.addEventListener('click', closeMealM);

  if (addMealForm) {
    addMealForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('mealNameInput').value.trim();
      const category = document.getElementById('mealCategorySelect').value;
      const calories = parseInt(document.getElementById('mealCaloriesInput').value) || 0;
      const protein = parseInt(document.getElementById('mealProteinInput').value) || 0;
      const carbs = parseInt(document.getElementById('mealCarbsInput').value) || 0;
      const fats = parseInt(document.getElementById('mealFatsInput').value) || 0;

      if (!name) return;

      const newMeal = { id: Date.now(), name, category, calories, protein, carbs, fats };
      appState.meals.push(newMeal);

      saveState();
      renderNutritionUI();
      closeMealM();
      addMealForm.reset();
      addXP(30, 'Logged Meal & Nutrition');
    });
  }

  const mealsTbody = document.getElementById('mealsTableBody');
  if (mealsTbody) {
    mealsTbody.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-del-meal')) {
        const id = parseInt(e.target.dataset.id);
        appState.meals = appState.meals.filter(m => m.id !== id);
        saveState();
        renderNutritionUI();
        showToast('Deleted meal log');
      }
    });
  }

  /* Monthly Consistency Heatmap Generator */
  function renderHeatmap() {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;

    grid.innerHTML = '';
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const intensity = (i === 0 || i === 1 || i === 2 || i === 4 || i === 7 || i === 12) ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 4);

      const square = document.createElement('div');
      square.className = `heatmap-square lvl-${intensity}`;
      square.title = `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${intensity * 25}% Habits Complete`;

      grid.appendChild(square);
    }
  }

  /* Data Export Engine (PDF & Screenshot) */
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const exportScreenshotBtn = document.getElementById('exportScreenshotBtn');

  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => {
      showToast('📄 Opening PDF Report Print Dialog...');
      setTimeout(() => {
        window.print();
      }, 300);
    });
  }

  if (exportScreenshotBtn) {
    exportScreenshotBtn.addEventListener('click', () => {
      showToast('📸 Capturing Dashboard Screenshot...');
      const targetElement = document.querySelector('.main-wrapper') || document.body;

      if (window.html2canvas) {
        html2canvas(targetElement, {
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary') || '#080c14',
          scale: 2,
          useCORS: true
        }).then(canvas => {
          const image = canvas.toDataURL("image/png");
          const link = document.createElement('a');
          link.href = image;
          link.download = `auralife_screenshot_${new Date().toISOString().split('T')[0]}.png`;
          link.click();
          showToast('✨ Screenshot saved as PNG image!');
        }).catch(err => {
          console.error('Screenshot capture error:', err);
          showToast('⚠️ Screenshot error. Try again!');
        });
      } else {
        showToast('⚠️ Screenshot tool initializing... Please try again!');
      }
    });
  }

  /* Core Dashboard Event Listeners & UI Components */
  function initHeader() {
    const greetingEl = document.getElementById('greetingText');
    const dateEl = document.getElementById('currentDateBadge');
    const themeBtn = document.getElementById('themeToggleBtn');

    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', options);

    const hour = now.getHours();
    let greeting = 'Good Morning, Alex 🌅';
    if (hour >= 12 && hour < 17) greeting = 'Good Afternoon, Alex ☀️';
    else if (hour >= 17) greeting = 'Good Evening, Alex 🌙';

    if (greetingEl) greetingEl.textContent = greeting;
    document.documentElement.setAttribute('data-theme', appState.theme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', appState.theme);
        saveState();
        showToast(`Switched to ${appState.theme.toUpperCase()} glass theme ✨`);
      });
    }
  }

  function updateMetricsUI() {
    // Steps
    const stepsVal = document.getElementById('stepsVal');
    const stepsGoalVal = document.getElementById('stepsGoalVal');
    const stepsRing = document.getElementById('stepsRing');
    const stepsPercent = document.getElementById('stepsPercent');

    const stepGoal = appState.stepGoal || 10000;
    if (stepsVal) stepsVal.textContent = (appState.steps || 0).toLocaleString();
    if (stepsGoalVal) stepsGoalVal.textContent = stepGoal.toLocaleString();
    const pct = Math.min(100, Math.round(((appState.steps || 0) / stepGoal) * 100));
    if (stepsRing) stepsRing.setAttribute('stroke-dasharray', `${pct}, 100`);
    if (stepsPercent) stepsPercent.textContent = `${pct}%`;

    // Calories
    const caloriesVal = document.getElementById('caloriesVal');
    const caloriesGoalVal = document.getElementById('caloriesGoalVal');
    const caloriesProgress = document.getElementById('caloriesProgress');

    const calGoal = appState.caloriesGoal || 800;
    if (caloriesVal) caloriesVal.textContent = appState.calories || 0;
    if (caloriesGoalVal) caloriesGoalVal.textContent = calGoal;
    if (caloriesProgress) {
      const calPct = Math.min(100, Math.round(((appState.calories || 0) / calGoal) * 100));
      caloriesProgress.style.width = `${calPct}%`;
    }

    // Sleep
    const sleepHoursVal = document.getElementById('sleepHoursVal');
    const sleepScoreVal = document.getElementById('sleepScoreVal');
    if (sleepHoursVal) sleepHoursVal.textContent = appState.sleepHours || 7.8;
    if (sleepScoreVal) sleepScoreVal.textContent = appState.sleepScore || 88;

    // Active Mins
    const activeMinsVal = document.getElementById('activeMinsVal');
    const activeMinsGoalVal = document.getElementById('activeMinsGoalVal');
    if (activeMinsVal) activeMinsVal.textContent = appState.activeMins || 0;
    if (activeMinsGoalVal) activeMinsGoalVal.textContent = appState.activeMinsGoal || 60;

    updateAuraScoreUI();
  }

  /* Metric Edit & Reset Event Handlers */
  const editMetricModal = document.getElementById('editMetricModal');
  const editMetricType = document.getElementById('editMetricType');
  const editMetricModalTitle = document.getElementById('editMetricModalTitle');
  const editMetricValLabel = document.getElementById('editMetricValLabel');
  const editMetricValInput = document.getElementById('editMetricValInput');
  const editMetricGoalGroup = document.getElementById('editMetricGoalGroup');
  const editMetricGoalLabel = document.getElementById('editMetricGoalLabel');
  const editMetricGoalInput = document.getElementById('editMetricGoalInput');
  const editMetricForm = document.getElementById('editMetricForm');
  const closeEditMetricModalBtn = document.getElementById('closeEditMetricModal');
  const cancelEditMetricModalBtn = document.getElementById('cancelEditMetricModal');

  function openEditMetricModal(type) {
    if (!editMetricModal) return;
    editMetricType.value = type;

    if (type === 'steps') {
      editMetricModalTitle.textContent = '✏️ Edit Steps Metric';
      editMetricValLabel.textContent = 'Current Steps';
      editMetricValInput.value = appState.steps || 0;
      editMetricGoalGroup.style.display = 'block';
      editMetricGoalLabel.textContent = 'Target Step Goal';
      editMetricGoalInput.value = appState.stepGoal || 10000;
    } else if (type === 'calories') {
      editMetricModalTitle.textContent = '✏️ Edit Calories Metric';
      editMetricValLabel.textContent = 'Calories Burned (kcal)';
      editMetricValInput.value = appState.calories || 0;
      editMetricGoalGroup.style.display = 'block';
      editMetricGoalLabel.textContent = 'Target Calorie Goal (kcal)';
      editMetricGoalInput.value = appState.caloriesGoal || 800;
    } else if (type === 'sleep') {
      editMetricModalTitle.textContent = '✏️ Edit Sleep Metric';
      editMetricValLabel.textContent = 'Sleep Duration (hours)';
      editMetricValInput.value = appState.sleepHours || 7.8;
      editMetricGoalGroup.style.display = 'block';
      editMetricGoalLabel.textContent = 'Sleep Score (0-100)';
      editMetricGoalInput.value = appState.sleepScore || 88;
    } else if (type === 'activeMins') {
      editMetricModalTitle.textContent = '✏️ Edit Active Minutes';
      editMetricValLabel.textContent = 'Active Minutes';
      editMetricValInput.value = appState.activeMins || 0;
      editMetricGoalGroup.style.display = 'block';
      editMetricGoalLabel.textContent = 'Target Active Goal (mins)';
      editMetricGoalInput.value = appState.activeMinsGoal || 60;
    }

    editMetricModal.classList.add('active');
  }

  function closeEditMetricModal() {
    if (editMetricModal) editMetricModal.classList.remove('active');
  }

  document.querySelectorAll('.edit-metric-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.metric;
      openEditMetricModal(type);
    });
  });

  document.querySelectorAll('.reset-metric-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.metric;
      if (type === 'steps') appState.steps = 0;
      else if (type === 'calories') appState.calories = 0;
      else if (type === 'sleep') { appState.sleepHours = 0; appState.sleepScore = 0; }
      else if (type === 'activeMins') appState.activeMins = 0;

      saveState();
      updateMetricsUI();
      renderActivityChart();
      showToast(`Reset ${type} metric to 0 🗑️`);
    });
  });

  if (closeEditMetricModalBtn) closeEditMetricModalBtn.addEventListener('click', closeEditMetricModal);
  if (cancelEditMetricModalBtn) cancelEditMetricModalBtn.addEventListener('click', closeEditMetricModal);

  if (editMetricForm) {
    editMetricForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = editMetricType.value;
      const val = parseFloat(editMetricValInput.value) || 0;
      const goal = parseFloat(editMetricGoalInput.value) || 0;

      if (type === 'steps') {
        appState.steps = Math.max(0, Math.round(val));
        if (goal > 0) appState.stepGoal = Math.round(goal);
      } else if (type === 'calories') {
        appState.calories = Math.max(0, Math.round(val));
        if (goal > 0) appState.caloriesGoal = Math.round(goal);
      } else if (type === 'sleep') {
        appState.sleepHours = Math.max(0, val);
        if (goal >= 0) appState.sleepScore = Math.min(100, Math.round(goal));
      } else if (type === 'activeMins') {
        appState.activeMins = Math.max(0, Math.round(val));
        if (goal > 0) appState.activeMinsGoal = Math.round(goal);
      }

      saveState();
      updateMetricsUI();
      renderActivityChart();
      closeEditMetricModal();
      showToast('Updated metric values successfully ✨');
    });
  }

  const addStepsBtn = document.getElementById('addStepsBtn');
  if (addStepsBtn) {
    addStepsBtn.addEventListener('click', () => {
      appState.steps += 500;
      appState.calories += 25;
      addXP(50, 'Walking & Steps Goal');
      updateMetricsUI();
      renderActivityChart();
    });
  }

  const logWorkoutBtn = document.getElementById('logWorkoutBtn');
  if (logWorkoutBtn) {
    logWorkoutBtn.addEventListener('click', () => {
      appState.activeMins += 15;
      appState.calories += 90;
      addXP(60, 'Active Fitness Workout');
      updateMetricsUI();
      renderActivityChart();
    });
  }

  function renderHabitsTable() {
    const tbody = document.getElementById('habitTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const filtered = appState.activeCategory === 'all'
      ? appState.habits
      : appState.habits.filter(h => h.category === appState.activeCategory);

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; color: var(--text-muted); padding:20px;">No habits in this category yet. Click "New Habit" to create one!</td></tr>`;
      return;
    }

    filtered.forEach(habit => {
      const tr = document.createElement('tr');
      let daysHTML = '';
      habit.days.forEach((done, index) => {
        daysHTML += `
          <td class="day-col">
            <div class="day-chk ${done ? 'done' : ''}" data-habit-id="${habit.id}" data-day-index="${index}">
              ${done ? '✓' : ''}
            </div>
          </td>
        `;
      });

      tr.innerHTML = `
        <td><span class="habit-item-name">${escapeHTML(habit.name)}</span></td>
        <td><span class="habit-cat-tag cat-${habit.category}">${habit.category}</span></td>
        ${daysHTML}
        <td class="text-right">
          <div style="display:inline-flex; align-items:center; gap:6px;">
            <span class="streak-badge">🔥 ${habit.streak}d</span>
            <button class="btn-icon-sm edit-habit-btn" data-id="${habit.id}" title="Edit Habit Details">✏️</button>
            <button class="btn-icon-sm delete-habit-btn" data-id="${habit.id}" title="Delete Habit">🗑️</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    updateWeeklyCompletionScore();
    updateAuraScoreUI();
  }

  function updateWeeklyCompletionScore() {
    const totalSlots = appState.habits.length * 7;
    let completedSlots = 0;
    let maxStreak = 0;

    appState.habits.forEach(h => {
      if (h.streak > maxStreak) maxStreak = h.streak;
      h.days.forEach(d => { if (d) completedSlots++; });
    });

    const score = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;
    const scoreEl = document.getElementById('weeklyHabitScore');
    if (scoreEl) scoreEl.textContent = `${score}%`;

    // Auto update Sidebar Active Streak
    if (maxStreak > 0) appState.totalStreak = maxStreak;
    const streakEl = document.getElementById('totalStreakVal');
    if (streakEl) streakEl.textContent = `${appState.totalStreak || 14} Days`;
  }

  const habitTbody = document.getElementById('habitTableBody');
  if (habitTbody) {
    habitTbody.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.edit-habit-btn');
      const delBtn = e.target.closest('.delete-habit-btn');
      const chk = e.target.closest('.day-chk');

      if (editBtn) {
        const id = parseInt(editBtn.dataset.id);
        const habit = appState.habits.find(h => h.id === id);
        if (habit) openEditHabitModal(habit);
        return;
      }

      if (delBtn) {
        const id = parseInt(delBtn.dataset.id);
        appState.habits = appState.habits.filter(h => h.id !== id);
        saveState();
        renderHabitsTable();
        showToast('Habit deleted 🗑️');
        return;
      }

      if (chk) {
        const habitId = parseInt(chk.dataset.habitId);
        const dayIdx = parseInt(chk.dataset.dayIndex);

        const habit = appState.habits.find(h => h.id === habitId);
        if (habit) {
          habit.days[dayIdx] = !habit.days[dayIdx];
          const doneCount = habit.days.filter(Boolean).length;
          habit.streak = doneCount * 2 + 1;

          if (habit.days[dayIdx]) {
            addXP(50, 'Completed Habit');
          }

          saveState();
          renderHabitsTable();
        }
      }
    });
  }

  const categoryTabs = document.getElementById('habitCategoryTabs');
  if (categoryTabs) {
    categoryTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;

      categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      appState.activeCategory = btn.dataset.cat;
      renderHabitsTable();
    });
  }

  // Edit Habit Modal
  const editHabitModal = document.getElementById('editHabitModal');
  const editHabitId = document.getElementById('editHabitId');
  const editHabitTitleInput = document.getElementById('editHabitTitleInput');
  const editHabitCategorySelect = document.getElementById('editHabitCategorySelect');
  const editHabitForm = document.getElementById('editHabitForm');
  const closeEditHabitModalBtn = document.getElementById('closeEditHabitModal');
  const cancelEditHabitModalBtn = document.getElementById('cancelEditHabitModal');

  function openEditHabitModal(habit) {
    if (!editHabitModal) return;
    editHabitId.value = habit.id;
    editHabitTitleInput.value = habit.name;
    editHabitCategorySelect.value = habit.category;
    editHabitModal.classList.add('active');
  }

  function closeEditHabitModal() {
    if (editHabitModal) editHabitModal.classList.remove('active');
  }

  if (closeEditHabitModalBtn) closeEditHabitModalBtn.addEventListener('click', closeEditHabitModal);
  if (cancelEditHabitModalBtn) cancelEditHabitModalBtn.addEventListener('click', closeEditHabitModal);

  if (editHabitForm) {
    editHabitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = parseInt(editHabitId.value);
      const habit = appState.habits.find(h => h.id === id);
      if (habit) {
        habit.name = editHabitTitleInput.value.trim() || habit.name;
        habit.category = editHabitCategorySelect.value;
        saveState();
        renderHabitsTable();
        closeEditHabitModal();
        showToast('Habit details updated ✨');
      }
    });
  }

  // Add Habit Modal
  const addHabitModal = document.getElementById('addHabitModal');
  const openHabitBtn = document.getElementById('openAddHabitBtn');
  const closeHabitBtn = document.getElementById('closeHabitModal');
  const cancelHabitBtn = document.getElementById('cancelHabitModal');
  const addHabitForm = document.getElementById('addHabitForm');

  function openModal() { if (addHabitModal) addHabitModal.classList.add('active'); }
  function closeModal() { if (addHabitModal) closeModalHabit(); }
  function closeModalHabit() { if (addHabitModal) addHabitModal.classList.remove('active'); }

  if (openHabitBtn) openHabitBtn.addEventListener('click', openModal);
  if (closeHabitBtn) closeHabitBtn.addEventListener('click', closeModalHabit);
  if (cancelHabitBtn) cancelHabitBtn.addEventListener('click', closeModalHabit);

  const headerQuickCheckinBtn = document.getElementById('headerQuickCheckinBtn');
  if (headerQuickCheckinBtn) {
    headerQuickCheckinBtn.addEventListener('click', () => {
      const fabMenu = document.getElementById('fabMenu');
      if (fabMenu) fabMenu.classList.toggle('active');
      showToast('⚡ Quick Check-in Menu Opened!');
    });
  }

  if (addHabitForm) {
    addHabitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('habitTitleInput');
      const catSelect = document.getElementById('habitCategorySelect');

      if (!titleInput.value.trim()) return;

      const newHabit = {
        id: Date.now(),
        name: titleInput.value.trim(),
        category: catSelect.value,
        days: [false, false, false, false, false, false, false],
        streak: 0
      };

      appState.habits.push(newHabit);
      saveState();
      renderHabitsTable();
      closeModal();
      titleInput.value = '';
      addXP(40, 'Created New Habit');
    });
  }

  // Canvas Activity Chart
  let showSteps = true;
  let showCalories = true;

  const legendStepsBtn = document.getElementById('legendStepsBtn');
  const legendCaloriesBtn = document.getElementById('legendCaloriesBtn');

  if (legendStepsBtn) {
    legendStepsBtn.addEventListener('click', () => {
      showSteps = !showSteps;
      legendStepsBtn.classList.toggle('disabled', !showSteps);
      renderActivityChart();
    });
  }

  if (legendCaloriesBtn) {
    legendCaloriesBtn.addEventListener('click', () => {
      showCalories = !showCalories;
      legendCaloriesBtn.classList.toggle('disabled', !showCalories);
      renderActivityChart();
    });
  }

  function renderActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const stepsData = [7200, appState.steps, 9100, 6800, 8900, 11200, 6780];
    const caloriesData = [480, appState.calories, 620, 410, 590, 780, 450];

    const maxSteps = 12000;
    const maxCalories = 1000;

    const paddingLeft = 48;
    const paddingBottom = 28;
    const paddingTop = 20;
    const graphWidth = width - paddingLeft;
    const graphHeight = height - paddingBottom - paddingTop;
    const colWidth = graphWidth / days.length;
    const barWidth = showSteps && showCalories ? 16 : 28;

    // Y-Axis Scale Grid Lines & Left Percentage Labels
    const gridValues = ['100%', '75%', '50%', '25%', '0%'];
    ctx.lineWidth = 1;

    for (let i = 0; i < gridValues.length; i++) {
      const y = paddingTop + (graphHeight / (gridValues.length - 1)) * i;

      // Horizontal Grid Line
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Left Y-Axis Scale Numbers
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#94a3b8';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(gridValues[i], paddingLeft - 8, y + 4);
    }

    days.forEach((day, idx) => {
      const xCenter = paddingLeft + idx * colWidth + colWidth / 2;

      if (showSteps) {
        const val = stepsData[idx];
        const barH = (val / maxSteps) * graphHeight;
        const x = showCalories ? xCenter - barWidth - 2 : xCenter - barWidth / 2;
        const y = paddingTop + (graphHeight - barH);

        const gradient = ctx.createLinearGradient(0, y, 0, y + barH);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#059669');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
        ctx.fill();
      }

      if (showCalories) {
        const val = caloriesData[idx];
        const barH = (val / maxCalories) * graphHeight;
        const x = showSteps ? xCenter + 2 : xCenter - barWidth / 2;
        const y = paddingTop + (graphHeight - barH);

        const gradient = ctx.createLinearGradient(0, y, 0, y + barH);
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(1, '#d97706');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
        ctx.fill();
      }

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#94a3b8';
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(day, xCenter, height - 6);
    });
  }

  // Hydration UI
  function updateHydrationUI() {
    const waterWave = document.getElementById('waterWave');
    const waterText = document.getElementById('waterAmountText');
    const waterGoalTag = document.getElementById('waterGoalTag');

    const pct = Math.min(100, Math.round((appState.waterLogged / appState.waterGoal) * 100));
    if (waterWave) waterWave.style.height = `${pct}%`;
    if (waterText) waterText.textContent = appState.waterLogged.toLocaleString();
    if (waterGoalTag) waterGoalTag.textContent = `Goal: ${appState.waterGoal.toLocaleString()} ml (${pct}%)`;

    updateAuraScoreUI();
  }

  const addWater250 = document.getElementById('addWater250');
  const addWater500 = document.getElementById('addWater500');
  const resetWaterBtn = document.getElementById('resetWaterBtn');

  if (addWater250) {
    addWater250.addEventListener('click', () => {
      appState.waterLogged += 250;
      addXP(20, 'Hydration Intake');
      updateHydrationUI();
    });
  }

  if (addWater500) {
    addWater500.addEventListener('click', () => {
      appState.waterLogged += 500;
      addXP(40, 'Hydration Intake');
      updateHydrationUI();
    });
  }

  if (resetWaterBtn) {
    resetWaterBtn.addEventListener('click', () => {
      appState.waterLogged = 0;
      saveState();
      updateHydrationUI();
    });
  }

  // Gratitude Journal & Routine
  function initJournalAndRoutine() {
    const g1 = document.getElementById('gratitude1');
    const g2 = document.getElementById('gratitude2');
    const g3 = document.getElementById('gratitude3');
    const saveBtn = document.getElementById('saveGratitudeBtn');

    if (g1) g1.value = appState.journal.entry1 || '';
    if (g2) g2.value = appState.journal.entry2 || '';
    if (g3) g3.value = appState.journal.entry3 || '';

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        appState.journal.entry1 = g1 ? g1.value.trim() : '';
        appState.journal.entry2 = g2 ? g2.value.trim() : '';
        appState.journal.entry3 = g3 ? g3.value.trim() : '';
        saveState();
        addXP(30, 'Saved Gratitude Reflections');
      });
    }

    const checkboxes = document.querySelectorAll('.routine-checkbox');
    const progressEl = document.getElementById('routineProgressText');

    function updateRoutineCount() {
      let done = 0;
      checkboxes.forEach(chk => {
        const id = chk.dataset.id;
        chk.checked = !!appState.routines[id];
        if (chk.checked) done++;
      });
      if (progressEl) progressEl.textContent = `${done} / ${checkboxes.length} Done`;
    }

    checkboxes.forEach(chk => {
      chk.addEventListener('change', () => {
        const id = chk.dataset.id;
        appState.routines[id] = chk.checked;
        saveState();
        updateRoutineCount();
      });
    });

    updateRoutineCount();
  }

  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
  }

  /* ==========================================================================
     Calendar & Emotion Journal Engine
     ========================================================================== */
  let currentCalDate = new Date();
  let selectedJournalEmotion = '🌟 Joyful';
  let selectedJournalEmoji = '🌟';

  function initJournalEmotionChips() {
    const chips = document.querySelectorAll('#journalEmotionChips .emotion-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedJournalEmotion = chip.dataset.emotion;
        selectedJournalEmoji = chip.dataset.emoji || '🌟';
      });
    });
  }

  function renderJournalHistory() {
    const listEl = document.getElementById('journalHistoryList');
    if (!listEl) return;

    if (!appState.journalEntries || appState.journalEntries.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; color: var(--text-muted); padding: 16px; font-size: 0.85rem;">No journal entries yet. Write your first reflection above!</div>`;
      return;
    }

    listEl.innerHTML = '';
    appState.journalEntries.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'journal-card-item';
      card.innerHTML = `
        <button class="j-card-del-btn" data-id="${entry.id}">&times;</button>
        <div class="j-card-header">
          <span class="j-card-title">${escapeHTML(entry.title || 'Untitled Entry')}</span>
          <span class="j-card-date">${entry.date}</span>
        </div>
        <div class="j-card-body">${escapeHTML(entry.content)}</div>
        <span class="j-card-tag">${entry.tag}</span>
      `;
      listEl.appendChild(card);
    });

    listEl.querySelectorAll('.j-card-del-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        appState.journalEntries = appState.journalEntries.filter(j => j.id !== id);
        saveState();
        renderJournalHistory();
        renderCalendarGrid();
        showToast('Journal entry deleted');
      });
    });
  }

  function saveJournalEntry() {
    const titleInput = document.getElementById('journalTitleInput');
    const bodyInput = document.getElementById('journalBodyInput');

    if (!bodyInput || !bodyInput.value.trim()) {
      showToast('Please enter some journal text before saving!');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: Date.now(),
      date: todayStr,
      title: titleInput ? titleInput.value.trim() : 'Daily Reflection',
      content: bodyInput.value.trim(),
      tag: selectedJournalEmotion,
      emoji: selectedJournalEmoji
    };

    if (!appState.journalEntries) appState.journalEntries = [];
    appState.journalEntries.unshift(newEntry);

    if (!appState.emotionLogs) appState.emotionLogs = [];
    appState.emotionLogs.push({ date: todayStr, emotion: selectedJournalEmotion, emoji: selectedJournalEmoji });

    saveState();
    addXP(30, 'Saved Journal Entry');

    if (titleInput) titleInput.value = '';
    bodyInput.value = '';

    renderJournalHistory();
    renderCalendarGrid();
  }

  function renderCalendarGrid() {
    const daysGrid = document.getElementById('calendarDaysGrid');
    const monthTitle = document.getElementById('calMonthYearTitle');
    if (!daysGrid) return;

    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (monthTitle) monthTitle.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    daysGrid.innerHTML = '';
    const todayStr = new Date().toISOString().split('T')[0];

    for (let i = firstDay - 1; i >= 0; i--) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month';
      cell.innerHTML = `<span class="cal-day-num">${prevMonthDays - i}</span>`;
      daysGrid.appendChild(cell);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = cellDateStr === todayStr;

      const cell = document.createElement('div');
      cell.className = `cal-day-cell ${isToday ? 'today' : ''}`;
      cell.dataset.date = cellDateStr;

      const hasJournal = appState.journalEntries && appState.journalEntries.some(j => j.date === cellDateStr);
      const emotionLog = appState.emotionLogs && appState.emotionLogs.find(e => e.date === cellDateStr);

      let dotsHTML = '';
      if (hasJournal) dotsHTML += `<span class="cal-dot dot-journal" title="Journal logged"></span>`;
      if (emotionLog) dotsHTML += `<span class="cal-dot dot-mood" title="Emotion logged"></span>`;

      const emojiHTML = emotionLog ? `<span class="cal-emoji-badge">${emotionLog.emoji}</span>` : '';

      cell.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="cal-day-num">${d}</span>
          ${emojiHTML}
        </div>
        <div class="cal-indicators">
          ${dotsHTML}
        </div>
      `;

      cell.addEventListener('click', () => openDayInspector(cellDateStr));
      daysGrid.appendChild(cell);
    }
  }

  function openDayInspector(dateStr) {
    const modal = document.getElementById('dayInspectorModal');
    const titleEl = document.getElementById('dayInspectorTitle');
    const bodyEl = document.getElementById('dayInspectorBody');
    if (!modal || !bodyEl) return;

    if (titleEl) titleEl.textContent = `📅 Day Inspector — ${dateStr}`;

    const journalForDay = appState.journalEntries ? appState.journalEntries.filter(j => j.date === dateStr) : [];
    const emotionForDay = appState.emotionLogs ? appState.emotionLogs.filter(e => e.date === dateStr) : [];

    let journalHTML = journalForDay.map(j => `
      <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-color); padding: 12px; border-radius: 12px; margin-bottom: 8px;">
        <h4 style="color: var(--emerald); font-size: 0.9rem; margin-bottom: 4px;">${escapeHTML(j.title)}</h4>
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">${escapeHTML(j.content)}</p>
        <span class="j-card-tag" style="margin-top:6px; display:inline-block;">${j.tag}</span>
      </div>
    `).join('');

    if (!journalHTML) journalHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">No journal entries recorded for this date.</p>`;

    let emotionHTML = emotionForDay.map(e => `
      <span style="font-size: 1.2rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 12px; display: inline-flex; align-items: center; gap: 6px; margin-right: 6px;">
        ${e.emoji} ${e.emotion}
      </span>
    `).join('');

    if (!emotionHTML) emotionHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;">No emotion logs recorded.</span>`;

    bodyEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4 style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Emotions Logged</h4>
          <div>${emotionHTML}</div>
        </div>
        <div>
          <h4 style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Journal Reflections</h4>
          ${journalHTML}
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  const closeDayInspBtn = document.getElementById('closeDayInspectorModal');
  if (closeDayInspBtn) {
    closeDayInspBtn.addEventListener('click', () => {
      const modal = document.getElementById('dayInspectorModal');
      if (modal) modal.classList.remove('active');
    });
  }

  const calPrevBtn = document.getElementById('calPrevMonthBtn');
  const calNextBtn = document.getElementById('calNextMonthBtn');
  const calTodayBtn = document.getElementById('calTodayBtn');
  const saveJournalBtn = document.getElementById('saveJournalEntryBtn');

  if (calPrevBtn) calPrevBtn.addEventListener('click', () => { currentCalDate.setMonth(currentCalDate.getMonth() - 1); renderCalendarGrid(); });
  if (calNextBtn) calNextBtn.addEventListener('click', () => { currentCalDate.setMonth(currentCalDate.getMonth() + 1); renderCalendarGrid(); });
  if (calTodayBtn) calTodayBtn.addEventListener('click', () => { currentCalDate = new Date(); renderCalendarGrid(); });
  if (saveJournalBtn) saveJournalBtn.addEventListener('click', saveJournalEntry);

  /* ==========================================================================
     Init Sequence
     ========================================================================== */
  initHeader();
  updateGamificationUI();
  updateLevelGatedUI();
  updateMetricsUI();
  renderHabitsTable();
  renderActivityChart();
  updateHydrationUI();
  renderNutritionUI();
  renderHeatmap();
  renderBadges();
  renderLevelRoadmap();
  renderMoodHistoryPills();
  initJournalAndRoutine();
  updatePomoDisplay();
  renderMoodTrendChart();
  initJournalEmotionChips();
  renderCalendarGrid();
  renderJournalHistory();

  const initialHash = window.location.hash.replace('#', '') || 'dashboard';
  switchView(initialHash);

  window.addEventListener('resize', () => {
    renderActivityChart();
    renderMoodTrendChart();
  });
});
