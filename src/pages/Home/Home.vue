<template>
  <div>
    <!-- Home -->
    <!-- 使用全局组件 - TypeNav -->
    <TypeNav />
    <Banner />
    <Recommend />
    <Rank />
    <Like />
    <!-- 对组件（自定义标签）进行遍历，由于数据是在home中，而它的子组件需要这些数据，因此，需要把这些数据传递给子组件，相应的属性值应与遍历项一致 -->
    <DianQi v-for="f in floor" :key="f.id" :list="f" />
    <Brand />
  </div>
</template>

<script>
import TypeNav from "@/components/TypeNav/TypeNav";
import Banner from "@/pages/Home/Banner/Banner.vue";
import Recommend from "@/pages/Home/Recommend/Recommend.vue";
import Rank from "@/pages/Home/Rank/Rank.vue";
import Like from "@/pages/Home/Like/Like.vue";
import DianQi from "@/pages/Home/DianQi/DianQi.vue";
import Brand from "@/pages/Home/Brand/Brand.vue";
// 二
import { mapState } from "vuex";
export default {
  name: "Home",
  components: {
    TypeNav,
    Banner,
    Recommend,
    Rank,
    Like,
    DianQi,
    Brand,
  },
  // 由于此处进行了组件复用（用了两遍DianQi），而我们又需要对mock出来的数据进行遍历，因此，需要将对应的action在该组件的父组件中进行派发
  mounted() {
    // 一
    this.$store.dispatch('getFloorList');
    // 得到登录后的用户信息
    this.$store.dispatch('getUserInfo');
  },
  computed: {
    // 三
    ...mapState({
      floor: (state) => state.Home.floorList,
    })
  }
};
</script>

<style>
</style>