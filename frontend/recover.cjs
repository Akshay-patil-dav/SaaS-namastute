const fs = require('fs');
const transcriptPath = 'C:/Users/aksha/.gemini/antigravity-ide/brain/5a8c395f-4158-49b2-aa19-127b4bdebbfd/.system_generated/logs/transcript_full.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
let fileContent = '';
let found = false;
for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i]) continue;
    const obj = JSON.parse(lines[i]);
    if (obj.type === 'TOOL_RESPONSE' && obj.content.includes('File Path: `file:///c:/Users/aksha/OneDrive/Desktop/Namustutam/SaaS-namastute/frontend/src/components/layout/PosHeader/PosHeader.jsx`')) {
        if (obj.content.includes('Total Lines: 736')) {
            const contentLines = obj.content.split('\n');
            let codeLines = [];
            for (const line of contentLines) {
                if (line.match(/^\d+:/)) {
                    codeLines.push(line.replace(/^\d+:\s/, ''));
                }
            }
            fileContent = codeLines.join('\n');
            fs.writeFileSync('C:/Users/aksha/OneDrive/Desktop/Namustutam/SaaS-namastute/frontend/src/components/layout/PosHeader/PosHeader.jsx', fileContent);
            console.log('Restored correctly from transcript_full!');
            found = true;
            break;
        }
    }
}
if(!found) console.log('Not found');
