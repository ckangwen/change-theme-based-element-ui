import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/fonts/element-icons.ttf'
import 'element-ui/lib/theme-chalk/fonts/element-icons.woff'
Vue.use(ElementUI, { size: 'small' })

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  mounted () {
    const app = document.getElementById('app')
    app.classList.add('theme-classic')
  }
}).$mount('#app')
