import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由信息
import Routes from './routes'
// 仓库 - 由于我们要判断用户是否已经登录（token是否已存在），所以需要用到token（存储在仓库中）
import store from '@/store/index'
// 全局组件
// 引入三级联动组件
import TypeNav from '@/components/TypeNav/TypeNav'
// 并将其注册为全局组件
Vue.component(TypeNav.name, TypeNav)

// 使用插件
Vue.use(VueRouter)
// 为重写push和replace方法，应将这两个方法先进行保存（备份）
let oriPush = VueRouter.prototype.push;
let oriReplace = VueRouter.prototype.replace;
// 开始重写
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        // 将this指向修改为VueRouter
        oriPush.call(this, location, resolve, reject);
    } else {
        oriPush.call(this, location, () => { }, () => { });
    }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        oriReplace.call(this, location, resolve, reject);
    } else {
        oriReplace.call(this, location, () => { }, () => { });
    }
}

// 配置路由
let router = new VueRouter({
    routes: Routes,
    // 滚动行为 - 用于设置新打开的页面的滚动条的位置
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部 - y指垂直方向上的距离
        return { y: 0 }
    },
})
// 导航守卫
// 全局守卫
router.beforeEach(async (to, from, next) => {
    // 获取token来判断用户登录状态
    let token = store.state.User.token;
    // 获取用户信息 - 保持在跳转各路由时可以正常显示登录
    let userName = store.state.User.userInfo.name;
    next();
    // 如果token不为空，说明用户已登录
    // 已登录
    if (token) {
        // 如果要跳转到login或register，则不放行，即停留在主页/home
        if (to.path == '/login' || to.path == '/register') {
            next('/');
        } else {
            // 已登录，并且用户信息存在
            if (userName) {
                next();
            } else {
                // 已登录，但没有用户信息 - 获取用户信息
                try {
                    await store.dispatch('getUserInfo');
                    next();
                } catch (error) {
                    // 由于token是有时效性的，所以，如果token失效，我们需要重新登录 - 派发action并跳转至登录页面
                    await store.dispatch('userLoginout');
                    next('/login');
                }
            }
        }
    } else {
        // 用户未登录 - 不能访问购物车、商品交易、支付及个人中心
        let targetPath = to.path;
        // 如果访问的是以上路径，则弹出提示框，并跳转至登录页
        if (targetPath.indexOf('hop') !== -1 || 
        targetPath.indexOf('/trade') !== -1 || targetPath.indexOf('/pay') !== -1 || targetPath.indexOf('/center') !== -1) {
        // if(to.path == '/shopCart' || to.path == '/trade' || to.path == '/pay' || to.path == '/paySuccess' || to.path == '/center/myOrder') {
            alert('查看当前页面需要进行登录，请登录！');
            // 如果未登录时点击的是 “我的订单”或“我的购物车”，则需要先跳转到登录页，登录成功后，直接跳转至刚才点击的页面 - 为该路径添加query参数
            next('/login?redirect=' + targetPath);
        } else {
            // 去的不是以上路径，直接跳转到所点击的路径
            next(to.path)
        }
    }
})
export default router;