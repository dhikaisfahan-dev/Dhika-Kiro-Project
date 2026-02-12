#!/bin/bash
# Flappy Bird - Production Deployment Preparation Script

echo "🎮 Flappy Bird - Production Deployment Preparation"
echo "=================================================="
echo ""

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p deploy
echo "✅ Created: deploy/"
echo ""

# Copy production files
echo "📋 Copying production files..."
cp index.html deploy/
cp styles.css deploy/
cp game.js deploy/
cp README.md deploy/
echo "✅ Copied: index.html, styles.css, game.js, README.md"
echo ""

# Copy assets directory
echo "📁 Copying assets directory..."
mkdir -p deploy/assets
if [ -f "assets/music.mp3" ]; then
    cp assets/music.mp3 deploy/assets/
    echo "✅ Copied: assets/music.mp3"
else
    echo "⚠️  Warning: assets/music.mp3 not found (optional)"
    echo "   Add music.mp3 to assets/ directory if desired"
fi
echo ""

# Display deployment summary
echo "✅ Deployment files ready in ./deploy/ directory"
echo ""
echo "📦 Files prepared for deployment:"
echo "   - index.html"
echo "   - styles.css"
echo "   - game.js"
echo "   - README.md"
echo "   - assets/ (directory)"
if [ -f "assets/music.mp3" ]; then
    echo "   - assets/music.mp3"
fi
echo ""

# Display next steps
echo "🚀 Next Steps:"
echo ""
echo "Option 1 - Netlify (Easiest):"
echo "   1. Go to https://app.netlify.com/drop"
echo "   2. Drag and drop the 'deploy' folder"
echo "   3. Done! Your game is live"
echo ""
echo "Option 2 - GitHub Pages:"
echo "   1. Create GitHub repository"
echo "   2. cd deploy"
echo "   3. git init && git add . && git commit -m 'Deploy Flappy Bird'"
echo "   4. git remote add origin YOUR_REPO_URL"
echo "   5. git push -u origin main"
echo "   6. Enable GitHub Pages in repo settings"
echo ""
echo "Option 3 - Vercel:"
echo "   1. Install: npm install -g vercel"
echo "   2. cd deploy"
echo "   3. vercel --prod"
echo ""
echo "📖 See production-deployment-guide.md for detailed instructions"
echo ""
