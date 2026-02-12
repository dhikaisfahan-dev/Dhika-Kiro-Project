# Tetris Game - Integration Test Instructions

## Purpose

Test interactions between game components to ensure they work together correctly. Integration tests verify that modules communicate properly and produce expected combined behavior.

## Test Environment Setup

### Prerequisites
- Game running in browser (`http://localhost:8000/tetris/`)
- Browser DevTools open (F12)
- Console tab visible
- All unit tests passed

### Setup Steps

1. **Clear Browser Data** (for clean test state)
   ```
   - Open DevTools (F12)
   - Go to Application tab
   - Clear localStorage
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   ```

2. **Verify Clean State**
   ```
   - No saved games
   - No high scores
   - No unlocked achievements
   - Default theme active
   ```

## Integration Test Scenarios

### Scenario 1: Game Start → Gameplay → Game Over Flow

**Purpose**: Verify complete game lifecycle integration

**Components Tested**: UI → Game Logic → Renderer → Storage

**Steps**:
1. Load game page
2. Enter player name "TestPlayer"
3. Select Medium difficulty
4. Select Marathon mode
5. Click Start Game
6. Play until game over (let pieces stack to top)
7. Observe game over screen
8. Check leaderboard

**Expected Results**:
- ✅ Start screen displays correctly
- ✅ Game initializes with selected settings
- ✅ Gameplay runs smoothly
- ✅ Game over triggers when pieces reach top
- ✅ Final score displayed
- ✅ Score saved to leaderboard with player name
- ✅ Leaderboard shows score correctly

**Pass Criteria**: Complete flow works without errors, score persists

---

### Scenario 2: Scoring System → Leaderboard Integration

**Purpose**: Verify scoring calculations integrate with leaderboard

**Components Tested**: Game Logic (scoring) → Storage → UI (leaderboard)

**Steps**:
1. Start game with name "Player1"
2. Clear 1 line (note score)
3. Clear 2 lines (note score)
4. Clear 4 lines - Tetris (note score)
5. Perform T-spin (note score)
6. Build combo (note score increases)
7. Game over
8. Check leaderboard entry

**Expected Results**:
- ✅ Score increases correctly for each clear type
- ✅ Combo multiplier applies
- ✅ T-spin bonus adds correctly
- ✅ Final score matches sum of all bonuses
- ✅ Leaderboard entry shows correct total
- ✅ Player name associated with score

**Pass Criteria**: All scoring bonuses integrate correctly, leaderboard accurate

---

### Scenario 3: Power-up System → Game Logic Integration

**Purpose**: Verify power-ups interact correctly with game state

**Components Tested**: Game Logic (power-ups) → Renderer → Audio

**Steps**:
1. Start game
2. Play until power-up appears
3. Collect Clear Row power-up
4. Observe bottom row clear
5. Collect Slow Time power-up
6. Observe fall speed reduction
7. Collect Bomb Piece power-up
8. Place piece and observe explosion
9. Check score updates for each power-up

**Expected Results**:
- ✅ Power-ups spawn randomly during gameplay
- ✅ Collection triggers visual effect
- ✅ Power-up effects apply correctly
- ✅ Score increases appropriately
- ✅ Sound effects play
- ✅ Game state updates correctly
- ✅ Multiple power-ups can be active simultaneously

**Pass Criteria**: Power-ups integrate with game logic, rendering, and audio

---

### Scenario 4: Achievement System → Storage → UI Integration

**Purpose**: Verify achievements unlock and persist correctly

**Components Tested**: Game Logic (achievement tracking) → Storage → UI (notifications + page)

**Steps**:
1. Start new game (clear achievements first)
2. Clear 4 lines at once (First Tetris achievement)
3. Observe notification popup
4. Continue playing
5. Build 10+ combo (Combo Master achievement)
6. Observe second notification
7. Game over
8. Open achievements page
9. Reload page
10. Open achievements page again

**Expected Results**:
- ✅ First Tetris achievement unlocks on 4-line clear
- ✅ Notification popup appears
- ✅ Combo Master achievement unlocks at 10 combo
- ✅ Second notification appears
- ✅ Achievements page shows both unlocked
- ✅ Achievements persist after page reload
- ✅ Locked achievements still show as locked

**Pass Criteria**: Achievements unlock, notify, display, and persist correctly

---

### Scenario 5: Theme System → Renderer → Storage Integration

**Purpose**: Verify theme changes affect all visual elements and persist

**Components Tested**: Theme System → Renderer → Storage → UI

**Steps**:
1. Start game with default theme
2. Open settings
3. Select Neon theme
4. Observe color changes
5. Start playing
6. Observe piece colors, board colors, UI colors
7. Reload page
8. Check theme still applied
9. Change to Ocean theme
10. Verify all colors update

**Expected Results**:
- ✅ Theme selection applies immediately
- ✅ All UI elements update colors
- ✅ Canvas/board colors update
- ✅ Piece colors update
- ✅ Theme persists after reload
- ✅ Multiple theme switches work correctly
- ✅ No visual artifacts during theme change

**Pass Criteria**: Themes integrate with all visual components and persist

---

### Scenario 6: Audio System → Game Events Integration

**Purpose**: Verify audio responds to all game events

**Components Tested**: Audio System → Game Logic → UI

**Steps**:
1. Start game (ensure audio files present)
2. Perform these actions and listen for sounds:
   - Move piece left/right
   - Rotate piece
   - Soft drop
   - Hard drop
   - Clear single line
   - Clear 4 lines (Tetris)
   - Level up
   - Collect power-up
   - Unlock achievement
   - Game over
3. Open settings
4. Mute audio
5. Perform actions (should be silent)
6. Unmute audio
7. Adjust volume slider
8. Reload page
9. Check audio settings persist

**Expected Results**:
- ✅ Each action triggers appropriate sound
- ✅ Background music plays continuously
- ✅ Mute button silences all audio
- ✅ Volume slider adjusts audio level
- ✅ Audio settings persist after reload
- ✅ No audio overlap or distortion
- ✅ Sounds match game events timing

**Pass Criteria**: Audio system integrates with all game events and persists settings

---

### Scenario 7: Pause System → Game State Integration

**Purpose**: Verify pause freezes all game systems correctly

**Components Tested**: UI (pause) → Game Logic → Renderer → Audio

**Steps**:
1. Start Marathon mode game
2. Play for 30 seconds
3. Press P key to pause
4. Observe:
   - Pieces stop falling
   - Timer stops (if applicable)
   - Input blocked
   - Music pauses
   - Pause overlay displays
5. Wait 10 seconds
6. Click Resume
7. Observe:
   - Pieces resume falling
   - Timer resumes
   - Input works
   - Music resumes
   - Game state unchanged

**Expected Results**:
- ✅ Pause freezes all game systems
- ✅ Timer stops (Sprint/Ultra modes)
- ✅ Piece positions unchanged
- ✅ Score unchanged
- ✅ Music pauses
- ✅ Resume restores exact state
- ✅ No time lost during pause

**Pass Criteria**: Pause completely freezes and resumes game state

---

### Scenario 8: Game Modes → Scoring → UI Integration

**Purpose**: Verify each game mode integrates correctly with scoring and UI

**Components Tested**: Game Logic (modes) → Scoring → UI → Storage

**Test 8.1: Marathon Mode**
1. Select Marathon mode
2. Play and clear 10 lines
3. Observe level increase
4. Observe speed increase
5. Continue playing
6. Game over
7. Check final score and level

**Expected Results**:
- ✅ Level increases every 10 lines
- ✅ Speed increases with level
- ✅ Score accumulates correctly
- ✅ Game continues until game over
- ✅ Final stats displayed correctly

**Test 8.2: Sprint Mode**
1. Select Sprint mode
2. Start game
3. Observe timer counting up
4. Clear lines while watching timer
5. Reach 40 lines
6. Observe game end
7. Check final time

**Expected Results**:
- ✅ Timer starts at 00:00
- ✅ Timer counts up during play
- ✅ Timer pauses when paused
- ✅ Game ends at exactly 40 lines
- ✅ Final time displayed
- ✅ Time saved to leaderboard

**Test 8.3: Ultra Mode**
1. Select Ultra mode
2. Start game
3. Observe timer counting down from 03:00
4. Play and accumulate score
5. Let timer reach 00:00
6. Observe game end
7. Check final score

**Expected Results**:
- ✅ Timer starts at 03:00
- ✅ Timer counts down during play
- ✅ Timer pauses when paused
- ✅ Game ends at exactly 00:00
- ✅ Final score displayed
- ✅ Score saved to leaderboard

**Pass Criteria**: All three modes integrate correctly with timing and scoring

---

### Scenario 9: Hold Piece → Ghost Piece → Rendering Integration

**Purpose**: Verify preview features integrate with rendering

**Components Tested**: Game Logic (hold/ghost) → Renderer

**Steps**:
1. Start game
2. Observe ghost piece showing landing position
3. Move current piece left/right
4. Observe ghost piece updates
5. Press C to hold piece
6. Observe:
   - Current piece moves to hold area
   - Next piece becomes current
   - New ghost piece appears
7. Press C again to swap
8. Observe pieces swap correctly
9. Try pressing C immediately (should be blocked)

**Expected Results**:
- ✅ Ghost piece always shows correct landing position
- ✅ Ghost piece updates with movement/rotation
- ✅ Hold piece displays correctly
- ✅ Hold swap works correctly
- ✅ Hold restrictions enforced (can't hold twice in a row)
- ✅ All preview features render without lag

**Pass Criteria**: Preview features integrate seamlessly with rendering

---

### Scenario 10: Multiplayer Score Sharing Integration

**Purpose**: Verify score sharing functionality works

**Components Tested**: UI (share buttons) → Storage → Browser APIs

**Steps**:
1. Complete game with high score
2. Observe game over screen
3. Click "Share Score" button
4. Observe share options (Twitter, Facebook, Copy Link)
5. Click "Copy Link"
6. Paste link in new browser tab
7. Observe challenge mode loads
8. Play game trying to beat shared score
9. Check comparison display

**Expected Results**:
- ✅ Share buttons appear on game over
- ✅ Share options functional
- ✅ Link copies to clipboard
- ✅ Link loads challenge mode
- ✅ Target score displays
- ✅ Comparison shows during gameplay
- ✅ Result shows if target beaten

**Pass Criteria**: Score sharing integrates with UI and browser APIs

---

### Scenario 11: Persistence → Session Continuity Integration

**Purpose**: Verify game state persists and resumes correctly

**Components Tested**: Storage → Game Logic → UI

**Steps**:
1. Start game
2. Play for 2 minutes
3. Note current score, level, lines
4. Close browser tab (don't game over)
5. Reopen game
6. Observe "Resume Game" option
7. Click Resume
8. Verify game state restored:
   - Score matches
   - Level matches
   - Lines matches
   - Board state matches
   - Next piece matches
   - Hold piece matches (if any)
9. Continue playing
10. Game over
11. Reload page
12. Verify no resume option (game completed)

**Expected Results**:
- ✅ Game state saves automatically
- ✅ Resume option appears on reload
- ✅ All game state restored correctly
- ✅ Can continue playing from exact point
- ✅ Completed games don't show resume
- ✅ High scores persist separately

**Pass Criteria**: Game state persists and resumes accurately

---

### Scenario 12: Difficulty → Speed → Scoring Integration

**Purpose**: Verify difficulty affects gameplay and scoring correctly

**Components Tested**: Game Logic (difficulty) → Scoring → Renderer

**Test 12.1: Easy Difficulty**
1. Select Easy difficulty
2. Start game
3. Observe initial fall speed (slow)
4. Clear 10 lines
5. Observe level 2 speed
6. Note score for single line clear

**Test 12.2: Medium Difficulty**
1. Select Medium difficulty
2. Start game
3. Observe initial fall speed (moderate)
4. Clear 10 lines
5. Observe level 2 speed
6. Note score for single line clear

**Test 12.3: Hard Difficulty**
1. Select Hard difficulty
2. Start game
3. Observe initial fall speed (fast)
4. Clear 10 lines
5. Observe level 2 speed
6. Note score for single line clear

**Expected Results**:
- ✅ Easy: Slowest initial speed, gentler progression
- ✅ Medium: Standard speed and progression
- ✅ Hard: Fastest initial speed, aggressive progression
- ✅ Score multipliers differ by difficulty
- ✅ Difficulty displayed during gameplay
- ✅ Speed progression matches difficulty

**Pass Criteria**: Difficulty integrates with speed and scoring systems

---

## Integration Test Summary Template

After completing all integration tests, fill out this summary:

```
INTEGRATION TEST SUMMARY
========================
Date: ___________
Tester: ___________

Scenario 1 - Game Lifecycle: PASS / FAIL
Scenario 2 - Scoring → Leaderboard: PASS / FAIL
Scenario 3 - Power-ups → Game Logic: PASS / FAIL
Scenario 4 - Achievements → Storage: PASS / FAIL
Scenario 5 - Theme → Renderer: PASS / FAIL
Scenario 6 - Audio → Game Events: PASS / FAIL
Scenario 7 - Pause → Game State: PASS / FAIL
Scenario 8 - Game Modes Integration: PASS / FAIL
Scenario 9 - Preview Features: PASS / FAIL
Scenario 10 - Score Sharing: PASS / FAIL
Scenario 11 - Persistence: PASS / FAIL
Scenario 12 - Difficulty Integration: PASS / FAIL

TOTAL: ___/12 scenarios passed

Critical Integration Issues: ___________
Minor Integration Issues: ___________
```

## Common Integration Issues

### Issue: Components Not Communicating
**Symptoms**: Features work in isolation but fail together
**Debug**: Check event listeners, function calls between modules
**Solution**: Verify module interfaces and data flow

### Issue: State Synchronization Problems
**Symptoms**: UI shows different state than game logic
**Debug**: Console log state in multiple modules
**Solution**: Ensure single source of truth for game state

### Issue: Timing/Race Conditions
**Symptoms**: Intermittent failures, order-dependent bugs
**Debug**: Add delays, check async operations
**Solution**: Proper event sequencing, promise handling

### Issue: Storage Conflicts
**Symptoms**: Data not persisting or loading incorrectly
**Debug**: Check localStorage in DevTools Application tab
**Solution**: Verify storage keys, data serialization

## Cleanup After Testing

1. Clear localStorage
2. Close all browser tabs
3. Document any issues found
4. Create bug reports for failures
5. Retest after fixes

## Next Steps

After completing integration tests:
1. Document all integration issues
2. Fix critical integration problems
3. Retest failed scenarios
4. Proceed to Performance Test Instructions
5. Prepare for final build verification
