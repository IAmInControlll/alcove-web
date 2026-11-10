import AlcoveDemo from './AlcoveDemo';
import type { DemoScene } from './AlcoveDemo';
import ScaledFit from './ScaledFit';
import type { FitFocus } from './ScaledFit';

interface Props {
  scene: DemoScene;
  label: string;
  focus?: FitFocus;
}

export default function AlcoveScene({ scene, label, focus }: Props) {
  return (
    <ScaledFit width={880} height={556} label={label} focus={focus}>
      <AlcoveDemo scene={scene} />
    </ScaledFit>
  );
}
