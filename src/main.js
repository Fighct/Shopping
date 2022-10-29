import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from './router/index'
// 仓库
import store from '@/store/index'

// 让 请求函数 变得任意组件均可访问，而不需要在仓库中逐个引入
import * as AllApi from '@/api/index'

// Mock
import Mock from '@/mock/mockServer'
// 引入swiper样式 - 轮播图
import 'swiper/css/swiper.css'
import 'swiper/js/swiper.js'

// element-ui
import { Button, MessageBox } from 'element-ui'
Vue.use(Button)
// 添加至原型
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

// 图片懒加载
import VueLazyload from 'vue-lazyload'
// 默认懒加载图片
import view from '@/assets/images/1.jpg'
Vue.use(VueLazyload, {  // 使用插件 - use相当于install方法，而install方法返回的是一个对象 - Vue，以便我们使用Vue及其原型对象（prototype）上的方法 - Vue.prorotype.$bus Vue.component vue.directive
  loading: view
})

import '@/plugins/formValidate'

// 引入全局组件
// 三级菜单
import typeNav from '@/components/TypeNav/TypeNav'
// 轮播图
import Carousel from '@/components/Carousel/Carousel'
// 分页器
import Pagination from '@/components/Pagination/Pagination'
// import Pagination2 from '@/components/Pagination2/Pagination2'
// 注册全局组件
Vue.component(typeNav.name, typeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)
// Vue.component(Pagination2.name, Pagination2)
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  // 注册路由
  router,
  // 注册仓库
  store,
  beforeCreate() {
    // 全局事件总线
    Vue.prototype.$bus = this;
    // 让 请求函数 变得任意组件均可访问
    Vue.prototype.$API = AllApi;
  }
}).$mount('#app')