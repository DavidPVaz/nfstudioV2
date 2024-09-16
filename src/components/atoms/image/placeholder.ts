import { type PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

const shimmer = () => `
<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#1e293b" offset="20%" />
      <stop stop-color="#00142E33" offset="50%" />
      <stop stop-color="#1e293b" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#1e293b" />
  <rect id="r" width="100%" height="100%" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-100%" to="100%" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (string: string) =>
    typeof window === 'undefined' ? Buffer.from(string).toString('base64') : window.btoa(string);

export const generatePlaceholder = (): PlaceholderValue =>
    `data:image/svg+xml;base64,${toBase64(shimmer())}`;
