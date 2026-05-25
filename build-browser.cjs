// Build browser version: bundles ES modules with esbuild, outputs to docs/
// Netlify deploys from docs/ (see netlify.toml)

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcDir  = path.join(__dirname, 'src');
const docsDir = path.join(__dirname, 'docs');

if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir);

// 1. Bundle all ES modules into a single IIFE
console.log('[1/4] Bundling ES modules with esbuild...');
execSync(
  'npx esbuild src/app.js --bundle --format=iife --outfile=docs/bundle.js --platform=browser',
  { stdio: 'inherit' }
);

// 2. Read and patch the HTML
console.log('[2/4] Patching HTML...');
let html = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');

// Replace ES module script with bundled script
html = html.replace(
  '<script type="module" src="app.js"></script>',
  '<script src="bundle.js"></script>'
);

// Replace local docx with CDN
html = html.replace(
  '<script src="docx.min.js"></script>',
  '<script src="https://unpkg.com/docx@9.6.1/dist/index.iife.js"></script>'
);

// 3. Write docs/index.html (Netlify deploy target)
console.log('[3/4] Writing docs/index.html...');
fs.writeFileSync(path.join(docsDir, 'index.html'), html, 'utf8');

// 4. Copy assets that are loaded at runtime (not bundled)
console.log('[4/4] Copying runtime assets...');
['fc_template.js', 'docx.min.js'].forEach(asset => {
  const src = path.join(srcDir, asset);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(docsDir, asset));
});

const bundleKB = (fs.statSync(path.join(docsDir, 'bundle.js')).size / 1024).toFixed(1);
const htmlKB   = (fs.statSync(path.join(docsDir, 'index.html')).size / 1024).toFixed(1);
console.log(`\nDone!`);
console.log(`  docs/bundle.js   ${bundleKB} KB`);
console.log(`  docs/index.html  ${htmlKB} KB`);
console.log(`\nPentru deploy Netlify: push la git sau uploadeaza folderul docs/`);
