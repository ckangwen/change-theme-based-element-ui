module.exports = {

  devServer: {
    proxy: {
      '/': {
        target: 'https://unpkg.com/element-ui/lib/theme-chalk/',
        ws: true,
        changOrigin: true
      }
    }
  }
}
