# Contributing to Tetris Game Collection

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Testing Guidelines](#testing-guidelines)
5. [Documentation](#documentation)
6. [Submitting Changes](#submitting-changes)

## Getting Started

### Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Text editor or IDE
- Basic knowledge of JavaScript, HTML5, and CSS3
- Git for version control

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd [repo-name]
   ```

2. **Review the documentation**
   - Read `README.md` for project overview
   - Review `aidlc-docs/construction/tetris/code/implementation-summary.md` for architecture
   - Check `aidlc-docs/construction/tetris/code/user-guide.md` for features

3. **Set up audio assets** (optional for development)
   - See `aidlc-docs/construction/tetris/code/asset-requirements.md`
   - Place audio files in `tetris/assets/audio/`

4. **Test the game**
   - Open `tetris/index.html` in your browser
   - Verify all features work correctly

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/[name]` - New features
- `bugfix/[name]` - Bug fixes
- `hotfix/[name]` - Urgent production fixes

### Creating a Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Make your changes** in the appropriate files
2. **Test thoroughly** using the testing checklist
3. **Update documentation** if needed
4. **Commit with clear messages**

```bash
git add .
git commit -m "feat: add new power-up type"
```

### Commit Message Format

Use conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add rainbow theme
fix: correct T-spin detection logic
docs: update user guide with new controls
refactor: optimize rendering performance
```

## Code Standards

### JavaScript

**Style Guidelines**:
- Use 2 spaces for indentation
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPER_CASE for constants
- Add semicolons at end of statements
- Use single quotes for strings

**Example**:
```javascript
const MAX_LEVEL = 15;

class GameManager {
  constructor() {
    this.score = 0;
  }
  
  updateScore(points) {
    this.score += points;
  }
}
```

**Best Practices**:
- Keep functions small and focused
- Use meaningful variable names
- Add comments for complex logic
- Avoid global variables
- Use const/let instead of var
- Handle errors gracefully

### HTML

- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Keep structure clean and organized
- Use data attributes for game-specific data

### CSS

- Use CSS Grid and Flexbox for layouts
- Follow BEM naming convention for classes
- Group related styles together
- Use CSS variables for theme colors
- Ensure responsive design

**Example**:
```css
.game-board {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
}

.game-board__cell {
  aspect-ratio: 1;
}

.game-board__cell--active {
  background-color: var(--primary-color);
}
```

## Testing Guidelines

### Before Submitting

Run through the complete testing checklist:
- See `aidlc-docs/construction/tetris/code/testing-checklist.md`

### Manual Testing Requirements

**Core Functionality** (Required):
1. Game starts correctly
2. Pieces move and rotate properly
3. Line clearing works
4. Scoring is accurate
5. Game over detection works

**Feature Testing** (If modified):
1. Test the specific feature you changed
2. Test related features that might be affected
3. Test edge cases

**Browser Testing**:
- Test in at least 2 different browsers
- Test on different screen sizes
- Verify responsive design

**Performance Testing**:
- Game runs smoothly at 60 FPS
- No memory leaks during extended play
- Audio plays without lag

### Reporting Issues

When you find a bug:
1. Check if it's already reported
2. Create a detailed issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Browser and version
   - Screenshots if applicable

## Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing functionality
- Fix bugs that affect user experience
- Modify game controls or mechanics

### Documentation Files to Update

**User-Facing Changes**:
- `README.md` - Update features list
- `aidlc-docs/construction/tetris/code/user-guide.md` - Update gameplay instructions

**Developer Changes**:
- `aidlc-docs/construction/tetris/code/implementation-summary.md` - Update architecture
- Code comments - Add/update inline documentation

**Testing Changes**:
- `aidlc-docs/construction/tetris/code/testing-checklist.md` - Add new test scenarios

## Submitting Changes

### Pull Request Process

1. **Ensure your code is ready**
   - All tests pass
   - Code follows style guidelines
   - Documentation is updated
   - Commits are clean and well-described

2. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

### Pull Request Template

```markdown
## Description
[Describe what this PR does]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested on mobile
- [ ] All test scenarios pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No console errors
- [ ] Performance is acceptable

## Screenshots (if applicable)
[Add screenshots of visual changes]
```

### Review Process

1. **Automated checks** (if configured)
   - Code style validation
   - Build verification

2. **Manual review**
   - Code quality review
   - Functionality testing
   - Documentation review

3. **Feedback and iteration**
   - Address review comments
   - Make requested changes
   - Re-test after changes

4. **Approval and merge**
   - Approved by maintainer
   - Merged into develop branch

## Code Review Guidelines

### For Reviewers

**What to Check**:
- Code quality and readability
- Adherence to style guidelines
- Test coverage
- Documentation completeness
- Performance implications
- Security considerations

**How to Provide Feedback**:
- Be constructive and specific
- Explain the reasoning behind suggestions
- Acknowledge good work
- Focus on the code, not the person

### For Contributors

**Responding to Feedback**:
- Be open to suggestions
- Ask questions if unclear
- Make requested changes promptly
- Thank reviewers for their time

## Common Tasks

### Adding a New Power-Up

1. Update `game.js`:
   - Add power-up type to `POWER_UP_TYPES`
   - Implement power-up logic in `activatePowerUp()`
   - Add spawn logic in `spawnPowerUp()`

2. Update `renderer.js`:
   - Add visual representation in `drawPowerUp()`

3. Update `ui.js`:
   - Add UI feedback in `showPowerUpNotification()`

4. Update documentation:
   - Add to user guide
   - Update testing checklist

### Adding a New Theme

1. Update `styles.css`:
   - Add theme variables in `:root[data-theme="name"]`
   - Define all required CSS variables

2. Update `theme.js`:
   - Add theme to `THEMES` object

3. Update `ui.js`:
   - Add theme option to settings menu

4. Test theme in all game states

### Fixing a Bug

1. **Reproduce the bug**
   - Follow reported steps
   - Identify the cause

2. **Create a fix**
   - Make minimal changes
   - Don't introduce new issues

3. **Test thoroughly**
   - Verify fix works
   - Test related functionality
   - Check for regressions

4. **Document the fix**
   - Update changelog
   - Add comments if needed

## Getting Help

### Resources

- **Documentation**: Check `aidlc-docs/` directory
- **Code Comments**: Read inline documentation
- **Testing Guide**: See testing checklist
- **Architecture**: Review implementation summary

### Asking Questions

When asking for help:
1. Search existing issues first
2. Provide context and details
3. Include relevant code snippets
4. Describe what you've tried

### Contact

- Open an issue for bugs or feature requests
- Use discussions for questions
- Tag maintainers for urgent issues

## Recognition

Contributors will be recognized in:
- README.md credits section
- Release notes
- Project documentation

Thank you for contributing to make this project better! 🎮
