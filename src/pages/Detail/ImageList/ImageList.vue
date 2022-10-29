<template>
  <!-- swiper 轮播图 -->
  <div class="swiper-container" ref="mySwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(s, index) in skuImageList" :key="s.id">
        <!-- addBorder中的index是指当前图片的索引值，且当当前的索引值index与nowIndex相等时，赋予该图片边框颜色 -->
        <img :src="s.imgUrl" @click="addBorder(index)" :class="{active: nowIndex === index}" />
      </div>
    </div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
  // 轮播图 - 引包
  import Swiper from 'swiper'
  export default {
    name: "ImageList",
    data() {
      return {
        // 记录当前图片的索引值（默认为第一张图片，因此，要将索引值置为0）
        nowIndex: 0
      }
    },
    // 接收父组件传递过来的数据
    props: ['skuImageList'],
    // 创建swiper实例
    watch: {
      // 监听
      skuImageList: {
        handler(n, old) {
        this.$nextTick(() => {
          var mySwiper = new Swiper(this.$refs.mySwiper, {
            // 前进后退按钮
            navigation: {
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            },
            // 每页所能显示的轮播图的图片数
            slidesPerView: 3,
            // 每次切换的图片数
            slidesPerGroup: 1
          });
        });
      }
      }
    },
    methods: {
      addBorder(index) {
        // 修改data当中的响应式数据
        this.nowIndex = index
        // 告知兄弟组件Zoom当前所点击的图片的索引值 - 兄弟组件间的通信
        this.$bus.$emit('nowIndex', index)
      }
    }
  }
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>