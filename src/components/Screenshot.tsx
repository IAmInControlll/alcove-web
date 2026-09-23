import ArchMotif from './ArchMotif';
import { screenshotUrl } from '../config/screenshots';

interface Props {
  filename: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
}

export default function Screenshot({ filename, alt, aspectRatio = '16 / 10', className = '' }: Props) {
  const src = screenshotUrl(filename);
  const classes = `showcase-visual ${className}`.trim();

  if (src) {
    return (
      <div className={classes} style={{ aspectRatio }}>
        <img src={src} alt={alt} />
      </div>
    );
  }

  return (
    <div className={classes} style={{ aspectRatio }}>
      <div className="showcase-placeholder">
        <ArchMotif size={48} />
        <span>{filename}</span>
      </div>
    </div>
  );
}
