import { reqGetCode, reqRegister, reqLogin, reqToken, reqLogout } from '@/api/index'
const state = {
    // 验证码
    code: '',
    // 令牌
    token: localStorage.getItem('TOKEN'),
    // 用户信息
    userInfo: {}
}
const actions = {
    // 验证码
    async getCode({ commit }, phone) {
        let res = await reqGetCode(phone);
        // 由于此处我们是使用接口来获取验证码，即验证码不会真正发给用户，因此，我们需要得到返回的验证码
        if (res.code === 200) {
            commit('GETCODE', res.data);
            return 'ok';
        } else {
            return Promise.reject(new Error('验证码获取失败，请尝试重新获取'));
        }
    },
    // 完成注册
    async userRegister({commit}, user) {
        let res = await reqRegister(user);
        if(res.code === 200) {
            // console.log(res);
            return 'ok';
        } else {
            return Promise.reject(new Error('注册失败，请重新尝试'));
        }
    },
    // 登录
    async userLogin({commit}, user) {
        let res = await reqLogin(user);
        if(res.code === 200) {
            // 我们需要得到token（令牌） - 由服务器给前台返回的一个随机且唯一的字符串，用来判断谁是谁
            // 不过在同一个用户得到一次token以后，是存储在vuex（仓库）中，这里的数据都会随着刷新而丢失（非持久化），因此，我们必需保证token的持久性
            // 一、此时已经能得到token，但它是非持久化的
            commit('USERLOGIN', res.data.token);
            // 二、我们应该持久化存储token
            localStorage.setItem('TOKEN', res.data.token);
            return 'ok';
        } else {
            return Promise.reject(new Error('登录失败'))
        }
    },
    // 得到token，以此获取登录后的用户信息
    async getUserInfo({commit}) {
        let res = await reqToken();
        if(res.code === 200) {
            commit('GETUSERINFO', res.data);
            return 'ok';
        } else {
            return Promise.reject(new Error('无法获取用户信息'));
        }
    },
    // 退出登录
    async userLoginout({commit}) {
        let res = await reqLogout();
        if(res.code === 200) {
            // 我们向服务器通知，令其删除仓库和本地的数据 - userInfo、token - 由于不能直接通过action操作state，因此，需要提交mutation
            commit('CLEARUSERINFO');
            return 'ok';
        } else {
            return Promise.reject(new Error('退出登录失败'));
        }
    }
}
const mutations = {
    // 获取验证码
    GETCODE(state, code) {
        state.code = code;
    },
    USERLOGIN(state, token) {
        state.token = token;
    },
    // 获取用户信息
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo;
    },
    // 退出登录后清除相应数据
    CLEARUSERINFO(state) {
        state.token = '';
        state.userInfo = '';
        localStorage.removeItem('TOKEN');
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