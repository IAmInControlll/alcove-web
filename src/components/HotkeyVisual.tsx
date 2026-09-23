export default function HotkeyVisual() {
  return (
    <div className="keycaps" role="img" aria-label="The default hotkey, Ctrl plus Space">
      <kbd className="keycap">Ctrl</kbd>
      <span className="keycap-plus" aria-hidden="true">+</span>
      <kbd className="keycap keycap-wide">Space</kbd>
    </div>
  );
}
