import { Fragment } from 'react';

interface Props {
  crumbs: string[];
  onCrumb: (index: number) => void;
}

export default function DemoCrumbs({ crumbs, onCrumb }: Props) {
  return (
    <nav className="alc-crumbs" aria-label="Location">
      <button type="button" className="alc-crumb" data-current={!crumbs.length || undefined} onClick={() => onCrumb(-1)}>
        Home
      </button>
      {crumbs.map((label, i) => (
        <Fragment key={i}>
          <span className="alc-crumb-sep">/</span>
          {i === crumbs.length - 1 ? (
            <span className="alc-crumb" data-current>
              {label}
            </span>
          ) : (
            <button type="button" className="alc-crumb" onClick={() => onCrumb(i)}>
              {label}
            </button>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
