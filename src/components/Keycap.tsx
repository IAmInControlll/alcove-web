interface Props {
  keys: string[];
}

export default function Keycap({ keys }: Props) {
  return (
    <kbd className="keycap">
      {keys.map((k, i) => (
        <span key={k}>
          {i > 0 && <span className="keycap-plus">+</span>}
          {k}
        </span>
      ))}
    </kbd>
  );
}
