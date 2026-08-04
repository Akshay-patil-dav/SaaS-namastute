const fs = require('fs');
const path = require('path');

function checkImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('useCurrency()') || content.includes('useCurrency();')) {
        if (!content.includes('import { useCurrency }')) {
            console.log(`MISSING IMPORT: ${filePath}`);
        }
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            checkImports(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'src'));
