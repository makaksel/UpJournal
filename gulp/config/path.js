import * as nodePath from 'path';

const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = './dist';
const scrFolder = './src';

export const path = {
  build: {
    js: `${buildFolder}/assets/js/`,
    scss: `${buildFolder}/assets/css/`,
    html: `${buildFolder}/`,
    fonts: `${buildFolder}/assets/fonts/`,
    icons: `${scrFolder}/assets/icons/`,
    images: `${buildFolder}/assets/images/`,
  },
  src: {
    js: `${scrFolder}/scripts/index.js`,
    scss: `${scrFolder}/styles/styles.scss`,
    html: `${scrFolder}/pages/*.pug`,
    icons: `${scrFolder}/assets/icons/*.svg`,
    images: `${scrFolder}/assets/images/*.*`,
  },
  watch: {
    js: `${scrFolder}/scripts/**/*.js`,
    scss: `${scrFolder}/styles/**/*.scss`,
    html: `${scrFolder}/**/*.pug`,
  },
  clean: buildFolder,
  buildFolder,
  scrFolder,
  rootFolder,
};
