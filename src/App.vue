<template>
  <div>
    <!-- 非路由组件使用步骤：定义、引入、注册、使用 -->
    <!-- 四、非路由组件使用 -->
    <Header />
    <router-view></router-view>
    <!-- 控制Footer的显示与隐藏 -->
    <!-- 一、获取$route下的path，若其为'/home'或'/search'，则显示组件 -->
    <!-- <Footer v-show="$route.path === '/home' || $route.path === '/search'"/> -->
    <!-- 二、向$route中添加路由元属性meta，通过控制meta中的值来控制组件的显示或隐藏 -->
    <Footer v-show="$route.meta.isShow" />
  </div>
</template>

<script>
  // 二、非路由组件引入
import Header from "./components/Header/Header.vue";
import Footer from "./components/Footer/Footer.vue";
export default {
  name: "App",
  // 三、非路由组件注册
  components: {
    Header,
    Footer,
  },
  // 由于App.vue是根组件，因此此处的mounted只会执行一次，这就避免了每次切换路由时都要发送请求（请求结果是一样的），这样可以提升性能
  mounted() {
    this.$store.dispatch("categoryList");
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
