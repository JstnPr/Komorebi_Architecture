import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const siteBase = '/Komorebi_Architecture/';
const cleanPages = ['about', 'projects', 'contact'];

function cleanPageUrls() {
  return {
    name: 'clean-page-urls',
    closeBundle() {
      const distDirectory = resolve(__dirname, 'dist');
      const pageLinks = [
        ['./index.html', siteBase],
        ['./about.html', `${siteBase}about/`],
        ['./projects.html', `${siteBase}projects/`],
        ['./contact.html', `${siteBase}contact/`],
      ];

      const rewritePageLinks = (html) => pageLinks.reduce(
        (result, [source, destination]) => result.replaceAll(`href="${source}"`, `href="${destination}"`),
        html,
      );

      cleanPages.forEach((page) => {
        const sourcePath = resolve(distDirectory, `${page}.html`);
        const outputDirectory = resolve(distDirectory, page);
        const outputPath = resolve(outputDirectory, 'index.html');
        mkdirSync(outputDirectory, { recursive: true });
        writeFileSync(outputPath, rewritePageLinks(readFileSync(sourcePath, 'utf8')));
      });

      ['index', ...cleanPages].forEach((page) => {
        const outputPath = resolve(distDirectory, `${page === 'index' ? 'index' : page}.html`);
        writeFileSync(outputPath, rewritePageLinks(readFileSync(outputPath, 'utf8')));
      });
    },
  };
}

export default defineConfig({
  base: siteBase,
  plugins: [tailwindcss(), cleanPageUrls()],
  server: {
    watch: {
      ignored: ['**/src/images/**'],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        projects: resolve(__dirname, 'projects.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});