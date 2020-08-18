module.exports = {
  baseUrl: '/change-theme-based-element-ui/',
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
