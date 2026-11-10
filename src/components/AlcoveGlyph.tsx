interface Props {
  className?: string;
  size?: number;
  /** One colour, the text colour, for an icon button instead of the brand mark. */
  mono?: boolean;
}

export default function AlcoveGlyph({ className, size = 28, mono = false }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 256 256"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="alcoveDirectional" x1="82" y1="59" x2="176" y2="189" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#72EDCA" />
          <stop offset="38%" stopColor="#58E5BB" />
          <stop offset="100%" stopColor="#3BC49D" />
        </linearGradient>
      </defs>
      <path
        d="M51 210 L82 101 C90 65 107 43 128 43 C149 43 166 65 174 101 L205 210 H163 L152 168 H104 L93 210 Z M101 162 V109 C101 79 112 61 128 61 C144 61 155 79 155 109 V162 Z"
        fill={mono ? 'currentColor' : 'url(#alcoveDirectional)'}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <rect x="104" y="162" width="48" height="6" rx="3" fill={mono ? 'currentColor' : '#58E5BB'} />
      <rect x="111" y="88" width="15" height="15" rx="5.5" fill={mono ? 'currentColor' : '#58E5BB'} />
      <rect x="130" y="88" width="15" height="15" rx="5.5" fill={mono ? 'currentColor' : '#58E5BB'} />
      <rect x="111" y="107" width="15" height="15" rx="5.5" fill={mono ? 'currentColor' : '#58E5BB'} />
      <rect x="130" y="107" width="15" height="15" rx="5.5" fill={mono ? 'currentColor' : '#58E5BB'} />
    </svg>
  );
}
