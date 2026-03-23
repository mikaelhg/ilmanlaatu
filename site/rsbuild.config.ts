import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'Ilmanlaatu Helsingissä',
  },
  output: {
    assetPrefix: './',
    distPath: {
      js: '',
      css: '',
    },
  },
});
