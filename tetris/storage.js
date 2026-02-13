// ============================================================================
// TETRIS GAME - localStorage Management System
// ============================================================================

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
    HIGH_SCORES: 'tetris_high_scores',
    ACHIEVEMENTS: 'tetris_achievements',
    PLAYER_PREFS: 'tetris_player_prefs',
    SAVED_GAME: 'tetris_saved_game',
    STATS: 'tetris_stats'
};

// ============================================================================
// HIGH SCORES MANAGEMENT
// ============================================================================

function saveHighScore(score, playerName, mode, difficulty, lines, level) {
    try {
        // Load existing scores
        const scores = loadHighScores();
        
        // Create new score entry
        const newScore = {
            score: score,
            playerName: playerName,
            mode: mode,
            difficulty: difficulty,
            lines: lines,
            level: level,
            date: new Date().toISOString()
        };
        
        // Add to scores array
        scores.push(newScore);
        
        // Sort by score (descending)
        scores.sort((a, b) => b.score - a.score);
        
        // Keep only top 5
        const topScores = scores.slice(0, 5);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(topScores));
        
        // Check if this score made it to top 5
        const rank = topScores.findIndex(s => s.score === score && s.date === newScore.date);
        
        return {
            saved: true,
            rank: rank >= 0 ? rank + 1 : null,
            isTopScore: rank === 0
        };
    } catch (error) {
        console.error('Failed to save high score:', error);
        return { saved: false, rank: null, isTopScore: false };
    }
}

function loadHighScores() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Failed to load high scores:', error);
    }
    return [];
}

function getTopScore() {
    const scores = loadHighScores();
    return scores.length > 0 ? scores[0] : null;
}

function clearHighScores() {
    try {
        localStorage.removeItem(STORAGE_KEYS.HIGH_SCORES);
        return true;
    } catch (error) {
        console.error('Failed to clear high scores:', error);
        return false;
    }
}

// ============================================================================
// ACHIEVEMENTS MANAGEMENT
// ============================================================================

function saveAchievement(achievementId) {
    try {
        const achievements = loadAchievements();
        
        // Check if already unlocked
        if (achievements.includes(achievementId)) {
            return { saved: false, alreadyUnlocked: true };
        }
        
        // Add achievement
        achievements.push(achievementId);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
        
        return { saved: true, alreadyUnlocked: false };
    } catch (error) {
        console.error('Failed to save achievement:', error);
        return { saved: false, alreadyUnlocked: false };
    }
}

function loadAchievements() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Failed to load achievements:', error);
    }
    return [];
}

function isAchievementUnlocked(achievementId) {
    const achievements = loadAchievements();
    return achievements.includes(achievementId);
}

function getAchievementProgress() {
    const achievements = loadAchievements();
    const totalAchievements = 7; // Total number of achievements in the game
    
    return {
        unlocked: achievements.length,
        total: totalAchievements,
        percentage: Math.round((achievements.length / totalAchievements) * 100)
    };
}

function clearAchievements() {
    try {
        localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
        return true;
    } catch (error) {
        console.error('Failed to clear achievements:', error);
        return false;
    }
}

// ============================================================================
// PLAYER PREFERENCES MANAGEMENT
// ============================================================================

function savePlayerPreferences(prefs) {
    try {
        const currentPrefs = loadPlayerPreferences();
        const updatedPrefs = { ...currentPrefs, ...prefs };
        
        localStorage.setItem(STORAGE_KEYS.PLAYER_PREFS, JSON.stringify(updatedPrefs));
        return true;
    } catch (error) {
        console.error('Failed to save player preferences:', error);
        return false;
    }
}

function loadPlayerPreferences() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PLAYER_PREFS);
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Failed to load player preferences:', error);
    }
    
    // Return default preferences
    return {
        playerName: 'Player',
        theme: 'classic',
        difficulty: 'medium',
        lastMode: 'marathon'
    };
}

function savePlayerName(name) {
    return savePlayerPreferences({ playerName: name });
}

function getPlayerName() {
    const prefs = loadPlayerPreferences();
    return prefs.playerName || 'Player';
}

function saveTheme(theme) {
    return savePlayerPreferences({ theme: theme });
}

function getTheme() {
    const prefs = loadPlayerPreferences();
    return prefs.theme || 'classic';
}

function saveDifficulty(difficulty) {
    return savePlayerPreferences({ difficulty: difficulty });
}

function getDifficulty() {
    const prefs = loadPlayerPreferences();
    return prefs.difficulty || 'medium';
}

function saveLastMode(mode) {
    return savePlayerPreferences({ lastMode: mode });
}

function getLastMode() {
    const prefs = loadPlayerPreferences();
    return prefs.lastMode || 'marathon';
}

// ============================================================================
// GAME STATE PERSISTENCE
// ============================================================================

function saveGameState(state) {
    try {
        // Create serializable state object
        const saveData = {
            board: state.board,
            currentPiece: state.currentPiece ? {
                type: state.currentPiece.type,
                x: state.currentPiece.x,
                y: state.currentPiece.y,
                rotation: state.currentPiece.rotation
            } : null,
            nextPieces: state.nextPieces.map(p => ({ type: p.type })),
            holdPiece: state.holdPiece ? { type: state.holdPiece.type } : null,
            score: state.score,
            level: state.level,
            lines: state.lines,
            mode: state.mode,
            difficulty: state.difficulty,
            combo: state.combo,
            backToBack: state.backToBack,
            activePowerUps: state.activePowerUps,
            achievements: state.achievements,
            gameTime: state.gameTime,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(STORAGE_KEYS.SAVED_GAME, JSON.stringify(saveData));
        return true;
    } catch (error) {
        console.error('Failed to save game state:', error);
        return false;
    }
}

function loadGameState() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SAVED_GAME);
        if (data) {
            const saveData = JSON.parse(data);
            
            // Check if save is not too old (e.g., within 24 hours)
            const saveTime = new Date(saveData.timestamp);
            const now = new Date();
            const hoursSinceSave = (now - saveTime) / (1000 * 60 * 60);
            
            if (hoursSinceSave > 24) {
                // Save is too old, discard it
                clearSavedGame();
                return null;
            }
            
            return saveData;
        }
    } catch (error) {
        console.error('Failed to load game state:', error);
    }
    return null;
}

function hasSavedGame() {
    const saveData = loadGameState();
    return saveData !== null;
}

function clearSavedGame() {
    try {
        localStorage.removeItem(STORAGE_KEYS.SAVED_GAME);
        return true;
    } catch (error) {
        console.error('Failed to clear saved game:', error);
        return false;
    }
}

// ============================================================================
// STATISTICS TRACKING
// ============================================================================

function updateStats(gameData) {
    try {
        const stats = loadStats();
        
        // Update statistics
        stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
        stats.totalScore = (stats.totalScore || 0) + gameData.score;
        stats.totalLines = (stats.totalLines || 0) + gameData.lines;
        stats.totalTime = (stats.totalTime || 0) + gameData.gameTime;
        
        // Update mode-specific stats
        if (!stats.modes) stats.modes = {};
        if (!stats.modes[gameData.mode]) {
            stats.modes[gameData.mode] = {
                played: 0,
                bestScore: 0,
                bestLines: 0
            };
        }
        
        stats.modes[gameData.mode].played++;
        stats.modes[gameData.mode].bestScore = Math.max(
            stats.modes[gameData.mode].bestScore,
            gameData.score
        );
        stats.modes[gameData.mode].bestLines = Math.max(
            stats.modes[gameData.mode].bestLines,
            gameData.lines
        );
        
        // Update best scores
        if (!stats.bestScore || gameData.score > stats.bestScore) {
            stats.bestScore = gameData.score;
        }
        
        // Save stats
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
        
        return true;
    } catch (error) {
        console.error('Failed to update stats:', error);
        return false;
    }
}

function loadStats() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.STATS);
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
    
    return {
        gamesPlayed: 0,
        totalScore: 0,
        totalLines: 0,
        totalTime: 0,
        bestScore: 0,
        modes: {}
    };
}

function clearStats() {
    try {
        localStorage.removeItem(STORAGE_KEYS.STATS);
        return true;
    } catch (error) {
        console.error('Failed to clear stats:', error);
        return false;
    }
}

// ============================================================================
// DATA VALIDATION
// ============================================================================

function validateStorageData() {
    const issues = [];
    
    try {
        // Check high scores
        const scores = loadHighScores();
        if (!Array.isArray(scores)) {
            issues.push('High scores data is corrupted');
        }
        
        // Check achievements
        const achievements = loadAchievements();
        if (!Array.isArray(achievements)) {
            issues.push('Achievements data is corrupted');
        }
        
        // Check preferences
        const prefs = loadPlayerPreferences();
        if (typeof prefs !== 'object') {
            issues.push('Player preferences data is corrupted');
        }
        
        // Check stats
        const stats = loadStats();
        if (typeof stats !== 'object') {
            issues.push('Statistics data is corrupted');
        }
    } catch (error) {
        issues.push(`Validation error: ${error.message}`);
    }
    
    return {
        valid: issues.length === 0,
        issues: issues
    };
}

// ============================================================================
// STORAGE QUOTA MANAGEMENT
// ============================================================================

function getStorageUsage() {
    try {
        let totalSize = 0;
        
        for (const key in STORAGE_KEYS) {
            const data = localStorage.getItem(STORAGE_KEYS[key]);
            if (data) {
                totalSize += data.length;
            }
        }
        
        // Estimate in KB
        const sizeKB = totalSize / 1024;
        
        return {
            used: sizeKB.toFixed(2),
            unit: 'KB'
        };
    } catch (error) {
        console.error('Failed to get storage usage:', error);
        return { used: 0, unit: 'KB' };
    }
}

function clearAllData() {
    try {
        for (const key in STORAGE_KEYS) {
            localStorage.removeItem(STORAGE_KEYS[key]);
        }
        return true;
    } catch (error) {
        console.error('Failed to clear all data:', error);
        return false;
    }
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

window.storageSystem = {
    // High scores
    saveHighScore: saveHighScore,
    loadHighScores: loadHighScores,
    getTopScore: getTopScore,
    clearHighScores: clearHighScores,
    
    // Achievements
    saveAchievement: saveAchievement,
    loadAchievements: loadAchievements,
    getAchievements: loadAchievements, // Alias for compatibility
    isAchievementUnlocked: isAchievementUnlocked,
    getAchievementProgress: getAchievementProgress,
    clearAchievements: clearAchievements,
    
    // Player preferences
    savePlayerPreferences: savePlayerPreferences,
    loadPlayerPreferences: loadPlayerPreferences,
    savePlayerName: savePlayerName,
    getPlayerName: getPlayerName,
    saveTheme: saveTheme,
    getTheme: getTheme,
    saveDifficulty: saveDifficulty,
    getDifficulty: getDifficulty,
    saveLastMode: saveLastMode,
    getLastMode: getLastMode,
    
    // Game state
    saveGameState: saveGameState,
    loadGameState: loadGameState,
    hasSavedGame: hasSavedGame,
    clearSavedGame: clearSavedGame,
    
    // Statistics
    updateStats: updateStats,
    loadStats: loadStats,
    clearStats: clearStats,
    
    // Utilities
    validateStorageData: validateStorageData,
    getStorageUsage: getStorageUsage,
    clearAllData: clearAllData
};
