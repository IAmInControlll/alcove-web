import SectionHeading from './SectionHeading';

interface Props {
  id?: string;
  title: string;
  children?: React.ReactNode;
}

export default function SectionHeader({ id, title, children }: Props) {
  return (
    <header className="section-head">
      <SectionHeading id={id}>{title}</SectionHeading>
      {children && <p className="section-lede">{children}</p>}
    </header>
  );
}
