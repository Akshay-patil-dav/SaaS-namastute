const fs = require('fs');
const path = require('path');

const walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const processFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('₹')) return;
    
    // Skip if it's the hooks file itself
    if (filePath.includes('useCurrency.js') || filePath.includes('Currencies')) return;
    if (filePath.includes('FinancialSettings.jsx')) return;

    let modified = false;

    // Replace JSX text: >₹ -> >{currencySymbol}
    if (content.includes('>₹')) {
        content = content.replace(/>₹/g, '>{currencySymbol}');
        modified = true;
    }
    // Replace JSX text with space: > ₹ -> > {currencySymbol}
    if (content.includes('> ₹')) {
        content = content.replace(/> ₹/g, '> {currencySymbol}');
        modified = true;
    }
    // Replace in strings or direct text: ₹2.4L -> {currencySymbol}2.4L
    if (content.includes('₹')) {
        content = content.replace(/₹(\d|\.)/g, '{currencySymbol}$1');
        content = content.replace(/₹/g, '{currencySymbol}');
        content = content.replace(/\{\{currencySymbol\}\}/g, '{currencySymbol}');
        modified = true;
    }

    if (modified && !content.includes('useCurrency')) {
        const isFrontend = filePath.includes('frontend');
        const hooksDir = isFrontend ? 
            path.resolve(__dirname, 'frontend/src/hooks') : 
            path.resolve(__dirname, '_namustutam_UI/src/hooks');
        
        const fileDir = path.dirname(filePath);
        let relativePath = path.relative(fileDir, hooksDir).replace(/\\/g, '/');
        if (!relativePath.startsWith('.')) relativePath = './' + relativePath;
        
        const importStatement = `import { useCurrency } from '${relativePath}/useCurrency';\n`;
        
        const lines = content.split('\n');
        let lastImportIdx = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
                lastImportIdx = i;
            }
        }
        if (lastImportIdx !== -1) {
            lines.splice(lastImportIdx + 1, 0, importStatement);
        } else {
            lines.unshift(importStatement);
        }

        content = lines.join('\n');

        // Target only default exports or the main component which usually has uppercase
        // We'll replace the first match of a function starting with uppercase letter
        content = content.replace(/(export default function [A-Z]\w+\(.*\) \{|export const [A-Z]\w+ = \(.*\) => \{|function [A-Z]\w+\(.*\) \{)/, '$1\n    const { currencySymbol } = useCurrency();\n');
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
};

processFile(path.resolve(__dirname, '_namustutam_UI/src/pages/website/Ecommerce/Ecommerce.jsx'));
