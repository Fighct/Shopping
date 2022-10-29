import { reqUserAddress, reqTrade } from "@/api"
const state = {
    address: [],
    trade: {}
}
const actions = {
    // 用户地址
    async getUserAddress({commit}) {
        let res = await reqUserAddress();
        if(res.code === 200) {
            commit('GETUSERADDRESS', res.data);
            return 'ok';
        } else {
            return Promise.reject(new Error('无法得到用户地址'));
        }
    },
    // 商品清单
    async getTrade({commit}) {
        let res = await reqTrade();
        if(res.code === 200) {
            commit('GETTRADE', res.data);
            return 'ok';
        } else {
            return Promise.reject(new Error('无法得到商品清单'));
        }
    }
}
const mutations = {
    GETUSERADDRESS(state, address) {
        state.address = address;
    },
    GETTRADE(state, trade) {
        state.trade = trade;
    }
}
const getters = {
    
}
export default {
    state,
    actions,
    mutations,
    getters
}