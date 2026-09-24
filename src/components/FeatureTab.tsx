import Screenshot from './Screenshot';
import type { FeatureTab as FeatureTabData } from '../config/home';

interface Props {
  feature: FeatureTabData;
  inactive?: boolean;
}

export default function FeatureTab({ feature, inactive = false }: Props) {
  return (
    <div className={inactive ? 'showcase-copy is-inactive' : 'showcase-copy'} aria-hidden={inactive || undefined}>
      <h3>{feature.heading}</h3>
      <p>{feature.description}</p>
    </div>
  );
}

export function FeatureTabVisual({ feature }: Props) {
  return <Screenshot filename={feature.screenshot} alt={feature.alt} />;
}
