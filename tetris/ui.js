// ============================================================================
// TETRIS GAME - UI Components and Screen Controllers
// ============================================================================

// ============================================================================
// SCREEN MANAGEMENT
// ============================================================================

const SCREENS = {
    START: 'start-screen',
    GAME: 'game-screen',
    PAUSE: 'pause-overlay',
    GAME_OVER: 'game-over-screen',
    SETTINGS: 'settings-menu',
    ACHIEVEMENTS: 'achievements-page'
};

let currentScreen = SCREENS.START;

function showScreen(screenId) {
    // Hide all screens
    for (const screen in SCREENS) {
        const element = document.getElementById(SCREENS[screen]);
        if (element) {
            element.classList.remove('active');
        }
    }
    
    // Show requested screen
    const element = document.getElementById(screenId);
    if (element) {
        element.classList.add('active');
        currentScreen = screenId;
    }
}

// ============================================================================
// START SCREEN CONTROLLER
// ============================================================================

function initializeStartScreen() {
    // Load player name from storage
    const playerName = window.storageSystem.getPlayerName();
    const nameInput = document.getElementById('player-name-input');
    if (nameInput) {
        nameInput.value = playerName;
    }
    
    // Load last selected difficulty
    const difficulty = window.storageSystem.getDifficulty();
    const difficultySelect = document.getElementById('difficulty-select');
    if (difficultySelect) {
        difficultySelect.value = difficulty;
    }
    
    // Load last selected mode
    const mode = window.storageSystem.getLastMode();
    const modeSelect = document.getElementById('mode-select');
    if (modeSelect) {
        modeSelect.value = mode;
    }
    
    // Setup event listeners
    const startButton = document.getElementById('start-game-btn');
    if (startButton) {
        startButton.addEventListener('click', handleStartGame);
    }
    
    const settingsButton = document.getElementById('settings-btn');
    if (settingsButton) {
        settingsButton.addEventListener('click', () => showScreen(SCREENS.SETTINGS));
    }
    
    const achievementsButton = document.getElementById('achievements-btn');
    if (achievementsButton) {
        achievementsButton.addEventListener('click', () => showScreen(SCREENS.ACHIEVEMENTS));
    }
    
    // Check for saved game
    if (window.storageSystem.hasSavedGame()) {
        showContinueGameOption();
    }
}

function showContinueGameOption() {
    const continueButton = document.getElementById('continue-game-btn');
    if (continueButton) {
        continueButton.style.display = 'block';
        continueButton.addEventListener('click', handleContinueGame);
    }
}

function handleStartGame() {
    // Get player name
    const nameInput = document.getElementById('player-name-input');
    const playerName = nameInput ? nameInput.value.trim() : 'Player';
    
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    
    // Save player name
    window.storageSystem.savePlayerName(playerName);
    
    // Get difficulty
    const difficultySelect = document.getElementById('difficulty-select');
    const difficulty = difficultySelect ? difficultySelect.value : 'medium';
    window.storageSystem.saveDifficulty(difficulty);
    
    // Get mode
    const modeSelect = document.getElementById('mode-select');
    const mode = modeSelect ? modeSelect.value : 'marathon';
    window.storageSystem.saveLastMode(mode);
    
    // Start new game
    startNewGame(playerName, difficulty, mode);
}

function handleContinueGame() {
    const savedState = window.storageSystem.loadGameState();
    if (savedState) {
        resumeGame(savedState);
    } else {
        alert('No saved game found');
    }
}

// ============================================================================
// GAME SCREEN CONTROLLER
// ============================================================================

function initializeGameScreen() {
    // Setup pause button
    const pauseButton = document.getElementById('pause-btn');
    if (pauseButton) {
        pauseButton.addEventListener('click', handlePauseGame);
    }
    
    // Setup keyboard listener for pause
    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
            if (currentScreen === SCREENS.GAME) {
                handlePauseGame();
            } else if (currentScreen === SCREENS.PAUSE) {
                handleResumeGame();
            }
        }
    });
}

function updateGameUI() {
    // Update score
    const scoreElement = document.getElementById('score-value');
    if (scoreElement && gameState) {
        scoreElement.textContent = gameState.score.toLocaleString();
    }
    
    // Update level
    const levelElement = document.getElementById('level-value');
    if (levelElement && gameState) {
        levelElement.textContent = gameState.level;
    }
    
    // Update lines
    const linesElement = document.getElementById('lines-value');
    if (linesElement && gameState) {
        linesElement.textContent = gameState.lines;
    }
    
    // Update timer (for Sprint and Ultra modes)
    if (gameState && (gameState.mode === 'sprint' || gameState.mode === 'ultra')) {
        updateTimerDisplay();
    }
    
    // Update combo display
    if (gameState && gameState.combo > 1) {
        const comboElement = document.getElementById('combo-value');
        if (comboElement) {
            comboElement.textContent = `${gameState.combo}x`;
            comboElement.style.display = 'block';
        }
    } else {
        const comboElement = document.getElementById('combo-value');
        if (comboElement) {
            comboElement.style.display = 'none';
        }
    }
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer-value');
    if (!timerElement || !gameState) return;
    
    let timeValue;
    
    if (gameState.mode === 'sprint') {
        // Show elapsed time
        timeValue = gameState.gameTime;
    } else if (gameState.mode === 'ultra') {
        // Show remaining time (3 minutes = 180000ms)
        timeValue = Math.max(0, 180000 - gameState.gameTime);
    }
    
    // Format as MM:SS
    const minutes = Math.floor(timeValue / 60000);
    const seconds = Math.floor((timeValue % 60000) / 1000);
    const milliseconds = Math.floor((timeValue % 1000) / 10);
    
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

function handlePauseGame() {
    if (typeof pauseGame === 'function') {
        pauseGame();
    }
    showScreen(SCREENS.PAUSE);
    
    // Pause audio
    if (window.audioSystem) {
        window.audioSystem.pauseMusic();
    }
}

// ============================================================================
// PAUSE OVERLAY CONTROLLER
// ============================================================================

function initializePauseOverlay() {
    const resumeButton = document.getElementById('resume-btn');
    if (resumeButton) {
        resumeButton.addEventListener('click', handleResumeGame);
    }
    
    const quitButton = document.getElementById('quit-btn');
    if (quitButton) {
        quitButton.addEventListener('click', handleQuitGame);
    }
    
    const pauseSettingsButton = document.getElementById('pause-settings-btn');
    if (pauseSettingsButton) {
        pauseSettingsButton.addEventListener('click', () => showScreen(SCREENS.SETTINGS));
    }
}

function handleResumeGame() {
    if (typeof resumeGame === 'function') {
        resumeGame();
    }
    showScreen(SCREENS.GAME);
    
    // Resume audio
    if (window.audioSystem) {
        window.audioSystem.resumeMusic();
    }
}

function handleQuitGame() {
    if (confirm('Are you sure you want to quit? Your progress will be saved.')) {
        // Save game state
        if (gameState && typeof window.storageSystem !== 'undefined') {
            window.storageSystem.saveGameState(gameState);
        }
        
        // Stop game
        if (typeof stopGame === 'function') {
            stopGame();
        }
        
        // Return to start screen
        showScreen(SCREENS.START);
        
        // Stop audio
        if (window.audioSystem) {
            window.audioSystem.stopMusic();
        }
    }
}

// ============================================================================
// GAME OVER SCREEN CONTROLLER
// ============================================================================

function initializeGameOverScreen() {
    const playAgainButton = document.getElementById('play-again-btn');
    if (playAgainButton) {
        playAgainButton.addEventListener('click', handlePlayAgain);
    }
    
    const mainMenuButton = document.getElementById('main-menu-btn');
    if (mainMenuButton) {
        mainMenuButton.addEventListener('click', () => showScreen(SCREENS.START));
    }
    
    const shareScoreButton = document.getElementById('share-score-btn');
    if (shareScoreButton) {
        shareScoreButton.addEventListener('click', handleShareScore);
    }
}

function showGameOver(finalScore, lines, level, mode, difficulty) {
    // Display final stats
    const finalScoreElement = document.getElementById('final-score');
    if (finalScoreElement) {
        finalScoreElement.textContent = finalScore.toLocaleString();
    }
    
    const finalLinesElement = document.getElementById('final-lines');
    if (finalLinesElement) {
        finalLinesElement.textContent = lines;
    }
    
    const finalLevelElement = document.getElementById('final-level');
    if (finalLevelElement) {
        finalLevelElement.textContent = level;
    }
    
    // Save high score
    const playerName = window.storageSystem.getPlayerName();
    const result = window.storageSystem.saveHighScore(
        finalScore,
        playerName,
        mode,
        difficulty,
        lines,
        level
    );
    
    // Show rank if made it to top 5
    if (result.rank) {
        const rankElement = document.getElementById('score-rank');
        if (rankElement) {
            rankElement.textContent = `Rank #${result.rank}`;
            rankElement.style.display = 'block';
            
            if (result.isTopScore) {
                rankElement.textContent = '🏆 NEW HIGH SCORE! 🏆';
                rankElement.classList.add('top-score');
            }
        }
    }
    
    // Update leaderboard display
    updateLeaderboardDisplay();
    
    // Update statistics
    if (gameState) {
        window.storageSystem.updateStats({
            score: finalScore,
            lines: lines,
            mode: mode,
            gameTime: gameState.gameTime
        });
    }
    
    // Clear saved game
    window.storageSystem.clearSavedGame();
    
    // Show game over screen
    showScreen(SCREENS.GAME_OVER);
    
    // Play game over sound
    if (window.audioSystem) {
        window.audioSystem.playGameOver();
    }
}

function updateLeaderboardDisplay() {
    const leaderboardElement = document.getElementById('leaderboard-list');
    if (!leaderboardElement) return;
    
    const scores = window.storageSystem.loadHighScores();
    
    leaderboardElement.innerHTML = '';
    
    if (scores.length === 0) {
        leaderboardElement.innerHTML = '<li class="no-scores">No high scores yet</li>';
        return;
    }
    
    scores.forEach((score, index) => {
        const li = document.createElement('li');
        li.className = 'leaderboard-entry';
        
        // Highlight current player's score
        const currentPlayer = window.storageSystem.getPlayerName();
        if (score.playerName === currentPlayer) {
            li.classList.add('current-player');
        }
        
        li.innerHTML = `
            <span class="rank">#${index + 1}</span>
            <span class="player-name">${score.playerName}</span>
            <span class="score">${score.score.toLocaleString()}</span>
            <span class="mode">${score.mode}</span>
        `;
        
        leaderboardElement.appendChild(li);
    });
}

function handlePlayAgain() {
    // Get last settings
    const difficulty = window.storageSystem.getDifficulty();
    const mode = window.storageSystem.getLastMode();
    const playerName = window.storageSystem.getPlayerName();
    
    // Start new game with same settings
    startNewGame(playerName, difficulty, mode);
}

function handleShareScore() {
    if (!gameState) return;
    
    const playerName = window.storageSystem.getPlayerName();
    const shareText = `I scored ${gameState.score.toLocaleString()} points in Tetris (${gameState.mode} mode)! Can you beat my score?`;
    
    // Try to use Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'Tetris Score',
            text: shareText,
            url: window.location.href
        }).catch(error => {
            console.log('Share failed:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    // Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Score copied to clipboard!');
        }).catch(error => {
            console.error('Failed to copy:', error);
        });
    } else {
        // Show share text in alert
        alert(text);
    }
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

let notificationTimeout = null;

function showNotification(message, duration = 3000, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    // Clear existing timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    
    // Set message and type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    // Auto-dismiss
    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

function showAchievementNotification(achievementName) {
    showNotification(`🏆 Achievement Unlocked: ${achievementName}`, 5000, 'achievement');
    
    // Play achievement sound
    if (window.audioSystem) {
        window.audioSystem.playAchievement();
    }
    
    // Trigger achievement particles
    if (window.triggerAchievementParticles) {
        window.triggerAchievementParticles();
    }
}

function showPowerUpNotification(powerUpName) {
    showNotification(`⚡ Power-Up: ${powerUpName}`, 2000, 'powerup');
}

function showLevelUpNotification(level) {
    showNotification(`📈 Level Up! Now at Level ${level}`, 2000, 'levelup');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function initializeUI() {
    initializeStartScreen();
    initializeGameScreen();
    initializePauseOverlay();
    initializeGameOverScreen();
    
    // Show start screen
    showScreen(SCREENS.START);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUI);
} else {
    initializeUI();
}

// ============================================================================
// PART 2: MENUS AND SETTINGS
// ============================================================================

// ============================================================================
// SETTINGS MENU CONTROLLER
// ============================================================================

function initializeSettingsMenu() {
    // Load current settings
    loadSettingsUI();
    
    // Setup theme selector
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.addEventListener('change', handleThemeChange);
    }
    
    // Setup audio controls
    const muteToggle = document.getElementById('mute-toggle');
    if (muteToggle) {
        muteToggle.addEventListener('change', handleMuteToggle);
    }
    
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', handleVolumeChange);
    }
    
    // Setup close button
    const closeSettingsButton = document.getElementById('close-settings-btn');
    if (closeSettingsButton) {
        closeSettingsButton.addEventListener('click', handleCloseSettings);
    }
    
    // Setup back button (from pause menu)
    const backFromSettingsButton = document.getElementById('back-from-settings-btn');
    if (backFromSettingsButton) {
        backFromSettingsButton.addEventListener('click', () => {
            if (gameState && gameState.isPlaying) {
                showScreen(SCREENS.PAUSE);
            } else {
                showScreen(SCREENS.START);
            }
        });
    }
}

function loadSettingsUI() {
    // Load theme
    const currentTheme = window.storageSystem ? window.storageSystem.getTheme() : 'classic';
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = currentTheme;
    }
    
    // Load audio settings
    if (window.audioSystem) {
        const muteToggle = document.getElementById('mute-toggle');
        if (muteToggle) {
            muteToggle.checked = !window.audioSystem.isMuted();
        }
        
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.value = window.audioSystem.getVolume() * 100;
        }
    }
}

function handleThemeChange(event) {
    const newTheme = event.target.value;
    
    // Apply theme
    if (typeof applyTheme === 'function') {
        applyTheme(newTheme);
    }
    
    // Save theme
    if (window.storageSystem) {
        window.storageSystem.saveTheme(newTheme);
    }
    
    showNotification(`Theme changed to ${newTheme}`, 2000, 'info');
}

function handleMuteToggle(event) {
    const isMuted = !event.target.checked;
    
    if (window.audioSystem) {
        if (isMuted) {
            window.audioSystem.mute();
        } else {
            window.audioSystem.unmute();
        }
    }
}

function handleVolumeChange(event) {
    const volume = event.target.value / 100;
    
    if (window.audioSystem) {
        window.audioSystem.setVolume(volume);
    }
}

function handleCloseSettings() {
    // Return to appropriate screen
    if (gameState && gameState.isPlaying) {
        showScreen(SCREENS.PAUSE);
    } else {
        showScreen(SCREENS.START);
    }
}

// ============================================================================
// ACHIEVEMENTS PAGE CONTROLLER
// ============================================================================

const ACHIEVEMENTS = {
    firstTetris: {
        id: 'firstTetris',
        name: 'First Tetris',
        description: 'Clear 4 lines at once',
        icon: '🎯',
        condition: (progress) => progress.tetrises >= 1
    },
    comboMaster: {
        id: 'comboMaster',
        name: 'Combo Master',
        description: 'Achieve a 10+ combo',
        icon: '🔥',
        condition: (progress) => progress.maxCombo >= 10
    },
    speedDemon: {
        id: 'speedDemon',
        name: 'Speed Demon',
        description: 'Complete Sprint mode under 2 minutes',
        icon: '⚡',
        condition: (progress) => progress.sprintTime && progress.sprintTime < 120000
    },
    centurion: {
        id: 'centurion',
        name: 'Centurion',
        description: 'Score 100,000 points',
        icon: '💯',
        condition: (progress) => progress.maxScore >= 100000
    },
    tSpinExpert: {
        id: 'tSpinExpert',
        name: 'T-spin Expert',
        description: 'Perform 10 T-spins in one game',
        icon: '🌀',
        condition: (progress) => progress.tSpins >= 10
    },
    marathonRunner: {
        id: 'marathonRunner',
        name: 'Marathon Runner',
        description: 'Survive 30 minutes',
        icon: '🏃',
        condition: (progress) => progress.playTime >= 1800000
    },
    powerPlayer: {
        id: 'powerPlayer',
        name: 'Power Player',
        description: 'Use all power-ups in one game',
        icon: '⚡',
        condition: (progress) => progress.powerupsUsed && progress.powerupsUsed.size >= 5
    }
};

function initializeAchievementsPage() {
    // Setup back button
    const backButton = document.getElementById('back-from-achievements-btn');
    if (backButton) {
        backButton.addEventListener('click', () => showScreen(SCREENS.START));
    }
    
    // Render achievements
    renderAchievements();
}

function renderAchievements() {
    const achievementsContainer = document.getElementById('achievements-container');
    if (!achievementsContainer) return;
    
    // Load unlocked achievements
    const unlockedAchievements = window.storageSystem ? window.storageSystem.getAchievements() : [];
    
    achievementsContainer.innerHTML = '';
    
    for (const key in ACHIEVEMENTS) {
        const achievement = ACHIEVEMENTS[key];
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        
        const achievementCard = document.createElement('div');
        achievementCard.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        achievementCard.innerHTML = `
            <div class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
            <div class="achievement-info">
                <h3 class="achievement-name">${achievement.name}</h3>
                <p class="achievement-description">${achievement.description}</p>
                ${isUnlocked ? '<span class="achievement-status">✓ Unlocked</span>' : '<span class="achievement-status">Locked</span>'}
            </div>
        `;
        
        achievementsContainer.appendChild(achievementCard);
    }
}

function checkAchievements() {
    if (!gameState || !window.storageSystem) return;
    
    const progress = gameState.achievementsProgress;
    const unlockedAchievements = window.storageSystem.getAchievements();
    
    for (const key in ACHIEVEMENTS) {
        const achievement = ACHIEVEMENTS[key];
        
        // Skip if already unlocked
        if (unlockedAchievements.includes(achievement.id)) {
            continue;
        }
        
        // Check condition
        if (achievement.condition(progress)) {
            // Unlock achievement
            window.storageSystem.unlockAchievement(achievement.id);
            
            // Show notification
            showAchievementNotification(achievement.name);
        }
    }
}

// ============================================================================
// ENHANCED LEADERBOARD VIEW
// ============================================================================

function initializeLeaderboard() {
    // Setup filter buttons
    const filterButtons = document.querySelectorAll('.leaderboard-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleLeaderboardFilter);
    });
    
    // Initial render
    renderLeaderboard('all');
}

function handleLeaderboardFilter(event) {
    const filter = event.target.dataset.filter;
    
    // Update active button
    document.querySelectorAll('.leaderboard-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Render filtered leaderboard
    renderLeaderboard(filter);
}

function renderLeaderboard(filter = 'all') {
    const leaderboardElement = document.getElementById('leaderboard-list');
    if (!leaderboardElement) return;
    
    let scores = window.storageSystem ? window.storageSystem.loadHighScores() : [];
    
    // Apply filter
    if (filter !== 'all') {
        scores = scores.filter(score => score.mode === filter);
    }
    
    leaderboardElement.innerHTML = '';
    
    if (scores.length === 0) {
        leaderboardElement.innerHTML = '<li class="no-scores">No high scores yet</li>';
        return;
    }
    
    const currentPlayer = window.storageSystem ? window.storageSystem.getPlayerName() : '';
    const bestScore = scores.length > 0 ? scores[0].score : 0;
    
    scores.forEach((score, index) => {
        const li = document.createElement('li');
        li.className = 'leaderboard-entry';
        
        // Highlight current player's score
        if (score.playerName === currentPlayer) {
            li.classList.add('current-player');
        }
        
        // Highlight best score
        if (score.score === bestScore) {
            li.classList.add('best-score');
        }
        
        // Format mode and difficulty
        const modeText = score.mode ? score.mode.charAt(0).toUpperCase() + score.mode.slice(1) : 'Marathon';
        const difficultyText = score.difficulty ? score.difficulty.charAt(0).toUpperCase() + score.difficulty.slice(1) : 'Medium';
        
        li.innerHTML = `
            <span class="rank">${index === 0 ? '🏆' : `#${index + 1}`}</span>
            <span class="player-name">${score.playerName}</span>
            <span class="score">${score.score.toLocaleString()}</span>
            <span class="mode-difficulty">${modeText} - ${difficultyText}</span>
            <span class="lines">${score.lines || 0} lines</span>
        `;
        
        leaderboardElement.appendChild(li);
    });
}

// ============================================================================
// ENHANCED NOTIFICATION SYSTEM
// ============================================================================

function showComboNotification(combo) {
    if (combo <= 1) return;
    
    const message = combo >= 10 ? `🔥 MEGA COMBO ${combo}x! 🔥` : `Combo ${combo}x!`;
    showNotification(message, 2000, 'combo');
}

function showBackToBackNotification() {
    showNotification('🎯 Back-to-Back!', 2000, 'bonus');
}

function showTSpinNotification(lines) {
    const message = lines > 0 ? `🌀 T-Spin ${lines === 1 ? 'Single' : lines === 2 ? 'Double' : 'Triple'}!` : '🌀 T-Spin!';
    showNotification(message, 2500, 'tspin');
}

// ============================================================================
// INITIALIZATION - PART 2
// ============================================================================

function initializeMenus() {
    initializeSettingsMenu();
    initializeAchievementsPage();
    initializeLeaderboard();
}

// Initialize menus when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMenus);
} else {
    initializeMenus();
}

// Export functions for use in game.js
window.showComboNotification = showComboNotification;
window.showBackToBackNotification = showBackToBackNotification;
window.showTSpinNotification = showTSpinNotification;
window.checkAchievements = checkAchievements;
window.renderAchievements = renderAchievements;


// ============================================================================
// MULTIPLAYER FEATURES
// ============================================================================

// Initialize multiplayer features on game start
function initializeMultiplayer() {
    // Check for friend challenge in URL
    const friendScore = window.loadFriendScore();
    
    if (friendScore) {
        // Display challenge notification
        displayNotification(
            `Challenge from ${friendScore.playerName}: Beat ${friendScore.score.toLocaleString()} points!`,
            'challenge',
            5000
        );
        
        // Show challenge indicator in game UI
        showChallengeIndicator(friendScore);
    }
}

// Show challenge indicator during gameplay
function showChallengeIndicator(friendScore) {
    const challengeContainer = document.getElementById('challenge-indicator');
    if (!challengeContainer) return;
    
    challengeContainer.innerHTML = `
        <div class="challenge-info">
            <div class="challenge-label">Challenge Mode</div>
            <div class="challenge-target">
                <span class="friend-name">${friendScore.playerName}</span>
                <span class="friend-score">${friendScore.score.toLocaleString()}</span>
            </div>
        </div>
    `;
    challengeContainer.style.display = 'block';
}

// Update challenge comparison during gameplay
function updateChallengeComparison() {
    const comparison = window.getScoreComparison();
    if (!comparison) return;
    
    const challengeContainer = document.getElementById('challenge-indicator');
    if (!challengeContainer) return;
    
    const statusClass = comparison.isBeatFriend ? 'beating' : 'behind';
    const statusText = comparison.isBeatFriend 
        ? `+${comparison.difference.toLocaleString()} ahead!`
        : `${comparison.difference.toLocaleString()} behind`;
    
    const comparisonElement = challengeContainer.querySelector('.challenge-comparison');
    if (comparisonElement) {
        comparisonElement.className = `challenge-comparison ${statusClass}`;
        comparisonElement.textContent = statusText;
    } else {
        const comparisonDiv = document.createElement('div');
        comparisonDiv.className = `challenge-comparison ${statusClass}`;
        comparisonDiv.textContent = statusText;
        challengeContainer.querySelector('.challenge-info').appendChild(comparisonDiv);
    }
}

// Handle share score button click
function handleShareScore() {
    if (!gameState) return;
    
    const score = gameState.score;
    const playerName = window.storageSystem.getPlayerName();
    const mode = gameState.mode;
    const difficulty = gameState.difficulty;
    const lines = gameState.lines;
    const level = gameState.level;
    
    // Show share options modal
    showShareModal(score, playerName, mode, difficulty, lines, level);
}

// Show share modal with options
function showShareModal(score, playerName, mode, difficulty, lines, level) {
    const modal = document.getElementById('share-modal');
    if (!modal) {
        // Create modal if it doesn't exist
        createShareModal();
        return showShareModal(score, playerName, mode, difficulty, lines, level);
    }
    
    // Update modal content
    const scoreDisplay = modal.querySelector('.share-score-display');
    if (scoreDisplay) {
        scoreDisplay.textContent = score.toLocaleString();
    }
    
    // Setup button handlers
    const copyButton = modal.querySelector('#copy-challenge-link');
    if (copyButton) {
        copyButton.onclick = () => {
            window.copyScoreToClipboard(score, playerName, mode, difficulty, lines, level);
        };
    }
    
    const twitterButton = modal.querySelector('#share-twitter');
    if (twitterButton) {
        twitterButton.onclick = () => {
            const links = window.generateSocialShareLinks(score, playerName, mode, difficulty);
            window.open(links.twitter, '_blank', 'width=550,height=420');
        };
    }
    
    const facebookButton = modal.querySelector('#share-facebook');
    if (facebookButton) {
        facebookButton.onclick = () => {
            const links = window.generateSocialShareLinks(score, playerName, mode, difficulty);
            window.open(links.facebook, '_blank', 'width=550,height=420');
        };
    }
    
    const nativeShareButton = modal.querySelector('#share-native');
    if (nativeShareButton) {
        // Show native share button only if Web Share API is available
        if (navigator.share) {
            nativeShareButton.style.display = 'block';
            nativeShareButton.onclick = () => {
                window.shareScoreNative(score, playerName, mode, difficulty);
                hideShareModal();
            };
        } else {
            nativeShareButton.style.display = 'none';
        }
    }
    
    const closeButton = modal.querySelector('.close-share-modal');
    if (closeButton) {
        closeButton.onclick = hideShareModal;
    }
    
    // Show modal
    modal.style.display = 'flex';
}

// Hide share modal
function hideShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Create share modal dynamically
function createShareModal() {
    const modal = document.createElement('div');
    modal.id = 'share-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content share-modal-content">
            <span class="close-share-modal">&times;</span>
            <h2>Share Your Score</h2>
            <div class="share-score-display">0</div>
            <div class="share-options">
                <button id="copy-challenge-link" class="share-btn copy-btn">
                    📋 Copy Challenge Link
                </button>
                <button id="share-twitter" class="share-btn twitter-btn">
                    🐦 Share on Twitter
                </button>
                <button id="share-facebook" class="share-btn facebook-btn">
                    📘 Share on Facebook
                </button>
                <button id="share-native" class="share-btn native-btn" style="display: none;">
                    📤 Share
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideShareModal();
        }
    });
}

// Display notification message
function displayNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
    if (!container) {
        createNotificationContainer();
        return displayNotification(message, type, duration);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-dismiss
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Create notification container
function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
}

// Update game UI to include challenge comparison
function updateGameUIWithChallenge() {
    // Update regular game UI
    updateGameUI();
    
    // Update challenge comparison if active
    if (gameState && gameState.friendScore) {
        updateChallengeComparison();
    }
}

// Export multiplayer UI functions
window.initializeMultiplayer = initializeMultiplayer;
window.showChallengeIndicator = showChallengeIndicator;
window.updateChallengeComparison = updateChallengeComparison;
window.handleShareScore = handleShareScore;
window.displayNotification = displayNotification;
window.updateGameUIWithChallenge = updateGameUIWithChallenge;
