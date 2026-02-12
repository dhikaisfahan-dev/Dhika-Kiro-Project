# Tetris Game - Requirements Document

## Intent Analysis Summary

**User Request**: Create a comprehensive web Tetris game with player name entry, pause/resume functionality, scoring system, ranking display, and recommendations for making the game more fun.

**Request Type**: New Project (Greenfield)

**Scope Estimate**: Single component web-based game application

**Complexity Estimate**: Complex - Full-featured game with modern mechanics, multiple game modes, power-ups, achievements, themes, and asynchronous multiplayer

---

## Functional Requirements

### FR1: Core Game Mechanics (Modern Tetris)
- **FR1.1**: Implement 7 standard Tetris pieces (I, O, T, S, Z, J, L)
- **FR1.2**: Hold piece feature - allow player to hold one piece for later use
- **FR1.3**: Ghost piece - show transparent preview of where piece will land
- **FR1.4**: Hard drop - instant piece placement with spacebar
- **FR1.5**: T-spin detection and bonus scoring
- **FR1.6**: Line clearing with animation effects
- **FR1.7**: Piece rotation with wall kicks
- **FR1.8**: Soft drop (faster falling with down arrow)

### FR2: Difficulty System
- **FR2.1**: Three selectable difficulty levels at game start:
  - Easy: Slower initial speed, gentler progression
  - Medium: Standard speed and progression
  - Hard: Fast initial speed, aggressive progression
- **FR2.2**: Display selected difficulty level during gameplay
- **FR2.3**: Difficulty affects initial fall speed and score multipliers

### FR3: Player Name System
- **FR3.1**: Optional name entry before starting game
- **FR3.2**: Default to "Player" if name is skipped
- **FR3.3**: Name entry modal/dialog with validation (max 20 characters)
- **FR3.4**: Display player name during gameplay
- **FR3.5**: Associate player name with scores in ranking

### FR4: Scoring System (Modern)
- **FR4.1**: Base points per line cleared:
  - Single line: 100 points × level
  - Double lines: 300 points × level
  - Triple lines: 500 points × level
  - Tetris (4 lines): 800 points × level
- **FR4.2**: Combo system - consecutive line clears increase multiplier
- **FR4.3**: T-spin bonuses:
  - T-spin single: 800 points × level
  - T-spin double: 1200 points × level
  - T-spin triple: 1600 points × level
- **FR4.4**: Back-to-back bonus (consecutive difficult clears)
- **FR4.5**: Hard drop bonus (2 points per cell dropped)
- **FR4.6**: Display current score, level, and lines cleared

### FR5: Ranking/Leaderboard System
- **FR5.1**: Store top 5 high scores with player names
- **FR5.2**: Persist rankings in browser localStorage
- **FR5.3**: Display rankings on game over screen
- **FR5.4**: Highlight current player's score if it makes top 5
- **FR5.5**: Show "Best Score" indicator for highest score
- **FR5.6**: Display rankings in dedicated leaderboard view

### FR6: Game Controls
- **FR6.1**: Keyboard controls:
  - Left Arrow: Move piece left
  - Right Arrow: Move piece right
  - Down Arrow: Soft drop (faster fall)
  - Up Arrow: Rotate piece clockwise
  - Z Key: Rotate piece counter-clockwise
  - Spacebar: Hard drop (instant placement)
  - C Key: Hold piece
  - P Key: Pause/Resume
  - Escape: Pause
- **FR6.2**: Display control instructions on start screen

### FR7: Pause and Resume
- **FR7.1**: Pause button visible during gameplay
- **FR7.2**: Keyboard shortcut (P or Escape) to pause
- **FR7.3**: Pause overlay with "Resume" and "Quit" options
- **FR7.4**: Game state frozen during pause (timer stops, pieces don't fall)
- **FR7.5**: Resume returns to exact game state

### FR8: Game Preview Features
- **FR8.1**: Next piece preview - show upcoming piece
- **FR8.2**: Ghost piece - transparent preview at landing position
- **FR8.3**: Hold piece display - show currently held piece
- **FR8.4**: Visual indicators for all preview features

### FR9: Game Modes
- **FR9.1**: Marathon Mode - play until game over, increasing difficulty
- **FR9.2**: Sprint Mode - clear 40 lines as fast as possible
- **FR9.3**: Ultra Mode - highest score in 3 minutes
- **FR9.4**: Mode selection screen before game start
- **FR9.5**: Display mode-specific objectives and timers

### FR10: Power-ups System
- **FR10.1**: Random power-ups appear during gameplay (5% chance per piece)
- **FR10.2**: Power-up types:
  - Clear Row: Instantly clear bottom row
  - Slow Time: Reduce fall speed by 50% for 30 seconds
  - Bomb Piece: Clear 3×3 area where placed
  - Line Blast: Clear all incomplete lines
  - Ghost Mode: Next 5 pieces pass through existing blocks
- **FR10.3**: Visual indicator when power-up is active
- **FR10.4**: Power-up collection animation
- **FR10.5**: Display active power-ups and duration

### FR11: Achievements System
- **FR11.1**: Track and display achievements:
  - First Tetris (clear 4 lines at once)
  - Combo Master (10+ combo)
  - Speed Demon (complete Sprint mode under 2 minutes)
  - Centurion (score 100,000 points)
  - T-spin Expert (perform 10 T-spins in one game)
  - Marathon Runner (survive 30 minutes)
  - Power Player (use all power-ups in one game)
- **FR11.2**: Achievement notification popup when unlocked
- **FR11.3**: Achievements page showing locked/unlocked status
- **FR11.4**: Persist achievements in localStorage

### FR12: Visual Themes
- **FR12.1**: Multiple visual themes:
  - Classic: Retro Tetris colors
  - Neon: Bright glowing colors
  - Ocean: Blue/aqua gradient theme
  - Sunset: Orange/purple gradient theme
  - Dark Mode: High contrast dark theme
- **FR12.2**: Theme selector in settings/menu
- **FR12.3**: Theme affects board, pieces, and UI colors
- **FR12.4**: Persist selected theme in localStorage

### FR13: Asynchronous Multiplayer
- **FR13.1**: Share score functionality (copy link or code)
- **FR13.2**: Challenge mode - try to beat a friend's score
- **FR13.3**: Display comparison: Your Score vs Friend's Score
- **FR13.4**: Global leaderboard (if backend implemented, otherwise local only)
- **FR13.5**: Social sharing buttons (Twitter, Facebook)

### FR14: Game State Persistence
- **FR14.1**: Save current game state to localStorage
- **FR14.2**: Resume game option on page load if unfinished game exists
- **FR14.3**: Save high scores persistently
- **FR14.4**: Save player preferences (name, theme, difficulty)
- **FR14.5**: Clear saved game on game over or manual quit

---

## Non-Functional Requirements

### NFR1: Performance
- **NFR1.1**: Smooth 60 FPS gameplay
- **NFR1.2**: Responsive controls with <50ms input lag
- **NFR1.3**: Efficient rendering using canvas or optimized DOM
- **NFR1.4**: Minimal memory footprint (<50MB)

### NFR2: Visual Design
- **NFR2.1**: Colorful and vibrant design with particle effects
- **NFR2.2**: Smooth animations for piece movement, rotation, line clearing
- **NFR2.3**: Particle effects for special events (Tetris, T-spin, power-ups)
- **NFR2.4**: Visual feedback for all user interactions
- **NFR2.5**: Professional, polished UI design

### NFR3: Audio
- **NFR3.1**: Background music (looping, adjustable volume)
- **NFR3.2**: Sound effects:
  - Piece movement
  - Piece rotation
  - Piece placement
  - Line clear (different sounds for single/double/triple/Tetris)
  - Level up
  - Game over
  - Power-up collection
  - Achievement unlock
- **NFR3.3**: Audio controls (mute, volume adjustment)
- **NFR3.4**: Audio persists across game sessions (remember mute state)

### NFR4: Responsive Design
- **NFR4.1**: Adapt to desktop, tablet, and mobile screen sizes
- **NFR4.2**: Maintain aspect ratio and playability on all devices
- **NFR4.3**: Responsive UI elements (buttons, menus, overlays)
- **NFR4.4**: Minimum supported resolution: 320×568 (iPhone SE)
- **NFR4.5**: Maximum supported resolution: 4K displays

### NFR5: Browser Compatibility
- **NFR5.1**: Support modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR5.2**: Minimum browser versions: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **NFR5.3**: Graceful degradation for older browsers
- **NFR5.4**: No external dependencies requiring plugins

### NFR6: Accessibility
- **NFR6.1**: Keyboard-only navigation support
- **NFR6.2**: High contrast mode option
- **NFR6.3**: Colorblind-friendly color schemes
- **NFR6.4**: Clear visual indicators for all game states
- **NFR6.5**: Pause functionality for accessibility needs

### NFR7: Usability
- **NFR7.1**: Intuitive controls and UI
- **NFR7.2**: Clear instructions and tutorials
- **NFR7.3**: Immediate feedback for all actions
- **NFR7.4**: Error prevention (confirm quit, clear warnings)
- **NFR7.5**: Consistent design patterns throughout

### NFR8: Maintainability
- **NFR8.1**: Clean, modular code structure
- **NFR8.2**: Comprehensive code comments
- **NFR8.3**: Separation of concerns (game logic, rendering, UI)
- **NFR8.4**: Easy to add new features (themes, power-ups, modes)

---

## Technical Constraints

### TC1: Technology Stack
- **TC1.1**: Pure HTML5, CSS3, JavaScript (no frameworks required)
- **TC1.2**: Canvas API for game rendering
- **TC1.3**: Web Audio API for sound
- **TC1.4**: localStorage for data persistence
- **TC1.5**: No backend required (fully client-side)

### TC2: File Structure
- **TC2.1**: Static web files deployable to any web server
- **TC2.2**: Single-page application architecture
- **TC2.3**: Organized asset structure (images, audio, fonts)

---

## User Scenarios

### US1: First-Time Player
1. Player opens game in browser
2. Sees attractive start screen with game title
3. Prompted to enter name (optional)
4. Selects difficulty level (Easy/Medium/Hard)
5. Selects game mode (Marathon/Sprint/Ultra)
6. Views brief control instructions
7. Starts playing with modern Tetris mechanics
8. Experiences smooth gameplay with visual effects
9. Hears background music and sound effects
10. Sees score, level, and preview features
11. Game over screen shows final score and ranking

### US2: Returning Player
1. Player opens game
2. Name auto-filled from previous session
3. Sees high scores and achievements
4. Selects different theme for variety
5. Tries different game mode
6. Collects power-ups during gameplay
7. Unlocks new achievement
8. Beats previous high score
9. Shares score with friends

### US3: Competitive Player
1. Player aims for top 5 leaderboard
2. Practices T-spins and combos
3. Uses hold piece strategically
4. Activates power-ups at optimal times
5. Completes achievements
6. Compares scores with friends
7. Tries to beat friend's challenge score

---

## Success Criteria

1. **Gameplay**: Smooth, responsive, and fun Tetris experience
2. **Features**: All modern mechanics, modes, and power-ups working
3. **Visual**: Colorful, vibrant design with particle effects
4. **Audio**: Immersive music and sound effects
5. **Persistence**: Scores, achievements, and preferences saved
6. **Engagement**: Players want to replay and improve scores
7. **Polish**: Professional quality with attention to detail

---

## Out of Scope (Future Enhancements)

- Real-time online multiplayer
- Backend server for global leaderboards
- Mobile app versions (iOS/Android)
- Customizable controls
- Level editor
- Replay system
- Tournament mode

---

## Recommendations for Maximum Fun

Based on the requirements, here are key recommendations to make the game highly engaging:

1. **Juice the Feedback**: Add screen shake, particle explosions, and satisfying sound effects for every action
2. **Progressive Unlocks**: Make achievements visible but locked to encourage players to try different strategies
3. **Visual Polish**: Smooth animations, glowing effects, and dynamic backgrounds
4. **Score Chasing**: Clear display of "next milestone" to encourage one more game
5. **Power-up Balance**: Make power-ups rare enough to be exciting but common enough to be useful
6. **Mode Variety**: Different modes appeal to different play styles (casual vs competitive)
7. **Theme Variety**: Let players personalize their experience
8. **Combo Feedback**: Exaggerated visual/audio feedback for combos and special moves
9. **Near-Miss Saves**: Ghost piece helps players make precise placements
10. **Celebration Moments**: Special animations for achievements and high scores

