import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

export const ttfToWoff = () => {
  return app.gulp.src(`${app.path.scrFolder}/assets/fonts/*.ttf`, {})
    .pipe(app.plugin.plumber(
      app.plugin.notify.onError({
        title: 'FONTS',
        message: 'Error: <%= error.message  %>'
      })
    ))
    .pipe(fonter({
      formats: ['woff']
    }))
    .pipe(app.gulp.dest(`${app.path.build.fonts}`))
    .pipe(app.gulp.src(`${app.path.scrFolder}/assets/fonts/*.ttf`))
    .pipe(ttf2woff2())
    .pipe(app.gulp.dest(`${app.path.build.fonts}`))
}


export const fontStyle = () => {
  let fontsFile = `${app.path.scrFolder}/styles/fonts.scss`
  fs.readdir(app.path.build.fonts, (err, fontsFiles) => {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        fontsFiles.forEach((file) => {
          let fontFileName = file.split('.')[0];
          if (fontFileName !== newFileOnly) {
            let fontName = fontFileName.split('-')[0];
            let fontWeight = fontFileName.split('-')[1];
            switch (fontWeight.toLowerCase()) {
              case 'thin': {
                fontWeight = 100;
                break;
              }
              case 'extraLight': {
                fontWeight = 200;
                break;
              }
              case 'light': {
                fontWeight = 300;
                break;
              }
              case 'medium': {
                fontWeight = 500;
                break;
              }
              case 'semibold': {
                fontWeight = 600;
                break;
              }
              case 'bold': {
                fontWeight = 700;
                break;
              }
              case 'extrabold': {
                fontWeight = 800;
                break;
              }
              case 'black': {
                fontWeight = 900;
                break;
              }
              default: {
                fontWeight = 400;
                break;
              }
            }
            fs.appendFile(
              fontsFile,
              `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`,
              cb,
            )
          }
        })
      } else {
        console.log('Файл scss/fonts.scss уже существует. Для обновления его нужно удалить')
      }
    }
  })

  return app.gulp.src(`${app.path.scrFolder}`);

  function cb() {
  }
}
