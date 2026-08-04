const fs = require('fs');
const path = require('path');

function isCurrencyDollar(text, index) {
    if (text[index] !== '$') return false;
    
    // Check next character: if it's '{', it's a template literal interpolation like ${var}
    // But wait! What if it's in JSX like <span>${item.price}</span> ?
    // In JSX, that is literal '$' followed by '{item.price}'.
    
    // To distinguish JSX literal '$' from template literal '${':
    // If it's inside a backtick string, '${' is interpolation.
    // We can't perfectly parse AST easily here, but we can look for heuristics.
    
    // Let's just grab the context (15 chars before and 15 chars after) and print it out.
    return true;
}

const matches = [];

function searchInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Let's find all '$' and capture context
    for (let i = 0; i < content.length; i++) {
        if (content[i] === '$') {
            // ignore if it's '${' inside a template literal, but it's hard to know.
            const nextChar = content[i+1];
            
            // Heuristic 1: If it's a template literal interpolation, usually we see `${`
            // Let's just collect ALL '$' that are followed by '{' or a number.
            // Actually, any '$' that is NOT in a typical jQuery/JS variable context.
            const prevChar = content[i-1];
            
            // Ignore if it's part of a variable like `$scope` or if it's at the end of a line.
            if (/[a-zA-Z0-9_]/.test(prevChar)) continue; // e.g. user$
            
            // Context snippet
            const start = Math.max(0, i - 20);
            const end = Math.min(content.length, i + 30);
            const snippet = content.substring(start, end).replace(/\r?\n/g, '\\n');
            
            // Filter out obvious template interpolations `...${...}`
            // A simple heuristic: if it has a backtick in the context before it on the same line,
            // and it is `${`, it MIGHT be interpolation.
            // Let's just log it to see.
            if (nextChar === '{' && snippet.includes('`')) {
                // Check if it's likely a JS template string:
                // `some string ${var}`
                // If it is, we skip for now unless it's preceded by a currency indicator?
                // Wait, `${` could be JSX literal `$` + `{`. e.g. <td>${item.total}</td>
                // If there's a `>` right before `$`, it's JSX!
            }

            // Let's specifically look for:
            // 1. >$
            // 2. > ${
            // 3. >$ {
            // 4. "$ or '$ (but not if it's string interpolation if we want to change to backtick)
            // 5. " $ or ' $
            // 6. \$[0-9]
            
            const isJSXText = prevChar === '>' || (prevChar === ' ' && content[i-2] === '>');
            const isStringLiteral = prevChar === '"' || prevChar === "'";
            const isFollowedByNumber = /[0-9]/.test(nextChar);
            const isFollowedByBrace = nextChar === '{';
            
            if (isJSXText || isStringLiteral || isFollowedByNumber || (isFollowedByBrace && !snippet.includes('`'))) {
                matches.push({
                    file: filePath.replace(__dirname, ''),
                    snippet: snippet
                });
            } else if (isJSXText && isFollowedByBrace) {
                 matches.push({
                    file: filePath.replace(__dirname, ''),
                    snippet: snippet
                });
            }
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
            searchInFile(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'src'));

console.log(JSON.stringify(matches.filter((v, i, a) => a.findIndex(t => (t.snippet === v.snippet && t.file === v.file)) === i), null, 2));
