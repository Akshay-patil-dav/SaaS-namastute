const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'layout', 'PosHeader', 'PosHeader.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import for useCurrency at the top
if (!content.includes("import { useCurrency }")) {
    content = content.replace(
        "import { useNavigate, Link } from 'react-router-dom';", 
        "import { useNavigate, Link } from 'react-router-dom';\nimport { useCurrency } from '../../../hooks/useCurrency';"
    );
}

// 2. Fix the error message template string
content = content.replace(
    /console\.error\(`Error attempting to enable fullscreen: \{currencySymbol\}\{err\.message\}`\);/g, 
    "console.error(`Error attempting to enable fullscreen: ${err.message}`);"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("PosHeader.jsx fixed.");
