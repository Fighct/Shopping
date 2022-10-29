<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!-- 用户未登录时，显示登录与免费注册 -->
          <p v-if="!userInfo.name">
            <span>请</span>
            <!-- 声明式导航 - router-link跳转路由 -->
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <!-- 用户登录以后，显示用户信息 -->
          <p v-if="userInfo.name">
            <a>{{userInfo.name}}</a>
            <a class="register" @click="toLoginout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center/myOrder">我的订单</router-link>
          <router-link to="/shopCart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keywords"
          />
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="toSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      keywords: '',
    };
  },
  computed: {
    // 用户信息
    userInfo() {
      return this.$store.state.User.userInfo || {};
    }
  },
  methods: {
    // 编程式路由导航 - $router下的push或replace
    toSearch() {
      // ?后加query参数，若想传递params参数，则需要提前“占位”
      // 字符串写法传参
      // this.$router.push('/search/' + 'v=' + this.keywords + '?' + this.keywords.toUpperCase())
      // 模板字符串传参
      // this.$router.push(`/search/${this.keywords}?v=${this.keywords.toUpperCase()}`);
      // 对象传参
      if (this.$route.query) {
        let location = {
          name: 'search',
          // 若parmas参数为空，则跳转后的路径不正确 - 可以通过undefined解决
          // par: '' || undefined
          params: { keywords: this.keywords || undefined },
          // query: {big: this.keywords.toUpperCase()}
        };
        location.query = this.$route.query;
        this.$router.push(location);
      }
      // if (this.$route.query) {
      // }
      // this.$router.push({
      //   name: 'search',
      //   params: {
      //     keywords: this.keywords || undefined
      //   },
      //   // query: {big: this.keywords.toUpperCase()}
      // })
    },
    // 退出登录
    async toLoginout() {
      try {
        await this.$store.dispatch('userLoginout');
        // 跳转至首页
        this.$router.push('/home');
      } catch (error) {
        alert(error.message);
      }
    }
  },
  mounted() {
    // $on - 开始清除keywords
    this.$bus.$on('clearKeywords', () => {
      this.keywords = undefined;
    })
  }
};
</script>

<style scoped lang="less">
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>