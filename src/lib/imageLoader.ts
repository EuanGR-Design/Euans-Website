import { basePath } from "./basePath";

// The static export has no image optimiser, so images are served as-is from
// public/, prefixed with the base path.
export default function imageLoader({ src, width }: { src: string; width: number }) {
  return `${basePath}${src}?w=${width}`;
}
