// Build script: obfuscate + minify HTML/JS before Tauri build
// Source: src/index.html (your clean code)
// Output: src-dist/index.html (obfuscated copy for release)

const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { minify } = require('html-minifier-terser');

async function build() {
  console.log('[1/4] Reading source...');
  const src = fs.readFileSync(path.join(__dirname, 'src', 'index.html'), 'utf8');

  // Extract all <script> blocks
  console.log('[2/4] Obfuscating JavaScript...');
  let result = src;
  const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
  let match;
  const replacements = [];

  while ((match = scriptRegex.exec(src)) !== null) {
    const originalJS = match[1];
    if (originalJS.trim().length < 50) continue; // skip tiny scripts

    try {
      const obfuscated = JavaScriptObfuscator.obfuscate(originalJS, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.5,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.2,
        identifierNamesGenerator: 'hexadecimal',
        renameGlobals: false,  // keep global function names (save, load, etc.)
        selfDefending: false,
        splitStrings: true,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
      }).getObfuscatedCode();

      replacements.push({
        original: '<script>' + originalJS + '</script>',
        replaced: '<script>' + obfuscated + '</script>'
      });
    } catch (e) {
      console.warn('  Warning: could not obfuscate a script block:', e.message);
    }
  }

  for (const r of replacements) {
    result = result.replace(r.original, r.replaced);
  }

  // Minify HTML + CSS
  console.log('[3/4] Minifying HTML & CSS...');
  try {
    result = await minify(result, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: false, // already obfuscated
      removeRedundantAttributes: true,
      removeEmptyAttributes: true
    });
  } catch (e) {
    console.warn('  HTML minification warning:', e.message);
  }

  // Write to src-dist
  console.log('[4/4] Writing obfuscated build...');
  const distDir = path.join(__dirname, 'src-dist');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  // Copy assets if they exist
  const assetsDir = path.join(__dirname, 'src', 'assets');
  const distAssetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    if (!fs.existsSync(distAssetsDir)) fs.mkdirSync(distAssetsDir, { recursive: true });
    fs.readdirSync(assetsDir).forEach(f => {
      fs.copyFileSync(path.join(assetsDir, f), path.join(distAssetsDir, f));
    });
  }

  fs.writeFileSync(path.join(distDir, 'index.html'), result, 'utf8');

  const srcSize = (Buffer.byteLength(src) / 1024).toFixed(1);
  const distSize = (Buffer.byteLength(result) / 1024).toFixed(1);
  console.log(`\nDone! ${srcSize}KB -> ${distSize}KB`);
  console.log(`Source: src/index.html (clean, editable)`);
  console.log(`Output: src-dist/index.html (obfuscated for release)`);
}

build().catch(e => { console.error('Build failed:', e); process.exit(1); });
