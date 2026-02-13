// ============================================================================
// TETRIS GAME - Core Game Logic
// ============================================================================
// VERSION: 2026-02-12-v3 - Added comprehensive error handling and logging

console.log('[game.js] VERSION 2026-02-12-v3 - Starting to load game.js...');

// ============================================================================
// GAME CONSTANTS
// ============================================================================

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

// Tetromino shapes (4x4 grid representation)
const SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    O: [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    T: [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
    ],
    S: [
        [0, 0, 0, 0],
        [0, 0, 1, 1],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    Z: [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ],
    J: [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 0]
    ],
    L: [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ]
};

// Piece colors
const COLORS = {
    I: '#00f0f0',
    O: '#f0f000',
    T: '#a000f0',
    S: '#00f000',
    Z: '#f00000',
    J: '#0000f0',
    L: '#f0a000'
};

// Wall kick data for SRS (Super Rotation System)
const WALL_KICKS = {
    'J': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    'L': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    'S': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    'T': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    'Z': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    'I': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    'O': [[0, 0]]
};

// Difficulty settings
const DIFFICULTY_SETTINGS = {
    easy: {
        initialSpeed: 1000,
        speedIncrease: 50,
        scoreMultiplier: 1.0
    },
    medium: {
        initialSpeed: 800,
        speedIncrease: 75,
        scoreMultiplier: 1.5
    },
    hard: {
        initialSpeed: 500,
        speedIncrease: 100,
        scoreMultiplier: 2.0
    }
};

// ============================================================================
// TETROMINO CLASS
// ============================================================================

class Tetromino {
    constructor(type) {
        this.type = type;
        this.shape = JSON.parse(JSON.stringify(SHAPES[type])); // Deep copy
        this.color = COLORS[type];
        this.x = Math.floor(BOARD_WIDTH / 2) - 2;
        this.y = 0;
        this.rotation = 0;
    }

    // Rotate piece clockwise
    rotateClockwise() {
        const newShape = [];
        const size = this.shape.length;
        
        for (let i = 0; i < size; i++) {
            newShape[i] = [];
            for (let j = 0; j < size; j++) {
                newShape[i][j] = this.shape[size - 1 - j][i];
            }
        }
        
        return newShape;
    }

    // Rotate piece counter-clockwise
    rotateCounterClockwise() {
        const newShape = [];
        const size = this.shape.length;
        
        for (let i = 0; i < size; i++) {
            newShape[i] = [];
            for (let j = 0; j < size; j++) {
                newShape[i][j] = this.shape[j][size - 1 - i];
            }
        }
        
        return newShape;
    }

    // Get actual blocks (non-zero cells)
    getBlocks() {
        const blocks = [];
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x]) {
                    blocks.push({ x: this.x + x, y: this.y + y });
                }
            }
        }
        return blocks;
    }

    // Clone the piece
    clone() {
        const cloned = new Tetromino(this.type);
        cloned.shape = JSON.parse(JSON.stringify(this.shape));
        cloned.x = this.x;
        cloned.y = this.y;
        cloned.rotation = this.rotation;
        return cloned;
    }
}

// ============================================================================
// GAME STATE
// ============================================================================

const gameState = {
    // Board
    board: [],
    
    // Current piece
    currentPiece: null,
    
    // Next pieces queue
    nextPieces: [],
    
    // Hold piece
    holdPiece: null,
    canHold: true,
    
    // Ghost piece
    ghostY: 0,
    
    // Score and stats
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    backToBack: false,
    
    // Game mode and difficulty
    mode: 'marathon', // marathon, sprint, ultra
    difficulty: 'medium',
    
    // Timers
    timer: 0,
    lastMoveTime: 0,
    fallSpeed: 800,
    
    // Power-ups
    activePowerups: [],
    powerupQueue: [],
    
    // Game state flags
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    
    // Player info
    playerName: 'Player',
    
    // Achievements tracking
    achievementsProgress: {
        tetrises: 0,
        maxCombo: 0,
        tSpins: 0,
        powerupsUsed: new Set(),
        playTime: 0
    }
};

// ============================================================================
// BOARD MANAGEMENT
// ============================================================================

function initializeBoard() {
    gameState.board = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        gameState.board[y] = [];
        for (let x = 0; x < BOARD_WIDTH; x++) {
            gameState.board[y][x] = null;
        }
    }
}

function isValidPosition(piece, offsetX = 0, offsetY = 0) {
    const blocks = piece.getBlocks();
    
    for (const block of blocks) {
        const newX = block.x + offsetX;
        const newY = block.y + offsetY;
        
        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
        }
        
        // Check collision with placed pieces (skip if above board)
        if (newY >= 0 && gameState.board[newY][newX] !== null) {
            return false;
        }
    }
    
    return true;
}

function placePiece(piece) {
    const blocks = piece.getBlocks();
    
    for (const block of blocks) {
        if (block.y >= 0 && block.y < BOARD_HEIGHT) {
            gameState.board[block.y][block.x] = piece.color;
        }
    }
}

// ============================================================================
// PIECE GENERATION
// ============================================================================

function generatePieceBag() {
    const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const bag = [];
    
    // Shuffle using Fisher-Yates algorithm
    for (let i = types.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [types[i], types[j]] = [types[j], types[i]];
    }
    
    for (const type of types) {
        bag.push(new Tetromino(type));
    }
    
    return bag;
}

function getNextPiece() {
    if (gameState.nextPieces.length < 3) {
        gameState.nextPieces.push(...generatePieceBag());
    }
    
    return gameState.nextPieces.shift();
}

function spawnNewPiece() {
    gameState.currentPiece = getNextPiece();
    gameState.canHold = true;
    
    // Check if game over (piece can't spawn)
    if (!isValidPosition(gameState.currentPiece)) {
        gameOver();
        return false;
    }
    
    updateGhostPiece();
    return true;
}

// ============================================================================
// COLLISION DETECTION
// ============================================================================

function checkCollision(piece, offsetX = 0, offsetY = 0) {
    return !isValidPosition(piece, offsetX, offsetY);
}

// ============================================================================
// GHOST PIECE CALCULATION
// ============================================================================

function updateGhostPiece() {
    if (!gameState.currentPiece) return;
    
    let ghostY = gameState.currentPiece.y;
    
    while (isValidPosition(gameState.currentPiece, 0, ghostY - gameState.currentPiece.y + 1)) {
        ghostY++;
    }
    
    gameState.ghostY = ghostY;
}

// Initialize game
function initGame() {
    try {
        console.log('[game.js] initGame ENTRY');
        
        initializeBoard();
        console.log('[game.js] ✓ Board initialized');
        
        gameState.nextPieces = [];
        gameState.nextPieces.push(...generatePieceBag());
        console.log('[game.js] ✓ Next pieces generated:', gameState.nextPieces.length);
        
        gameState.score = 0;
        gameState.level = 1;
        gameState.lines = 0;
        gameState.combo = 0;
        gameState.backToBack = false;
        gameState.holdPiece = null;
        gameState.canHold = true;
        gameState.activePowerups = [];
        gameState.isPlaying = false;
        gameState.isPaused = false;
        gameState.isGameOver = false;
        gameState.timer = 0;
        gameState.achievementsProgress = {
            tetrises: 0,
            maxCombo: 0,
            tSpins: 0,
            powerupsUsed: new Set(),
            playTime: 0
        };
        console.log('[game.js] ✓ Game state reset');
        
        // Set fall speed based on difficulty
        const diffSettings = DIFFICULTY_SETTINGS[gameState.difficulty];
        gameState.fallSpeed = diffSettings.initialSpeed;
        console.log('[game.js] ✓ Fall speed set:', gameState.fallSpeed);
        
        console.log('[game.js] initGame COMPLETE');
    } catch (error) {
        console.error('[game.js] ERROR in initGame:', error.message);
        console.error('[game.js] Stack:', error.stack);
        throw error;
    }
}

function gameOver() {
    gameState.isGameOver = true;
    gameState.isPlaying = false;
    
    // Save score to leaderboard
    if (window.storageSystem && typeof window.storageSystem.saveHighScore === 'function') {
        window.storageSystem.saveHighScore(
            gameState.score,
            gameState.playerName,
            gameState.mode,
            gameState.difficulty,
            gameState.lines,
            gameState.level
        );
    }
    
    // Show game over screen
    if (window.showGameOver && typeof window.showGameOver === 'function') {
        window.showGameOver(gameState.score, gameState.lines, gameState.level, gameState.mode, gameState.difficulty);
    }
}


// ============================================================================
// PIECE MOVEMENT
// ============================================================================

function movePieceLeft() {
    if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return false;
    
    if (isValidPosition(gameState.currentPiece, -1, 0)) {
        gameState.currentPiece.x--;
        updateGhostPiece();
        
        // Play move sound
        if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
            window.audioSystem.playSound('move');
        }
        
        return true;
    }
    
    return false;
}

function movePieceRight() {
    if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return false;
    
    if (isValidPosition(gameState.currentPiece, 1, 0)) {
        gameState.currentPiece.x++;
        updateGhostPiece();
        
        // Play move sound
        if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
            window.audioSystem.playSound('move');
        }
        
        return true;
    }
    
    return false;
}

function movePieceDown() {
    if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return false;
    
    if (isValidPosition(gameState.currentPiece, 0, 1)) {
        gameState.currentPiece.y++;
        gameState.lastMoveTime = Date.now();
        return true;
    } else {
        // Piece has landed
        lockPiece();
        return false;
    }
}

// ============================================================================
// SOFT DROP
// ============================================================================

function softDrop() {
    if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return;
    
    if (movePieceDown()) {
        // Award 1 point per cell dropped
        gameState.score += 1;
    }
}

// ============================================================================
// HARD DROP
// ============================================================================

function hardDrop() {
    if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return;
    
    let dropDistance = 0;
    
    // Drop piece to ghost position
    while (isValidPosition(gameState.currentPiece, 0, 1)) {
        gameState.currentPiece.y++;
        dropDistance++;
    }
    
    // Award 2 points per cell dropped
    gameState.score += dropDistance * 2;
    
    // Lock piece immediately
    lockPiece();
    
    // Play drop sound
    if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
        window.audioSystem.playSound('drop');
    }
}

// ============================================================================
// PIECE ROTATION
// ============================================================================

function rotatePieceClockwise() {
    if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return false;
    
    const originalShape = gameState.currentPiece.shape;
    const originalRotation = gameState.currentPiece.rotation;
    
    // Rotate the piece
    gameState.currentPiece.shape = gameState.currentPiece.rotateClockwise();
    gameState.currentPiece.rotation = (gameState.currentPiece.rotation + 1) % 4;
    
    // Try wall kicks
    const kicks = WALL_KICKS[gameState.currentPiece.type] || WALL_KICKS['J'];
    
    for (const [dx, dy] of kicks) {
        if (isValidPosition(gameState.currentPiece, dx, dy)) {
            gameState.currentPiece.x += dx;
            gameState.currentPiece.y += dy;
            updateGhostPiece();
            
            // Play rotate sound
            if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
                window.audioSystem.playSound('rotate');
            }
            
            return true;
        }
    }
    
    // Rotation failed, revert
    gameState.currentPiece.shape = originalShape;
    gameState.currentPiece.rotation = originalRotation;
    
    return false;
}

function rotatePieceCounterClockwise() {
    if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return false;
    
    const originalShape = gameState.currentPiece.shape;
    const originalRotation = gameState.currentPiece.rotation;
    
    // Rotate the piece
    gameState.currentPiece.shape = gameState.currentPiece.rotateCounterClockwise();
    gameState.currentPiece.rotation = (gameState.currentPiece.rotation + 3) % 4;
    
    // Try wall kicks
    const kicks = WALL_KICKS[gameState.currentPiece.type] || WALL_KICKS['J'];
    
    for (const [dx, dy] of kicks) {
        if (isValidPosition(gameState.currentPiece, dx, dy)) {
            gameState.currentPiece.x += dx;
            gameState.currentPiece.y += dy;
            updateGhostPiece();
            
            // Play rotate sound
            if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
                window.audioSystem.playSound('rotate');
            }
            
            return true;
        }
    }
    
    // Rotation failed, revert
    gameState.currentPiece.shape = originalShape;
    gameState.currentPiece.rotation = originalRotation;
    
    return false;
}

// ============================================================================
// HOLD PIECE
// ============================================================================

function holdCurrentPiece() {
    if (!gameState.currentPiece || !gameState.canHold || gameState.isPaused || gameState.isGameOver) {
        return false;
    }
    
    if (gameState.holdPiece === null) {
        // First hold
        gameState.holdPiece = new Tetromino(gameState.currentPiece.type);
        spawnNewPiece();
    } else {
        // Swap with held piece
        const temp = new Tetromino(gameState.holdPiece.type);
        gameState.holdPiece = new Tetromino(gameState.currentPiece.type);
        gameState.currentPiece = temp;
        
        // Reset position
        gameState.currentPiece.x = Math.floor(BOARD_WIDTH / 2) - 2;
        gameState.currentPiece.y = 0;
        
        updateGhostPiece();
    }
    
    gameState.canHold = false;
    
    return true;
}

// ============================================================================
// PIECE LOCKING
// ============================================================================

function lockPiece() {
    if (!gameState.currentPiece) return;
    
    // Place piece on board
    placePiece(gameState.currentPiece);
    
    // Check for T-spin before clearing lines
    const isTSpin = detectTSpin();
    
    // Clear completed lines
    const linesCleared = clearLines();
    
    // Calculate score
    calculateScore(linesCleared, isTSpin);
    
    // Check for power-up spawn
    checkPowerupSpawn();
    
    // Spawn next piece
    if (!spawnNewPiece()) {
        return; // Game over
    }
    
    // Play placement sound
    if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
        window.audioSystem.playSound('place');
    }
}

// ============================================================================
// LINE CLEARING
// ============================================================================

function clearLines() {
    const linesToClear = [];
    
    // Find completed lines
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        let isComplete = true;
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (gameState.board[y][x] === null) {
                isComplete = false;
                break;
            }
        }
        if (isComplete) {
            linesToClear.push(y);
        }
    }
    
    if (linesToClear.length === 0) {
        // No lines cleared, reset combo
        gameState.combo = 0;
        return 0;
    }
    
    // Trigger line clear animation
    if (typeof window.triggerLineClearAnimation === 'function') {
        window.triggerLineClearAnimation(linesToClear);
    }
    
    // Remove cleared lines
    for (const y of linesToClear) {
        gameState.board.splice(y, 1);
        gameState.board.unshift(new Array(BOARD_WIDTH).fill(null));
    }
    
    // Update stats
    gameState.lines += linesToClear.length;
    gameState.combo++;
    
    // Update level (every 10 lines)
    const newLevel = Math.floor(gameState.lines / 10) + 1;
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        updateFallSpeed();
        
        // Play level up sound
        if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
            window.audioSystem.playSound('levelup');
        }
    }
    
    // Play clear sound
    if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
        if (linesToClear.length === 4) {
            window.audioSystem.playSound('tetris');
        } else {
            window.audioSystem.playSound('clear');
        }
    }
    
    return linesToClear.length;
}

function updateFallSpeed() {
    const diffSettings = DIFFICULTY_SETTINGS[gameState.difficulty];
    gameState.fallSpeed = Math.max(
        100,
        diffSettings.initialSpeed - (gameState.level - 1) * diffSettings.speedIncrease
    );
}

// ============================================================================
// T-SPIN DETECTION
// ============================================================================

function detectTSpin() {
    if (!gameState.currentPiece || gameState.currentPiece.type !== 'T') {
        return false;
    }
    
    // Check if piece was just rotated (simplified detection)
    // A proper T-spin requires checking corners and last action
    const blocks = gameState.currentPiece.getBlocks();
    const centerBlock = blocks.find(b => b.x === gameState.currentPiece.x + 1 && b.y === gameState.currentPiece.y + 1);
    
    if (!centerBlock) return false;
    
    // Count filled corners around center
    let filledCorners = 0;
    const corners = [
        [-1, -1], [1, -1], [-1, 1], [1, 1]
    ];
    
    for (const [dx, dy] of corners) {
        const x = centerBlock.x + dx;
        const y = centerBlock.y + dy;
        
        if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT) {
            filledCorners++;
        } else if (gameState.board[y][x] !== null) {
            filledCorners++;
        }
    }
    
    // T-spin if 3 or more corners are filled
    return filledCorners >= 3;
}

// ============================================================================
// GRAVITY (AUTO-FALL)
// ============================================================================

function applyGravity() {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;
    
    const now = Date.now();
    
    if (now - gameState.lastMoveTime >= gameState.fallSpeed) {
        movePieceDown();
        gameState.lastMoveTime = now;
    }
}

// ============================================================================
// GAME OVER DETECTION
// ============================================================================

function checkGameOver() {
    // Game over if new piece can't spawn
    if (!gameState.currentPiece) {
        return true;
    }
    
    // Check if any blocks are above the board
    const blocks = gameState.currentPiece.getBlocks();
    for (const block of blocks) {
        if (block.y < 0) {
            return true;
        }
    }
    
    return false;
}


// ============================================================================
// SCORING SYSTEM
// ============================================================================

function calculateScore(linesCleared, isTSpin) {
    if (linesCleared === 0 && !isTSpin) {
        gameState.backToBack = false;
        return;
    }
    
    const diffSettings = DIFFICULTY_SETTINGS[gameState.difficulty];
    const baseMultiplier = diffSettings.scoreMultiplier;
    const levelMultiplier = gameState.level;
    
    let points = 0;
    let isDifficultClear = false;
    
    // Base scoring
    if (isTSpin) {
        // T-spin scoring
        if (linesCleared === 1) {
            points = 800;
        } else if (linesCleared === 2) {
            points = 1200;
        } else if (linesCleared === 3) {
            points = 1600;
        }
        isDifficultClear = true;
        
        // Track T-spin for achievements
        gameState.achievementsProgress.tSpins++;
    } else {
        // Regular line clear scoring
        if (linesCleared === 1) {
            points = 100;
        } else if (linesCleared === 2) {
            points = 300;
        } else if (linesCleared === 3) {
            points = 500;
        } else if (linesCleared === 4) {
            points = 800;
            isDifficultClear = true;
            
            // Track Tetris for achievements
            gameState.achievementsProgress.tetrises++;
        }
    }
    
    // Apply level multiplier
    points *= levelMultiplier;
    
    // Apply difficulty multiplier
    points *= baseMultiplier;
    
    // Back-to-back bonus (50% bonus for consecutive difficult clears)
    if (isDifficultClear && gameState.backToBack) {
        points *= 1.5;
    }
    
    // Update back-to-back status
    gameState.backToBack = isDifficultClear;
    
    // Combo bonus (50 points per combo level)
    if (gameState.combo > 1) {
        points += (gameState.combo - 1) * 50 * levelMultiplier;
    }
    
    // Track max combo for achievements
    if (gameState.combo > gameState.achievementsProgress.maxCombo) {
        gameState.achievementsProgress.maxCombo = gameState.combo;
    }
    
    // Add points to score
    gameState.score += Math.floor(points);
    
    // Check achievements
    checkAchievements();
}

// ============================================================================
// POWER-UP SPAWN CHECK
// ============================================================================

function checkPowerupSpawn() {
    // 5% chance to spawn power-up
    if (Math.random() < 0.05) {
        const powerupTypes = ['clearRow', 'slowTime', 'bomb', 'lineBlast', 'ghost'];
        const randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
        
        // Add power-up to queue
        gameState.powerupQueue.push({
            type: randomType,
            x: Math.floor(Math.random() * BOARD_WIDTH),
            y: 0
        });
    }
}


// ============================================================================
// GAME MODES
// ============================================================================

// NOTE: Old startGame() function removed - use startNewGame() instead (defined later in file)

function updateGameMode(deltaTime) {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    if (gameState.mode === 'sprint') {
        // Sprint mode: track time
        gameState.timer += deltaTime;
        
        // Check if target lines reached
        if (gameState.lines >= gameState.targetLines) {
            completeGame();
        }
    } else if (gameState.mode === 'ultra') {
        // Ultra mode: countdown timer
        gameState.timer -= deltaTime;
        
        // Check if time is up
        if (gameState.timer <= 0) {
            gameState.timer = 0;
            completeGame();
        }
    } else {
        // Marathon mode: track play time
        gameState.timer += deltaTime;
        gameState.achievementsProgress.playTime += deltaTime;
    }
}

function completeGame() {
    gameState.isPlaying = false;
    gameState.isGameOver = true;
    
    // Save score
    if (window.storageSystem && typeof window.storageSystem.saveHighScore === 'function') {
        window.storageSystem.saveHighScore(
            gameState.score,
            gameState.playerName,
            gameState.mode,
            gameState.difficulty,
            gameState.lines,
            gameState.level
        );
    }
    
    // Check achievements
    checkAchievements();
    
    // Show game over screen
    if (window.showGameOver && typeof window.showGameOver === 'function') {
        window.showGameOver(gameState.score, gameState.lines, gameState.level, gameState.mode, gameState.difficulty);
    }
}

// ============================================================================
// PAUSE/RESUME
// ============================================================================

function pauseGame() {
    if (!gameState.isPlaying || gameState.isGameOver) return;
    
    gameState.isPaused = true;
    
    // Pause audio
    if (typeof pauseAudio === 'function') {
        pauseAudio();
    }
}

function resumeGame() {
    if (!gameState.isPlaying || !gameState.isPaused) return;
    
    gameState.isPaused = false;
    gameState.lastMoveTime = Date.now();
    
    // Resume audio
    if (typeof resumeAudio === 'function') {
        resumeAudio();
    }
}


// ============================================================================
// POWER-UPS SYSTEM
// ============================================================================

const POWERUP_TYPES = {
    clearRow: {
        name: 'Clear Row',
        description: 'Instantly clear bottom row',
        duration: 0 // Instant effect
    },
    slowTime: {
        name: 'Slow Time',
        description: 'Reduce fall speed by 50%',
        duration: 30000 // 30 seconds
    },
    bomb: {
        name: 'Bomb Piece',
        description: 'Clear 3×3 area on placement',
        duration: 0 // Instant effect
    },
    lineBlast: {
        name: 'Line Blast',
        description: 'Clear all incomplete lines',
        duration: 0 // Instant effect
    },
    ghost: {
        name: 'Ghost Mode',
        description: 'Next 5 pieces pass through blocks',
        duration: 0, // Counter-based
        counter: 5
    }
};

function activatePowerup(type) {
    if (!POWERUP_TYPES[type]) return;
    
    // Track for achievements
    gameState.achievementsProgress.powerupsUsed.add(type);
    
    // Play power-up sound
    if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
        window.audioSystem.playSound('powerup');
    }
    
    // Show notification
    if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification(`Power-up: ${POWERUP_TYPES[type].name}`, 'powerup');
    }
    
    switch (type) {
        case 'clearRow':
            activateClearRow();
            break;
        case 'slowTime':
            activateSlowTime();
            break;
        case 'bomb':
            activateBomb();
            break;
        case 'lineBlast':
            activateLineBlast();
            break;
        case 'ghost':
            activateGhostMode();
            break;
    }
}

function activateClearRow() {
    // Clear bottom row
    gameState.board.splice(BOARD_HEIGHT - 1, 1);
    gameState.board.unshift(new Array(BOARD_WIDTH).fill(null));
    
    // Award points
    gameState.score += 100 * gameState.level;
    gameState.lines++;
}

function activateSlowTime() {
    // Add to active power-ups
    const powerup = {
        type: 'slowTime',
        startTime: Date.now(),
        duration: POWERUP_TYPES.slowTime.duration,
        originalSpeed: gameState.fallSpeed
    };
    
    gameState.activePowerups.push(powerup);
    
    // Reduce fall speed by 50%
    gameState.fallSpeed *= 2;
}

function activateBomb() {
    // Mark next piece as bomb piece
    const powerup = {
        type: 'bomb',
        active: true
    };
    
    gameState.activePowerups.push(powerup);
}

function activateLineBlast() {
    // Clear all incomplete lines
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        let hasBlocks = false;
        let isComplete = true;
        
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (gameState.board[y][x] !== null) {
                hasBlocks = true;
            } else {
                isComplete = false;
            }
        }
        
        // Clear if has blocks but not complete
        if (hasBlocks && !isComplete) {
            gameState.board.splice(y, 1);
            gameState.board.unshift(new Array(BOARD_WIDTH).fill(null));
            linesCleared++;
            y++; // Check same row again
        }
    }
    
    // Award points
    if (linesCleared > 0) {
        gameState.score += linesCleared * 200 * gameState.level;
        gameState.lines += linesCleared;
    }
}

function activateGhostMode() {
    // Add to active power-ups
    const powerup = {
        type: 'ghost',
        counter: POWERUP_TYPES.ghost.counter
    };
    
    gameState.activePowerups.push(powerup);
}

function updatePowerups(deltaTime) {
    // Update time-based power-ups
    for (let i = gameState.activePowerups.length - 1; i >= 0; i--) {
        const powerup = gameState.activePowerups[i];
        
        if (powerup.type === 'slowTime') {
            const elapsed = Date.now() - powerup.startTime;
            
            if (elapsed >= powerup.duration) {
                // Restore original speed
                gameState.fallSpeed = powerup.originalSpeed;
                gameState.activePowerups.splice(i, 1);
                
                if (window.showNotification && typeof window.showNotification === 'function') {
                    window.showNotification('Slow Time ended', 'info');
                }
            }
        }
    }
}

function applyBombEffect(x, y) {
    // Clear 3×3 area around placement
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const clearX = x + dx;
            const clearY = y + dy;
            
            if (clearX >= 0 && clearX < BOARD_WIDTH && clearY >= 0 && clearY < BOARD_HEIGHT) {
                gameState.board[clearY][clearX] = null;
            }
        }
    }
    
    // Trigger particle effect for bomb
    if (typeof window.triggerPowerUpParticles === 'function') {
        window.triggerPowerUpParticles(x, y, '#FF6B6B');
    }
    
    // Remove bomb power-up
    gameState.activePowerups = gameState.activePowerups.filter(p => p.type !== 'bomb');
}

function useGhostModeCharge() {
    const ghostPowerup = gameState.activePowerups.find(p => p.type === 'ghost');
    
    if (ghostPowerup) {
        ghostPowerup.counter--;
        
        if (ghostPowerup.counter <= 0) {
            gameState.activePowerups = gameState.activePowerups.filter(p => p.type !== 'ghost');
            
            if (window.showNotification && typeof window.showNotification === 'function') {
                window.showNotification('Ghost Mode ended', 'info');
            }
        }
    }
}

function isGhostModeActive() {
    return gameState.activePowerups.some(p => p.type === 'ghost');
}

function hasBombPowerup() {
    return gameState.activePowerups.some(p => p.type === 'bomb');
}

// ============================================================================
// ACHIEVEMENTS SYSTEM
// ============================================================================

const ACHIEVEMENTS = {
    firstTetris: {
        id: 'firstTetris',
        name: 'First Tetris',
        description: 'Clear 4 lines at once',
        condition: () => gameState.achievementsProgress.tetrises >= 1,
        unlocked: false
    },
    comboMaster: {
        id: 'comboMaster',
        name: 'Combo Master',
        description: 'Achieve a 10+ combo',
        condition: () => gameState.achievementsProgress.maxCombo >= 10,
        unlocked: false
    },
    speedDemon: {
        id: 'speedDemon',
        name: 'Speed Demon',
        description: 'Complete Sprint mode under 2 minutes',
        condition: () => gameState.mode === 'sprint' && gameState.lines >= 40 && gameState.timer < 120,
        unlocked: false
    },
    centurion: {
        id: 'centurion',
        name: 'Centurion',
        description: 'Score 100,000 points',
        condition: () => gameState.score >= 100000,
        unlocked: false
    },
    tSpinExpert: {
        id: 'tSpinExpert',
        name: 'T-spin Expert',
        description: 'Perform 10 T-spins in one game',
        condition: () => gameState.achievementsProgress.tSpins >= 10,
        unlocked: false
    },
    marathonRunner: {
        id: 'marathonRunner',
        name: 'Marathon Runner',
        description: 'Survive 30 minutes in Marathon mode',
        condition: () => gameState.mode === 'marathon' && gameState.achievementsProgress.playTime >= 1800,
        unlocked: false
    },
    powerPlayer: {
        id: 'powerPlayer',
        name: 'Power Player',
        description: 'Use all 5 power-ups in one game',
        condition: () => gameState.achievementsProgress.powerupsUsed.size >= 5,
        unlocked: false
    }
};

function checkAchievements() {
    for (const key in ACHIEVEMENTS) {
        const achievement = ACHIEVEMENTS[key];
        
        // Skip if already unlocked
        if (achievement.unlocked) continue;
        
        // Check condition
        if (achievement.condition()) {
            unlockAchievement(achievement);
        }
    }
}

function unlockAchievement(achievement) {
    achievement.unlocked = true;
    
    // Save to localStorage
    saveAchievements();
    
    // Show notification
    if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification(`Achievement Unlocked: ${achievement.name}`, 'achievement');
    }
    
    // Play achievement sound
    if (window.audioSystem && typeof window.audioSystem.playSound === 'function') {
        window.audioSystem.playSound('achievement');
    }
    
    // Trigger particle effect for achievement
    if (typeof window.triggerAchievementParticles === 'function') {
        window.triggerAchievementParticles();
    }
}

function loadAchievements() {
    try {
        const saved = localStorage.getItem('tetris_achievements');
        if (saved) {
            const unlockedIds = JSON.parse(saved);
            for (const id of unlockedIds) {
                if (ACHIEVEMENTS[id]) {
                    ACHIEVEMENTS[id].unlocked = true;
                }
            }
        }
    } catch (e) {
        console.error('Failed to load achievements:', e);
    }
}

function saveAchievements() {
    try {
        const unlockedIds = [];
        for (const key in ACHIEVEMENTS) {
            if (ACHIEVEMENTS[key].unlocked) {
                unlockedIds.push(key);
            }
        }
        localStorage.setItem('tetris_achievements', JSON.stringify(unlockedIds));
    } catch (e) {
        console.error('Failed to save achievements:', e);
    }
}

function getAchievementsList() {
    return Object.values(ACHIEVEMENTS);
}

function getUnlockedAchievements() {
    return Object.values(ACHIEVEMENTS).filter(a => a.unlocked);
}

function getLockedAchievements() {
    return Object.values(ACHIEVEMENTS).filter(a => !a.unlocked);
}

function getAchievementProgress() {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = getUnlockedAchievements().length;
    return {
        unlocked,
        total,
        percentage: Math.floor((unlocked / total) * 100)
    };
}

// Load achievements on initialization
loadAchievements();

// ============================================================================
// INPUT HANDLING
// ============================================================================

// Input state tracking
const inputState = {
    keys: {},
    lastKeyTime: {},
    keyRepeatDelay: 150, // ms before key repeat starts
    keyRepeatRate: 50,   // ms between repeats
    inputBuffer: [],
    bufferSize: 3
};

// Key mappings
const KEY_MAPPINGS = {
    'ArrowLeft': 'moveLeft',
    'ArrowRight': 'moveRight',
    'ArrowDown': 'softDrop',
    'ArrowUp': 'rotateClockwise',
    'z': 'rotateCounterClockwise',
    'Z': 'rotateCounterClockwise',
    ' ': 'hardDrop',
    'c': 'hold',
    'C': 'hold',
    'p': 'pause',
    'P': 'pause',
    'Escape': 'pause'
};

// Initialize input handling
function initializeInput() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

// Handle key down events
function handleKeyDown(event) {
    // Prevent default for game keys
    if (KEY_MAPPINGS[event.key]) {
        event.preventDefault();
    }
    
    // Ignore if key is already pressed (for key repeat)
    if (inputState.keys[event.key]) {
        return;
    }
    
    // Mark key as pressed
    inputState.keys[event.key] = true;
    inputState.lastKeyTime[event.key] = Date.now();
    
    // Get action
    const action = KEY_MAPPINGS[event.key];
    if (!action) return;
    
    // Add to input buffer
    addToInputBuffer(action);
    
    // Process input immediately
    processInput(action);
}

// Handle key up events
function handleKeyUp(event) {
    inputState.keys[event.key] = false;
    delete inputState.lastKeyTime[event.key];
}

// Add action to input buffer
function addToInputBuffer(action) {
    inputState.inputBuffer.push({
        action,
        timestamp: Date.now()
    });
    
    // Keep buffer size limited
    if (inputState.inputBuffer.length > inputState.bufferSize) {
        inputState.inputBuffer.shift();
    }
}

// Process buffered inputs
function processInputBuffer() {
    if (!gameState || !gameState.isPlaying || gameState.isPaused) {
        return;
    }
    
    // Process key repeats
    const now = Date.now();
    for (const key in inputState.keys) {
        if (!inputState.keys[key]) continue;
        
        const action = KEY_MAPPINGS[key];
        if (!action) continue;
        
        // Only repeat movement and soft drop
        if (action !== 'moveLeft' && action !== 'moveRight' && action !== 'softDrop') {
            continue;
        }
        
        const lastTime = inputState.lastKeyTime[key];
        const timeSincePress = now - lastTime;
        
        // Check if we should repeat
        if (timeSincePress > inputState.keyRepeatDelay) {
            const timeSinceLastRepeat = now - (inputState.lastKeyTime[key] + inputState.keyRepeatDelay);
            if (timeSinceLastRepeat >= inputState.keyRepeatRate) {
                processInput(action);
                inputState.lastKeyTime[key] = now - inputState.keyRepeatDelay;
            }
        }
    }
}

// Process individual input action
function processInput(action) {
    if (!gameState || !gameState.isPlaying) {
        return;
    }
    
    // Handle pause separately
    if (action === 'pause') {
        togglePause();
        return;
    }
    
    // Don't process game inputs while paused
    if (gameState.isPaused) {
        return;
    }
    
    // Validate and execute action
    switch (action) {
        case 'moveLeft':
            movePieceLeft();
            break;
            
        case 'moveRight':
            movePieceRight();
            break;
            
        case 'softDrop':
            softDrop();
            break;
            
        case 'hardDrop':
            hardDrop();
            break;
            
        case 'rotateClockwise':
            rotatePieceClockwise();
            break;
            
        case 'rotateCounterClockwise':
            rotatePieceCounterClockwise();
            break;
            
        case 'hold':
            holdCurrentPiece();
            break;
    }
    
    // Update UI after input
    if (typeof updateGameUI === 'function') {
        updateGameUI();
    }
}

// Toggle pause state
function togglePause() {
    if (!gameState || !gameState.isPlaying) {
        return;
    }
    
    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
        // Pause game
        if (typeof handlePauseGame === 'function') {
            handlePauseGame();
        }
    } else {
        // Resume game
        if (typeof handleResumeGame === 'function') {
            handleResumeGame();
        }
    }
}

// Validate move before executing
function canMove(dx, dy) {
    if (!gameState || !gameState.currentPiece) {
        return false;
    }
    
    return isValidPosition(gameState.currentPiece, dx, dy);
}

// Clear input state (useful when switching screens)
function clearInputState() {
    inputState.keys = {};
    inputState.lastKeyTime = {};
    inputState.inputBuffer = [];
}

// Export input functions
window.initializeInput = initializeInput;
window.processInputBuffer = processInputBuffer;
window.clearInputState = clearInputState;


// ============================================================================
// ASYNCHRONOUS MULTIPLAYER FEATURES
// ============================================================================

// Generate shareable score code
function generateScoreCode(score, playerName, mode, difficulty, lines, level) {
    const data = {
        s: score,
        n: playerName,
        m: mode,
        d: difficulty,
        l: lines,
        v: level,
        t: Date.now()
    };
    
    // Encode to base64
    const jsonString = JSON.stringify(data);
    const encoded = btoa(jsonString);
    
    return encoded;
}

// Decode score code
function decodeScoreCode(code) {
    try {
        const decoded = atob(code);
        const data = JSON.parse(decoded);
        
        return {
            score: data.s,
            playerName: data.n,
            mode: data.m,
            difficulty: data.d,
            lines: data.l,
            level: data.v,
            timestamp: data.t
        };
    } catch (error) {
        console.error('Invalid score code:', error);
        return null;
    }
}

// Load friend's score from URL parameter
function loadFriendScore() {
    const urlParams = new URLSearchParams(window.location.search);
    const scoreCode = urlParams.get('challenge');
    
    if (scoreCode) {
        const friendScore = decodeScoreCode(scoreCode);
        if (friendScore) {
            gameState.friendScore = friendScore;
            return friendScore;
        }
    }
    
    return null;
}

// Compare current score with friend's score
function getScoreComparison() {
    if (!gameState.friendScore) {
        return null;
    }
    
    const currentScore = gameState.score;
    const friendScore = gameState.friendScore.score;
    const difference = currentScore - friendScore;
    const percentage = friendScore > 0 ? ((currentScore / friendScore) * 100).toFixed(1) : 0;
    
    return {
        isBeatFriend: currentScore > friendScore,
        difference: Math.abs(difference),
        percentage: percentage,
        friendName: gameState.friendScore.playerName,
        friendScore: friendScore
    };
}

// Generate shareable URL with score code
function generateShareableURL(score, playerName, mode, difficulty, lines, level) {
    const scoreCode = generateScoreCode(score, playerName, mode, difficulty, lines, level);
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}?challenge=${scoreCode}`;
}

// Copy score URL to clipboard
function copyScoreToClipboard(score, playerName, mode, difficulty, lines, level) {
    const shareURL = generateShareableURL(score, playerName, mode, difficulty, lines, level);
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareURL).then(() => {
            showNotification('Challenge link copied to clipboard!', 'success');
            return true;
        }).catch(err => {
            console.error('Failed to copy:', err);
            showFallbackCopy(shareURL);
            return false;
        });
    } else {
        showFallbackCopy(shareURL);
    }
}

// Fallback copy method for older browsers
function showFallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Challenge link copied to clipboard!', 'success');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showNotification('Failed to copy. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textarea);
}

// Generate social sharing links
function generateSocialShareLinks(score, playerName, mode, difficulty) {
    const shareURL = generateShareableURL(score, playerName, mode, difficulty, gameState.lines, gameState.level);
    const shareText = `I scored ${score.toLocaleString()} points in Tetris ${mode} mode! Can you beat my score?`;
    
    return {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareURL)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`,
        generic: shareURL
    };
}

// Share score via Web Share API (if available)
function shareScoreNative(score, playerName, mode, difficulty) {
    if (navigator.share) {
        const shareURL = generateShareableURL(score, playerName, mode, difficulty, gameState.lines, gameState.level);
        const shareText = `I scored ${score.toLocaleString()} points in Tetris ${mode} mode! Can you beat my score?`;
        
        navigator.share({
            title: 'Tetris Challenge',
            text: shareText,
            url: shareURL
        }).then(() => {
            showNotification('Score shared successfully!', 'success');
        }).catch(err => {
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
            }
        });
    } else {
        // Fallback to copy to clipboard
        copyScoreToClipboard(score, playerName, mode, difficulty, gameState.lines, gameState.level);
    }
}

// Show notification message
function showNotification(message, type = 'info') {
    // This will be implemented in ui.js
    if (window.displayNotification && typeof window.displayNotification === 'function') {
        window.displayNotification(message, type);
    } else {
        console.log(`[${type}] ${message}`);
    }
}

// Export notification function
window.showNotification = showNotification;

// Export multiplayer functions
window.generateScoreCode = generateScoreCode;
window.decodeScoreCode = decodeScoreCode;
window.loadFriendScore = loadFriendScore;
window.getScoreComparison = getScoreComparison;
window.generateShareableURL = generateShareableURL;
window.copyScoreToClipboard = copyScoreToClipboard;
window.generateSocialShareLinks = generateSocialShareLinks;
window.shareScoreNative = shareScoreNative;


// ============================================================================
// GAME INITIALIZATION AND MAIN LOOP (Step 20)
// ============================================================================

// Initialize game on page load
function initializeGame() {
    // Initialize board
    initializeBoard();
    
    // Load saved preferences
    if (window.storageSystem) {
        const savedName = window.storageSystem.getPlayerName();
        if (savedName) {
            gameState.playerName = savedName;
        }
        
        const savedDifficulty = window.storageSystem.getDifficulty();
        if (savedDifficulty) {
            gameState.difficulty = savedDifficulty;
        }
        
        const savedMode = window.storageSystem.getLastMode();
        if (savedMode) {
            gameState.mode = savedMode;
        }
    }
    
    // Load high scores
    if (window.storageSystem && typeof window.storageSystem.loadHighScores === 'function') {
        window.storageSystem.loadHighScores();
    }
    
    // Load achievements
    loadAchievements();
    
    // Check for saved game state
    if (window.storageSystem && typeof window.storageSystem.hasSavedGame === 'function') {
        const hasSaved = window.storageSystem.hasSavedGame();
        if (hasSaved && typeof window.showResumeOption === 'function') {
            window.showResumeOption();
        }
    }
    
    // Initialize audio system
    if (window.audioSystem && typeof window.audioSystem.init === 'function') {
        window.audioSystem.init();
    }
    
    // Initialize renderer
    if (window.renderer && typeof window.renderer.initialize === 'function') {
        window.renderer.initialize();
    }
    
    // Initialize input handling
    initializeInput();
    
    // Load friend score from URL (multiplayer challenge)
    loadFriendScore();
    
    // Set initial game state
    gameState.isPlaying = false;
    gameState.isPaused = false;
    gameState.isGameOver = false;
}

// Start a new game
function startNewGame(playerName, difficulty, mode) {
    try {
        console.log('[game.js] ========================================');
        console.log('[game.js] startNewGame ENTRY - Version 2026-02-12-v3');
        console.log('[game.js] Parameters:', { playerName, difficulty, mode });
        console.log('[game.js] ========================================');
        
        // Save player preferences
        gameState.playerName = playerName || 'Player';
        gameState.difficulty = difficulty || 'medium';
        gameState.mode = mode || 'marathon';
        console.log('[game.js] ✓ Player preferences set');
        
        // Save preferences to storage
        if (window.storageSystem) {
            window.storageSystem.savePlayerName(playerName);
            window.storageSystem.saveDifficulty(difficulty);
            window.storageSystem.saveLastMode(mode);
            console.log('[game.js] ✓ Preferences saved to storage');
        }
        
        // Initialize game state
        console.log('[game.js] Calling initGame...');
        initGame();
        console.log('[game.js] ✓ initGame complete');
        
        // Mode-specific initialization (MUST be after initGame)
        if (mode === 'sprint') {
            // Sprint mode: clear 40 lines
            gameState.targetLines = 40;
            gameState.timer = 0;
            console.log('[game.js] ✓ Sprint mode: timer=0, targetLines=40');
        } else if (mode === 'ultra') {
            // Ultra mode: 3 minutes
            gameState.timer = 180; // 180 seconds
            console.log('[game.js] ✓ Ultra mode: timer=180 seconds');
        } else {
            // Marathon mode: endless
            gameState.timer = 0;
            console.log('[game.js] ✓ Marathon mode: timer=0');
        }
        
        // Initialize renderer
        console.log('[game.js] Initializing renderer...');
        if (window.renderer && typeof window.renderer.initialize === 'function') {
            const rendererSuccess = window.renderer.initialize();
            console.log('[game.js] Renderer initialization result:', rendererSuccess);
        } else {
            console.error('[game.js] ✗ Renderer not available');
        }
        
        // Set fall speed based on difficulty
        const diffSettings = DIFFICULTY_SETTINGS[gameState.difficulty];
        gameState.fallSpeed = diffSettings.initialSpeed;
        console.log('[game.js] ✓ Fall speed set:', gameState.fallSpeed);
        
        // Spawn first piece
        console.log('[game.js] Spawning first piece...');
        if (!spawnNewPiece()) {
            console.error('[game.js] ✗ Failed to spawn first piece');
            return false;
        }
        console.log('[game.js] ✓ First piece spawned successfully');
        
        // Set game as playing
        gameState.isPlaying = true;
        gameState.isPaused = false;
        gameState.isGameOver = false;
        gameState.lastMoveTime = Date.now();
        console.log('[game.js] ✓ Game state set to playing');
        
        // Show game screen
        console.log('[game.js] Showing game screen...');
        if (window.showScreen && typeof window.showScreen === 'function') {
            window.showScreen('gameScreen');
            console.log('[game.js] ✓ Game screen shown');
        } else {
            console.error('[game.js] ✗ showScreen function not available');
        }
        
        // Start background music
        if (window.audioSystem && typeof window.audioSystem.playMusic === 'function') {
            window.audioSystem.playMusic();
            console.log('[game.js] ✓ Background music started');
        }
        
        // Update UI with friend challenge if active
        if (window.updateGameUIWithChallenge && typeof window.updateGameUIWithChallenge === 'function') {
            window.updateGameUIWithChallenge();
        }
        
        // Start game loop
        console.log('[game.js] Starting game loop...');
        requestAnimationFrame(gameLoop);
        console.log('[game.js] ========================================');
        console.log('[game.js] startNewGame COMPLETE - SUCCESS');
        console.log('[game.js] ========================================');
        
        return true;
    } catch (error) {
        console.error('[game.js] ========================================');
        console.error('[game.js] FATAL ERROR in startNewGame:');
        console.error('[game.js] Error message:', error.message);
        console.error('[game.js] Error stack:', error.stack);
        console.error('[game.js] ========================================');
        return false;
    }
}
console.log('startNewGame function defined:', typeof startNewGame);

// Resume saved game
function resumeSavedGame() {
    if (!window.storageSystem || typeof window.storageSystem.loadGameState !== 'function') {
        console.error('Storage system not available');
        return false;
    }
    
    const savedState = window.storageSystem.loadGameState();
    if (!savedState) {
        console.error('No saved game found');
        return false;
    }
    
    // Restore game state
    Object.assign(gameState, savedState);
    
    // Restore board
    if (savedState.board) {
        gameState.board = savedState.board;
    }
    
    // Restore current piece
    if (savedState.currentPiece) {
        gameState.currentPiece = new Tetromino(savedState.currentPiece.type);
        gameState.currentPiece.x = savedState.currentPiece.x;
        gameState.currentPiece.y = savedState.currentPiece.y;
        gameState.currentPiece.rotation = savedState.currentPiece.rotation;
    }
    
    // Restore next pieces
    if (savedState.nextPieces) {
        gameState.nextPieces = savedState.nextPieces.map(p => {
            const piece = new Tetromino(p.type);
            return piece;
        });
    }
    
    // Restore hold piece
    if (savedState.holdPiece) {
        gameState.holdPiece = new Tetromino(savedState.holdPiece.type);
    }
    
    // Set game as playing
    gameState.isPlaying = true;
    gameState.isPaused = false;
    gameState.lastMoveTime = Date.now();
    
    // Show game screen
    if (window.showScreen && typeof window.showScreen === 'function') {
        window.showScreen('gameScreen');
    }
    
    // Start background music
    if (window.audioSystem && typeof window.audioSystem.playMusic === 'function') {
        window.audioSystem.playMusic();
    }
    
    // Update UI
    if (window.updateGameUIWithChallenge && typeof window.updateGameUIWithChallenge === 'function') {
        window.updateGameUIWithChallenge();
    }
    
    // Start game loop
    requestAnimationFrame(gameLoop);
    
    return true;
}

// Main game loop
let lastFrameTime = 0;

let gameLoopCount = 0;
function gameLoop(timestamp) {
    gameLoopCount++;
    if (gameLoopCount === 1) {
        console.log('[game.js] Game loop started - first frame');
    }
    if (gameLoopCount % 60 === 0) {
        console.log('[game.js] Game loop running - frame', gameLoopCount);
    }
    
    // Calculate delta time
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    
    // Only update if game is playing and not paused
    if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
        // Apply gravity (auto-fall)
        applyGravity();
        
        // Update game mode timer
        updateGameMode(deltaTime / 1000); // Convert to seconds
        
        // Process input buffer (key repeats)
        processInputBuffer();
        
        // Update power-ups
        updatePowerups(deltaTime / 1000);
        
        // Check achievements
        checkAchievements();
        
        // Render frame
        if (window.renderer && typeof window.renderer.renderWithEffects === 'function') {
            window.renderer.renderWithEffects(timestamp);
        } else {
            if (gameLoopCount === 1) {
                console.error('[game.js] renderer.renderWithEffects not available');
            }
        }
        
        // Update UI
        if (window.updateGameUIWithChallenge && typeof window.updateGameUIWithChallenge === 'function') {
            window.updateGameUIWithChallenge();
        }
        
        // Save game state periodically (every 5 seconds)
        if (timestamp % 5000 < deltaTime) {
            saveGameState();
        }
    }
    
    // Continue game loop if still playing
    if (gameState.isPlaying && !gameState.isGameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        if (gameLoopCount === 1) {
            console.error('[game.js] Game loop stopped - isPlaying:', gameState.isPlaying, 'isGameOver:', gameState.isGameOver);
        }
    }
}

// Save current game state
function saveGameState() {
    if (!window.storageSystem || typeof window.storageSystem.saveGameState !== 'function') {
        return;
    }
    
    const stateToSave = {
        board: gameState.board,
        currentPiece: gameState.currentPiece ? {
            type: gameState.currentPiece.type,
            x: gameState.currentPiece.x,
            y: gameState.currentPiece.y,
            rotation: gameState.currentPiece.rotation
        } : null,
        nextPieces: gameState.nextPieces.map(p => ({ type: p.type })),
        holdPiece: gameState.holdPiece ? { type: gameState.holdPiece.type } : null,
        canHold: gameState.canHold,
        score: gameState.score,
        level: gameState.level,
        lines: gameState.lines,
        combo: gameState.combo,
        backToBack: gameState.backToBack,
        mode: gameState.mode,
        difficulty: gameState.difficulty,
        timer: gameState.timer,
        playerName: gameState.playerName,
        activePowerups: gameState.activePowerups,
        achievementsProgress: gameState.achievementsProgress
    };
    
    window.storageSystem.saveGameState(stateToSave);
}

// Handle game start from UI
function handleGameStart(playerName, difficulty, mode) {
    return startNewGame(playerName, difficulty, mode);
}

// Handle pause game
function handlePauseGame() {
    if (!gameState.isPlaying || gameState.isGameOver) return;
    
    gameState.isPaused = true;
    
    // Pause audio
    if (window.audioSystem && typeof window.audioSystem.pauseMusic === 'function') {
        window.audioSystem.pauseMusic();
    }
    
    // Show pause overlay
    if (window.showPauseOverlay && typeof window.showPauseOverlay === 'function') {
        window.showPauseOverlay();
    }
    
    // Save game state
    saveGameState();
}

// Handle resume game
function handleResumeGame() {
    if (!gameState.isPlaying || !gameState.isPaused) return;
    
    gameState.isPaused = false;
    gameState.lastMoveTime = Date.now();
    
    // Resume audio
    if (window.audioSystem && typeof window.audioSystem.resumeMusic === 'function') {
        window.audioSystem.resumeMusic();
    }
    
    // Hide pause overlay
    if (window.hidePauseOverlay && typeof window.hidePauseOverlay === 'function') {
        window.hidePauseOverlay();
    }
    
    // Restart game loop
    requestAnimationFrame(gameLoop);
}

// Handle game over
function handleGameOver() {
    gameState.isGameOver = true;
    gameState.isPlaying = false;
    
    // Stop audio
    if (window.audioSystem && typeof window.audioSystem.stopMusic === 'function') {
        window.audioSystem.stopMusic();
    }
    
    // Play game over sound
    if (window.audioSystem && typeof window.audioSystem.playGameOver === 'function') {
        window.audioSystem.playGameOver();
    }
    
    // Save final score
    if (window.storageSystem && typeof window.storageSystem.saveHighScore === 'function') {
        window.storageSystem.saveHighScore(
            gameState.score,
            gameState.playerName,
            gameState.mode,
            gameState.difficulty,
            gameState.lines,
            gameState.level
        );
    }
    
    // Clear saved game
    if (window.storageSystem && typeof window.storageSystem.clearSavedGame === 'function') {
        window.storageSystem.clearSavedGame();
    }
    
    // Check final achievements
    checkAchievements();
    
    // Show game over screen
    if (window.showGameOver && typeof window.showGameOver === 'function') {
        window.showGameOver(gameState.score, gameState.lines, gameState.level, gameState.mode, gameState.difficulty);
    }
}

// Stop game (quit to menu)
function stopGame() {
    gameState.isPlaying = false;
    gameState.isPaused = false;
    
    // Stop audio
    if (window.audioSystem && typeof window.audioSystem.stopMusic === 'function') {
        window.audioSystem.stopMusic();
    }
    
    // Save game state before quitting
    saveGameState();
    
    // Clear input state
    clearInputState();
}

// ============================================================================
// EXPORT FUNCTIONS TO WINDOW (IMMEDIATELY - AT END OF FILE)
// ============================================================================
console.log('[game.js] Reached export section - about to export functions...');
// Export functions immediately so they're available when ui.js loads
console.log('About to export - startNewGame type:', typeof startNewGame);
window.gameState = gameState;
window.BOARD_WIDTH = BOARD_WIDTH;
window.BOARD_HEIGHT = BOARD_HEIGHT;
window.BLOCK_SIZE = BLOCK_SIZE;
window.initializeGame = initializeGame;
window.startNewGame = startNewGame;
window.resumeSavedGame = resumeSavedGame;
window.gameLoop = gameLoop;
window.handleGameStart = handleGameStart;
window.handlePauseGame = handlePauseGame;
window.handleResumeGame = handleResumeGame;
window.handleGameOver = handleGameOver;
window.stopGame = stopGame;
window.saveGameState = saveGameState;
console.log('After export - window.startNewGame type:', typeof window.startNewGame);

// Set a flag to indicate game.js is fully loaded
window.gameJsLoaded = true;
console.log('game.js fully loaded and exported');

// ============================================================================
// INITIALIZE GAME
// ============================================================================
// Initialize game when DOM is ready (wrapped in try-catch to prevent blocking exports)
try {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeGame);
    } else {
        initializeGame();
    }
} catch (error) {
    console.error('Error during game initialization:', error);
    // Don't let initialization errors prevent the game from being playable
}

console.log('game.js loaded - startNewGame available:', typeof window.startNewGame);
