const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('currencySymbol')) return;

    // Check if currencySymbol is used OUTSIDE of a function body, or BEFORE it's declared
    // A simple heuristic: find the index of "const { currencySymbol } = useCurrency();" or similar
    const declMatch = content.match(/const\s+\{\s*currencySymbol\s*\}\s*=\s*useCurrency\(\)/);
    
    if (declMatch) {
        const declIndex = declMatch.index;
        // Check if there are any usages BEFORE declIndex (except imports or function args)
        const before = content.substring(0, declIndex);
        if (before.includes('currencySymbol')) {
            // It could be imported, check if it's just 'import ... currencySymbol'
            const withoutImport = before.replace(/import\s+.*currencySymbol.*/g, '');
            if (withoutImport.includes('currencySymbol')) {
                console.log(`WARNING: currencySymbol used before declaration in: ${filePath}`);
            }
        }
    } else {
        // Not declared in file, but used?
        if (!content.includes('import { useCurrency }') && !content.includes('currencyCode')) {
             console.log(`WARNING: currencySymbol used but NOT DECLARED in: ${filePath}`);
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
            checkFile(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'src'));
