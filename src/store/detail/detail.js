import { reqGoodsDetail, reqAddGoodsToCart } from "@/api"
// 封装一个临时游客身份
import {userId} from '@/utils/temporaryId'
const state = {
    // 服务器中返回的data是一个对象
    goodsInfo: {},
    // 临时游客身份ID
    temporaryId: userId()
}
const actions = {
    async getGoodsInfo({commit}, goodsId) {
        let res = await reqGoodsDetail(goodsId);
        if(res.code === 200) {
            commit('GETGOODSINFO', res.data);
        }
    },
    // 购物车 - toShopCart相当于一个函数，由于其带有 async，所以返回结果一定是Promise对象
    // 由于此处没有返回数据（返回的data为null），因此，我们无需再配置相应的state和mutations
    async toShopCart({commit}, {goodsId, goodsNum}) {
        // 由于我们此时还没有登录，所以，服务器不知道我们添加的商品是属于哪个“用户”的，因此，我们需要给服务器传递一个可辨别用户的身份的属性，从而，服务器才能知道哪个用户添加了哪些商品 - 在此处，，由于此处不能直接通过query或者params传递，我们通过在“请求头”中（ajax）添加一个”不可变的游客身份“来使服务器辨别用户
        let res = await reqAddGoodsToCart(goodsId, goodsNum);
        if(res.code === 200) {
            return 'ok'
        } else {
            // 此处返回的是Promise.reject()，说明结果失败
            return Promise.reject(new Error('添加至购物车失败，请尝试重新添加'))
        }
    }
}
const mutations = {
    // goodsInfo为服务器传递过来的数据
    GETGOODSINFO(state, goodsInfo) {
        state.goodsInfo = goodsInfo;
    }
}
const getters = {
    categoryView(state) {
        // 由于此处的goodsInfo的初始值为一空对象，所以返回的可能是可能是undefined，这样就会导致访问到的 子数据 为undefined
        return state.goodsInfo.categoryView || {}
    },
    skuInfo(state) {
        return state.goodsInfo.skuInfo || {}
    },
    spuSaleAttrList(state) {
        return state.goodsInfo.spuSaleAttrList || []
    }
}
export default {
    state,
    actions,
    mutations,
    getters
}