const videos = import.meta.glob<string>('../assets/video/demo.{mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const posters = import.meta.glob<string>('../assets/video/demo-poster.{webp,png,jpg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const demoVideoUrl: string | undefined = Object.values(videos)[0];
export const demoPosterUrl: string | undefined = Object.values(posters)[0];
