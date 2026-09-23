import { motion, useReducedMotion } from 'motion/react';
import SectionHeading from './SectionHeading';
import HotkeyVisual from './HotkeyVisual';
import GridVisual from './GridVisual';
import DataFolderVisual from './DataFolderVisual';
import type { NarrativeSection as Section } from '../config/home';

interface Props {
  section: Section;
}

const visuals = {
  hotkey: HotkeyVisual,
  grid: GridVisual,
  'data-folder': DataFolderVisual,
};

export default function NarrativeSection({ section }: Props) {
  const reduce = useReducedMotion();

  const revealProps = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.6, ease: 'easeOut' as const },
      };

  const sideClass = section.visualSide === 'left' ? 'narrative-visual-left' : 'narrative-visual-right';
  const Visual = visuals[section.visual];

  return (
    <motion.section className="narrative" {...revealProps}>
      <div className={`narrative-inner ${sideClass}`}>
        <div>
          <SectionHeading id={section.id}>{section.heading}</SectionHeading>
          {section.paragraphs.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>
        <figure className="narrative-visual">
          <Visual />
        </figure>
      </div>
    </motion.section>
  );
}
