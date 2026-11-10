import DemoFilesWindow from './DemoFilesWindow';
import ScaledFit from './ScaledFit';
import type { FitFocus } from './ScaledFit';
import { themeById, useSiteThemeId } from '../config/themes';

export default function FilesScene({ label, focus }: { label: string; focus?: FitFocus }) {
  const themeId = useSiteThemeId() ?? 'alcove';
  return (
    <ScaledFit width={880} height={556} label={label} focus={focus}>
      <DemoFilesWindow themeClass={`theme-${themeId}`} frosted={!!themeById(themeId)?.frosted} />
    </ScaledFit>
  );
}
