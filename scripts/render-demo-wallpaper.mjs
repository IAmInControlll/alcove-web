// Renders the demo wallpaper SVG sources to WebP, so the browser never has to rasterize their blur filters.
// Usage: node scripts/render-demo-wallpaper.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const assets = fileURLToPath(new URL('../src/assets/', import.meta.url));

for (const variant of ['dark', 'light']) {
  const src = `${assets}demo-wallpaper-${variant}.svg`;
  const out = `${assets}demo-wallpaper-${variant}.webp`;
  const info = await sharp(src, { density: 144 }).resize(2400, 1500).webp({ quality: 82 }).toFile(out);
  console.log(`${out} ${Math.round(info.size / 1024)}KB`);
}
