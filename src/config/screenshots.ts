const files = import.meta.glob<string>('../assets/screenshots/*.{png,webp,avif,jpg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const stem = (path: string) => path.split('/').pop()!.replace(/\.[^.]+$/, '');

const byStem: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [stem(path), url]),
);

export const screenshotUrl = (filename: string): string | undefined => byStem[stem(filename)];
