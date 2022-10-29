import requests from "./Interceptors";
import mockRequests from './mockInterceptors'
// 三级联动组件


// 通过vuex获取数据
// 请求地址 - /api/product/getBaseCategoryList
// 让requestCategoryList这一函数变得任意组件均可以访问
export const requestCategoryList = () => {
    // 发送请求 - 请求结果是Promise对象
    return requests({
        url: '/product/getBaseCategoryList',
        method: 'get'
    })
}
// 轮播图
export const reqGetBannerList = () => mockRequests.get('/banner')

// 家电
export const reqGetFloorList = () => mockRequests.get('/floor')

// 搜索模块的数据 - 请求地址：/api/list 请求方式：post 参数（此处应用data传递参数）：非必要
export const reqGetSearchInfo = (par) => requests({
    url: '/list',
    method: 'post',
    data: par
})

// 商品详情 - /api/item/{ skuId }  get  goodsId为该物品的ID
export const reqGoodsDetail = (goodsId) => requests({
    url: `/item/${ goodsId }`, 
    method: 'get'
})

// 添加物品至购物车 - /api/cart/addToCart/{ skuId }/{ skuNum }  post  goodsId为相应商品的ID，goodsNum为商品数量
export const reqAddGoodsToCart = (goodsId, goodsNum) => requests({
    url: `/cart/addToCart/${ goodsId }/${ goodsNum }`,
    method: 'post'
})

// /api/cart/cartList   get
export const reqShopCart = () => requests({
    url: '/cart/cartList',
    method: 'get'
})

// 删除购物车中的商品 /api/cart/deleteCart/{skuId}  delete
export const reqDeleteGoods = (goodsId) => requests({
    url: `/cart/deleteCart/${goodsId}`,
    method: 'delete'
})

// 修改购物车中商品的选中状态 /api/cart/checkCart/{goodsId}/{isChecked} get
export const reqGoodsState = (goodsId, isChecked) => requests({
    url: `/cart/checkCart/${goodsId}/${isChecked}`,
    method: 'get'
})

// 获取验证码  /api/user/passport/sendCode/{phone}  get
export const reqGetCode = (phone) => requests({
    url: `/user/passport/sendCode/${phone}`,
    method: 'get'
})

// 用户注册 /api/user/passport/register post
export const reqRegister = (data) => requests({
    url: '/user/passport/register',
    method: 'post',
    data
})

// 用户登录  /api/user/passport/login post
export const reqLogin = (data) => requests({
    url: '/user/passport/login',
    method: 'post',
    data
})

// 得到token /api/user/passport/auth/getUserInfo get
export const reqToken = () => requests({
    url: '/user/passport/auth/getUserInfo',
    method: 'get'
})

// 退出登录 /api/user/passport/logout get
export const reqLogout = () => requests({
    url: '/user/passport/logout',
    method: 'get'
})

// 用户地址 /api/user/userAddress/auth/findUserAddressList get
export const reqUserAddress= () => requests({
    url: '/user/userAddress/auth/findUserAddressList',
    method: 'get'
}) 

// 获取订单信息 /api/order/auth/trade get
export const reqTrade = () => requests({
    url: '/order/auth/trade',
    method: 'get'
})



// 通过$API传递数据
// 提交订单 /api/order/auth/submitOrder?tradeNo={tradeNo} post
export const reqSubmitOrder = (tradeNo, data) => requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    method: 'post',
    data
})

// 订单支付信息 /api/payment/weixin/createNative/{orderId} get
export const reqPayInfo = (orderId) => requests({
    url: `/payment/weixin/createNative/${orderId}`,
    method: 'get'
})

// 订单支付状态 /api/payment/weixin/queryPayStatus/{orderId} get
export const reqPayStatus = (orderId) => requests({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method: 'get'
})

// 订单列表 /api/order/auth/{page}/{limit} get
export const reqOrderList = (page, limit) => requests({
    url: `/order/auth/${page}/${limit}`,
    method: 'get'
})