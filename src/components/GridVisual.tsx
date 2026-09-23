import { screenshotUrl } from '../config/screenshots';

export default function GridVisual() {
  const src = screenshotUrl('narrative-grid.webp');
  if (!src) return null;
  return <img className="narrative-shot" src={src} alt="Tiles and coloured folders arranged on the Alcove grid" loading="lazy" />;
}
