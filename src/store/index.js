// 各组件的总管理者
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 各个小仓库
import Home from './home/home'
import Search from './search/search'
import Detail from './detail/detail'
import ShopCart from './shopCart/shopCart'
import User from './registerAlogin/user'
import Trade from './trade/trade'

export default new Vuex.Store({
    // 模块化开发存储数据
    modules: {
        Home,
        Search,
        Detail,
        ShopCart,
        // 登录与注册
        User,
        // 订单信息
        Trade
    }
})