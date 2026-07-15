const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'src', 'pages', 'dashboard', 'Dashboard.jsx');
const content = fs.readFileSync(dashboardPath, 'utf8');
const lines = content.split(/\r?\n/);

// Remove specific line ranges
// - line 64
// - lines 201 to 220
// - lines 768 to 1018

// 1-indexed line numbers to keep
const newLines = [];
for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    if (lineNum === 64) continue;
    if (lineNum >= 201 && lineNum <= 220) continue;
    if (lineNum >= 768 && lineNum <= 1018) continue;
    
    newLines.push(lines[i]);
}

fs.writeFileSync(dashboardPath, newLines.join('\n'));
console.log('Removed Manufacturing & Operations ERP from Dashboard.jsx');
