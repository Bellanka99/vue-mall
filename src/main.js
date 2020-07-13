import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'

//导入自定义的封装的插件
import toast from './components/common/toast'

Vue.config.productionTip = false

//t添加事件总线对象，new Vue()可以作为事件出现
Vue.prototype.$bus = new Vue()

//安装toast插件
Vue.use(toast)

//解决移动端的300s延迟
FastClick.attach(document.body)

//使用赖加载插件
Vue.use(VueLazyload, {
    loading: require('./assets/img/common/placeholder.png') //占位图
})

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')