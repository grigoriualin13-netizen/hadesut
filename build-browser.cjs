// Build a single self-contained HTML file for browser usage
// Replaces local docx.min.js with CDN version
// Outputs to both ElectroCAD-Pro-Browser.html and dist/index.html (for Netlify)

const fs = require('fs');
const path = require('path');

console.log('[1/3] Reading source...');
const html = fs.readFileSync(path.join(__dirname, 'src', 'index.html'), 'utf8');

console.log('[2/3] Replacing docx with CDN...');
const result = html.replace(
  '<script src="docx.min.js"></script>',
  '<script src="https://unpkg.com/docx@9.6.1/dist/index.iife.js"></script>'
);

// Write main browser file
const outPath = path.join(__dirname, 'ElectroCAD-Pro-Browser.html');
fs.writeFileSync(outPath, result, 'utf8');

// Write to dist/index.html for Netlify deploy
console.log('[3/3] Copying to dist/index.html...');
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
fs.writeFileSync(path.join(distDir, 'index.html'), result, 'utf8');

const outSize = (Buffer.byteLength(result) / 1024).toFixed(1);
console.log(`\nDone! ${outSize}KB`);
console.log(`Output: ${outPath}`);
console.log(`Netlify: ${path.join(distDir, 'index.html')}`);
console.log('Deschide acest fisier in orice browser (Chrome, Edge, Firefox).');
console.log('NOTA: Necesita conexiune internet pentru generarea Fisa de Solutie (incarca docx de pe CDN).');
console.log('\nPentru deploy Netlify: uploadeaza folderul dist/');
