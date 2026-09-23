import Button from './Button';

interface Props {
  downloadHref?: string;
  helpHref?: string;
  changelogHref?: string;
}

export default function HeroCTAs({
  downloadHref = '/install/',
  helpHref = '/support/',
  changelogHref = '/changelog/',
}: Props) {
  return (
    <div className="hero-cta">
      <Button variant="primary" href={downloadHref}>
        Download for Windows
      </Button>
      <Button variant="secondary" href={helpHref}>
        Get help
      </Button>
      <a className="hero-changelog-link" href={changelogHref}>
        See what's new
      </a>
    </div>
  );
}
