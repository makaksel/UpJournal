import gulp from 'gulp';
import { path } from './gulp/config/path.js';
import { plugin } from './gulp/config/plugin.js';
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { server } from './gulp/tasks/server.js';
import { js } from './gulp/tasks/js.js';
import { scss } from './gulp/tasks/scss.js';
import { fontStyle, ttfToWoff } from './gulp/tasks/fonts.js';
import { removeSprite, svgSprite } from './gulp/tasks/svgSprite.js';
import { images } from "./gulp/tasks/images.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

global.app = {
  isBuild: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build'),
  path,
  gulp,
  plugin,
}

const watcher = () => {
  gulp.watch(path.watch.html, html)
  gulp.watch(path.watch.scss, scss)
  gulp.watch(path.watch.js, js)
};

const svgBuild = gulp.series(removeSprite, svgSprite);

const fonts = gulp.series(ttfToWoff, fontStyle);

const mainTasks = gulp.series(svgBuild, images, fonts, gulp.parallel(html, scss, js));

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);

export { dev, build };


gulp.task('default', dev);
