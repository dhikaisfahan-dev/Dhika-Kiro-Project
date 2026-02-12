// ============================================================================
// TETRIS GAME - Theme System
// ============================================================================

// Theme definitions with CSS variable mappings
const THEMES = {
    classic: {
        name: 'Classic',
        colors: {
            '--bg-primary': '#000000',
            '--bg-secondary': '#1a1a1a',
            '--bg-tertiary': '#2a2a2a',
            '--text-primary': '#ffffff',
            '--text-secondary': '#cccccc',
            '--accent-primary': '#00f0f0',
            '--accent-secondary': '#f0a000',
            '--border-color': '#444444',
            '--board-bg': '#000000',
            '--board-grid': '#222222',
            '--ghost-opacity': '0.3'
        },
        pieceColors: {
            I: '#00f0f0',
            O: '#f0f000',
            T: '#a000f0',
            S: '#00f000',
            Z: '#f00000',
            J: '#0000f0',
            L: '#f0a000'
        }
    },
    neon: {
        name: 'Neon',
        colors: {
            '--bg-primary': '#0a0a1a',
            '--bg-secondary': '#1a1a2e',
            '--bg-tertiary': '#2a2a3e',
            '--text-primary': '#00ffff',
            '--text-secondary': '#ff00ff',
            '--accent-primary': '#00ffff',
            '--accent-secondary': '#ff00ff',
            '--border-color': '#00ffff',
            '--board-bg': '#0a0a1a',
            '--board-grid': '#1a1a2e',
            '--ghost-opacity': '0.4'
        },
        pieceColors: {
            I: '#00ffff',
            O: '#ffff00',
            T: '#ff00ff',
            S: '#00ff00',
            Z: '#ff0000',
            J: '#0080ff',
            L: '#ff8000'
        }
    },
    ocean: {
        name: 'Ocean',
        colors: {
            '--bg-primary': '#001a33',
            '--bg-secondary': '#003366',
            '--bg-tertiary': '#004d99',
            '--text-primary': '#e6f7ff',
            '--text-secondary': '#b3e0ff',
            '--accent-primary': '#00bfff',
            '--accent-secondary': '#1e90ff',
            '--border-color': '#0080cc',
            '--board-bg': '#001a33',
            '--board-grid': '#002d4d',
            '--ghost-opacity': '0.35'
        },
        pieceColors: {
            I: '#00bfff',
            O: '#40e0d0',
            T: '#4169e1',
            S: '#20b2aa',
            Z: '#5f9ea0',
            J: '#1e90ff',
            L: '#00ced1'
        }
    },
    sunset: {
        name: 'Sunset',
        colors: {
            '--bg-primary': '#2d1b2e',
            '--bg-secondary': '#4a2545',
            '--bg-tertiary': '#6b3e5c',
            '--text-primary': '#ffe4e1',
            '--text-secondary': '#ffb6c1',
            '--accent-primary': '#ff6b6b',
            '--accent-secondary': '#ffa500',
            '--border-color': '#ff8c69',
            '--board-bg': '#2d1b2e',
            '--board-grid': '#3d2535',
            '--ghost-opacity': '0.35'
        },
        pieceColors: {
            I: '#ff6b6b',
            O: '#ffa500',
            T: '#ff1493',
            S: '#ff69b4',
            Z: '#ff4500',
            J: '#ff8c00',
            L: '#ffb347'
        }
    },
    dark: {
        name: 'Dark Mode',
        colors: {
            '--bg-primary': '#121212',
            '--bg-secondary': '#1e1e1e',
            '--bg-tertiary': '#2d2d2d',
            '--text-primary': '#e0e0e0',
            '--text-secondary': '#b0b0b0',
            '--accent-primary': '#bb86fc',
            '--accent-secondary': '#03dac6',
            '--border-color': '#3d3d3d',
            '--board-bg': '#0d0d0d',
            '--board-grid': '#1a1a1a',
            '--ghost-opacity': '0.3'
        },
        pieceColors: {
            I: '#03dac6',
            O: '#ffb300',
            T: '#bb86fc',
            S: '#00e676',
            Z: '#ff5252',
            J: '#448aff',
            L: '#ff6e40'
        }
    }
};

// Current theme state
let currentTheme = 'classic';

// Initialize theme system
function initializeThemeSystem() {
    // Load saved theme
    const savedTheme = window.storageSystem ? window.storageSystem.getTheme() : 'classic';
    applyTheme(savedTheme);
}

// Apply theme to document
function applyTheme(themeName) {
    if (!THEMES[themeName]) {
        console.error(`Theme '${themeName}' not found`);
        return;
    }
    
    const theme = THEMES[themeName];
    currentTheme = themeName;
    
    // Apply CSS variables
    const root = document.documentElement;
    for (const [variable, value] of Object.entries(theme.colors)) {
        root.style.setProperty(variable, value);
    }
    
    // Update body class for theme-specific styles
    document.body.className = `theme-${themeName}`;
    
    // Update canvas colors if renderer is initialized
    if (window.renderer && typeof window.renderer.updateTheme === 'function') {
        window.renderer.updateTheme(theme.pieceColors);
    }
    
    // Save theme preference
    if (window.storageSystem) {
        window.storageSystem.saveTheme(themeName);
    }
}

// Get current theme
function getCurrentTheme() {
    return currentTheme;
}

// Get theme colors for rendering
function getThemeColors() {
    return THEMES[currentTheme] ? THEMES[currentTheme].pieceColors : THEMES.classic.pieceColors;
}

// Get all available themes
function getAvailableThemes() {
    return Object.keys(THEMES).map(key => ({
        id: key,
        name: THEMES[key].name
    }));
}

// Get theme by name
function getTheme(themeName) {
    return THEMES[themeName] || THEMES.classic;
}

// Export theme functions
window.themeSystem = {
    initialize: initializeThemeSystem,
    apply: applyTheme,
    getCurrent: getCurrentTheme,
    getColors: getThemeColors,
    getAvailable: getAvailableThemes,
    getTheme: getTheme
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemeSystem);
} else {
    initializeThemeSystem();
}
