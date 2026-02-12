# Tetris Game - Asset Requirements

## Overview
This document outlines the audio asset requirements for the Tetris game. All audio files should be placed in the `tetris/assets/audio/` directory.

## Audio File Specifications

### Technical Requirements
- **Format**: MP3 (preferred) or OGG Vorbis
- **Sample Rate**: 44.1 kHz (CD quality)
- **Bit Rate**: 128 kbps minimum (192 kbps recommended for music)
- **Channels**: Stereo (2 channels)
- **Normalization**: -3dB peak to prevent clipping

### File Size Guidelines
- **Sound Effects**: 10-50 KB each (1-3 seconds duration)
- **Background Music**: 500 KB - 2 MB (looping, 1-2 minutes)

## Required Audio Files

### 1. Background Music (`music.mp3`)
- **Type**: Looping background music
- **Duration**: 60-120 seconds (seamless loop)
- **Style**: Upbeat, energetic electronic music
- **Mood**: Fun, engaging, not too intense
- **Volume**: Mixed at -6dB to allow sound effects to be heard
- **Notes**: Should loop seamlessly without noticeable gaps

### 2. Piece Movement (`move.mp3`)
- **Type**: Sound effect
- **Duration**: 0.05-0.1 seconds
- **Style**: Soft click or tap sound
- **Volume**: Subtle, not distracting
- **Notes**: Plays when piece moves left/right

### 3. Piece Rotation (`rotate.mp3`)
- **Type**: Sound effect
- **Duration**: 0.1-0.2 seconds
- **Style**: Mechanical rotation sound or whoosh
- **Volume**: Medium, noticeable but not harsh
- **Notes**: Plays when piece rotates

### 4. Soft Drop (`drop.mp3`)
- **Type**: Sound effect
- **Duration**: 0.1-0.3 seconds
- **Style**: Descending tone or thud
- **Volume**: Medium
- **Notes**: Plays when piece is placed (soft or hard drop)

### 5. Line Clear (`clear.mp3`)
- **Type**: Sound effect
- **Duration**: 0.3-0.5 seconds
- **Style**: Satisfying chime or explosion
- **Volume**: Medium-high
- **Notes**: Plays when 1-3 lines are cleared

### 6. Tetris Clear (`tetris.mp3`)
- **Type**: Sound effect
- **Duration**: 0.5-1.0 seconds
- **Style**: Triumphant fanfare or powerful explosion
- **Volume**: High (this is a special achievement)
- **Notes**: Plays when 4 lines are cleared at once

### 7. Level Up (`levelup.mp3`)
- **Type**: Sound effect
- **Duration**: 0.5-1.0 seconds
- **Style**: Ascending chime or victory jingle
- **Volume**: Medium-high
- **Notes**: Plays when player advances to next level

### 8. Game Over (`gameover.mp3`)
- **Type**: Sound effect
- **Duration**: 1.0-2.0 seconds
- **Style**: Descending tones or sad melody
- **Volume**: Medium
- **Notes**: Plays when game ends

### 9. Power-up Collection (`powerup.mp3`)
- **Type**: Sound effect
- **Duration**: 0.3-0.5 seconds
- **Style**: Magical chime or power-up sound
- **Volume**: Medium-high
- **Notes**: Plays when player collects a power-up

### 10. Achievement Unlock (`achievement.mp3`)
- **Type**: Sound effect
- **Duration**: 0.5-1.0 seconds
- **Style**: Triumphant fanfare or success jingle
- **Volume**: High
- **Notes**: Plays when player unlocks an achievement

## Placeholder Audio Generation

### Option 1: Use Free Sound Libraries
Recommended free sound effect libraries:
- **Freesound.org**: Community-uploaded sounds (CC licenses)
- **OpenGameArt.org**: Game-specific audio assets
- **Incompetech.com**: Royalty-free music by Kevin MacLeod
- **ZapSplat.com**: Free sound effects (attribution required)

### Option 2: Generate with Audio Tools
Tools for creating simple sound effects:
- **Audacity** (free, open-source): Record and edit audio
- **LMMS** (free): Create music and sound effects
- **Bfxr** (free, web-based): Generate retro game sound effects
- **ChipTone** (free, web-based): Create 8-bit style sounds

### Option 3: Text-to-Speech Placeholders
For initial testing, you can use silent audio files or simple beeps:
```javascript
// Create silent placeholder (1 second)
const audioContext = new AudioContext();
const buffer = audioContext.createBuffer(2, 44100, 44100);
// Export as WAV and convert to MP3
```

## Audio Implementation Notes

### Current Implementation
The game's audio system (`tetris/audio.js`) is already implemented and expects these files to exist in `tetris/assets/audio/`. The system includes:
- Automatic audio loading on game start
- Fallback handling if files are missing (silent playback)
- Volume controls and mute functionality
- Background music looping
- Sound effect playback with overlap support

### Testing Without Audio
The game will function without audio files, but will show console warnings. To test:
1. Open browser console to see audio loading errors
2. Game will continue to work with silent audio
3. Replace placeholder files with actual audio when available

### Adding Audio Files
1. Place audio files in `tetris/assets/audio/` directory
2. Ensure filenames match exactly (case-sensitive)
3. Test in browser to verify loading
4. Adjust volume levels in `audio.js` if needed (lines 15-26)

## License Considerations

### Important Notes
- Ensure all audio files have appropriate licenses for your use case
- Attribution may be required for Creative Commons licensed audio
- Commercial use may require different licenses
- Keep track of audio sources and licenses in a separate document

### Recommended Licenses
- **CC0 (Public Domain)**: No attribution required, free for any use
- **CC BY**: Attribution required, free for any use
- **CC BY-SA**: Attribution required, share-alike, free for any use
- **Royalty-Free**: One-time purchase, unlimited use

## Quality Assurance Checklist

Before finalizing audio assets:
- [ ] All 10 audio files present in `tetris/assets/audio/`
- [ ] Files meet technical specifications (format, sample rate, bit rate)
- [ ] Audio levels are normalized and consistent
- [ ] No clipping or distortion in any files
- [ ] Background music loops seamlessly
- [ ] Sound effects are appropriate length (not too long)
- [ ] All files tested in game for timing and volume
- [ ] Licenses documented for all audio sources
- [ ] Attribution added to game credits (if required)

## Future Enhancements

### Additional Audio (Optional)
Consider adding these sounds in future versions:
- **T-spin sound**: Special sound for T-spin moves
- **Combo sound**: Escalating sound for combo chains
- **Warning sound**: Alert when pieces stack too high
- **Menu sounds**: UI interaction feedback
- **Theme-specific music**: Different music for each visual theme

### Audio Variations
- Multiple music tracks that change based on level or game mode
- Dynamic music that intensifies as game speeds up
- Randomized sound effect variations to reduce repetition
