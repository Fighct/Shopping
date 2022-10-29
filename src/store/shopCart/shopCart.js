import { reqShopCart, reqDeleteGoods, reqGoodsState } from '@/api/index';
const state = {
    cartList: []
}
const actions = {
    // 获取购物车数据
    async getShopCartInfo({ commit }) {
        let res = await reqShopCart();
        if (res.code === 200) {
            commit('GETSHOPCARTINFO', res.data)
        }
    },
    // 删除单个商品
    async toDeleteCartGoods({commit}, goodsId) {
        let res = await reqDeleteGoods(goodsId);
        // 由于我们前台只是要让后台将数据删除，因此，后台不需要向我们返回数据，因此，就不用书写相应的mutations
        if(res.code === 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('Failed to delete!'))
        }
    },
    // 修改商品选中状态
    async changeGoodsState({commit}, {goodsId, isChecked}) {
        let res = await reqGoodsState(goodsId, isChecked);
        if(res.code === 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('修改状态失败，请重新尝试'))
        }
    },
    // 删除选中的所有产品
    // 由于没有相应的接口，因此无法进行相应操作，但我们可以通过调用 toDeleteCartGoods这一函数 来进行删除操作；此处context是上下文，其中包括commit dispatch getters state，我们可以通过getters|state来访问商品信息
    deleteAllChecked({dispatch, getters}) {  // commit dispatch getters state均为context中的内容
        // 通过遍历每一个产品，调用toDeleteCartGoods，若其中的isChecked属性为1，则删除该产品
        // 由于该函数执行以后返回结果为Promise对象，通过遍历可能会返回多个Promise对象，所以，我们通过Promise.all([])来得到整体返回结果，所以我们定义一个空数组来接收整体返回结果
        let returnResult = [];
        getters.cartList.cartInfoList.forEach(element => {
            let res = element.isChecked === 1 ? dispatch('toDeleteCartGoods', element.skuId) : '';
            // 将每一个返回结果存入空数组中，然后我们就能得到该数组的结果，即只有成功|失败两种结果
            returnResult.push(res);
        });
        // 返回returnResult - 返回结果也为Promise对象
        return Promise.all(returnResult)
    }
}
const mutations = {
    GETSHOPCARTINFO(state, cartList) {
        state.cartList = cartList;
    }
}
const getters = {
    cartList(state) {
        return state.cartList[0] || {}
    }
}
export default {
    state,
    actions,
    mutations,
    getters
}