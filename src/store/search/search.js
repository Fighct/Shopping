import { reqGetSearchInfo } from "@/api"
// search的仓库
const state = {
    searchList: {}
}
const actions = {
    // 第一个参数 - context，第二个参数 - 载荷（由用户派发actions时传递过来的 dispatch）
    async getSearchList({commit}, par = {}) {
        // reqGetSearchInfo这一函数在获取服务器数据时，应至少传递一个空对象
        let res = await reqGetSearchInfo(par);
        if(res.code === 200) {
            commit('GETSEARCHLIST',res.data);
        }
        // console.log(res);
    }
}
const mutations = {
    GETSEARCHLIST(state,searchList) {
        state.searchList = searchList;
    }
}
// 计算属性 - 简化数据，可以代替mapState
const getters = {
    // 此处的state是当前仓库中的
    attrs(state) {
        return state.searchList.attrsList || [];
    },
    goods(state) {
        // 返回结果有两种：第一种 - 由于searchList的初始状态是一个空数组，因此，遍历时会返回undefined；第二种 - 服务器返回正常数据，遍历时得到正常数据
        return state.searchList.goodsList || [];
    },
    trademark(state) {
        return state.searchList.trademarkList || [];
    }
}
export default {
    state,
    actions,
    mutations,
    getters
}