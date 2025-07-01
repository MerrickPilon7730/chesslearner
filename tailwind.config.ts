import type { Config } from 'tailwindcss';
import aspectRatio from '@tailwindcss/aspect-ratio';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [aspectRatio],
};

export default config;
