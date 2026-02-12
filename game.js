// Flappy Bird Game - Main JavaScript File

// Game Constants
const GRAVITY = 0.25;
const FLAP_FORCE = -6;
const PIPE_SPEED = 1.5;
const PIPE_GAP = 200;
const PIPE_WIDTH = 60;
const PIPE_SPAWN_INTERVAL = 150; // frames between pipes
const BIRD_SIZE = 30;
const GROUND_HEIGHT = 50;

// Game States
const GameState = {
    START: 'START',
    PLAYING: 'PLAYING',
    GAME_OVER: 'GAME_OVER'
};

// Canvas and Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreDisplay = document.getElementById('scoreDisplay');
const currentScoreElement = document.getElementById('currentScore');
const finalScoreElement = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const backgroundMusic = document.getElementById('backgroundMusic');

// Game Variables
let gameState = GameState.START;
let score = 0;
let frameCount = 0;
let bird = null;
let pipes = [];
let canvasWidth = 400;
let canvasHeight = 600;

// Initialize Canvas Size
function initCanvas() {
    // Set canvas size based on viewport
    const maxWidth = Math.min(window.innerWidth - 40, 400);
    const maxHeight = Math.min(window.innerHeight - 40, 600);
    
    canvasWidth = maxWidth;
    canvasHeight = maxHeight;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

// Bird Object
class Bird {
    constructor() {
        this.x = canvasWidth / 4;
        this.y = canvasHeight / 2;
        this.velocity = 0;
        this.size = BIRD_SIZE;
    }
    
    update() {
        // Apply gravity
        this.velocity += GRAVITY;
        this.y += this.velocity;
        
        // Prevent bird from going above canvas
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }
    
    flap() {
        this.velocity = FLAP_FORCE;
    }
    
    draw() {
        // Draw bird as a circle with flat design
        ctx.fillStyle = '#FFD700'; // Yellow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + 5, this.y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw beak
        ctx.fillStyle = '#FF6347'; // Tomato red
        ctx.beginPath();
        ctx.moveTo(this.x + this.size / 2, this.y);
        ctx.lineTo(this.x + this.size / 2 + 10, this.y - 3);
        ctx.lineTo(this.x + this.size / 2 + 10, this.y + 3);
        ctx.closePath();
        ctx.fill();
    }
    
    checkCollision() {
        // Check ground collision
        if (this.y + this.size / 2 >= canvasHeight - GROUND_HEIGHT) {
            return true;
        }
        
        // Check ceiling collision
        if (this.y - this.size / 2 <= 0) {
            return true;
        }
        
        // Check pipe collisions
        for (let pipe of pipes) {
            if (this.x + this.size / 2 > pipe.x && 
                this.x - this.size / 2 < pipe.x + PIPE_WIDTH) {
                // Bird is horizontally aligned with pipe
                if (this.y - this.size / 2 < pipe.topHeight || 
                    this.y + this.size / 2 > pipe.topHeight + PIPE_GAP) {
                    return true;
                }
            }
        }
        
        return false;
    }
}

// Pipe Object
class Pipe {
    constructor() {
        this.x = canvasWidth;
        this.width = PIPE_WIDTH;
        // Random gap position (leaving space from top and bottom)
        const minGapTop = 100;
        const maxGapTop = canvasHeight - GROUND_HEIGHT - PIPE_GAP - 100;
        this.topHeight = Math.random() * (maxGapTop - minGapTop) + minGapTop;
        this.scored = false;
    }
    
    update() {
        this.x -= PIPE_SPEED;
    }
    
    draw() {
        // Draw top pipe
        ctx.fillStyle = '#4CAF50'; // Green
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        
        // Draw pipe cap (top)
        ctx.fillStyle = '#45A049'; // Darker green
        ctx.fillRect(this.x - 5, this.topHeight - 20, this.width + 10, 20);
        
        // Draw bottom pipe
        const bottomPipeY = this.topHeight + PIPE_GAP;
        const bottomPipeHeight = canvasHeight - GROUND_HEIGHT - bottomPipeY;
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.x, bottomPipeY, this.width, bottomPipeHeight);
        
        // Draw pipe cap (bottom)
        ctx.fillStyle = '#45A049';
        ctx.fillRect(this.x - 5, bottomPipeY, this.width + 10, 20);
    }
    
    isOffScreen() {
        return this.x + this.width < 0;
    }
    
    checkScore(bird) {
        if (!this.scored && bird.x > this.x + this.width) {
            this.scored = true;
            return true;
        }
        return false;
    }
}

// Game Functions

function initGame() {
    initCanvas();
    bird = new Bird();
    pipes = [];
    score = 0;
    frameCount = 0;
    updateScore();
}

function startGame() {
    gameState = GameState.PLAYING;
    startScreen.classList.add('hidden');
    scoreDisplay.classList.remove('hidden');
    
    // Start background music
    backgroundMusic.play().catch(err => {
        console.log('Audio playback failed:', err);
    });
    
    gameLoop();
}

function gameOver() {
    gameState = GameState.GAME_OVER;
    scoreDisplay.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
    
    // Stop background music
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function restartGame() {
    gameOverScreen.classList.add('hidden');
    initGame();
    startGame();
}

function updateScore() {
    currentScoreElement.textContent = score;
}

function spawnPipe() {
    pipes.push(new Pipe());
}

function updatePipes() {
    // Update existing pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        
        // Check if pipe scored
        if (pipes[i].checkScore(bird)) {
            score++;
            updateScore();
        }
        
        // Remove off-screen pipes
        if (pipes[i].isOffScreen()) {
            pipes.splice(i, 1);
        }
    }
    
    // Spawn new pipes
    if (frameCount % PIPE_SPAWN_INTERVAL === 0) {
        spawnPipe();
    }
}

function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawGround() {
    // Ground
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fillRect(0, canvasHeight - GROUND_HEIGHT, canvasWidth, GROUND_HEIGHT);
    
    // Grass on top of ground
    ctx.fillStyle = '#228B22'; // Forest green
    ctx.fillRect(0, canvasHeight - GROUND_HEIGHT, canvasWidth, 10);
}

function gameLoop() {
    if (gameState !== GameState.PLAYING) {
        return;
    }
    
    frameCount++;
    
    // Update game objects
    bird.update();
    updatePipes();
    
    // Check collisions
    if (bird.checkCollision()) {
        gameOver();
        return;
    }
    
    // Draw everything
    drawBackground();
    
    // Draw pipes
    for (let pipe of pipes) {
        pipe.draw();
    }
    
    // Draw ground
    drawGround();
    
    // Draw bird
    bird.draw();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Event Listeners

// Start button click
startButton.addEventListener('click', () => {
    initGame();
    startGame();
});

// Restart button click
restartButton.addEventListener('click', restartGame);

// Spacebar and click controls
function handleInput() {
    if (gameState === GameState.PLAYING) {
        bird.flap();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        handleInput();
    }
});

canvas.addEventListener('click', handleInput);

// Window resize handler
window.addEventListener('resize', () => {
    if (gameState === GameState.START) {
        initCanvas();
    }
});

// Initialize on load
window.addEventListener('load', () => {
    initCanvas();
});
