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
    if (!content.includes('currencySymbol') || filePath.includes('useCurrency.js') || filePath.includes('replace_') || filePath.includes('fix_')) return;
    if (filePath.includes('.js') && !filePath.includes('.jsx')) return; // ignore compiled assets
    
    if (content.includes('const { currencySymbol } = useCurrency();')) return; // already injected

    const basename = path.basename(filePath, '.jsx');
    
    // Try to find the component function
    // 1. const Basename = (...) => {
    // 2. export default function Basename(...) {
    // 3. function Basename(...) {
    
    let regexes = [
        new RegExp(`(const ${basename} = \\(.*?\\) => \\{)`),
        new RegExp(`(export default function ${basename}\\(.*\\) \\{)`),
        new RegExp(`(function ${basename}\\(.*\\) \\{)`),
        // Some might use "export const Basename"
        new RegExp(`(export const ${basename} = \\(.*?\\) => \\{)`),
        // General component if exact basename doesn't match
        new RegExp(`(const [A-Z]\\w+ = \\(.*?\\) => \\{)`),
        new RegExp(`(function [A-Z]\\w+\\(.*?\\) \\{)`),
    ];

    let injected = false;
    for (let regex of regexes) {
        if (regex.test(content)) {
            content = content.replace(regex, `$1\n    const { currencySymbol } = useCurrency();\n`);
            injected = true;
            break;
        }
    }

    if (!injected) {
        console.log("COULD NOT INJECT INTO: " + filePath);
        return;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed hook in: ${filePath}`);
};

walk(process.cwd(), function(err, results) {
  if (err) throw err;
  results.forEach(processFile);
});
