const entries = ['shortcuts\\', 'icons\\', 'settings.json', 'positions.json', 'folder_colors.json'];

export default function DataFolderVisual() {
  return (
    <div className="data-card" aria-label="The Alcove data folder and what is in it">
      <p className="data-card-path">%APPDATA%\Alcove\</p>
      <ul>
        {entries.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  );
}
