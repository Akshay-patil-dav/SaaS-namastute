const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

// Helper to walk a directory
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const allJsx = walk(SRC_DIR);

function fixImports(file) {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Calculate new depth relative to src
  const relativeToSrc = path.relative(SRC_DIR, file);
  // e.g. pages\auth\Login.jsx (3 parts -> depth 2 from src, so it needs ../../ to reach src)
  const parts = relativeToSrc.split(path.sep);
  const depth = parts.length - 1; 
  
  if (depth === 1) {
      // It's still in pages/ or components/, like App.jsx which is depth 0.
      return;
  }

  // If it was in pages/ (depth 1) and now in pages/auth/ (depth 2), difference is +1.
  // If it was in components/ (depth 1) and now in components/modals/sales/ (depth 3), difference is +2.

  const isPage = parts[0] === 'pages';
  const isComponent = parts[0] === 'components';

  if (!isPage && !isComponent) return;

  const diff = isPage ? (depth - 1) : (depth - 1);
  if (diff <= 0) return;

  const increaseDepth = (match, p1) => {
    // If it's importing a local CSS file like './Login.css', don't change it.
    if (p1.startsWith('./') && !p1.includes('../')) {
        return match;
    }
    // If it's a deep local import like './modals/sales/AddPosModal' (wait, we moved them)
    
    let parts = p1.split('/');
    if (parts[0] === '.') {
       // if we moved it from components/ to components/modals/sales/, 
       // a `./layout/Sidebar` becomes `../../layout/Sidebar`
       // because `./` meant components/. Now components/ is `../../`.
       if (isComponent) {
          // It used to be in components/, so `./` was components/
          // Now it's in components/modals/sales/. To get to components/, it needs `../../`
          let prefix = '';
          for (let i=0; i<diff; i++) prefix += '../';
          return match.replace(p1, prefix + parts.slice(1).join('/'));
       } else if (isPage) {
          // It used to be in pages/, so `./` was pages/.
          // Now it's in pages/auth/. To get to pages/, it needs `../`
          let prefix = '';
          for (let i=0; i<diff; i++) prefix += '../';
          return match.replace(p1, prefix + parts.slice(1).join('/'));
       }
    } else if (parts[0] === '..') {
       // It used to be `../` to get to `src/`.
       // Now it needs to add `diff` more `../` to get to `src/`.
       let prefix = '';
       for (let i=0; i<diff; i++) prefix += '../';
       return match.replace(p1, prefix + p1);
    }
    return match;
  };

  newContent = newContent.replace(/from\s+['"]([^'"]+)['"]/g, increaseDepth);
  newContent = newContent.replace(/import\s+['"]([^'"]+)['"]/g, increaseDepth);

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated imports in ${path.relative(SRC_DIR, file)}`);
  }
}

allJsx.forEach(fixImports);
console.log('Done fixing imports.');
