import AlcoveTaglineLockup from './AlcoveTaglineLockup';
import HeroCTAs from './HeroCTAs';
import HeroSlideshow from './HeroSlideshow';
import type { HeroSlide } from '../config/home';

interface Props {
  slides: HeroSlide[];
  downloadHref?: string;
  helpHref?: string;
  changelogHref?: string;
}

export default function Hero({ slides, downloadHref, helpHref, changelogHref }: Props) {
  return (
    <div className="hero">
      <div className="hero-flourish" aria-hidden="true" />
      <h1 className="hero-title hero-reveal hero-reveal-lockup">
        <AlcoveTaglineLockup variant="horizontal" className="hero-lockup" />
      </h1>
      <p className="hero-headline hero-reveal hero-reveal-2">
        Clear the clutter. Keep what matters close.
      </p>
      <div className="hero-reveal hero-reveal-3">
        <HeroCTAs downloadHref={downloadHref} helpHref={helpHref} changelogHref={changelogHref} />
      </div>
      <div className="hero-shot hero-reveal hero-reveal-4">
        <HeroSlideshow slides={slides} />
      </div>
    </div>
  );
}
