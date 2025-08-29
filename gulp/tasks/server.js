export const server = () => {
  app.plugin.browsersync.init({
    server: {
      baseDir: `${app.path.build.html}`
    },
    port: 3000,
  })
}
