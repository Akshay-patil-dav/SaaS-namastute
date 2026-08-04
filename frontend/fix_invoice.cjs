const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'modals', 'sales', 'InvoiceModal', 'InvoiceModal.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the functions from the top
// We can just find the block from "/* ── helpers ─..." down to just before payBadgeClass
const startMarker = "/* ── helpers ─────────────────────────────────────────────── */";
const endMarker = "function payBadgeClass(status) {";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const blockToRemove = content.substring(startIndex, endIndex);
    content = content.replace(blockToRemove, "");
    
    // 2. We need to inject them inside the component
    // First, let's fix the block so it uses currencySymbol properly
    let innerBlock = blockToRemove.replace("/* ── helpers ─────────────────────────────────────────────── */", "");
    
    // Fix fmtMoney to use backticks
    innerBlock = innerBlock.replace(/return isNaN\(n\) \? '\{currencySymbol\}0\.00' : `\{currencySymbol\}\$\{n\.toFixed\(2\)\}`;/g, 
                                    "return isNaN(n) ? `${currencySymbol}0.00` : `${currencySymbol}${n.toFixed(2)}`;");
    // Remove `const { currencySymbol } = useCurrency();` from numToWords because it will be in the component scope
    innerBlock = innerBlock.replace(/const \{ currencySymbol \} = useCurrency\(\);\s*/g, "");
    
    // Inject innerBlock right after `const { currencySymbol } = useCurrency();`
    const componentStart = "const InvoiceModal = ({ isOpen, order, onClose, orderType = 'ONLINE' }) => {\n    const printRef = useRef(null);\n\n    if (!isOpen || !order) return null;\n";
    
    const replacement = `const InvoiceModal = ({ isOpen, order, onClose, orderType = 'ONLINE' }) => {\n    const { currencySymbol } = useCurrency();\n    const printRef = useRef(null);\n\n    if (!isOpen || !order) return null;\n\n` + innerBlock;
    
    content = content.replace("const InvoiceModal = ({ isOpen, order, onClose, orderType = 'ONLINE' }) => {\n    const printRef = useRef(null);\n\n    if (!isOpen || !order) return null;\n", replacement);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("InvoiceModal fixed successfully.");
} else {
    console.log("Could not find markers in InvoiceModal.jsx");
}
