# Asset Requirements

## Background Music

### Required File
- **Filename**: `music.mp3`
- **Location**: `assets/music.mp3`
- **Format**: MP3 audio file
- **Recommended Length**: 30-60 seconds (will loop automatically)
- **Recommended Style**: Upbeat, cheerful, game-appropriate music

### Specifications
- **Sample Rate**: 44.1 kHz or 48 kHz
- **Bit Rate**: 128 kbps or higher
- **Channels**: Stereo or Mono
- **File Size**: Keep under 2 MB for fast loading

### Licensing Requirements
- Must be royalty-free or properly licensed
- Recommended sources for free music:
  - [Incompetech](https://incompetech.com/) (Creative Commons)
  - [FreePD](https://freepd.com/) (Public Domain)
  - [Bensound](https://www.bensound.com/) (Free with attribution)
  - [Purple Planet](https://www.purple-planet.com/) (Free for non-commercial)

### Adding the Music File
1. Obtain a suitable MP3 file from a licensed source
2. Rename the file to `music.mp3`
3. Place the file in the `assets/` directory
4. The game will automatically play the music when started

### Fallback Behavior
- If `music.mp3` is not found, the game will:
  - Display a console warning
  - Continue to function normally without music
  - All other features remain operational

## Optional Future Assets

### Sound Effects (Not Currently Implemented)
If you want to add sound effects in the future:
- **Flap sound**: Short "whoosh" sound when bird flaps
- **Score sound**: Pleasant "ding" when passing through pipes
- **Collision sound**: Brief impact sound on game over

### Visual Assets (Not Currently Implemented)
The game currently uses canvas-drawn graphics. Future enhancements could include:
- **Bird sprite**: Animated bird image with flapping wings
- **Pipe texture**: Textured pipe graphics
- **Background image**: Parallax scrolling background
- **UI elements**: Custom buttons and overlays

## Notes
- The game is designed to work without any assets (except music)
- All visual elements are drawn using HTML5 Canvas
- Music is the only external asset required for full experience
- Game remains fully functional even without music file
