# Tetris Game - Performance Test Instructions

## Purpose

Validate system performance under various conditions to ensure it meets NFR1 requirements:
- **60 FPS gameplay**: Smooth rendering without frame drops
- **<50ms input lag**: Responsive controls
- **<50MB memory**: Efficient resource usage

## Performance Requirements (from NFR1)

- **Frame Rate**: 60 FPS during gameplay
- **Input Lag**: < 50ms keyboard response
- **Memory Usage**: < 50MB in browser
- **Rendering**: Efficient canvas/DOM operations

## Test Environment Setup

### Prerequisites
- Game running in browser (`http://localhost:8000/tetris/`)
- Browser DevTools open (F12)
- Performance tab ready
- Close unnecessary browser tabs and applications

### Browser Performance Tools

**Chrome DevTools Performance Tab**:
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record button (or Ctrl+E)
4. Perform test actions
5. Click Stop button
6. Analyze results

**Firefox DevTools Performance Tab**:
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Start Recording
4. Perform test actions
5. Click Stop Recording
6. Analyze results

## Performance Test Scenarios

### Test 1: Frame Rate During Normal Gameplay

**Purpose**: Verify 60 FPS maintained during standard gameplay

**Steps**:
1. Start game (Marathon mode, Medium difficulty)
2. Open DevTools Performance tab
3. Start recording
4. Play for 60 seconds:
   - Move pieces left/right
   - Rotate pieces
   - Clear lines
   - Let pieces fall naturally
5. Stop recording
6. Analyze frame rate

**Expected Results**:
- ✅ Frame rate stays at 60 FPS (±2 FPS acceptable)
- ✅ No significant frame drops
- ✅ Smooth animations throughout
- ✅ No visual stuttering

**Measurement**:
- Check FPS graph in Performance tab
- Look for green bars at 60 FPS
- Identify any red/yellow warnings

**Pass Criteria**: Average FPS ≥ 58, no drops below 55 FPS

---

### Test 2: Frame Rate During Intensive Effects

**Purpose**: Verify performance during particle effects and animations

**Steps**:
1. Start game
2. Open DevTools Performance tab
3. Start recording
4. Trigger intensive effects:
   - Clear 4 lines (Tetris) - particle effects
   - Perform T-spin - celebration effects
   - Collect power-ups - collection animations
   - Activate Bomb power-up - explosion effects
   - Clear multiple lines rapidly - combo effects
5. Stop recording after 30 seconds
6. Analyze frame rate during effects

**Expected Results**:
- ✅ Frame rate stays at 60 FPS during effects
- ✅ Particle effects don't cause lag
- ✅ Multiple simultaneous effects handled
- ✅ No frame drops during animations

**Pass Criteria**: FPS ≥ 55 during all effects, average ≥ 58

---

### Test 3: Input Lag Measurement

**Purpose**: Verify keyboard input response time < 50ms

**Steps**:
1. Start game
2. Open DevTools Performance tab
3. Start recording
4. Rapidly press keys:
   - Left Arrow (10 times)
   - Right Arrow (10 times)
   - Up Arrow (10 times)
   - Spacebar (5 times)
5. Stop recording
6. Analyze input events in timeline

**Expected Results**:
- ✅ Input events processed immediately
- ✅ Visual response within 1-2 frames (16-33ms)
- ✅ No input buffering delays
- ✅ Consistent response times

**Measurement**:
- Find keyboard events in timeline
- Measure time from event to visual update
- Check for event handler execution time

**Pass Criteria**: Input-to-visual response < 50ms for all inputs

---

### Test 4: Memory Usage During Extended Play

**Purpose**: Verify memory usage stays under 50MB

**Steps**:
1. Start game
2. Open DevTools Memory tab
3. Take heap snapshot (baseline)
4. Play for 10 minutes:
   - Clear lines
   - Collect power-ups
   - Unlock achievements
   - Change themes
5. Take second heap snapshot
6. Compare memory usage

**Expected Results**:
- ✅ Memory usage < 50MB
- ✅ No significant memory leaks
- ✅ Memory stable over time
- ✅ Garbage collection working

**Measurement**:
- Check heap size in snapshots
- Look for growing object counts
- Identify retained objects

**Pass Criteria**: Total memory < 50MB, no leaks detected

---

### Test 5: Performance Under Load (Fast Gameplay)

**Purpose**: Verify performance during rapid piece placement

**Steps**:
1. Start game (Hard difficulty for fast speed)
2. Open DevTools Performance tab
3. Start recording
4. Play aggressively for 60 seconds:
   - Rapid left/right movements
   - Frequent rotations
   - Continuous hard drops
   - Fast line clearing
5. Stop recording
6. Analyze performance

**Expected Results**:
- ✅ Frame rate maintained at 60 FPS
- ✅ No input lag despite rapid inputs
- ✅ Rendering keeps up with game speed
- ✅ No performance degradation

**Pass Criteria**: FPS ≥ 55, input lag < 50ms, no stuttering

---

### Test 6: Theme Switching Performance

**Purpose**: Verify theme changes don't cause performance issues

**Steps**:
1. Start game
2. Open DevTools Performance tab
3. Start recording
4. Rapidly switch themes:
   - Classic → Neon
   - Neon → Ocean
   - Ocean → Sunset
   - Sunset → Dark
   - Dark → Classic
5. Stop recording
6. Analyze theme switch performance

**Expected Results**:
- ✅ Theme switches complete < 100ms
- ✅ No frame drops during switch
- ✅ Smooth color transitions
- ✅ No visual artifacts

**Pass Criteria**: Theme switch < 100ms, no frame drops

---

### Test 7: Audio Performance Impact

**Purpose**: Verify audio doesn't impact frame rate

**Steps**:
1. Start game with audio enabled
2. Open DevTools Performance tab
3. Start recording
4. Play for 60 seconds with frequent sound triggers:
   - Move pieces rapidly (move sounds)
   - Rotate frequently (rotate sounds)
   - Clear lines (clear sounds)
   - Collect power-ups (powerup sounds)
5. Stop recording
6. Analyze performance

**Expected Results**:
- ✅ Audio doesn't reduce frame rate
- ✅ Multiple simultaneous sounds handled
- ✅ No audio-related lag
- ✅ Background music doesn't impact gameplay

**Pass Criteria**: FPS ≥ 58 with audio, same as without audio

---

### Test 8: Rendering Performance (Canvas Operations)

**Purpose**: Verify canvas rendering is efficient

**Steps**:
1. Start game
2. Open DevTools Performance tab
3. Start recording
4. Play for 60 seconds
5. Stop recording
6. Analyze rendering performance:
   - Check "Rendering" section
   - Look for paint operations
   - Check composite layers
   - Identify expensive operations

**Expected Results**:
- ✅ Paint operations < 10ms per frame
- ✅ Composite operations < 5ms per frame
- ✅ No unnecessary repaints
- ✅ Efficient canvas updates

**Measurement**:
- Check paint time in timeline
- Look for green bars (good performance)
- Identify red/yellow warnings

**Pass Criteria**: Paint < 10ms, composite < 5ms per frame

---

### Test 9: Storage Operations Performance

**Purpose**: Verify localStorage operations don't block gameplay

**Steps**:
1. Start game
2. Open DevTools Performance tab
3. Start recording
4. Trigger storage operations:
   - Game over (save score)
   - Unlock achievement (save achievement)
   - Change theme (save preference)
   - Pause/resume (save game state)
5. Stop recording
6. Analyze storage operation timing

**Expected Results**:
- ✅ Storage operations < 10ms
- ✅ No gameplay blocking during saves
- ✅ Async operations don't cause lag
- ✅ No frame drops during storage

**Pass Criteria**: Storage operations < 10ms, no frame drops

---

### Test 10: Multi-Tab Performance

**Purpose**: Verify performance with multiple game tabs open

**Steps**:
1. Open game in 3 browser tabs
2. Start game in all tabs
3. Open DevTools in first tab
4. Start recording
5. Play in first tab for 60 seconds
6. Stop recording
7. Analyze performance

**Expected Results**:
- ✅ Performance maintained with multiple tabs
- ✅ No resource conflicts
- ✅ Each tab runs independently
- ✅ No cross-tab interference

**Pass Criteria**: FPS ≥ 55 with 3 tabs open

---

### Test 11: Long Session Performance

**Purpose**: Verify no performance degradation over time

**Steps**:
1. Start game
2. Play for 30 minutes continuously
3. Take performance measurements every 5 minutes:
   - Frame rate
   - Memory usage
   - Input lag
4. Compare measurements over time

**Expected Results**:
- ✅ Frame rate consistent throughout
- ✅ Memory usage stable (no leaks)
- ✅ Input lag consistent
- ✅ No performance degradation

**Measurement**:
```
Time    FPS    Memory    Input Lag
0min    60     25MB      30ms
5min    60     26MB      30ms
10min   59     27MB      31ms
15min   59     28MB      31ms
20min   59     28MB      32ms
25min   58     29MB      32ms
30min   58     29MB      33ms
```

**Pass Criteria**: FPS ≥ 55, memory < 50MB, input lag < 50ms at 30min

---

### Test 12: Mobile/Responsive Performance

**Purpose**: Verify performance on smaller screens

**Steps**:
1. Open DevTools
2. Enable device emulation (Ctrl+Shift+M)
3. Select mobile device (iPhone 12, Pixel 5)
4. Start game
5. Start performance recording
6. Play for 60 seconds
7. Stop recording
8. Analyze performance

**Expected Results**:
- ✅ Frame rate ≥ 30 FPS on mobile (acceptable)
- ✅ Responsive layout works
- ✅ Touch events responsive (if implemented)
- ✅ No mobile-specific lag

**Pass Criteria**: FPS ≥ 30 on mobile emulation

---

## Performance Optimization Checklist

If performance tests fail, check these areas:

### Rendering Optimization
- [ ] Use requestAnimationFrame for game loop
- [ ] Minimize canvas redraws (only redraw changed areas)
- [ ] Use CSS transforms for animations (GPU accelerated)
- [ ] Avoid layout thrashing (batch DOM reads/writes)
- [ ] Optimize particle effects (limit particle count)

### JavaScript Optimization
- [ ] Avoid unnecessary object creation in game loop
- [ ] Use object pooling for frequently created objects
- [ ] Minimize garbage collection pressure
- [ ] Optimize collision detection algorithms
- [ ] Cache frequently accessed values

### Memory Optimization
- [ ] Remove event listeners when not needed
- [ ] Clear intervals/timeouts properly
- [ ] Avoid memory leaks in closures
- [ ] Limit stored game history
- [ ] Compress localStorage data

### Audio Optimization
- [ ] Use Web Audio API (not HTML5 audio)
- [ ] Preload audio files
- [ ] Limit simultaneous sounds
- [ ] Use audio sprites for small sounds
- [ ] Implement audio pooling

## Performance Test Summary Template

```
PERFORMANCE TEST SUMMARY
========================
Date: ___________
Tester: ___________
Browser: ___________
Device: ___________

Test 1 - Normal Gameplay FPS: ___ FPS (Target: ≥58)
Test 2 - Effects FPS: ___ FPS (Target: ≥55)
Test 3 - Input Lag: ___ ms (Target: <50ms)
Test 4 - Memory Usage: ___ MB (Target: <50MB)
Test 5 - Fast Gameplay FPS: ___ FPS (Target: ≥55)
Test 6 - Theme Switch: ___ ms (Target: <100ms)
Test 7 - Audio Impact FPS: ___ FPS (Target: ≥58)
Test 8 - Rendering Paint: ___ ms (Target: <10ms)
Test 9 - Storage Ops: ___ ms (Target: <10ms)
Test 10 - Multi-Tab FPS: ___ FPS (Target: ≥55)
Test 11 - 30min Session FPS: ___ FPS (Target: ≥55)
Test 12 - Mobile FPS: ___ FPS (Target: ≥30)

OVERALL PERFORMANCE: PASS / FAIL

Performance Issues Found: ___________
Optimization Recommendations: ___________
```

## Browser-Specific Performance Notes

### Chrome
- Best performance overall
- Excellent DevTools
- V8 engine optimizations
- Use for primary testing

### Firefox
- Good performance
- Different rendering engine
- Test for compatibility
- May have different bottlenecks

### Safari
- WebKit engine differences
- May have audio restrictions
- Test on actual Mac/iOS
- Performance may vary

### Edge
- Chromium-based (similar to Chrome)
- Good performance
- Test for Windows users

## Next Steps

After completing performance tests:
1. Document all performance metrics
2. Identify bottlenecks
3. Optimize critical paths
4. Retest failed scenarios
5. Proceed to Build and Test Summary
6. Prepare for deployment
