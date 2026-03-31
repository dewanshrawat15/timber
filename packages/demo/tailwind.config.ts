import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    // Scan Timber's built output so its utility classes are included
    '../core/dist/**/*.js',
  ],
  safelist: [
    // Grid cols are dynamic — safelist them so purge doesn't remove them
    { pattern: /^grid-cols-/ },
    { pattern: /^grid-rows-/ },
  ],
  darkMode: 'class',
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
