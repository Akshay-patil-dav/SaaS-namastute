
import fs from 'fs';

function checkFile(filePath) {
    console.log(`Checking ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');

    const stack = [];
    // Improved regex to handle tags more accurately
    const tagRegex = /<(\/?[a-zA-Z0-9.]+)|(\{\/\*)|(\*\/\})|(\{[^}]*\})|(<>\s*)|(<\/>\s*)/g;
    let match;

    const lines = content.split('\n');
    const getLineNum = (index) => {
        let count = 0;
        for (let i = 0; i < lines.length; i++) {
            const lineLength = lines[i].length + 1;
            if (count + lineLength > index) return i + 1;
            count += lineLength;
        }
        return lines.length;
    };

    let inComment = false;

    while ((match = tagRegex.exec(content)) !== null) {
        if (match[2]) { inComment = true; continue; }
        if (match[3]) { inComment = false; continue; }
        if (inComment) continue;

        if (match[5]) { // Fragment start <>
            stack.push({ tag: 'FRAGMENT', line: getLineNum(match.index) });
            continue;
        }
        if (match[6]) { // Fragment end </>
            const last = stack.pop();
            if (!last || last.tag !== 'FRAGMENT') {
                console.log(`  Unexpected closing fragment: </> at line ${getLineNum(match.index)}`);
            }
            continue;
        }

        const tag = match[1];
        if (!tag) continue; // Skip JS expressions { ... }

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
            // Find the end of this tag
            let searchIndex = index + match[0].length;
            let bracketDepth = 0;
            let endOfTag = -1;
            let isSelfClosing = false;

            for (let i = searchIndex; i < content.length; i++) {
                if (content[i] === '{') bracketDepth++;
                if (content[i] === '}') bracketDepth--;
                if (bracketDepth === 0 && content[i] === '>') {
                    endOfTag = i;
                    if (content[i-1] === '/') isSelfClosing = true;
                    break;
                }
            }

            if (isSelfClosing) {
                // Self-closing, do nothing
            } else if (['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tag.toLowerCase())) {
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
    'c:\\Users\\aksha\\OneDrive\\Desktop\\Namustutam\\SaaS-namustutam\\frontend\\src\\pages\\StockTransfer.jsx',
    'c:\\Users\\aksha\\OneDrive\\Desktop\\Namustutam\\SaaS-namustutam\\frontend\\src\\pages\\OnlineOrders.jsx',
    'c:\\Users\\aksha\\OneDrive\\Desktop\\Namustutam\\SaaS-namustutam\\frontend\\src\\pages\\PosOrders.jsx',
    'c:\\Users\\aksha\\OneDrive\\Desktop\\Namustutam\\SaaS-namustutam\\frontend\\src\\pages\\Products.jsx',
    'c:\\Users\\aksha\\OneDrive\\Desktop\\Namustutam\\SaaS-namustutam\\frontend\\src\\pages\\Dashboard2.jsx',
    'c:\\Users\\aksha\\OneDrive\\Desktop\\Namustutam\\SaaS-namustutam\\frontend\\src\\pages\\Dashboard.jsx'
];

files.forEach(checkFile);
