import { BatteryLow, Pause, SkipForward, Timer } from 'lucide-react';
import { demoNotchTracks, demoPicture } from '../config/demo';
import type { NotchPopout } from '../config/home';

const POPOUT_ICONS = { timer: Timer, batteryLow: BatteryLow };

interface Props {
  themeClass: string;
  popout?: NotchPopout;
  label: string;
}

export default function DemoNotchGlance({ themeClass, popout, label }: Props) {
  const track = demoNotchTracks[0];
  const art = demoPicture(track.art);
  const Icon = popout && POPOUT_ICONS[popout.icon];
  return (
    <div className="hm-notch-sketch" role="img" aria-label={label}>
      <div className={`alc-app ${themeClass} alc-notch-wrap hm-notch-static`} aria-hidden="true" data-follow-theme>
        <div className="alc-notch" data-open style={{ '--notch-fill': 'var(--popup-bg)', width: 380, height: 64 } as React.CSSProperties}>
          <span className="alc-notch-ear is-left" />
          <span className="alc-notch-ear is-right" />
          <div className="alc-notch-clip">
            <div className="alc-notch-content" style={{ width: 380, height: 64 }}>
              <div className="alc-notch-stage alc-notch-compact">
                <div className="alc-notch-glance-row">
                  {popout && Icon ? (
                    <div className="alc-nw-glance-media">
                      <span className={`alc-glance-icon is-${popout.tone}`}>
                        <Icon size={18} />
                      </span>
                      <span className="alc-nw-media-text alc-nw-gap-05">
                        <span className={`alc-nw-sm alc-nw-medium alc-nw-truncate ${popout.tone === 'danger' ? 'alc-nw-danger' : 'alc-nw-strong'}`}>
                          {popout.title}
                        </span>
                        <span className="alc-nw-xs alc-nw-secondary alc-nw-truncate">{popout.detail}</span>
                      </span>
                    </div>
                  ) : (
                    <div className="alc-nw-glance-media">
                      <span className="alc-nw-art" style={{ width: 40, height: 40 }}>
                        {art && <img src={art} alt="" />}
                      </span>
                      <span className="alc-nw-media-text alc-nw-gap-05">
                        <span className="alc-nw-sm alc-nw-medium alc-nw-strong alc-nw-truncate">{track.title}</span>
                        <span className="alc-nw-xs alc-nw-secondary alc-nw-truncate">{track.artist}</span>
                      </span>
                      <span className="alc-nw-controls">
                        <span className="alc-nw-btn is-lg">
                          <Pause size={16} />
                        </span>
                        <span className="alc-nw-btn is-lg">
                          <SkipForward size={16} />
                        </span>
                      </span>
                    </div>
                  )}
                  <div className="alc-notch-corner">
                    <span className="alc-nw-sm alc-nw-medium alc-nw-secondary alc-nw-num" data-notch-time>
                      9:41 AM
                    </span>
                    <span className="alc-nw-xs alc-nw-muted" data-notch-date></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
