import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('public/icons/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  const sizes = [
    { size: 192, name: 'icon-192.png' },
    { size: 512, name: 'icon-512.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 144, name: 'icon-144.png' },
    { size: 96, name: 'icon-96.png' },
    { size: 48, name: 'icon-48.png' },
  ];

  for (const item of sizes) {
    const outPath = path.resolve('public/icons', item.name);
    await sharp(svgBuffer)
      .resize(item.size, item.size)
      .png()
      .toFile(outPath);
    console.log(`Generated: ${outPath} (${item.size}x${item.size})`);
  }

  // Also copy apple-touch-icon to public root for automatic Safari detection
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));
  console.log(`Generated: public/apple-touch-icon.png (180x180)`);

  // Also copy favicon 32x32 to public root
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.resolve('public/favicon.png'));
  console.log(`Generated: public/favicon.png (32x32)`);
}

generate().catch(console.error);
