# Tetris Game - Build Instructions

## Prerequisites

### Required Software
- **Web Browser**: Modern browser with JavaScript enabled
  - Chrome 90+ (recommended)
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- **Web Server**: Any static file server (for local testing)
  - Python's built-in HTTP server (recommended for quick testing)
  - Node.js http-server
  - VS Code Live Server extension
  - Any other static file server

### System Requirements
- **Operating System**: Any (Windows, macOS, Linux)
- **Disk Space**: ~5 MB (including audio assets)
- **Memory**: 512 MB RAM minimum
- **Display**: 1024×768 minimum resolution (responsive design supports smaller)

## Build Steps

### Step 1: Verify File Structure

Ensure all files are present in the `tetris/` directory:

```
tetris/
├── index.html              ✓ Main game page
├── styles.css              ✓ Styling and themes
├── game.js                 ✓ Core game logic
├── renderer.js             ✓ Canvas rendering
├── audio.js                ✓ Audio system
├── storage.js              ✓ localStorage management
├── ui.js                   ✓ UI components
├── theme.js                ✓ Theme system
└── assets/
    ├── audio/              ⚠ Audio files (see Asset Requirements)
    │   ├── music.mp3
    │   ├── move.mp3
    │   ├── rotate.mp3
    │   ├── drop.mp3
    │   ├── clear.mp3
    │   ├── tetris.mp3
    │   ├── levelup.mp3
    │   ├── gameover.mp3
    │   ├── powerup.mp3
    │   └── achievement.mp3
    └── fonts/              (optional)
```

**Note**: Audio files are optional for initial testing. The game will function without them but will show console warnings.

### Step 2: Prepare Audio Assets (Optional)

If you have audio files ready:

1. Place all 10 audio files in `tetris/assets/audio/`
2. Ensure filenames match exactly (case-sensitive)
3. Verify file formats (MP3 or OGG)
4. Test file sizes (should be reasonable for web delivery)

If you don't have audio files yet:
- The game will work without audio
- See `asset-requirements.md` for audio specifications
- Audio can be added later without code changes

### Step 3: Start Local Web Server

**Option A: Python HTTP Server (Recommended)**

```bash
# Navigate to the workspace root (parent of tetris/ directory)
cd /path/to/workspace

# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option B: Node.js http-server**

```bash
# Install http-server globally (one-time)
npm install -g http-server

# Navigate to workspace root
cd /path/to/workspace

# Start server
http-server -p 8000
```

**Option C: VS Code Live Server**

1. Install "Live Server" extension in VS Code
2. Right-click `tetris/index.html`
3. Select "Open with Live Server"

**Option D: Other Web Servers**

Any static file server will work. Ensure it serves files from the workspace root so paths like `/tetris/game.js` resolve correctly.

### Step 4: Open Game in Browser

1. Open your web browser
2. Navigate to: `http://localhost:8000/tetris/`
3. You should see the Tetris start screen

**Expected Initial View**:
- Game title "TETRIS"
- "Enter Your Name" input field
- Difficulty selection (Easy/Medium/Hard)
- Game mode selection (Marathon/Sprint/Ultra)
- "Start Game" button
- Settings and Achievements buttons

### Step 5: Verify Build Success

**Visual Checks**:
- [ ] Page loads without errors
- [ ] All UI elements are visible and styled
- [ ] Theme colors are applied (default theme)
- [ ] Buttons are clickable and responsive
- [ ] Canvas element is present and sized correctly

**Console Checks** (Open browser DevTools - F12):
- [ ] No JavaScript errors in console
- [ ] Audio loading warnings are acceptable if no audio files present
- [ ] No 404 errors for CSS or JS files

**Functional Checks**:
- [ ] Can enter player name
- [ ] Can select difficulty level
- [ ] Can select game mode
- [ ] Start button is enabled after name entry
- [ ] Settings menu opens and closes
- [ ] Achievements page opens and closes

## Build Artifacts

After successful build, you should have:

1. **Functional Web Application**: All HTML/CSS/JS files loaded and working
2. **No Build Errors**: Clean browser console (except audio warnings if no files)
3. **Responsive Layout**: UI adapts to browser window size
4. **Interactive Elements**: All buttons and controls functional

## Troubleshooting

### Issue: Page Shows "Cannot GET /tetris/"

**Cause**: Web server not running or wrong directory
**Solution**: 
1. Verify web server is running
2. Check you're in the correct directory (workspace root, not tetris/)
3. Try accessing `http://localhost:8000/` first to see directory listing

### Issue: Styles Not Loading (Unstyled Page)

**Cause**: CSS file not found or path incorrect
**Solution**:
1. Check browser console for 404 errors
2. Verify `styles.css` exists in `tetris/` directory
3. Check file permissions (should be readable)
4. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)

### Issue: JavaScript Errors in Console

**Cause**: JS files not loading or syntax errors
**Solution**:
1. Check all JS files are present in `tetris/` directory
2. Verify file names match exactly (case-sensitive)
3. Check browser console for specific error messages
4. Ensure browser supports ES6+ JavaScript

### Issue: Audio Warnings in Console

**Cause**: Audio files not present (expected if not added yet)
**Solution**:
- This is normal if audio files haven't been added
- Game will function without audio
- Add audio files later to resolve warnings
- See `asset-requirements.md` for specifications

### Issue: Canvas Not Displaying

**Cause**: Canvas element not rendering
**Solution**:
1. Check browser console for errors
2. Verify browser supports HTML5 Canvas
3. Check canvas element exists in HTML
4. Try different browser

### Issue: localStorage Errors

**Cause**: Browser blocking localStorage (private mode)
**Solution**:
1. Disable private/incognito mode
2. Check browser settings allow localStorage
3. Try different browser
4. Game will work but won't save data

## Performance Verification

### Expected Performance Metrics
- **Page Load Time**: < 2 seconds on broadband
- **Frame Rate**: 60 FPS during gameplay
- **Input Lag**: < 50ms (keyboard response)
- **Memory Usage**: < 100 MB in browser

### Performance Testing
1. Open browser DevTools (F12)
2. Go to Performance tab
3. Start recording
4. Play game for 30 seconds
5. Stop recording
6. Check frame rate stays at 60 FPS

**If Performance Issues**:
- Close other browser tabs
- Disable browser extensions
- Check CPU usage (should be < 50% for game)
- Try different browser

## Browser Compatibility

### Tested Browsers
- ✅ Chrome 90+ (Recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Known Issues
- **Safari < 14**: May have audio autoplay restrictions
- **Firefox < 88**: Some CSS animations may be slower
- **IE 11**: Not supported (lacks ES6 support)

### Mobile Browsers
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)
- ⚠ Touch controls not implemented (keyboard only)

## Next Steps

After successful build verification:
1. Proceed to **Unit Test Instructions** to test individual components
2. Then **Integration Test Instructions** to test feature interactions
3. Finally **Performance Test Instructions** for load testing

## Build Summary

**Build Type**: Static Web Application (No compilation required)
**Build Time**: Instant (no build process)
**Build Artifacts**: HTML, CSS, JavaScript files served directly
**Dependencies**: None (vanilla JavaScript, no frameworks)
**Deployment Ready**: Yes (after testing)
