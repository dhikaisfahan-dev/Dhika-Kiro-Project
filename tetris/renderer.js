// ============================================================================
// TETRIS GAME - Canvas Rendering System
// ============================================================================

// ============================================================================
// CANVAS INITIALIZATION
// ============================================================================

let canvas = null;
let ctx = null;
let scale = 1;

function initializeCanvas() {
    console.log('[renderer.js] initializeCanvas called');
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('[renderer.js] Canvas element not found');
        return false;
    }
    console.log('[renderer.js] Canvas found:', canvas);
    
    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('[renderer.js] Failed to get 2D context');
        return false;
    }
    console.log('[renderer.js] Canvas context obtained');
    
    // Set canvas size
    resizeCanvas();
    console.log('[renderer.js] Canvas resized to:', canvas.width, 'x', canvas.height);
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    console.log('[renderer.js] Canvas initialization complete');
    return true;
}

function resizeCanvas() {
    if (!canvas) return;
    
    console.log('[renderer.js] resizeCanvas called');
    
    // Get container dimensions
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    console.log('[renderer.js] Container dimensions:', containerWidth, 'x', containerHeight);
    
    // If container has no size, use fixed dimensions
    if (containerWidth === 0 || containerHeight === 0) {
        console.warn('[renderer.js] Container has no size, using fixed dimensions');
        canvas.width = 300;
        canvas.height = 600;
        scale = 1;
        console.log('[renderer.js] Canvas resized to:', canvas.width, 'x', canvas.height);
        return;
    }
    
    // Calculate optimal size based on container
    const boardPixelWidth = window.BOARD_WIDTH * window.BLOCK_SIZE;
    const boardPixelHeight = window.BOARD_HEIGHT * window.BLOCK_SIZE;
    
    const scaleX = containerWidth / boardPixelWidth;
    const scaleY = containerHeight / boardPixelHeight;
    
    scale = Math.min(scaleX, scaleY, 2); // Max 2x scale
    
    // Set canvas dimensions
    canvas.width = boardPixelWidth * scale;
    canvas.height = boardPixelHeight * scale;
    
    console.log('[renderer.js] Canvas resized to:', canvas.width, 'x', canvas.height);
    
    // Apply scaling to context
    if (ctx) {
        ctx.scale(scale, scale);
    }
}

// ============================================================================
// COLOR PALETTE
// ============================================================================

// Get current theme colors
function getThemeColors() {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    
    return {
        background: style.getPropertyValue('--board-bg').trim(),
        grid: style.getPropertyValue('--grid-color').trim(),
        ghost: 'rgba(255, 255, 255, 0.2)'
    };
}

// ============================================================================
// BOARD RENDERING
// ============================================================================

function renderBoard() {
    if (!ctx || !gameState.board) return;
    
    const colors = getThemeColors();
    
    // Clear canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, window.BOARD_WIDTH * window.BLOCK_SIZE, window.BOARD_HEIGHT * window.BLOCK_SIZE);
    
    // Draw grid
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    
    for (let y = 0; y <= window.BOARD_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * window.BLOCK_SIZE);
        ctx.lineTo(window.BOARD_WIDTH * window.BLOCK_SIZE, y * window.BLOCK_SIZE);
        ctx.stroke();
    }
    
    for (let x = 0; x <= window.BOARD_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * window.BLOCK_SIZE, 0);
        ctx.lineTo(x * window.BLOCK_SIZE, window.BOARD_HEIGHT * window.BLOCK_SIZE);
        ctx.stroke();
    }
    
    // Render placed pieces
    for (let y = 0; y < window.BOARD_HEIGHT; y++) {
        for (let x = 0; x < window.BOARD_WIDTH; x++) {
            if (gameState.board[y][x]) {
                renderBlock(x, y, gameState.board[y][x]);
            }
        }
    }
}

// ============================================================================
// BLOCK RENDERING
// ============================================================================

function renderBlock(x, y, color, alpha = 1.0) {
    if (!ctx) return;
    
    const pixelX = x * window.BLOCK_SIZE;
    const pixelY = y * window.BLOCK_SIZE;
    
    // Draw block with gradient
    const gradient = ctx.createLinearGradient(
        pixelX, pixelY,
        pixelX + window.BLOCK_SIZE, pixelY + window.BLOCK_SIZE
    );
    
    // Adjust color alpha
    const rgbaColor = hexToRgba(color, alpha);
    const lighterColor = lightenColor(color, 20, alpha);
    const darkerColor = darkenColor(color, 20, alpha);
    
    gradient.addColorStop(0, lighterColor);
    gradient.addColorStop(0.5, rgbaColor);
    gradient.addColorStop(1, darkerColor);
    
    // Fill block
    ctx.fillStyle = gradient;
    ctx.fillRect(pixelX + 1, pixelY + 1, window.BLOCK_SIZE - 2, window.BLOCK_SIZE - 2);
    
    // Add highlight
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * alpha})`;
    ctx.fillRect(pixelX + 2, pixelY + 2, window.BLOCK_SIZE - 4, 3);
    
    // Add shadow
    ctx.fillStyle = `rgba(0, 0, 0, ${0.3 * alpha})`;
    ctx.fillRect(pixelX + 2, pixelY + window.BLOCK_SIZE - 5, window.BLOCK_SIZE - 4, 3);
}

// ============================================================================
// PIECE RENDERING
// ============================================================================

function renderCurrentPiece() {
    if (!ctx || !gameState.currentPiece) return;
    
    const blocks = gameState.currentPiece.getBlocks();
    const color = getPieceColor(gameState.currentPiece.type);
    
    for (const block of blocks) {
        if (block.y >= 0) {
            renderBlock(block.x, block.y, color);
        }
    }
}

// ============================================================================
// GHOST PIECE RENDERING
// ============================================================================

function renderGhostPiece() {
    if (!ctx || !gameState.currentPiece) return;
    
    const blocks = gameState.currentPiece.getBlocks();
    const ghostOffset = gameState.ghostY - gameState.currentPiece.y;
    const color = getPieceColor(gameState.currentPiece.type);
    
    for (const block of blocks) {
        const ghostY = block.y + ghostOffset;
        if (ghostY >= 0) {
            renderBlock(block.x, ghostY, color, 0.3);
        }
    }
}

// ============================================================================
// PREVIEW RENDERING
// ============================================================================

function renderNextPiece(piece, canvasId) {
    const previewCanvas = document.getElementById(canvasId);
    if (!previewCanvas || !piece) return;
    
    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) return;
    
    // Clear canvas
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    // Get piece blocks
    const blocks = [];
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                blocks.push({ x, y });
            }
        }
    }
    
    // Calculate centering offset
    const minX = Math.min(...blocks.map(b => b.x));
    const maxX = Math.max(...blocks.map(b => b.x));
    const minY = Math.min(...blocks.map(b => b.y));
    const maxY = Math.max(...blocks.map(b => b.y));
    
    const pieceWidth = maxX - minX + 1;
    const pieceHeight = maxY - minY + 1;
    
    const offsetX = (4 - pieceWidth) / 2 - minX;
    const offsetY = (4 - pieceHeight) / 2 - minY;
    
    // Render blocks
    const blockSize = previewCanvas.width / 4;
    const color = getPieceColor(piece.type);
    
    for (const block of blocks) {
        const x = (block.x + offsetX) * blockSize;
        const y = (block.y + offsetY) * blockSize;
        
        // Draw block
        const gradient = previewCtx.createLinearGradient(x, y, x + blockSize, y + blockSize);
        const lighterColor = lightenColor(color, 20);
        const darkerColor = darkenColor(color, 20);
        
        gradient.addColorStop(0, lighterColor);
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, darkerColor);
        
        previewCtx.fillStyle = gradient;
        previewCtx.fillRect(x + 1, y + 1, blockSize - 2, blockSize - 2);
        
        // Add highlight
        previewCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        previewCtx.fillRect(x + 2, y + 2, blockSize - 4, 2);
    }
}

function renderHoldPiece() {
    if (!gameState.holdPiece) {
        const holdCanvas = document.getElementById('hold-canvas');
        if (holdCanvas) {
            const holdCtx = holdCanvas.getContext('2d');
            if (holdCtx) {
                holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
            }
        }
        return;
    }
    
    renderNextPiece(gameState.holdPiece, 'hold-canvas');
}

// ============================================================================
// MAIN RENDER FUNCTION
// ============================================================================

function render() {
    if (!ctx) return;
    
    // Render board and grid
    renderBoard();
    
    // Render ghost piece (behind current piece)
    renderGhostPiece();
    
    // Render current piece
    renderCurrentPiece();
    
    // Render preview pieces
    if (gameState.nextPieces.length > 0) {
        renderNextPiece(gameState.nextPieces[0], 'next-canvas');
    }
    
    renderHoldPiece();
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

function hexToRgba(hex, alpha = 1.0) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lightenColor(hex, percent, alpha = 1.0) {
    hex = hex.replace('#', '');
    
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    r = Math.min(255, r + Math.floor((255 - r) * (percent / 100)));
    g = Math.min(255, g + Math.floor((255 - g) * (percent / 100)));
    b = Math.min(255, b + Math.floor((255 - b) * (percent / 100)));
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function darkenColor(hex, percent, alpha = 1.0) {
    hex = hex.replace('#', '');
    
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    r = Math.max(0, r - Math.floor(r * (percent / 100)));
    g = Math.max(0, g - Math.floor(g * (percent / 100)));
    b = Math.max(0, b - Math.floor(b * (percent / 100)));
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================================
// ANIMATION EFFECTS
// ============================================================================

// Animation state
const animations = {
    lineClear: [],
    particles: [],
    screenShake: { active: false, intensity: 0, duration: 0, elapsed: 0 },
    flash: { active: false, alpha: 0 }
};

// ============================================================================
// LINE CLEAR ANIMATION
// ============================================================================

function startLineClearAnimation(lines) {
    // Add lines to animation queue
    for (const lineIndex of lines) {
        animations.lineClear.push({
            y: lineIndex,
            phase: 'flash',
            elapsed: 0,
            duration: 200, // Flash for 200ms
            alpha: 1.0
        });
    }
}

function updateLineClearAnimations(deltaTime) {
    for (let i = animations.lineClear.length - 1; i >= 0; i--) {
        const anim = animations.lineClear[i];
        anim.elapsed += deltaTime;
        
        if (anim.phase === 'flash') {
            // Flash effect
            anim.alpha = 1.0 - (anim.elapsed / anim.duration);
            
            if (anim.elapsed >= anim.duration) {
                anim.phase = 'fadeout';
                anim.elapsed = 0;
                anim.duration = 300; // Fade out for 300ms
            }
        } else if (anim.phase === 'fadeout') {
            // Fade out effect
            anim.alpha = 1.0 - (anim.elapsed / anim.duration);
            
            if (anim.elapsed >= anim.duration) {
                // Animation complete
                animations.lineClear.splice(i, 1);
            }
        }
    }
}

function renderLineClearAnimations() {
    if (!ctx) return;
    
    for (const anim of animations.lineClear) {
        const y = anim.y * window.BLOCK_SIZE;
        
        if (anim.phase === 'flash') {
            // White flash
            ctx.fillStyle = `rgba(255, 255, 255, ${anim.alpha * 0.8})`;
            ctx.fillRect(0, y, window.BOARD_WIDTH * window.BLOCK_SIZE, window.BLOCK_SIZE);
        } else if (anim.phase === 'fadeout') {
            // Fade out the line
            for (let x = 0; x < window.BOARD_WIDTH; x++) {
                if (gameState.board[anim.y] && gameState.board[anim.y][x]) {
                    renderBlock(x, anim.y, gameState.board[anim.y][x], anim.alpha);
                }
            }
        }
    }
}

// ============================================================================
// PARTICLE EFFECTS
// ============================================================================

class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.life = 1.0;
        this.size = Math.random() * 4 + 2;
        this.gravity = 0.2;
    }
    
    update(deltaTime) {
        const dt = deltaTime / 16.67; // Normalize to 60 FPS
        
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
        this.velocity.y += this.gravity * dt;
        this.life -= 0.02 * dt;
        
        return this.life > 0;
    }
    
    render(ctx) {
        ctx.fillStyle = hexToRgba(this.color, this.life);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles(x, y, color, count = 20) {
    const centerX = x * window.BLOCK_SIZE + window.BLOCK_SIZE / 2;
    const centerY = y * window.BLOCK_SIZE + window.BLOCK_SIZE / 2;
    
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 3 + 2;
        
        const particle = new Particle(
            centerX,
            centerY,
            color,
            {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed - 2
            }
        );
        
        animations.particles.push(particle);
    }
}

function createTetrisParticles(lines) {
    // Create particles for Tetris clear (4 lines)
    for (const lineY of lines) {
        for (let x = 0; x < window.BOARD_WIDTH; x++) {
            if (gameState.board[lineY] && gameState.board[lineY][x]) {
                createParticles(x, lineY, gameState.board[lineY][x], 10);
            }
        }
    }
}

function createTSpinParticles(x, y) {
    // Create special particles for T-spin
    const colors = ['#FF00FF', '#00FFFF', '#FFFF00'];
    
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 3;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const particle = new Particle(
            x * window.BLOCK_SIZE + window.BLOCK_SIZE / 2,
            y * window.BLOCK_SIZE + window.BLOCK_SIZE / 2,
            color,
            {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed - 3
            }
        );
        
        animations.particles.push(particle);
    }
}

function createPowerUpParticles(x, y, color) {
    // Create particles for power-up collection
    for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        
        const particle = new Particle(
            x * window.BLOCK_SIZE + window.BLOCK_SIZE / 2,
            y * window.BLOCK_SIZE + window.BLOCK_SIZE / 2,
            color,
            {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed - 4
            }
        );
        
        animations.particles.push(particle);
    }
}

function createAchievementParticles() {
    // Create particles across the screen for achievement unlock
    const colors = ['#FFD700', '#FFA500', '#FF6347'];
    
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * window.BOARD_WIDTH * window.BLOCK_SIZE;
        const y = Math.random() * window.BOARD_HEIGHT * window.BLOCK_SIZE;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const particle = new Particle(x, y, color, {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed - 2
        });
        
        animations.particles.push(particle);
    }
}

function updateParticles(deltaTime) {
    for (let i = animations.particles.length - 1; i >= 0; i--) {
        const particle = animations.particles[i];
        
        if (!particle.update(deltaTime)) {
            animations.particles.splice(i, 1);
        }
    }
}

function renderParticles() {
    if (!ctx) return;
    
    for (const particle of animations.particles) {
        particle.render(ctx);
    }
}

// ============================================================================
// SCREEN SHAKE EFFECT
// ============================================================================

function startScreenShake(intensity = 5, duration = 300) {
    animations.screenShake = {
        active: true,
        intensity: intensity,
        duration: duration,
        elapsed: 0
    };
}

function updateScreenShake(deltaTime) {
    if (!animations.screenShake.active) return;
    
    animations.screenShake.elapsed += deltaTime;
    
    if (animations.screenShake.elapsed >= animations.screenShake.duration) {
        animations.screenShake.active = false;
        // Reset canvas transform
        if (ctx) {
            ctx.setTransform(scale, 0, 0, scale, 0, 0);
        }
    }
}

function applyScreenShake() {
    if (!ctx || !animations.screenShake.active) return;
    
    const progress = animations.screenShake.elapsed / animations.screenShake.duration;
    const intensity = animations.screenShake.intensity * (1 - progress);
    
    const offsetX = (Math.random() - 0.5) * intensity;
    const offsetY = (Math.random() - 0.5) * intensity;
    
    ctx.setTransform(scale, 0, 0, scale, offsetX * scale, offsetY * scale);
}

// ============================================================================
// PIECE PLACEMENT FLASH
// ============================================================================

function startPlacementFlash() {
    animations.flash = {
        active: true,
        alpha: 0.5
    };
}

function updatePlacementFlash(deltaTime) {
    if (!animations.flash.active) return;
    
    animations.flash.alpha -= 0.05 * (deltaTime / 16.67);
    
    if (animations.flash.alpha <= 0) {
        animations.flash.active = false;
    }
}

function renderPlacementFlash() {
    if (!ctx || !animations.flash.active) return;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${animations.flash.alpha})`;
    ctx.fillRect(0, 0, window.BOARD_WIDTH * window.BLOCK_SIZE, window.BOARD_HEIGHT * window.BLOCK_SIZE);
}

// ============================================================================
// COMBO VISUAL FEEDBACK
// ============================================================================

function renderComboFeedback() {
    if (!ctx || gameState.combo <= 1) return;
    
    // Render combo text on canvas
    ctx.save();
    
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Combo text with glow effect
    const text = `${gameState.combo}x COMBO!`;
    const x = (window.BOARD_WIDTH * window.BLOCK_SIZE) / 2;
    const y = window.BLOCK_SIZE * 2;
    
    // Glow
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FFD700';
    ctx.fillText(text, x, y);
    
    // Main text
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, x, y);
    
    ctx.restore();
}

// ============================================================================
// POWER-UP VISUAL INDICATORS
// ============================================================================

function renderPowerUpIndicators() {
    if (!ctx || !gameState.activePowerUps || gameState.activePowerUps.length === 0) return;
    
    ctx.save();
    
    let yOffset = window.BLOCK_SIZE;
    
    for (const powerUp of gameState.activePowerUps) {
        // Render power-up icon/text
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#00FF00';
        
        let text = '';
        switch (powerUp.type) {
            case POWER_UP_TYPES.SLOW_TIME:
                text = `⏱️ Slow Time: ${Math.ceil(powerUp.duration / 1000)}s`;
                break;
            case POWER_UP_TYPES.GHOST_MODE:
                text = `👻 Ghost Mode: ${powerUp.remaining} pieces`;
                break;
            default:
                text = `⚡ ${powerUp.type}`;
        }
        
        ctx.fillText(text, window.BLOCK_SIZE / 2, yOffset);
        yOffset += 20;
    }
    
    ctx.restore();
}

// ============================================================================
// THEME-BASED RENDERING
// ============================================================================

function applyThemeEffects() {
    if (!ctx) return;
    
    // Get current theme from CSS
    const theme = document.documentElement.getAttribute('data-theme') || 'classic';
    
    // Apply theme-specific effects
    switch (theme) {
        case 'neon':
            // Add glow effect for neon theme
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
            break;
        case 'ocean':
            // Add subtle wave effect (could be animated)
            break;
        case 'sunset':
            // Add warm glow
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(255, 100, 0, 0.3)';
            break;
        case 'dark':
            // High contrast, no special effects
            ctx.shadowBlur = 0;
            break;
        default:
            // Classic theme, no special effects
            ctx.shadowBlur = 0;
    }
}

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================

let rendererLastFrameTime = 0;
let fps = 60;
let frameCount = 0;
let fpsUpdateTime = 0;

function updateFPS(currentTime) {
    frameCount++;
    
    if (currentTime - fpsUpdateTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        fpsUpdateTime = currentTime;
    }
}

function renderFPS() {
    if (!ctx) return;
    
    ctx.save();
    ctx.font = '12px monospace';
    ctx.fillStyle = '#00FF00';
    ctx.textAlign = 'right';
    ctx.fillText(`FPS: ${fps}`, window.BOARD_WIDTH * window.BLOCK_SIZE - 5, 15);
    ctx.restore();
}

// ============================================================================
// ENHANCED MAIN RENDER FUNCTION
// ============================================================================

function renderWithEffects(currentTime = 0) {
    if (!ctx) return;
    
    // Calculate delta time
    const deltaTime = currentTime - rendererLastFrameTime;
    rendererLastFrameTime = currentTime;
    
    // Update FPS counter
    updateFPS(currentTime);
    
    // Update animations
    updateLineClearAnimations(deltaTime);
    updateParticles(deltaTime);
    updateScreenShake(deltaTime);
    updatePlacementFlash(deltaTime);
    
    // Apply screen shake transform
    applyScreenShake();
    
    // Apply theme effects
    applyThemeEffects();
    
    // Render board and grid
    renderBoard();
    
    // Render line clear animations
    renderLineClearAnimations();
    
    // Render ghost piece (behind current piece)
    renderGhostPiece();
    
    // Render current piece
    renderCurrentPiece();
    
    // Render particles
    renderParticles();
    
    // Render placement flash
    renderPlacementFlash();
    
    // Render combo feedback
    renderComboFeedback();
    
    // Render power-up indicators
    renderPowerUpIndicators();
    
    // Render preview pieces
    if (gameState.nextPieces && gameState.nextPieces.length > 0) {
        renderNextPiece(gameState.nextPieces[0], 'next-canvas');
    }
    
    renderHoldPiece();
    
    // Render FPS (debug)
    // renderFPS();
    
    // Reset shadow effects
    if (ctx) {
        ctx.shadowBlur = 0;
    }
}

// ============================================================================
// THEME SYSTEM INTEGRATION
// ============================================================================

// Store current theme piece colors
let themePieceColors = null;

function updateTheme(pieceColors) {
    // Update piece colors for rendering
    themePieceColors = pieceColors;
    
    // Re-render if game is active
    if (window.gameState && window.gameState.isPlaying) {
        render();
    }
}

// Get piece color based on current theme
function getPieceColor(pieceType) {
    if (themePieceColors && themePieceColors[pieceType]) {
        return themePieceColors[pieceType];
    }
    
    // Fallback to default colors if theme not loaded
    const defaultColors = {
        I: '#00f0f0',
        O: '#f0f000',
        T: '#a000f0',
        S: '#00f000',
        Z: '#f00000',
        J: '#0000f0',
        L: '#f0a000'
    };
    
    return defaultColors[pieceType] || '#ffffff';
}

// ============================================================================
// EXPORT RENDERER FUNCTIONS
// ============================================================================

// Export renderer object for global access
window.renderer = {
    initialize: initializeCanvas,
    render: render,
    renderWithEffects: renderWithEffects,
    updateTheme: updateTheme,
    resize: resizeCanvas
};

// ============================================================================
// EXPORT ANIMATION FUNCTIONS FOR GAME.JS
// ============================================================================

// These functions will be called from game.js when events occur
window.triggerLineClearAnimation = startLineClearAnimation;
window.triggerTetrisParticles = createTetrisParticles;
window.triggerTSpinParticles = createTSpinParticles;
window.triggerPowerUpParticles = createPowerUpParticles;
window.triggerAchievementParticles = createAchievementParticles;
window.triggerScreenShake = startScreenShake;
window.triggerPlacementFlash = startPlacementFlash;
