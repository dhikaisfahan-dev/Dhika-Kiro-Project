import re

# Read the file
with open('tetris/renderer.js', 'r') as f:
    content = f.read()

# Replace all standalone references (not already prefixed with window.)
content = re.sub(r'(?<!window\.)(?<!\.)BOARD_WIDTH\b', 'window.BOARD_WIDTH', content)
content = re.sub(r'(?<!window\.)(?<!\.)BOARD_HEIGHT\b', 'window.BOARD_HEIGHT', content)
content = re.sub(r'(?<!window\.)(?<!\.)BLOCK_SIZE\b', 'window.BLOCK_SIZE', content)

# Write back
with open('tetris/renderer.js', 'w') as f:
    f.write(content)

print("✓ Fixed all constant references in renderer.js")
