import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import cleanCSS from 'gulp-clean-css';

const sass = gulpSass(dartSass);

export const scss = () => {
  return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
    .pipe(app.plugin.plumber(app.plugin.notify.onError({
      title: 'SCSS', message: 'Error: <%= error.message  %>'
    })))
    .pipe(sass({
      outputStyle: 'expanded',
    }))
    .pipe(app.plugin.gulpIf(app.isBuild, groupCssMediaQueries()))
    .pipe(app.plugin.gulpIf(app.isBuild, autoprefixer({
      grid: true, overrideBrowserslist: ['> 0.5%', 'last 3 versions', 'not dead'], cascade: true,
    })))
    .pipe(app.gulp.dest(app.path.build.scss))
    .pipe(cleanCSS())
    .pipe(rename({
      extname: '.min.css',
    }))
    .pipe(app.gulp.dest(app.path.build.scss))
    .pipe(app.plugin.browsersync.stream())
}
