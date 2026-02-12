# Tetris Game - Unit Test Execution

## Overview

This document provides manual testing procedures for individual game components. Since this is a vanilla JavaScript application without a formal test framework, testing is performed manually through browser console and gameplay verification.

## Testing Approach

- **Manual Testing**: Interactive testing through browser console and UI
- **Console Verification**: Using browser DevTools to inspect state and behavior
- **Visual Verification**: Confirming correct rendering and animations
- **Functional Verification**: Testing each feature independently

## Prerequisites

- Game running in browser (`http://localhost:8000/tetris/`)
- Browser DevTools open (F12)
- Console tab visible for logging and commands

## Unit Test Scenarios

### 1. Core Game Logic Tests (game.js)

#### Test 1.1: Tetromino Creation
**Purpose**: Verify all 7 piece types are created correctly

**Steps**:
1. Open browser console
2. Start a new game
3. Observe pieces appearing in "Next" preview
4. Play for 2 minutes, noting piece types

**Expected Results**:
- All 7 piece types appear (I, O, T, S, Z, J, L)
- Pieces have correct shapes and colors
- Random distribution (no obvious patterns)

**Pass Criteria**: ✅ All 7 piece types observed within 2 minutes

---

#### Test 1.2: Piece Movement
**Purpose**: Verify left/right movement works correctly

**Steps**:
1. Start game
2. Press Left Arrow key multiple times
3. Press Right Arrow key multiple times
4. Try moving piece beyond board edges

**Expected Results**:
- Piece moves left when Left Arrow pressed
- Piece moves right when Right Arrow pressed
- Piece stops at board edges (no overflow)
- Movement is smooth and responsive

**Pass Criteria**: ✅ Movement works correctly, respects boundaries

---

#### Test 1.3: Piece Rotation
**Purpose**: Verify rotation mechanics and wall kicks

**Steps**:
1. Start game
2. Press Up Arrow to rotate clockwise
3. Press Z key to rotate counter-clockwise
4. Try rotating near walls and floor
5. Test with all piece types

**Expected Results**:
- Pieces rotate correctly in both directions
- Wall kick system works (pieces adjust position when needed)
- Rotation respects collision detection
- All piece types rotate properly (O piece doesn't rotate)

**Pass Criteria**: ✅ Rotation works for all pieces, wall kicks function

---

#### Test 1.4: Soft Drop and Hard Drop
**Purpose**: Verify drop mechanics

**Steps**:
1. Start game
2. Hold Down Arrow (soft drop)
3. Release Down Arrow
4. Press Spacebar (hard drop)
5. Observe piece placement

**Expected Results**:
- Soft drop increases fall speed
- Normal speed resumes when Down Arrow released
- Hard drop instantly places piece at bottom
- Score bonus awarded for hard drop

**Pass Criteria**: ✅ Both drop types work correctly, score updates

---

#### Test 1.5: Hold Piece Functionality
**Purpose**: Verify hold piece mechanic

**Steps**:
1. Start game
2. Press C key to hold current piece
3. Press C key again to swap with held piece
4. Try holding immediately after swap (should be blocked)

**Expected Results**:
- First hold: Current piece moves to hold area, next piece becomes current
- Second hold: Pieces swap between current and hold
- Cannot hold twice in a row without placing a piece
- Hold area displays correct piece

**Pass Criteria**: ✅ Hold mechanic works, swap restrictions enforced

---

#### Test 1.6: Ghost Piece Display
**Purpose**: Verify ghost piece shows correct landing position

**Steps**:
1. Start game
2. Move piece left and right
3. Rotate piece
4. Observe ghost piece position

**Expected Results**:
- Ghost piece shows where current piece will land
- Ghost piece updates immediately with movement/rotation
- Ghost piece is semi-transparent
- Ghost piece respects collision detection

**Pass Criteria**: ✅ Ghost piece accurately shows landing position

---

#### Test 1.7: Line Clearing
**Purpose**: Verify line clearing detection and animation

**Steps**:
1. Start game
2. Fill bottom row completely
3. Observe line clear animation
4. Fill multiple rows simultaneously
5. Check score and lines counter

**Expected Results**:
- Complete rows are detected and cleared
- Line clear animation plays (flash/fade)
- Rows above cleared lines drop down
- Score increases based on lines cleared (1/2/3/4)
- Lines counter increments correctly

**Pass Criteria**: ✅ Lines clear correctly, animation plays, score updates

---

#### Test 1.8: Collision Detection
**Purpose**: Verify collision detection works correctly

**Steps**:
1. Start game
2. Try moving piece into placed blocks
3. Try rotating piece into placed blocks
4. Stack pieces to top of board

**Expected Results**:
- Pieces cannot move through placed blocks
- Pieces cannot rotate into placed blocks
- Pieces lock in place when landing
- Game over triggers when pieces reach top

**Pass Criteria**: ✅ Collision detection prevents invalid moves

---

### 2. Scoring System Tests (game.js)

#### Test 2.1: Basic Scoring
**Purpose**: Verify score calculation for line clears

**Steps**:
1. Start game on Easy difficulty
2. Clear 1 line, note score
3. Clear 2 lines, note score
4. Clear 3 lines, note score
5. Clear 4 lines (Tetris), note score

**Expected Results**:
- Single: 100 × level points
- Double: 300 × level points
- Triple: 500 × level points
- Tetris: 800 × level points
- Score increases with level multiplier

**Pass Criteria**: ✅ Scores match expected values for each clear type

---

#### Test 2.2: T-Spin Detection
**Purpose**: Verify T-spin moves are detected and scored

**Steps**:
1. Start game
2. Create T-spin setup (T-shaped cavity)
3. Rotate T-piece into cavity
4. Observe score bonus

**Expected Results**:
- T-spin detected when T-piece rotates into tight space
- Bonus points awarded (400-1200 depending on lines)
- Visual feedback shows T-spin achievement
- Score significantly higher than normal clear

**Pass Criteria**: ✅ T-spins detected and scored correctly

---

#### Test 2.3: Combo System
**Purpose**: Verify combo tracking and bonuses

**Steps**:
1. Start game
2. Clear lines consecutively without letting piece land without clearing
3. Observe combo counter
4. Let piece land without clearing (breaks combo)

**Expected Results**:
- Combo counter increments with each consecutive clear
- Bonus points awarded for combos (50 × combo × level)
- Combo counter resets when no lines cleared
- Visual feedback shows combo count

**Pass Criteria**: ✅ Combo system tracks and scores correctly

---

#### Test 2.4: Hard Drop Bonus
**Purpose**: Verify hard drop awards bonus points

**Steps**:
1. Start game
2. Hard drop piece from top (Spacebar)
3. Note score increase
4. Soft drop piece to bottom
5. Compare scores

**Expected Results**:
- Hard drop awards 2 points per cell dropped
- Soft drop awards 1 point per cell dropped
- Score updates immediately on placement

**Pass Criteria**: ✅ Drop bonuses calculated correctly

---

### 3. Game Modes Tests (game.js)

#### Test 3.1: Marathon Mode
**Purpose**: Verify Marathon mode mechanics

**Steps**:
1. Select Marathon mode
2. Start game
3. Clear 10 lines
4. Observe level increase
5. Note speed increase

**Expected Results**:
- Game continues indefinitely until game over
- Level increases every 10 lines
- Speed increases with each level
- Score accumulates without limit

**Pass Criteria**: ✅ Marathon mode works, levels progress correctly

---

#### Test 3.2: Sprint Mode
**Purpose**: Verify Sprint mode 40-line objective

**Steps**:
1. Select Sprint mode
2. Start game
3. Clear lines while watching timer
4. Reach 40 lines cleared

**Expected Results**:
- Timer starts at 00:00
- Timer counts up during gameplay
- Game ends when 40 lines cleared
- Final time displayed
- Completion message shows

**Pass Criteria**: ✅ Sprint mode ends at 40 lines, timer accurate

---

#### Test 3.3: Ultra Mode
**Purpose**: Verify Ultra mode 3-minute timer

**Steps**:
1. Select Ultra mode
2. Start game
3. Play while watching timer
4. Let timer reach 00:00

**Expected Results**:
- Timer starts at 03:00
- Timer counts down during gameplay
- Game ends when timer reaches 00:00
- Final score displayed
- Time-up message shows

**Pass Criteria**: ✅ Ultra mode ends at 3 minutes, score tracked

---

### 4. Power-ups Tests (game.js)

#### Test 4.1: Power-up Spawning
**Purpose**: Verify power-ups appear randomly

**Steps**:
1. Start game
2. Play for 5 minutes
3. Count power-up appearances
4. Note power-up types

**Expected Results**:
- Power-ups appear randomly (~5% chance per piece)
- All 5 power-up types appear over time
- Power-ups are visually distinct
- Power-ups can be collected

**Pass Criteria**: ✅ Power-ups spawn randomly, all types appear

---

#### Test 4.2: Clear Row Power-up
**Purpose**: Verify Clear Row power-up functionality

**Steps**:
1. Start game
2. Collect Clear Row power-up
3. Observe effect

**Expected Results**:
- Bottom row clears instantly
- Rows above drop down
- Score increases
- Lines counter increments
- Visual effect plays

**Pass Criteria**: ✅ Clear Row removes bottom row correctly

---

#### Test 4.3: Slow Time Power-up
**Purpose**: Verify Slow Time power-up functionality

**Steps**:
1. Start game
2. Collect Slow Time power-up
3. Observe fall speed
4. Wait 30 seconds
5. Observe speed return to normal

**Expected Results**:
- Fall speed reduces by 50%
- Duration indicator shows (30 seconds)
- Speed returns to normal after expiry
- Visual indicator shows active state

**Pass Criteria**: ✅ Slow Time reduces speed for 30 seconds

---

#### Test 4.4: Bomb Piece Power-up
**Purpose**: Verify Bomb Piece power-up functionality

**Steps**:
1. Start game
2. Collect Bomb Piece power-up
3. Place next piece
4. Observe explosion effect

**Expected Results**:
- 3×3 area around piece clears
- Particle effect plays
- Score increases for cleared blocks
- Surrounding pieces remain intact

**Pass Criteria**: ✅ Bomb clears 3×3 area with visual effect

---

#### Test 4.5: Line Blast Power-up
**Purpose**: Verify Line Blast power-up functionality

**Steps**:
1. Start game
2. Create several incomplete rows
3. Collect Line Blast power-up
4. Observe effect

**Expected Results**:
- All incomplete rows clear instantly
- Complete rows remain
- Score increases
- Visual effect plays

**Pass Criteria**: ✅ Line Blast clears incomplete rows only

---

#### Test 4.6: Ghost Mode Power-up
**Purpose**: Verify Ghost Mode power-up functionality

**Steps**:
1. Start game
2. Collect Ghost Mode power-up
3. Place next 5 pieces through existing blocks
4. Observe counter

**Expected Results**:
- Next 5 pieces pass through blocks
- Counter shows remaining ghost pieces
- Pieces still land on bottom/complete rows
- Effect expires after 5 pieces

**Pass Criteria**: ✅ Ghost Mode allows 5 pieces to pass through

---

### 5. Achievements Tests (game.js)

#### Test 5.1: First Tetris Achievement
**Purpose**: Verify "First Tetris" achievement unlocks

**Steps**:
1. Start new game (clear achievements if needed)
2. Clear 4 lines at once
3. Check achievements page

**Expected Results**:
- Achievement unlocks on first Tetris clear
- Notification popup appears
- Achievement shows as unlocked in achievements page
- Achievement persists after page reload

**Pass Criteria**: ✅ Achievement unlocks and persists

---

#### Test 5.2: Combo Master Achievement
**Purpose**: Verify "Combo Master" achievement (10+ combo)

**Steps**:
1. Start game
2. Clear lines consecutively to build combo
3. Reach 10+ combo
4. Check achievements page

**Expected Results**:
- Achievement unlocks at 10 combo
- Notification appears
- Achievement persists

**Pass Criteria**: ✅ Achievement unlocks at 10 combo

---

#### Test 5.3: Multiple Achievement Tracking
**Purpose**: Verify multiple achievements can be tracked simultaneously

**Steps**:
1. Start game
2. Work toward multiple achievements in one game
3. Check achievements page periodically

**Expected Results**:
- Multiple achievements can unlock in same game
- Each achievement triggers separate notification
- All unlocked achievements persist
- Progress toward locked achievements tracked

**Pass Criteria**: ✅ Multiple achievements work independently

---

### 6. Rendering Tests (renderer.js)

#### Test 6.1: Board Rendering
**Purpose**: Verify game board renders correctly

**Steps**:
1. Start game
2. Observe board grid
3. Place pieces
4. Check visual quality

**Expected Results**:
- Grid lines visible and aligned
- Board dimensions correct (10×20)
- Placed pieces render with correct colors
- No visual artifacts or glitches

**Pass Criteria**: ✅ Board renders cleanly at 60 FPS

---

#### Test 6.2: Piece Rendering
**Purpose**: Verify pieces render with correct colors and shapes

**Steps**:
1. Start game
2. Observe current piece
3. Check next piece preview
4. Check hold piece display

**Expected Results**:
- All pieces have distinct colors
- Shapes are correct for each piece type
- Colors match theme
- Pieces render smoothly

**Pass Criteria**: ✅ All pieces render correctly with proper colors

---

#### Test 6.3: Animation Effects
**Purpose**: Verify animations play correctly

**Steps**:
1. Start game
2. Clear lines (observe flash/fade animation)
3. Collect power-up (observe particle effect)
4. Unlock achievement (observe celebration effect)

**Expected Results**:
- Line clear animation smooth and visible
- Particle effects render without lag
- Animations don't block gameplay
- Effects match theme colors

**Pass Criteria**: ✅ All animations play smoothly at 60 FPS

---

### 7. Audio System Tests (audio.js)

#### Test 7.1: Background Music
**Purpose**: Verify background music plays and loops

**Steps**:
1. Start game (ensure audio files present)
2. Listen for background music
3. Let music play for 3+ minutes
4. Pause game, check music pauses
5. Resume game, check music resumes

**Expected Results**:
- Music starts when game starts
- Music loops seamlessly
- Music pauses with game
- Music resumes with game
- Volume controllable

**Pass Criteria**: ✅ Music plays, loops, and responds to game state

---

#### Test 7.2: Sound Effects
**Purpose**: Verify all sound effects play correctly

**Steps**:
1. Start game
2. Move piece (should hear move sound)
3. Rotate piece (should hear rotate sound)
4. Drop piece (should hear drop sound)
5. Clear line (should hear clear sound)
6. Clear 4 lines (should hear tetris sound)
7. Level up (should hear levelup sound)
8. Collect power-up (should hear powerup sound)
9. Unlock achievement (should hear achievement sound)
10. Game over (should hear gameover sound)

**Expected Results**:
- Each action triggers appropriate sound
- Sounds don't overlap excessively
- Volume appropriate for each sound
- No audio distortion or clipping

**Pass Criteria**: ✅ All sound effects play correctly

---

#### Test 7.3: Audio Controls
**Purpose**: Verify audio mute and volume controls

**Steps**:
1. Start game
2. Open settings
3. Toggle mute button
4. Adjust volume slider
5. Close and reopen game

**Expected Results**:
- Mute button silences all audio
- Volume slider adjusts audio level
- Settings persist after page reload
- Audio state restored on game load

**Pass Criteria**: ✅ Audio controls work and persist

---

### 8. Storage Tests (storage.js)

#### Test 8.1: High Score Persistence
**Purpose**: Verify scores save and load correctly

**Steps**:
1. Play game and achieve score
2. Game over
3. Check leaderboard
4. Reload page
5. Check leaderboard again

**Expected Results**:
- Score appears in leaderboard
- Player name associated with score
- Score persists after reload
- Top 5 scores maintained
- Scores sorted correctly (highest first)

**Pass Criteria**: ✅ Scores save and load correctly

---

#### Test 8.2: Achievement Persistence
**Purpose**: Verify achievements save and load

**Steps**:
1. Unlock achievement
2. Check achievements page
3. Reload page
4. Check achievements page again

**Expected Results**:
- Unlocked achievements persist
- Achievement state loads on page load
- No duplicate unlocks

**Pass Criteria**: ✅ Achievements persist correctly

---

#### Test 8.3: Preferences Persistence
**Purpose**: Verify user preferences save and load

**Steps**:
1. Change theme
2. Adjust audio settings
3. Reload page
4. Check settings

**Expected Results**:
- Theme selection persists
- Audio settings persist
- Player name persists
- Last difficulty persists

**Pass Criteria**: ✅ All preferences persist correctly

---

### 9. UI Component Tests (ui.js)

#### Test 9.1: Start Screen
**Purpose**: Verify start screen functionality

**Steps**:
1. Load game
2. Enter player name
3. Select difficulty
4. Select game mode
5. Click Start Game

**Expected Results**:
- All input fields functional
- Start button enables after name entry
- Selections highlight correctly
- Game starts with correct settings

**Pass Criteria**: ✅ Start screen fully functional

---

#### Test 9.2: Pause Overlay
**Purpose**: Verify pause functionality

**Steps**:
1. Start game
2. Press P key or Pause button
3. Try moving pieces (should be blocked)
4. Click Resume
5. Try moving pieces (should work)

**Expected Results**:
- Game pauses immediately
- Overlay displays
- Input blocked during pause
- Game resumes correctly
- Timer pauses (Sprint/Ultra modes)

**Pass Criteria**: ✅ Pause/resume works correctly

---

#### Test 9.3: Game Over Screen
**Purpose**: Verify game over screen displays correctly

**Steps**:
1. Play until game over
2. Observe game over screen
3. Check final score display
4. Check leaderboard
5. Click Play Again

**Expected Results**:
- Game over screen appears
- Final score displayed
- Leaderboard shows with player's score highlighted
- Play Again button returns to start screen
- Share buttons functional

**Pass Criteria**: ✅ Game over screen fully functional

---

#### Test 9.4: Settings Menu
**Purpose**: Verify settings menu functionality

**Steps**:
1. Open settings menu
2. Change theme
3. Adjust audio settings
4. Close settings
5. Reopen settings

**Expected Results**:
- Settings menu opens/closes smoothly
- Theme changes apply immediately
- Audio settings apply immediately
- Settings persist when reopened

**Pass Criteria**: ✅ Settings menu fully functional

---

#### Test 9.5: Achievements Page
**Purpose**: Verify achievements page displays correctly

**Steps**:
1. Open achievements page
2. Check locked achievements
3. Check unlocked achievements
4. Close achievements page

**Expected Results**:
- All achievements listed
- Locked/unlocked status clear
- Unlock conditions displayed
- Progress indicators shown
- Page closes correctly

**Pass Criteria**: ✅ Achievements page displays correctly

---

### 10. Theme System Tests (theme.js)

#### Test 10.1: Theme Switching
**Purpose**: Verify all themes work correctly

**Steps**:
1. Start game
2. Open settings
3. Select Classic theme
4. Select Neon theme
5. Select Ocean theme
6. Select Sunset theme
7. Select Dark theme

**Expected Results**:
- Each theme applies immediately
- Colors change for all UI elements
- Canvas colors update
- Theme persists after reload
- All themes visually distinct

**Pass Criteria**: ✅ All 5 themes work correctly

---

## Test Summary Template

After completing all unit tests, fill out this summary:

```
UNIT TEST SUMMARY
=================
Date: ___________
Tester: ___________

Core Game Logic: ___/8 tests passed
Scoring System: ___/4 tests passed
Game Modes: ___/3 tests passed
Power-ups: ___/6 tests passed
Achievements: ___/3 tests passed
Rendering: ___/3 tests passed
Audio System: ___/3 tests passed
Storage: ___/3 tests passed
UI Components: ___/5 tests passed
Theme System: ___/1 tests passed

TOTAL: ___/39 tests passed

Critical Issues Found: ___________
Minor Issues Found: ___________
```

## Next Steps

After completing unit tests:
1. Document any failures or issues
2. Fix critical issues before proceeding
3. Move to Integration Test Instructions
4. Test feature interactions and workflows
