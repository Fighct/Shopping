<template>
  <div class="spec-preview">
    <img :src="skuImagesListImg.imgUrl" />
    <div class="event" @mousemove="handler"></div>
    <div class="big">
      <img :src="skuImagesListImg.imgUrl" ref="big" />
    </div>
    <!-- 遮罩 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
  export default {
    name: "Zoom",
    data() {
      return {
        // 默认大图为第一个，因此，要将相应索引值置0
        currentIndex: 0
      }
    },
    props: ['skuImageList', 'skuDefaultImg'],
    computed: {
      // skuImageList下的imgurl返回结果为对象
      skuImagesListImg() {
        return this.skuImageList[this.currentIndex] || {}
      }
    },
    mounted() {
      // 接收兄弟组件ImageList传递过来的当前所点击图片的索引值
      this.$bus.$on('nowIndex', (index) => {
        // 应令接收过来的图片索引值与data当中的响应式数据一致
        this.currentIndex = index;
      })
    },
    methods: {
      handler(event) {
        // 获取遮罩层
        let mask = this.$refs.mask;
        // 左 由于鼠标始终位于遮罩层正中央，因此，用鼠标距离大盒子左侧的距离减去小盒子（遮罩层）宽度的一半
        let left = event.offsetX - mask.offsetWidth/2;
        // 上 由于鼠标始终位于遮罩层正中央，因此，用鼠标距离大盒子左侧的距离减去小盒子（遮罩层）高度的一半
        let top = event.offsetY - mask.offsetHeight/2;
        // 约束遮罩层的活动范围
        if(left < 0) {
          left = 0
        }
        if(left > mask.offsetWidth) {
          left = mask.offsetWidth
        }
        if(top < 0) {
          top = 0
        }
        if(top > mask.offsetHeight) {
          top = mask.offsetHeight
        }
        // 将left与top的值赋给遮罩层以后，遮罩层才能移动
        mask.style.left = left + 'px';
        mask.style.top = top + 'px';
        let big = this.$refs.big;
        big.style.left = -2 * left + 'px';
        big.style.top = -2 * top + 'px';
      }
    },
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 255, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>