
import pug from 'gulp-pug';

export const html = () => {
  return app.gulp.src(app.path.src.html)
    .pipe(app.plugin.plumber(
      app.plugin.notify.onError({
        title: 'HTML',
        message: 'Error: <%= error.message  %>'
      })
    ))
    .pipe(pug({
      pretty: true,
    }))
    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugin.browsersync.stream())
}
