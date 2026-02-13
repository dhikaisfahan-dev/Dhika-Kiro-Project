// ============================================================================
// TETRIS GAME - Audio System
// ============================================================================

// ============================================================================
// AUDIO CONTEXT INITIALIZATION
// ============================================================================

let audioContext = null;
let audioBuffers = {};
let audioSources = {};
let musicSource = null;
let isMuted = false;
let masterVolume = 0.7;
let musicVolume = 0.5;
let sfxVolume = 0.8;

// Audio file paths
const AUDIO_FILES = {
    music: 'assets/audio/music.mp3',
    move: 'assets/audio/move.mp3',
    rotate: 'assets/audio/rotate.mp3',
    drop: 'assets/audio/drop.mp3',
    clear: 'assets/audio/clear.mp3',
    tetris: 'assets/audio/tetris.mp3',
    levelup: 'assets/audio/levelup.mp3',
    gameover: 'assets/audio/gameover.mp3',
    powerup: 'assets/audio/powerup.mp3',
    achievement: 'assets/audio/achievement.mp3'
};

// ============================================================================
// INITIALIZATION
// ============================================================================

function initializeAudio() {
    try {
        // Create audio context (requires user interaction)
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Load audio preferences from storage
        loadAudioPreferences();
        
        // Preload audio files
        preloadAudioFiles();
        
        return true;
    } catch (error) {
        console.error('Failed to initialize audio:', error);
        return false;
    }
}

function resumeAudioContext() {
    // Resume audio context after user interaction (browser requirement)
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('Audio context resumed');
        }).catch(error => {
            console.error('Failed to resume audio context:', error);
        });
    }
}

// ============================================================================
// AUDIO LOADING
// ============================================================================

async function preloadAudioFiles() {
    const loadPromises = [];
    
    for (const [name, path] of Object.entries(AUDIO_FILES)) {
        loadPromises.push(loadAudioFile(name, path));
    }
    
    try {
        await Promise.all(loadPromises);
        console.log('All audio files loaded');
    } catch (error) {
        console.error('Failed to load some audio files:', error);
    }
}

async function loadAudioFile(name, path) {
    try {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        audioBuffers[name] = audioBuffer;
        console.log(`Loaded audio: ${name}`);
    } catch (error) {
        console.warn(`Failed to load audio file ${name}:`, error);
        // Create silent buffer as fallback
        audioBuffers[name] = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
    }
}

// ============================================================================
// MUSIC PLAYER
// ============================================================================

function playMusic() {
    if (!audioContext || isMuted || !audioBuffers.music) return;
    
    // Stop existing music
    stopMusic();
    
    try {
        // Create source
        musicSource = audioContext.createBufferSource();
        musicSource.buffer = audioBuffers.music;
        musicSource.loop = true;
        
        // Create gain node for volume control
        const gainNode = audioContext.createGain();
        gainNode.gain.value = masterVolume * musicVolume;
        
        // Connect nodes
        musicSource.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Start playback
        musicSource.start(0);
    } catch (error) {
        console.error('Failed to play music:', error);
    }
}

function stopMusic() {
    if (musicSource) {
        try {
            musicSource.stop();
        } catch (error) {
            // Source may already be stopped
        }
        musicSource = null;
    }
}

function pauseMusic() {
    if (audioContext && audioContext.state === 'running') {
        audioContext.suspend();
    }
}

function resumeMusic() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// ============================================================================
// SOUND EFFECTS PLAYER
// ============================================================================

function playSoundEffect(name, volumeMultiplier = 1.0) {
    if (!audioContext || isMuted || !audioBuffers[name]) return;
    
    try {
        // Create source
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers[name];
        
        // Create gain node for volume control
        const gainNode = audioContext.createGain();
        gainNode.gain.value = masterVolume * sfxVolume * volumeMultiplier;
        
        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Start playback
        source.start(0);
        
        // Store reference (for potential cleanup)
        const sourceId = Date.now() + Math.random();
        audioSources[sourceId] = source;
        
        // Clean up after playback
        source.onended = () => {
            delete audioSources[sourceId];
        };
    } catch (error) {
        console.error(`Failed to play sound effect ${name}:`, error);
    }
}

// ============================================================================
// GAME EVENT SOUNDS
// ============================================================================

function playMoveSound() {
    playSoundEffect('move', 0.3);
}

function playRotateSound() {
    playSoundEffect('rotate', 0.4);
}

function playDropSound() {
    playSoundEffect('drop', 0.6);
}

function playLineClearSound(lineCount) {
    if (lineCount === 4) {
        // Tetris clear - special sound
        playSoundEffect('tetris', 1.0);
    } else {
        // Regular clear
        playSoundEffect('clear', 0.7);
    }
}

function playLevelUpSound() {
    playSoundEffect('levelup', 0.8);
}

function playGameOverSound() {
    playSoundEffect('gameover', 1.0);
}

function playPowerUpSound() {
    playSoundEffect('powerup', 0.9);
}

function playAchievementSound() {
    playSoundEffect('achievement', 1.0);
}

// ============================================================================
// VOLUME CONTROLS
// ============================================================================

function setMasterVolume(volume) {
    masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update music volume if playing
    if (musicSource) {
        stopMusic();
        playMusic();
    }
    
    // Save preference
    saveAudioPreferences();
}

function setMusicVolume(volume) {
    musicVolume = Math.max(0, Math.min(1, volume));
    
    // Update music volume if playing
    if (musicSource) {
        stopMusic();
        playMusic();
    }
    
    // Save preference
    saveAudioPreferences();
}

function setSFXVolume(volume) {
    sfxVolume = Math.max(0, Math.min(1, volume));
    
    // Save preference
    saveAudioPreferences();
}

function toggleMute() {
    isMuted = !isMuted;
    
    if (isMuted) {
        stopMusic();
    } else {
        playMusic();
    }
    
    // Save preference
    saveAudioPreferences();
    
    return isMuted;
}

function getMuteState() {
    return isMuted;
}

function getVolumes() {
    return {
        master: masterVolume,
        music: musicVolume,
        sfx: sfxVolume
    };
}

// ============================================================================
// PREFERENCES PERSISTENCE
// ============================================================================

function loadAudioPreferences() {
    try {
        const prefs = localStorage.getItem('tetris_audio_prefs');
        if (prefs) {
            const data = JSON.parse(prefs);
            isMuted = data.muted || false;
            masterVolume = data.masterVolume !== undefined ? data.masterVolume : 0.7;
            musicVolume = data.musicVolume !== undefined ? data.musicVolume : 0.5;
            sfxVolume = data.sfxVolume !== undefined ? data.sfxVolume : 0.8;
        }
    } catch (error) {
        console.error('Failed to load audio preferences:', error);
    }
}

function saveAudioPreferences() {
    try {
        const prefs = {
            muted: isMuted,
            masterVolume: masterVolume,
            musicVolume: musicVolume,
            sfxVolume: sfxVolume
        };
        localStorage.setItem('tetris_audio_prefs', JSON.stringify(prefs));
    } catch (error) {
        console.error('Failed to save audio preferences:', error);
    }
}

// ============================================================================
// CLEANUP
// ============================================================================

function cleanupAudio() {
    // Stop all audio
    stopMusic();
    
    // Stop all sound effects
    for (const sourceId in audioSources) {
        try {
            audioSources[sourceId].stop();
        } catch (error) {
            // Source may already be stopped
        }
    }
    audioSources = {};
    
    // Close audio context
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

window.audioSystem = {
    initialize: initializeAudio,
    init: initializeAudio, // Alias for compatibility
    resumeContext: resumeAudioContext,
    
    // Music controls
    playMusic: playMusic,
    stopMusic: stopMusic,
    pauseMusic: pauseMusic,
    resumeMusic: resumeMusic,
    
    // Sound effects
    playMove: playMoveSound,
    playRotate: playRotateSound,
    playDrop: playDropSound,
    playLineClear: playLineClearSound,
    playLevelUp: playLevelUpSound,
    playGameOver: playGameOverSound,
    playPowerUp: playPowerUpSound,
    playAchievement: playAchievementSound,
    
    // Volume controls
    setMasterVolume: setMasterVolume,
    setVolume: setMasterVolume, // Alias for compatibility
    setMusicVolume: setMusicVolume,
    setSFXVolume: setSFXVolume,
    toggleMute: toggleMute,
    mute: () => { isMuted = true; stopMusic(); saveAudioPreferences(); }, // Alias for compatibility
    unmute: () => { isMuted = false; playMusic(); saveAudioPreferences(); }, // Alias for compatibility
    getMuteState: getMuteState,
    getVolumes: getVolumes,
    getVolume: () => masterVolume, // Alias for compatibility - returns master volume
    
    // Cleanup
    cleanup: cleanupAudio
};
