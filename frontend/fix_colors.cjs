const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "src");

// Colors to replace:
// #ff9b29 -> var(--primary-color)
// #ff6b35 -> var(--primary-color)
// #e68a1f -> var(--primary-hover)
// #ffedd5 -> var(--primary-light)
// We will do a case-insensitive global replace.

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith(".css") || file.endsWith(".jsx")) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(DIR);
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, "utf8");
    let original = content;

    // CSS variables work in CSS
    // For JSX style={{ color: "#ff9b29" }} -> style={{ color: "var(--primary-color)" }}
    
    // Replace hex directly (will work in both CSS and JSX string literals)
    content = content.replace(/#ff9b29/gi, "var(--primary-color)");
    content = content.replace(/#ff6b35/gi, "var(--primary-color)");
    content = content.replace(/#e68a1f/gi, "var(--primary-hover)");
    content = content.replace(/#ffedd5/gi, "var(--primary-light)");

    if (content !== original) {
        fs.writeFileSync(file, content, "utf8");
        changedCount++;
    }
});

console.log(`Updated ${changedCount} files to use CSS variables for primary colors.`);
