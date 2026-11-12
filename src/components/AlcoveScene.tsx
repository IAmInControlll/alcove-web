import AlcoveDemo from './AlcoveDemo';
import type { DemoScene } from './AlcoveDemo';
import ScaledFit from './ScaledFit';
import type { FitFocus } from './ScaledFit';

interface Props {
  scene: DemoScene;
  label: string;
  focus?: FitFocus;
  interactive?: boolean;
}

export default function AlcoveScene({ scene, label, focus, interactive }: Props) {
  return (
    <ScaledFit width={880} height={556} label={label} focus={focus} interactive={interactive}>
      <AlcoveDemo scene={scene} />
    </ScaledFit>
  );
}
