# Tetris Game Collection

A collection of classic arcade games built with vanilla JavaScript, HTML5, and CSS3.

## Games Included

### 🎮 Tetris (Main Project)
A comprehensive, modern implementation of the classic Tetris game with advanced features.

**Location**: `tetris/`

**Features**:
- Modern Tetris mechanics (hold piece, ghost piece, hard drop, T-spins)
- Multiple game modes (Marathon, Sprint, Ultra)
- Power-ups system (5 types)
- Achievements (7 unlockable achievements)
- Visual themes (5 themes: Classic, Neon, Ocean, Sunset, Dark)
- Asynchronous multiplayer (score sharing)
- Full audio system (music + sound effects)
- Persistent leaderboard and game state
- Responsive design (desktop, tablet, mobile)

### 🐦 Flappy Bird
A simple Flappy Bird clone (legacy project).

**Location**: Root directory (`game.js`, `index.html`, `styles.css`)

## Quick Start

### Playing Tetris

1. Open `tetris/index.html` in a modern web browser
2. Enter your player name
3. Select difficulty and game mode
4. Start playing!

**Controls**:
- Arrow Keys: Move left/right, rotate, soft drop
- Space: Hard drop
- C: Hold piece
- P: Pause/Resume
- M: Toggle music
- Escape: Return to menu

### Playing Flappy Bird

1. Open `index.html` in a web browser
2. Click or press Space to start
3. Keep the bird flying!

## Project Structure

```
.
├── tetris/                    # Main Tetris game
│   ├── index.html            # Game HTML structure
│   ├── styles.css            # All styles and themes
│   ├── game.js               # Core game logic (2145 lines)
│   ├── renderer.js           # Rendering and visual effects
│   ├── audio.js              # Web Audio API integration
│   ├── storage.js            # localStorage management
│   ├── ui.js                 # UI management (1117 lines)
│   ├── theme.js              # Theme system
│   └── assets/               # Game assets
│       ├── audio/            # Audio files (see requirements)
│       └── fonts/            # Custom fonts (optional)
├── aidlc-docs/               # AI-DLC development documentation
│   ├── inception/            # Requirements and planning
│   ├── construction/         # Implementation docs
│   └── audit.md              # Complete development audit trail
├── game.js                   # Flappy Bird game logic
├── index.html                # Flappy Bird HTML
├── styles.css                # Flappy Bird styles
└── README.md                 # This file
```

## Documentation

Comprehensive documentation is available in the `aidlc-docs/` directory:

### For Players
- **User Guide**: `aidlc-docs/construction/tetris/code/user-guide.md`
  - Complete gameplay instructions
  - Controls reference
  - Game modes explained
  - Power-ups and achievements guide

### For Developers
- **Implementation Summary**: `aidlc-docs/construction/tetris/code/implementation-summary.md`
  - Architecture overview
  - Module descriptions
  - Code organization
  
- **Testing Checklist**: `aidlc-docs/construction/tetris/code/testing-checklist.md`
  - 63 test scenarios
  - Manual testing procedures
  - Quality assurance guidelines

- **Build Instructions**: `aidlc-docs/construction/build-and-test/build-instructions.md`
  - Setup requirements
  - Build steps
  - Troubleshooting

### For Deployment
- **Deployment Notes**: `aidlc-docs/construction/tetris/code/deployment-notes.md`
  - Hosting options
  - Configuration steps
  - Production checklist

- **Asset Requirements**: `aidlc-docs/construction/tetris/code/asset-requirements.md`
  - Audio file specifications
  - Sourcing recommendations
  - Integration instructions

## Development Process

This project was built using the **AI-DLC (AI-Driven Development Life Cycle)** methodology, which provides:

- Comprehensive requirements analysis
- Structured implementation planning
- Complete audit trail of all decisions
- Thorough testing documentation

See `aidlc-docs/audit.md` for the complete development history.

## Requirements

### Browser Support
- Modern browsers with ES6+ support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Features Used
- HTML5 Canvas API
- Web Audio API
- localStorage API
- CSS Grid and Flexbox
- ES6 Modules (optional)

## Audio Assets

The game requires audio files that are not included in the repository due to licensing and file size. See `aidlc-docs/construction/tetris/code/asset-requirements.md` for:

- Required audio files and specifications
- Recommended sources (royalty-free music sites)
- Integration instructions

**Quick Setup**:
1. Download or create audio files per specifications
2. Place in `tetris/assets/audio/` directory
3. Files needed: `theme.mp3`, `line-clear.mp3`, `tetris.mp3`, `level-up.mp3`, `game-over.mp3`, `move.mp3`, `rotate.mp3`, `drop.mp3`, `hold.mp3`, `powerup.mp3`

## Testing

### Manual Testing
Follow the comprehensive testing checklist:
```bash
# Open the testing checklist
open aidlc-docs/construction/tetris/code/testing-checklist.md
```

### Test Coverage
- 39 unit test scenarios (game logic, rendering, audio, storage, UI, themes)
- 12 integration test scenarios (game flow, persistence, audio-visual sync)
- 12 performance test scenarios (rendering, memory, responsiveness)

See `aidlc-docs/construction/build-and-test/` for detailed test instructions.

## Deployment

### Static Hosting (Recommended)
The Tetris game is a static web application that can be hosted on:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static web server

### Deployment Steps
1. Copy the `tetris/` directory to your hosting service
2. Ensure audio files are in `tetris/assets/audio/`
3. Configure HTTPS (recommended for Web Audio API)
4. Test all features in production environment

See `aidlc-docs/construction/tetris/code/deployment-notes.md` for detailed instructions.

## Contributing

### Getting Started
1. Clone the repository
2. Review the documentation in `aidlc-docs/`
3. Check the testing checklist before making changes
4. Test thoroughly in multiple browsers

### Code Style
- Use consistent indentation (2 spaces)
- Follow existing naming conventions
- Add comments for complex logic
- Update documentation for new features

### Testing
- Test all game modes before submitting changes
- Verify responsive design on different screen sizes
- Check audio functionality
- Validate localStorage operations

## Known Limitations

1. **Audio Files Not Included**: Due to licensing, audio files must be sourced separately
2. **Browser Storage**: Game state limited by localStorage (typically 5-10MB)
3. **Multiplayer**: Asynchronous only (no real-time multiplayer)
4. **Mobile Controls**: Touch controls not yet implemented (keyboard only)

## Future Enhancements

Potential features for future development:
- Touch controls for mobile devices
- Real-time multiplayer mode
- Additional game modes (Zen mode, Challenge mode)
- More power-ups and achievements
- Customizable controls
- Replay system
- Tournament mode

## License

[Add your license here]

## Credits

### Development
- Built using AI-DLC methodology
- Developed with vanilla JavaScript (no frameworks)

### Tetris
- Original game concept by Alexey Pajitnov
- This is a fan implementation for educational purposes

## Support

For issues, questions, or contributions:
1. Check the documentation in `aidlc-docs/`
2. Review the testing checklist
3. Open an issue with detailed information

## Changelog

### Version 1.0.0 (2026-02-12)
- Initial release
- Complete Tetris implementation with all features
- Comprehensive documentation
- Full test coverage

---

**Enjoy playing Tetris! 🎮**
