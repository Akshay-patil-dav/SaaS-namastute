const fs = require('fs');
const path = require('path');

const posFile = path.join(__dirname, 'src', 'pages', 'sales', 'POS', 'POS.jsx');

if (fs.existsSync(posFile)) {
    let content = fs.readFileSync(posFile, 'utf8');
    
    // Replace >-${ with >-{currencySymbol}{
    content = content.replace(/>-\$\{/g, '>-{currencySymbol}{');
    
    fs.writeFileSync(posFile, content, 'utf8');
    console.log("Updated POS.jsx");
} else {
    console.log("File not found:", posFile);
}
