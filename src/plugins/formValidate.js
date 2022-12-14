// vee-validate 表单验证
import Vue from "vue";
import VeeValidate from "vee-validate";
// 中文提示信息
import zh_CN from 'vee-validate/dist/locale/zh_CN'
Vue.use(VeeValidate)

// 表单验证
VeeValidate.Validator.localize('zh_CN', {
    messages: {
        ...zh_CN.messages,
        is: (field) => `${field}必须与密码相同`  // 让确认密码和密码保持一致
    },
    // 给所需验证项赋予中文名称
    attributes: {
        phone: '手机号',
        code: '验证码',
        password: '密码',
        confirmPassword: '确认密码',
        isAgree: '协议'
    }
})

// 自定义校验
VeeValidate.Validator.extend("permit", {
    validate: (v) => {
        return v;
    },
    getMessage: (field) => field + '必须同意'
})