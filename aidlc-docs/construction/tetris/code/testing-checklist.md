# Tetris Game - Testing Checklist

## Testing Overview
This document provides a comprehensive testing checklist for the Tetris game implementation. All tests should be performed manually in a web browser.

## Browser Compatibility Testing
- [ ] Chrome (latest version)
- [ ] Firefox (latest version)
- [ ] Safari (latest version)
- [ ] Edge (latest version)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Core Game Mechanics Testing

### Piece Movement
- [ ] Left arrow moves piece left
- [ ] Right arrow moves piece right
- [ ] Down arrow performs soft drop (faster falling)
- [ ] Spacebar performs hard drop (instant placement)
- [ ] Pieces stop at board edges
- [ ] Pieces stop when colliding with placed blocks
- [ ] Movement is smooth and responsive (<50ms input lag)

### Piece Rotation
- [ ] Up arrow rotates piece clockwise
- [ ] Z key rotates piece counter-clockwise
- [ ] Rotation respects wall kicks (SRS system)
- [ ] Rotation stops at board edges
- [ ] Rotation stops when colliding with placed blocks
- [ ] I-piece rotates correctly (special case)
- [ ] O-piece doesn't rotate (correct behavior)

### Hold Piece
- [ ] C key holds current piece
- [ ] Hold piece swaps with current piece
- [ ] Hold piece can only be used once per piece
- [ ] Hold piece displays correctly in UI
- [ ] Hold piece persists across game sessions

### Ghost Piece
- [ ] Ghost piece shows where current piece will land
- [ ] Ghost piece is semi-transparent
- [ ] Ghost piece updates when piece moves
- [ ] Ghost piece updates when piece rotates
- [ ] Ghost piece respects theme colors

### Line Clearing
- [ ] Single line clear works correctly
- [ ] Double line clear works correctly
- [ ] Triple line clear works correctly
- [ ] Tetris (4 lines) clear works correctly
- [ ] Lines clear with animation
- [ ] Blocks above cleared lines fall down
- [ ] Score updates correctly after line clear

### T-Spin Detection
- [ ] T-spin mini detected correctly
- [ ] T-spin single detected correctly
- [ ] T-spin double detected correctly
- [ ] T-spin triple detected correctly
- [ ] T-spin bonus points awarded
- [ ] T-spin visual feedback displayed

## Game Modes Testing

### Marathon Mode
- [ ] Game starts at level 1
- [ ] Level increases every 10 lines
- [ ] Speed increases with each level
- [ ] Game continues indefinitely until game over
- [ ] Score accumulates correctly
- [ ] High score saves correctly

### Sprint Mode
- [ ] Timer starts when game begins
- [ ] Timer counts up correctly
- [ ] Game ends when 40 lines cleared
- [ ] Final time displayed correctly
- [ ] Best time saves correctly
- [ ] Leaderboard shows time instead of score

### Ultra Mode
- [ ] Timer starts at 3:00
- [ ] Timer counts down correctly
- [ ] Game ends when timer reaches 0:00
- [ ] Score maximization works
- [ ] High score saves correctly
- [ ] Leaderboard shows score

## Scoring System Testing

### Base Scoring
- [ ] Single line: 100 × level points
- [ ] Double line: 300 × level points
- [ ] Triple line: 500 × level points
- [ ] Tetris: 800 × level points
- [ ] Soft drop: 1 point per cell
- [ ] Hard drop: 2 points per cell

### Combo System
- [ ] Combo counter increases on consecutive clears
- [ ] Combo bonus: 50 × combo × level points
- [ ] Combo resets when no lines cleared
- [ ] Combo counter displays correctly

### Back-to-Back Bonus
- [ ] Back-to-back Tetris: 1.5× multiplier
- [ ] Back-to-back T-spin: 1.5× multiplier
- [ ] Back-to-back counter displays correctly
- [ ] Back-to-back resets on non-difficult clear

### Difficulty Multipliers
- [ ] Easy mode: 1.0× multiplier
- [ ] Medium mode: 1.5× multiplier
- [ ] Hard mode: 2.0× multiplier

## Power-ups Testing

### Power-up Spawning
- [ ] Power-ups spawn randomly (5% chance per piece)
- [ ] Power-up appears on board
- [ ] Power-up visual indicator shows
- [ ] Power-up collected when piece lands on it

### Clear Row Power-up
- [ ] Clears bottom row instantly
- [ ] Score updates correctly
- [ ] Lines counter updates
- [ ] Visual effect plays

### Slow Time Power-up
- [ ] Fall speed reduces by 50%
- [ ] Duration: 30 seconds
- [ ] Timer displays correctly
- [ ] Speed restores after expiry
- [ ] Visual indicator shows active state

### Bomb Piece Power-up
- [ ] Clears 3×3 area on placement
- [ ] Particle effect plays
- [ ] Score updates correctly
- [ ] Blocks above fall down

### Line Blast Power-up
- [ ] Clears all incomplete lines
- [ ] Score updates correctly
- [ ] Lines counter updates
- [ ] Visual effect plays

### Ghost Mode Power-up
- [ ] Next 5 pieces pass through blocks
- [ ] Counter displays correctly
- [ ] Counter decrements per piece
- [ ] Visual indicator shows active state
- [ ] Mode ends after 5 pieces

## Achievements Testing

### Achievement Unlocking
- [ ] First Tetris: Clear 4 lines at once
- [ ] Combo Master: Achieve 10+ combo
- [ ] Speed Demon: Complete Sprint under 2 minutes
- [ ] Centurion: Score 100,000 points
- [ ] T-spin Expert: Perform 10 T-spins in one game
- [ ] Marathon Runner: Survive 30 minutes
- [ ] Power Player: Use all 5 power-ups in one game

### Achievement System
- [ ] Achievement notification displays on unlock
- [ ] Achievement persists to localStorage
- [ ] Achievement page shows all achievements
- [ ] Locked achievements show unlock conditions
- [ ] Unlocked achievements show unlock date
- [ ] Achievement progress indicators work

## Theme System Testing

### Theme Switching
- [ ] Classic theme applies correctly
- [ ] Neon theme applies correctly
- [ ] Ocean theme applies correctly
- [ ] Sunset theme applies correctly
- [ ] Dark mode theme applies correctly
- [ ] Theme persists across sessions
- [ ] Canvas colors update with theme
- [ ] UI colors update with theme

### Theme Visual Quality
- [ ] All themes have good contrast
- [ ] Text is readable in all themes
- [ ] Piece colors are distinct in all themes
- [ ] Ghost piece is visible in all themes
- [ ] Animations work in all themes

## Audio System Testing

### Background Music
- [ ] Music plays on game start
- [ ] Music loops correctly
- [ ] Music pauses when game pauses
- [ ] Music resumes when game resumes
- [ ] Music stops on game over
- [ ] Volume control works

### Sound Effects
- [ ] Move sound plays on piece movement
- [ ] Rotate sound plays on piece rotation
- [ ] Drop sound plays on piece placement
- [ ] Clear sound plays on line clear
- [ ] Tetris sound plays on 4-line clear
- [ ] Level up sound plays on level increase
- [ ] Game over sound plays on game end
- [ ] Power-up sound plays on collection
- [ ] Achievement sound plays on unlock

### Audio Controls
- [ ] Mute button toggles audio
- [ ] Volume slider adjusts volume
- [ ] Audio settings persist across sessions
- [ ] Audio works after user interaction (browser requirement)

## UI Testing

### Start Screen
- [ ] Player name entry works
- [ ] Difficulty selection works (Easy/Medium/Hard)
- [ ] Game mode selection works (Marathon/Sprint/Ultra)
- [ ] Control instructions display correctly
- [ ] Start button launches game
- [ ] Resume saved game option appears if game saved

### Game Screen
- [ ] Score displays and updates correctly
- [ ] Level displays and updates correctly
- [ ] Lines cleared displays and updates correctly
- [ ] Timer displays correctly (Sprint/Ultra modes)
- [ ] Next piece preview shows correctly
- [ ] Hold piece displays correctly
- [ ] Active power-ups display correctly
- [ ] Pause button works

### Pause Overlay
- [ ] Pause overlay appears when P or Escape pressed
- [ ] Resume button continues game
- [ ] Settings button opens settings
- [ ] Quit button returns to start screen
- [ ] Game state preserved during pause

### Game Over Screen
- [ ] Final score displays correctly
- [ ] Leaderboard displays top 5 scores
- [ ] Player's score highlighted if in top 5
- [ ] Play again button restarts game
- [ ] Share score button works
- [ ] Return to menu button works

### Settings Menu
- [ ] Theme selector shows all 5 themes
- [ ] Theme preview works
- [ ] Audio mute toggle works
- [ ] Volume slider works
- [ ] Apply button saves settings
- [ ] Close button closes menu

### Achievements Page
- [ ] All 7+ achievements display
- [ ] Locked achievements show conditions
- [ ] Unlocked achievements show date
- [ ] Progress indicators work
- [ ] Close button returns to previous screen

### Notifications
- [ ] Achievement unlock notification appears
- [ ] Power-up collected notification appears
- [ ] Level up notification appears
- [ ] Notifications auto-dismiss after 3 seconds
- [ ] Multiple notifications queue correctly

## Multiplayer Features Testing

### Score Sharing
- [ ] Generate score code button works
- [ ] Score code copies to clipboard
- [ ] Share URL includes score parameter
- [ ] Twitter share link works
- [ ] Facebook share link works
- [ ] Generic share API works (if supported)

### Challenge Mode
- [ ] Load friend's score from URL parameter
- [ ] Friend's score displays during gameplay
- [ ] "Beat Friend's Score" indicator shows
- [ ] Indicator updates when score surpassed
- [ ] Challenge persists across game sessions

## Persistence Testing

### High Scores
- [ ] Top 5 scores save to localStorage
- [ ] Scores load on game start
- [ ] New high score updates leaderboard
- [ ] Player names save with scores
- [ ] Game mode and difficulty save with scores

### Achievements
- [ ] Unlocked achievements save to localStorage
- [ ] Achievements load on game start
- [ ] Achievement progress persists

### Player Preferences
- [ ] Player name persists
- [ ] Selected theme persists
- [ ] Audio settings persist
- [ ] Last selected difficulty persists

### Game State
- [ ] Current game saves on pause/close
- [ ] Saved game loads on resume
- [ ] Saved game clears on completion
- [ ] All game state properties save correctly

## Responsive Design Testing

### Desktop (1920×1080)
- [ ] Layout displays correctly
- [ ] Canvas size appropriate
- [ ] All UI elements visible
- [ ] Text readable
- [ ] Buttons clickable

### Tablet (768×1024)
- [ ] Layout adjusts correctly
- [ ] Canvas size appropriate
- [ ] All UI elements visible
- [ ] Text readable
- [ ] Buttons touch-friendly

### Mobile (375×667)
- [ ] Layout adjusts correctly
- [ ] Canvas size appropriate
- [ ] All UI elements visible
- [ ] Text readable
- [ ] Buttons touch-friendly
- [ ] Portrait orientation works
- [ ] Landscape orientation works

### Minimum Resolution (320×568)
- [ ] Game playable at minimum resolution
- [ ] All critical UI elements visible
- [ ] Text readable (may be small)

## Performance Testing

### Frame Rate
- [ ] Game runs at 60 FPS on desktop
- [ ] Game runs at 60 FPS on tablet
- [ ] Game runs at 60 FPS on mobile
- [ ] No frame drops during line clears
- [ ] No frame drops during particle effects
- [ ] No frame drops with multiple power-ups active

### Input Lag
- [ ] Input lag < 50ms on desktop
- [ ] Input lag < 50ms on tablet
- [ ] Input lag < 50ms on mobile
- [ ] No missed inputs during rapid key presses
- [ ] Input buffering works correctly

### Memory Usage
- [ ] No memory leaks during extended play
- [ ] Memory usage stable over time
- [ ] Game doesn't slow down after 30+ minutes

## Edge Cases Testing

### Boundary Conditions
- [ ] Pieces can't move beyond left edge
- [ ] Pieces can't move beyond right edge
- [ ] Pieces can't move below bottom
- [ ] Rotation works at edges (wall kicks)
- [ ] Game over when pieces reach top

### Rapid Input
- [ ] Rapid left/right movement works
- [ ] Rapid rotation works
- [ ] Rapid soft drop works
- [ ] Multiple simultaneous keys work
- [ ] Input buffering prevents missed inputs

### Special Scenarios
- [ ] Hold piece on first piece works
- [ ] Hold piece swap works correctly
- [ ] Power-up collection during line clear
- [ ] Multiple power-ups active simultaneously
- [ ] Achievement unlock during game over
- [ ] Pause during line clear animation
- [ ] Theme change during gameplay

## Bug Fixes and Polish

### Known Issues to Fix
- [ ] [List any bugs discovered during testing]
- [ ] [Add more as found]

### Polish Items
- [ ] Smooth animations throughout
- [ ] Consistent visual feedback
- [ ] Clear audio cues
- [ ] Intuitive UI flow
- [ ] Helpful error messages
- [ ] Loading states for async operations

## Testing Sign-off

### Tester Information
- **Tester Name**: _______________
- **Test Date**: _______________
- **Browser**: _______________
- **Device**: _______________

### Test Results
- **Total Tests**: _______________
- **Passed**: _______________
- **Failed**: _______________
- **Blocked**: _______________

### Overall Assessment
- [ ] Ready for deployment
- [ ] Needs minor fixes
- [ ] Needs major fixes
- [ ] Not ready for deployment

### Notes
[Add any additional notes, observations, or recommendations]
