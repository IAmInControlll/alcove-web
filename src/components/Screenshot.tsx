import ArchMotif from './ArchMotif';
import gridView from '../assets/screenshots/grid-view.png?url';
import folders from '../assets/screenshots/folders.png?url';
import themes from '../assets/screenshots/themes.png?url';
import peek from '../assets/screenshots/peek.png?url';
import shelf from '../assets/screenshots/shelf.png?url';
import heroWorkspace from '../assets/screenshots/hero-workspace.png?url';

interface Props {
  filename: string;
  alt: string;
  aspectRatio?: string;
}

const map: Record<string, string> = {
  'grid-view.png': gridView,
  'folders.png': folders,
  'themes.png': themes,
  'peek.png': peek,
  'shelf.png': shelf,
  'hero-workspace.png': heroWorkspace,
};

export default function Screenshot({ filename, alt, aspectRatio = '16 / 10' }: Props) {
  const src = map[filename];

  if (src) {
    return (
      <div className="showcase-visual" style={{ aspectRatio }}>
        <img src={src} alt={alt} />
      </div>
    );
  }

  return (
    <div className="showcase-visual" style={{ aspectRatio }}>
      <div className="showcase-placeholder">
        <ArchMotif size={48} />
        <span>{filename}</span>
      </div>
    </div>
  );
}
