<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>
        注册新用户
        <span class="go" preven
          >我有账号，去 <a href="login.html" target="_blank">登陆</a>
        </span>
      </h3>
      <form action="">
        <div class="content">
          <label>手机号:</label>
          <input placeholder="请输入你的手机号" v-model="phone" name="phone" v-validate="{required: true, regex: /^1\d{10}$/ }" :class="{invalid: errors.has('phone')}" />
          <span class="error-msg">{{errors.first("phone")}}</span>
        </div>
        <div class="content">
          <label>验证码:</label>
          <input placeholder="请输入验证码" v-model="code" name="code" v-validate="{required: true, regex:/^\d{6}$/ }" :class="{invalid: errors.has('code')}" />
          <button
            style="width: 100px; height: 38px; margin-left: 10px"
            @click.prevent="toGetCode"
          >
            点击获取
          </button>
          <span class="error-msg">{{errors.first("code")}}</span>
        </div>
        <div class="content">
          <label>登录密码:</label>
          <input
            placeholder="请输入你的登录密码"
            v-model="password"
            autocomplete="off" name="password" v-validate="{required: true, regex: /^[0-9A-Za-z]{8, 20}$/ }" :class="{invalid: errors.has('password')}"
          />
          <span class="error-msg">{{errors.first("password")}}</span>
        </div>
        <div class="content">
          <label>确认密码:</label>
          <!-- v-validate中的is是判断密码与确认密码是否一致 -->
          <input
            placeholder="请输入确认密码"
            v-model="confirmPassword"
            autocomplete="off" name="confirmPassword" 
            v-validate="{required: true, is: password }" :class="{invalid: errors.has('confirmPassword')}"
          />
          <span class="error-msg">{{errors.first("confirmPassword")}}</span>
        </div>
        <div class="controls">
          <input type="checkbox" :checked="isAgree"  v-model="isAgree" name="isAgree" v-validate="{required: true, 'permit': true }" :class="{invalid: errors.has('isAgree')}" />
          <span>同意协议并注册《尚品汇用户协议》</span>
          <span class="error-msg">{{errors.first("isAgree")}}</span>
        </div>
        <div class="btn">
          <button @click.prevent="toRegiste">完成注册</button>
        </div>
      </form>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      phone: "",
      // 验证码
      code: "",
      password: "",
      // 确认密码
      confirmPassword: "",
      // 用户是否同意
      isAgree: true,
    };
  },
  methods: {
    // 获取验证码
    async toGetCode() {
      try {
        // 获取验证码
        const { phone } = this;
        phone && (await this.$store.dispatch("getCode", phone));
        // 如果成功获取，则使用仓库中的code代替组件中的code
        this.code = this.$store.state.User.code;
      } catch (error) {
        alert(error.message);
      }
    },
    // 完成注册，跳转到登录页面
    async toRegiste() {
      try {
        const { phone, code, password, confirmPassword } = this;
        if (phone !== '' && password !== '' && password === confirmPassword) {
          await this.$store.dispatch("userRegister", { phone, code, password });
          // 进行路由跳转 - 登录
          this.$router.push("/login");
        }
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 40px;
    }

    .content {
      padding-left: 390px;
      margin-bottom: 18px;
      position: relative;

      label {
        font-size: 14px;
        width: 96px;
        text-align: right;
        display: inline-block;
      }

      input {
        width: 270px;
        height: 38px;
        padding-left: 8px;
        box-sizing: border-box;
        margin-left: 5px;
        outline: none;
        border: 1px solid #999;
      }

      img {
        vertical-align: sub;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .controls {
      text-align: center;
      position: relative;

      input {
        vertical-align: middle;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .btn {
      text-align: center;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
      }
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }
}
</style>