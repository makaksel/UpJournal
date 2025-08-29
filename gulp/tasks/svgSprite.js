import gulpSvgSprite from 'gulp-svg-sprite';
import { deleteAsync } from "del";

export const removeSprite = () => {
  return deleteAsync(`${app.path.scrFolder}/assets/icons/icons.svg`)
}

export const svgSprite = () => {
  return app.gulp.src(app.path.src.icons)
    .pipe(app.plugin.plumber(
      app.plugin.notify.onError({
        title: 'SVG',
        message: 'Error: <%= error.message  %>'
      })
    ))
    .pipe(gulpSvgSprite({
      mode: {
        stack: {
          sprite: `../icons.svg`,
        },

      }
    }))
    .pipe(app.gulp.dest(app.path.build.icons))
}
