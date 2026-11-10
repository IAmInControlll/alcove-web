import DemoShelf from './DemoShelf';
import ScaledFit from './ScaledFit';
import { demoShelfItems } from '../config/demo';
import { useSiteThemeId } from '../config/themes';

export default function ShelfShowcase() {
  const themeId = useSiteThemeId() ?? 'alcove';
  return (
    <ScaledFit width={960} height={480} label="The Shelf" interactive>
      <DemoShelf items={demoShelfItems} themeClass={`theme-${themeId}`} onOpen={() => {}} onClose={() => {}} autoFocus={false} />
    </ScaledFit>
  );
}
