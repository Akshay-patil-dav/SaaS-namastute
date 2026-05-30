
import fs from 'fs';

function checkFile(filePath) {
    console.log(`Checking ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');

    const stack = [];
    const tagRegex = /<(\/?[a-zA-Z0-9]+)/g;
    let match;

    const lines = content.split('\n');
    const getLineNum = (index) => {
        let count = 0;
        for (let i = 0; i < lines.length; i++) {
            count += lines[i].length + 1;
            if (count > index) return i + 1;
        }
        return lines.length;
    };

    while ((match = tagRegex.exec(content)) !== null) {
        const tag = match[1];
        const index = match.index;
        const line = getLineNum(index);

        if (tag.startsWith('/')) {
            const closing = tag.substring(1);
            if (stack.length === 0) {
                console.log(`  Unexpected closing tag: </${closing}> at line ${line}`);
            } else {
                const last = stack.pop();
                if (last.tag !== closing) {
                    console.log(`  Mismatched tag: expected </${last.tag}> (opened at line ${last.line}), got </${closing}> at line ${line}`);
                }
            }
        } else {
            // Check for self-closing
            const rest = content.substring(index + match[0].length);
            const endOfTag = rest.indexOf('>');
            if (endOfTag !== -1 && rest[endOfTag - 1] === '/') {
                // Self-closing, do nothing
            } else if (['img', 'input', 'br', 'hr', 'meta'].includes(tag.toLowerCase())) {
                // Self-closing in HTML
            } else {
                stack.push({ tag, line });
            }
        }
    }

    stack.forEach(item => {
        console.log(`  Unclosed tag: <${item.tag}> opened at line ${item.line}`);
    });
}

const files = [
    'c:\\Users\\aksha\\OneDrive\\Desktop\\Namustutam\\SaaS-namastute\\frontend\\src\\pages\\StockTransfer.jsx',
    'c:\\Users\\aksha\\OneDrive\\Desktop\\Namustutam\\SaaS-namastute\\frontend\\src\\pages\\Dashboard2.jsx',
    'c:\\Users\\aksha\\OneDrive\\Desktop\\Namustutam\\SaaS-namastute\\frontend\\src\\pages\\Dashboard.jsx',
    'c:\\Users\\aksha\\OneDrive\\Desktop\\Namustutam\\SaaS-namastute\\frontend\\src\\pages\\OnlineOrders.jsx',
    'c:\\Users\\aksha\\OneDrive\\Desktop\\Namustutam\\SaaS-namastute\\frontend\\src\\pages\\PosOrders.jsx'
];

files.forEach(checkFile);
