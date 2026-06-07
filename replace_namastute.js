const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = ['.git', 'node_modules', '.gemini', 'dist', 'build', '.idea', '.vscode'];
const IGNORE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.pdf', '.ps1', '.zip', '.jar', '.class'];

function walkAndReplace(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                walkAndReplace(fullPath);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (!IGNORE_EXTS.includes(ext) && !file.endsWith('.log')) {
                try {
                    let content = fs.readFileSync(fullPath, 'utf8');
                    let newContent = content
                        .replace(/Namustutam/g, 'Namustutam')
                        .replace(/namustutam/g, 'namustutam')
                        .replace(/NAMUSTUTAM/g, 'NAMUSTUTAM');
                    
                    if (content !== newContent) {
                        fs.writeFileSync(fullPath, newContent, 'utf8');
                        console.log(`Updated: ${fullPath}`);
                    }
                } catch (e) {
                    console.error(`Error processing ${fullPath}:`, e.message);
                }
            }
        }
    }
}

walkAndReplace(__dirname);
console.log("Done");
