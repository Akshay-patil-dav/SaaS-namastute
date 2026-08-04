const fs = require('fs');
const path = require('path');

// --- Fix Dashboard2.jsx ---
const dashFile = path.join(__dirname, 'src', 'pages', 'dashboard', 'Dashboard2', 'Dashboard2.jsx');
if (fs.existsSync(dashFile)) {
    let content = fs.readFileSync(dashFile, 'utf8');
    
    // We need to restore the return statement
    if (!content.includes('return (') && !content.includes('dash2-wrapper')) {
        content = content.replace(
            /color: 'bg-secondary' \},\s*\];/g,
            `color: 'bg-secondary' },\n    ];\n\n    return (\n        <div className="dash2-wrapper">\n            {/* Top White Metric Cards */}`
        );
        fs.writeFileSync(dashFile, content, 'utf8');
        console.log("Restored Dashboard2.jsx");
    } else {
        console.log("Dashboard2.jsx seems to already have the return statement.");
    }
}

// --- Fix BarcodeModal.jsx ---
const barcodeFile = path.join(__dirname, 'src', 'components', 'modals', 'inventory', 'BarcodeModal', 'BarcodeModal.jsx');
if (fs.existsSync(barcodeFile)) {
    let content = fs.readFileSync(barcodeFile, 'utf8');
    
    // If it's corrupted, we restore the top part
    if (content.includes('const BarcodeModal = ({ \r\n    ];')) {
        content = content.replace(
            /const BarcodeModal = \(\{ \r\n    \];/g,
            `const BarcodeModal = ({ \n    isOpen, \n    onClose, \n    products = [], \n    pageSize = '36mm',\n    showStoreName = true,\n    showProductName = true,\n    showPrice = true\n}) => {\n    const { currencySymbol } = useCurrency();\n\n    if (!isOpen) return null;\n\n    const displayProducts = products.length > 0 ? products : [\n        { name: 'Nike Jordan', price: \`\${currencySymbol}400\`, sku: 'HG3FKH8', count: 3 },\n        { name: 'Apple Series 5 Watch', price: \`\${currencySymbol}300\`, sku: 'TEUIU10', count: 1 }\n    ];`
        );
        fs.writeFileSync(barcodeFile, content, 'utf8');
        console.log("Restored BarcodeModal.jsx");
    } else {
        // Also check with \n instead of \r\n
        if (content.includes('const BarcodeModal = ({ \n    ];')) {
            content = content.replace(
                /const BarcodeModal = \(\{ \n    \];/g,
                `const BarcodeModal = ({ \n    isOpen, \n    onClose, \n    products = [], \n    pageSize = '36mm',\n    showStoreName = true,\n    showProductName = true,\n    showPrice = true\n}) => {\n    const { currencySymbol } = useCurrency();\n\n    if (!isOpen) return null;\n\n    const displayProducts = products.length > 0 ? products : [\n        { name: 'Nike Jordan', price: \`\${currencySymbol}400\`, sku: 'HG3FKH8', count: 3 },\n        { name: 'Apple Series 5 Watch', price: \`\${currencySymbol}300\`, sku: 'TEUIU10', count: 1 }\n    ];`
            );
            fs.writeFileSync(barcodeFile, content, 'utf8');
            console.log("Restored BarcodeModal.jsx (LF)");
        } else {
            console.log("BarcodeModal.jsx format unknown or already fixed.");
        }
    }
}
