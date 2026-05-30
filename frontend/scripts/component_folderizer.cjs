const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const allFiles = walk(SRC_DIR);
const filesToMove = []; // { oldPath, newPath, type: 'jsx'|'css' }
const oldToNewMap = new Map();

// 1. Identify which files to move
const componentsAndPagesDirs = [
    path.join(SRC_DIR, 'pages'),
    path.join(SRC_DIR, 'components')
];

function isInsideTargetDirs(p) {
    return componentsAndPagesDirs.some(d => p.startsWith(d));
}

// First pass: identify .jsx files to move
allFiles.forEach(file => {
    if (file.endsWith('.jsx') && isInsideTargetDirs(file)) {
        const basename = path.basename(file, '.jsx');
        const dir = path.dirname(file);
        // If it's already in a folder of the exact same name, skip
        if (path.basename(dir) === basename) return;
        
        const newPath = path.join(dir, basename, basename + '.jsx');
        filesToMove.push({ oldPath: file, newPath });
        oldToNewMap.set(file, newPath);
    }
});

// Second pass: identify CSS files that are imported by the identified .jsx files and move them along
filesToMove.forEach(item => {
    const content = fs.readFileSync(item.oldPath, 'utf8');
    const importRegex = /(?:import\s+.*?from\s+|import\s+)['"](\.\/[^'"]+\.css)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const cssRel = match[1]; // e.g. './Login.css'
        const cssAbs = path.resolve(path.dirname(item.oldPath), cssRel);
        if (fs.existsSync(cssAbs) && !oldToNewMap.has(cssAbs)) {
            const cssBasename = path.basename(cssAbs);
            const newCssPath = path.join(path.dirname(item.newPath), cssBasename);
            filesToMove.push({ oldPath: cssAbs, newPath: newCssPath });
            oldToNewMap.set(cssAbs, newCssPath);
        }
    }
});

function toPosix(p) {
    return p.split(path.sep).join('/');
}

// 3. Update all imports in all JS/JSX files
allFiles.filter(f => f.endsWith('.jsx') || f.endsWith('.js')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const newFilePath = oldToNewMap.get(file) || file;
    const newFileDir = path.dirname(newFilePath);
    
    let changed = false;
    
    const importRegex = /(import\s+[^'"]*from\s+['"]|export\s+[^'"]*from\s+['"]|import\s*\(?\s*['"]|export\s*\*\s*from\s*['"])([^'"]+)(['"]\)?)/g;
    
    const newContent = content.replace(importRegex, (match, prefix, importPath, suffix) => {
        if (!importPath.startsWith('.')) return match; // Not a relative import
        
        let targetAbsPath = path.resolve(path.dirname(file), importPath);
        
        let extensionsToTry = ['', '.jsx', '.js'];
        let matchedOldPath = null;
        let matchedExt = '';
        
        for (const ext of extensionsToTry) {
            const testPath = targetAbsPath + ext;
            if (oldToNewMap.has(testPath)) {
                matchedOldPath = testPath;
                matchedExt = ext;
                break;
            } else if (fs.existsSync(testPath)) {
                matchedOldPath = testPath;
                matchedExt = ext;
                break;
            }
        }
        
        if (!matchedOldPath) {
            return match;
        }
        
        const targetNewPath = oldToNewMap.get(matchedOldPath) || matchedOldPath;
        
        let newRelPath = path.relative(newFileDir, targetNewPath);
        newRelPath = toPosix(newRelPath);
        if (!newRelPath.startsWith('.')) {
            newRelPath = './' + newRelPath;
        }
        
        if (matchedExt !== '' && !importPath.endsWith(matchedExt) && newRelPath.endsWith(matchedExt)) {
            newRelPath = newRelPath.slice(0, -matchedExt.length);
        }
        
        if (newRelPath !== importPath) {
            changed = true;
            return prefix + newRelPath + suffix;
        }
        
        return match;
    });
    
    if (changed) {
        fs.writeFileSync(file, newContent);
        console.log(`Updated imports in ${path.basename(file)}`);
    }
});

// 4. Perform the file moves
filesToMove.forEach(({oldPath, newPath}) => {
    const newDir = path.dirname(newPath);
    if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
    }
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${path.basename(oldPath)} -> ${newPath}`);
});

console.log(`Completed folderizing ${filesToMove.length} files.`);
