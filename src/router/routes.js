// 引入路由组件 - 普通引入法：引入了，但不一定使用该组件，我们一般采用 懒加载 来引入路由
// 首页
import Home from '@/pages/Home/Home.vue'
// 搜索
import Search from '@/pages/Search/Search.vue'
// 添加至购物车
import AddToShopCart from '@/pages/AddCartSuccess/index'
// 购物车
import ShopCart from '@/pages/ShopCart'
// 登录
import Login from '@/pages/Login'
// 注册
import Register from '@/pages/Register'
// 支付
import Pay from '@/pages/Pay'
// 成功支付
import PaySuccess from '@/pages/PaySuccess'
// 个人中心
import Center from '@/pages/Center'
// 我的订单
import MyOrder from '@/pages/Center/MyOrder/MyOrder'
// 团购订单
import TeamOrder from '@/pages/Center/TeamOrder/TeamOrder'

// 路由懒加载 - 使用普通方法引入路由会有一个缺点：在打包成 dist 时，会导致js包过大，而懒加载可以“按需加载”，即需要用到哪个组件再开始加载，不需要就不必加载 - 即当路由被访问时再加载相应组件，比较“高效”
// 路由懒加载 完整写法
const Trade = () => {
    return import ('@/pages/Trade/index');
}

// 路由信息
export default [
    // 主页
    {
        path: '/home',
        component: Home,
        meta: { isShow: true }
    },
    // 搜索
    {
        name: 'search',
        path: '/search/:keywords?',  // 此处可以在pa后加 ? ，此处表示params参数可以传递，也可以不传递
        component: Search,
        meta: { isShow: true }
    },
    // 商品详情
    {
        path: '/detail/:goodsId',
        // 路由懒加载 简写-只有一个语句，省略{}和return
        component: () => import('@/pages/Detail/Detail.vue'),
        meta: { isShow: true }
    },
    // 添加到购物车
    {
        name: 'addToCart',
        path: '/addToShopCart',
        component: AddToShopCart,
        meta: { isShow: true }
    },
    // 购物车
    {
        path: '/shopcart',
        name: 'myShopCart',
        component: ShopCart,
        meta: {isShow: true},
        // 在  路由  中通过  props  传参之  对象写法
        props: {x: 1, y:2}
    },
    // 登录
    {
        path: '/login',
        component: Login,
    },
    // 注册
    {
        path: '/register',
        component: Register
    },
    // 结算
    {
        path: '/trade',
        component: Trade,
        // 路由独享守卫 - 箭头函数
        beforeEnter: (to, from, next) => {
            if(from.path == '/shopcart') {
                next();
            } else {
                next(false);
            }
        }
    },
    // 支付
    {
        path: '/pay',
        component: Pay,       
    },
    // 支付成功
    {
        path: '/paySuccess',
        component: PaySuccess,
        beforeEnter:(to, from, next) => {
            if(from.path == '/pay') {
                next();
            } else {
                next(false);
            }
        }
    },
    // 个人中心
    {
        path: '/center',
        component: Center,
        // 我的订单和团购订单
        children: [
            {
            path: 'myOrder',
            component: MyOrder
            },
            {
                path: 'teamOrder',
                component: TeamOrder
            },
            // 重定向
            {
                path: '/center',
                redirect: '/center/myOrder'
            }
        ]
    },
    // 重定向 - 默认首页
    {
        path: '*',
        redirect: '/home'
    }
]