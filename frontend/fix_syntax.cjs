const fs = require('fs');
const path = require('path');

const files = [
    'src/components/ai/AIHelper/AIHelper.jsx',
    'src/components/settings/AiHelperSettings/AiHelperSettings.jsx',
    'src/pages/dashboard/SalesDashboard/SalesDashboard.jsx',
    'src/pages/inventory/PrintBarcode/PrintBarcode.jsx'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the badly injected import
    content = content.replace("import { \nimport { useCurrency } from '../../../hooks/useCurrency';\n", "import { \n");
    // Also try another format if the new line was slightly different
    content = content.replace(/import \{\s*\nimport \{ useCurrency \} from '\.\.\/\.\.\/\.\.\/hooks\/useCurrency';\n/g, 'import {\n');

    // And remove any rogue ones
    content = content.replace(/import \{ useCurrency \} from '\.\.\/\.\.\/\.\.\/hooks\/useCurrency';\n/g, '');

    // Now insert it safely right after the first line (usually import React...)
    const firstNewline = content.indexOf('\n');
    if (firstNewline !== -1) {
        content = content.slice(0, firstNewline + 1) + "import { useCurrency } from '../../../hooks/useCurrency';\n" + content.slice(firstNewline + 1);
    } else {
        content = "import { useCurrency } from '../../../hooks/useCurrency';\n" + content;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed syntax in ${file}`);
});
