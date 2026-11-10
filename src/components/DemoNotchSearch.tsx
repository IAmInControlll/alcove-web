import DemoNotchFooter from './DemoNotchFooter';
import { demoIcon, filterPins, type DemoPin } from '../config/demo';

interface Props {
  themeClass: string;
  query: string;
  pins: DemoPin[];
}

/** The homepage card: stage 2's apps side narrowed by its search box. */
export default function DemoNotchSearch({ themeClass, query, pins }: Props) {
  return (
    <div className="hm-notch-search">
      <div className={`alc-app ${themeClass} alc-notch-foot-strip`} aria-hidden="true" data-follow-theme>
        <div className="alc-notch-search-pins">
          {filterPins(pins, query).map((pin) => (
            <span key={pin.label} className="alc-notch-app">
              <img src={demoIcon(pin.icon)} alt="" width={26} height={26} />
              <span className="alc-notch-app-label">{pin.label}</span>
            </span>
          ))}
        </div>
        <DemoNotchFooter query={query} still layoutTools={false} />
      </div>
    </div>
  );
}
