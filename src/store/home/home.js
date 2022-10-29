// home的仓库
import {requestCategoryList, reqGetBannerList, reqGetFloorList} from '@/api/index'
const state = {
    // 此处的默认值应根据返回值来进行初始化的（由于此处mock的数据是一个数组，因此，我们应该初始化其为数组）
    // 三级菜单
    categoryList: [],
    // 轮播图
    bannerList: [],
    // 家电
    floorList: []
}
const actions = {
    // 通过API里面的接口函数调用 - 向服务器发请求，获取服务器的数据
    // 三级菜单
    async categoryList({commit}) {
        // requestCategoryList是一个Promise对象
        // console.log(requestCategoryList.slice(0, 15));
        let result = await requestCategoryList();
        if(result.code === 200) {
            commit('CATEGORYLIST', result.data);
        }
    },
    // 轮播图
    async getBannerList({commit}) {
        let res = await reqGetBannerList();
        if(res.code === 200) {
            commit('BANNERLIST', res.data);
        }
    },
    // 家电（floor）
    async getFloorList({commit}) {
        let floor = await reqGetFloorList();
        if(floor.code === 200) {
            commit('FLOORLIST', floor.data);
        }
    }
}
const mutations = {
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList
    },
    BANNERLIST(state, bannerList) {
        state.bannerList = bannerList;
    },
    FLOORLIST(state, floorList) {
        state.floorList = floorList;
    }
}
const getters = {}
export default {
    state,
    actions,
    mutations,
    getters
}