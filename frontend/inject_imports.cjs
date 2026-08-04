const fs = require('fs');
const path = require('path');

const files = [
    'src/components/ai/AIHelper/AIHelper.jsx',
    'src/components/settings/AiHelperSettings/AiHelperSettings.jsx',
    'src/pages/dashboard/SalesDashboard/SalesDashboard.jsx',
    'src/pages/inventory/PrintBarcode/PrintBarcode.jsx'
];

const hookPath = path.join(__dirname, 'src', 'hooks', 'useCurrency');

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('import { useCurrency }')) {
        let relativePath = path.relative(path.dirname(filePath), hookPath);
        // Ensure it uses forward slashes and starts with ./ or ../
        relativePath = relativePath.replace(/\\/g, '/');
        if (!relativePath.startsWith('.')) {
            relativePath = './' + relativePath;
        }
        
        const importStatement = `import { useCurrency } from '${relativePath}';\n`;
        
        // Find the last import statement and inject it after
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const nextLineIndex = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, nextLineIndex + 1) + importStatement + content.slice(nextLineIndex + 1);
        } else {
            content = importStatement + content;
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Injected import into ${file} using path ${relativePath}`);
    }
});
