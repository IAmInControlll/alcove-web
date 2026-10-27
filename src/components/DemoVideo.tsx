import SectionHeader from './SectionHeader';
import type { DemoCopy } from '../config/home';

interface Props {
  copy: DemoCopy;
  src?: string;
  poster?: string;
}

export default function DemoVideo({ copy, src, poster }: Props) {
  if (!src) return null;

  return (
    <section className="home-section" aria-labelledby="demo">
      <SectionHeader id="demo" title={copy.heading}>
        {copy.lede}
      </SectionHeader>
      <div className="demo-frame">
        <video src={src} poster={poster} controls playsInline preload="metadata" />
      </div>
    </section>
  );
}
