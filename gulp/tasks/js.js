import webpack from 'webpack-stream';
import webpackLib from "webpack";

export const js = () => {
    return app.gulp.src(app.path.src.js, {sourcemaps: app.isDev})
        .pipe(app.plugin.plumber(
            app.plugin.notify.onError({
                title: 'JS',
                message: 'Error: <%= error.message  %>'
            })
        ))
        // .pipe(app.plugin.replace("__BOT_TOKEN__", `"${process.env.BOT_TOKEN}"`))
        // .pipe(app.plugin.replace("__CHAT_ID__", `"${process.env.CHAT_ID}"`))
        // .pipe(app.plugin.replace("__TERMINAL_KEY__", `"${process.env.TERMINAL_KEY}"`))
        // .pipe(app.plugin.replace("__TERMINAL_PASS__", `"${process.env.TERMINAL_PASS}"`))
        .pipe(webpack({
            mode: app.isDev ? 'development' : 'production',
            output: {
                filename: 'index.js'
            },
            plugins: [
                new webpackLib.DefinePlugin({
                    __BOT_TOKEN__: JSON.stringify(process.env.BOT_TOKEN),
                    __CHAT_ID__: JSON.stringify(process.env.CHAT_ID),
                    __TERMINAL_KEY__: JSON.stringify(process.env.TERMINAL_KEY),
                    __TERMINAL_PASS__: JSON.stringify(process.env.TERMINAL_PASS),
                })
            ]
        }, webpackLib))
        .pipe(app.gulp.dest(app.path.build.js))

        .pipe(app.plugin.browsersync.stream()

        )
}
