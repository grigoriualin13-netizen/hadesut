// Generate ElectroCAD Pro icon as PNG using Node.js canvas
// We'll create a simple but professional icon

const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size / 512; // scale factor

  // Background - rounded square with gradient
  const radius = 90 * s;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#0b1830');
  grad.addColorStop(1, '#0a1225');
  ctx.fillStyle = grad;
  ctx.fill();

  // Border glow
  ctx.strokeStyle = '#00cfff';
  ctx.lineWidth = 4 * s;
  ctx.stroke();

  // Inner glow
  ctx.shadowColor = 'rgba(0, 207, 255, 0.3)';
  ctx.shadowBlur = 20 * s;

  // "EC" text - main logo
  ctx.shadowColor = 'rgba(0, 207, 255, 0.5)';
  ctx.shadowBlur = 30 * s;
  ctx.fillStyle = '#00cfff';
  ctx.font = `bold ${180 * s}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EC', size / 2, size / 2 - 40 * s);

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Lightning bolt accent
  ctx.strokeStyle = '#00e5a0';
  ctx.lineWidth = 6 * s;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(200 * s, 340 * s);
  ctx.lineTo(240 * s, 380 * s);
  ctx.lineTo(220 * s, 380 * s);
  ctx.lineTo(260 * s, 420 * s);
  ctx.stroke();

  // "PRO" subtitle
  ctx.fillStyle = '#00e5a0';
  ctx.font = `bold ${60 * s}px Arial, sans-serif`;
  ctx.fillText('PRO', size / 2 + 30 * s, size / 2 + 130 * s);

  // Small circuit symbol (two circles for transformer)
  ctx.strokeStyle = 'rgba(0, 207, 255, 0.4)';
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.arc(170 * s, 130 * s, 25 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(210 * s, 130 * s, 25 * s, 0, Math.PI * 2);
  ctx.stroke();

  // Grid dots (subtle)
  ctx.fillStyle = 'rgba(0, 207, 255, 0.15)';
  for (let x = 80; x < 440; x += 40) {
    for (let y = 80; y < 440; y += 40) {
      ctx.beginPath();
      ctx.arc(x * s, y * s, 2 * s, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return canvas;
}

// Check if canvas module is available
try {
  require.resolve('canvas');
} catch(e) {
  // Fallback: create a simple icon using raw PNG
  console.log('canvas module not found, creating simple icon...');

  // We'll create a minimal valid PNG with the right colors
  // Actually, let's just use a simpler approach
  process.exit(1);
}

// Generate icons
const sizes = [32, 128, 256, 512];
sizes.forEach(size => {
  const canvas = generateIcon(size);
  const buffer = canvas.toBuffer('image/png');
  const name = size === 256 ? '128x128@2x.png' : `${size}x${size}.png`;
  fs.writeFileSync(`src-tauri/icons/${name}`, buffer);
  console.log(`Generated ${name}`);
});

// Also generate the 512 as icon source for ICO conversion
const canvas512 = generateIcon(512);
fs.writeFileSync('icon-source.png', canvas512.toBuffer('image/png'));
console.log('Generated icon-source.png');
