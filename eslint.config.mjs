import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  { ignores: ['node_modules/**', '.next/**', 'playwright-report/**', 'test-results/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescript,
  {
    // next/og's ImageResponse renders via Satori, not the DOM/browser — it cannot
    // consume next/image's <Image />, so raw <img> is required and correct here.
    files: ['src/app/api/og/**/*.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
