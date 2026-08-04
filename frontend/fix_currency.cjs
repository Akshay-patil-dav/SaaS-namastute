const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace '{currencySymbol}0.00' with `${currencySymbol}0.00`
    content = content.replace(/'\{currencySymbol\}0\.00'/g, '`${currencySymbol}0.00`');
    
    // Replace '{currencySymbol}' with `${currencySymbol}`
    content = content.replace(/'\{currencySymbol\}'/g, '`${currencySymbol}`');
    
    // Replace `{currencySymbol}${ with `${currencySymbol}${
    content = content.replace(/`\{currencySymbol\}\$\{/g, '`${currencySymbol}${');
    
    // Replace '{currencySymbol}12500' with `${currencySymbol}12500`
    content = content.replace(/'\{currencySymbol\}(\d+)'/g, '`${currencySymbol}$1`');
    
    // POS.jsx specific:
    // \`Successfully applied {currencySymbol}${
    content = content.replace(/`([^`]*)\{currencySymbol\}\$\{/g, '`$1${currencySymbol}${');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            replaceInFile(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'src'));
