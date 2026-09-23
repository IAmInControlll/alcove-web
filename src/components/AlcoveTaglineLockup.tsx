import lockupHorizontalDark from '../assets/brand/lockup-horizontal-tagline-dark.svg?url';
import lockupHorizontalLight from '../assets/brand/lockup-horizontal-tagline-light.svg?url';
import lockupStackedDark from '../assets/brand/lockup-stacked-dark.svg?url';
import lockupStackedLight from '../assets/brand/lockup-stacked-light.svg?url';
import marketingDark from '../assets/brand/marketing-lockup-dark.svg?url';
import marketingLight from '../assets/brand/marketing-lockup-light.svg?url';

interface Props {
  variant: 'horizontal' | 'stacked' | 'marketing';
  className: string;
  alt?: string;
}

function pick(variant: Props['variant']) {
  switch (variant) {
    case 'stacked':
      return { dark: lockupStackedDark, light: lockupStackedLight };
    case 'marketing':
      return { dark: marketingDark, light: marketingLight };
    default:
      return { dark: lockupHorizontalDark, light: lockupHorizontalLight };
  }
}

export default function AlcoveTaglineLockup({
  variant,
  className,
  alt = 'Alcove - Your space inside Windows.',
}: Props) {
  const urls = pick(variant);

  return (
    <>
      <img className={`${className} ${className}-light`} src={urls.light} alt={alt} />
      <img className={`${className} ${className}-dark`} src={urls.dark} alt={alt} />
    </>
  );
}
